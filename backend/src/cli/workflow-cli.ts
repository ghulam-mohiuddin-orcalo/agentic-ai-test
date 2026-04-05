#!/usr/bin/env node

/**
 * NexusAI Workflow CLI
 *
 * Usage:
 *   cd backend && npm run workflow -- NEXUS-42
 *   cd backend && npm run workflow -- NEXUS-42 --dry-run
 *   cd backend && npm run workflow -- NEXUS-42 --agent backend --write
 *   cd backend && npm run workflow -- NEXUS-42 --write --push
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { WorkflowService } from '../modules/workflow/workflow.service';
import * as path from 'path';

// ANSI colors
const cyan = '\x1b[36m';
const green = '\x1b[32m';
const yellow = '\x1b[33m';
const red = '\x1b[31m';
const gray = '\x1b[90m';
const bold = '\x1b[1m';
const reset = '\x1b[0m';

interface CliOptions {
  ticketKey: string;
  dryRun: boolean;
  agentFilter?: 'backend' | 'frontend';
  write: boolean;
  push: boolean;
  userId: string;
}

function parseArgs(argv: string[]): CliOptions {
  const args = argv.slice(2);
  const positional: string[] = [];
  const flags: Record<string, string | boolean> = {};

  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].slice(2);
      if (i + 1 < args.length && !args[i + 1].startsWith('--')) {
        flags[key] = args[i + 1];
        i++;
      } else {
        flags[key] = true;
      }
    } else {
      positional.push(args[i]);
    }
  }

  const ticketKey = positional[0];
  if (!ticketKey) {
    console.error(`${red}Error: Ticket key is required${reset}`);
    console.error(`Usage: npm run workflow -- NEXUS-42 [--dry-run] [--agent backend|frontend] [--write] [--push]`);
    process.exit(1);
  }

  const agentFilter = flags['agent'] as 'backend' | 'frontend' | undefined;
  if (agentFilter && agentFilter !== 'backend' && agentFilter !== 'frontend') {
    console.error(`${red}Error: --agent must be 'backend' or 'frontend'${reset}`);
    process.exit(1);
  }

  return {
    ticketKey,
    dryRun: flags['dry-run'] === true,
    agentFilter,
    write: flags['write'] === true,
    push: flags['push'] === true,
    userId: (flags['user-id'] as string) || 'cli-user',
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function displayTasks(tasks: any[], label: string): void {
  if (tasks.length === 0) return;
  console.log(`\n${cyan}${label}:${reset}`);
  tasks.forEach((t, i) => {
    console.log(`  ${i + 1}. [P${t.priority}] ${t.title}`);
    const desc = typeof t.description === 'string' ? t.description : String(t.description || '');
    console.log(`     ${gray}${desc.slice(0, 80)}${reset}`);
  });
}

async function main() {
  const options = parseArgs(process.argv);

  console.log(`\n${bold}${cyan}NexusAI Workflow CLI${reset}`);
  console.log(`${gray}${'─'.repeat(40)}${reset}`);
  console.log(`${cyan}Ticket:${reset}  ${options.ticketKey}`);
  console.log(`${cyan}Dry-run:${reset} ${options.dryRun}`);
  console.log(`${cyan}Agent:${reset}  ${options.agentFilter || 'all'}`);
  console.log(`${cyan}Write:${reset}  ${options.write}`);
  console.log(`${cyan}Push:${reset}   ${options.push}`);
  console.log(`${gray}${'─'.repeat(40)}${reset}\n`);

  // Bootstrap NestJS application context (no HTTP server)
  const app = await NestFactory.createApplicationContext(AppModule);
  const workflowService = app.get(WorkflowService);

  try {
    // Step 1: Analyze ticket
    console.log(`${yellow}▸ Analyzing ticket ${options.ticketKey}...${reset}`);

    const result = await workflowService.triggerWorkflow(options.userId, {
      ticketKey: options.ticketKey,
      dryRun: true, // Always plan first
      agentFilter: options.agentFilter,
    });

    // Step 2: Display task breakdown
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const resultAny = result as any;
    const tasks = resultAny.tasks || [];
    const backendTasks = tasks.filter((t: { type: string }) => t.type === 'backend');
    const frontendTasks = tasks.filter((t: { type: string }) => t.type === 'frontend');

    displayTasks(backendTasks, 'Backend Tasks');
    displayTasks(frontendTasks, 'Frontend Tasks');

    // Step 3: If dry-run, show plan and exit
    if (options.dryRun) {
      console.log(`\n${yellow}Dry-run complete. No files generated.${reset}`);
      console.log(`${gray}Run without --dry-run to execute, or call:${reset}`);
      console.log(`${gray}POST /api/v1/workflow/${resultAny.workflowId}/execute${reset}\n`);
      await app.close();
      return;
    }

    // Step 4: Execute the workflow
    console.log(`\n${yellow}▸ Executing workflow...${reset}`);

    const execResult = await workflowService.executeWorkflow(
      resultAny.workflowId,
      options.userId,
      {
        agentFilter: options.agentFilter,
        writeFiles: options.write,
      },
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const execAny = execResult as any;

    // Display generated files
    if (execAny.files && execAny.files.length > 0) {
      console.log(`\n${bold}Generated Files${reset}`);
      console.log(`${gray}${'─'.repeat(40)}${reset}`);
      for (const file of execAny.files) {
        const icon = file.action === 'create' ? `${green}+${reset}` : file.action === 'modify' ? `${yellow}~${reset}` : `${red}-${reset}`;
        console.log(`  ${icon} ${file.path}`);
      }
    }

    // Step 5: Git operations
    if (options.push && execAny.files?.length > 0) {
      console.log(`\n${yellow}▸ Git operations...${reset}`);
      await handleGitOperations(options.ticketKey, execAny.files);
    }

    // Summary
    console.log(`\n${bold}${green}Result${reset}`);
    console.log(`${gray}${'─'.repeat(40)}${reset}`);
    console.log(`  Workflow:  ${execAny.workflowId || resultAny.workflowId}`);
    console.log(`  Ticket:    ${options.ticketKey}`);
    console.log(`  Status:    ${execAny.status}`);

    if (execAny.results) {
      const completed = execAny.results.filter((r: { status: string }) => r.status === 'completed').length;
      const failed = execAny.results.filter((r: { status: string }) => r.status === 'failed').length;
      const total = execAny.results.length;
      console.log(`  Tasks:     ${completed}/${total} succeeded${failed > 0 ? `, ${failed} failed` : ''}`);
    }

    console.log('');
    if (execAny.status === 'COMPLETED') {
      console.log(`${green}${bold}Workflow completed successfully!${reset}\n`);
    } else if (execAny.status === 'FAILED') {
      console.log(`${red}${bold}Workflow completed with failures.${reset}\n`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`\n${red}${bold}Error:${reset} ${message}\n`);
    await app.close();
    process.exit(1);
  }

  await app.close();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handleGitOperations(ticketKey: string, files: any[]): Promise<void> {
  let git: import('simple-git').SimpleGit;
  try {
    const simpleGit = await import('simple-git');
    const projectRoot = path.resolve(__dirname, '../../..');
    git = simpleGit.default(projectRoot);
  } catch {
    console.log(`  ${yellow}⊘ simple-git not available, skipping git operations${reset}`);
    return;
  }

  const branchName = `feature/${ticketKey.toLowerCase()}`;

  // Create and checkout branch
  try {
    const branches = await git.branch();
    if (branches.all.includes(branchName)) {
      await git.checkout(branchName);
      console.log(`  ${green}✓${reset} Checked out existing branch ${branchName}`);
    } else {
      await git.checkoutBranch(branchName, 'HEAD');
      console.log(`  ${green}✓${reset} Created branch ${branchName}`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(`  ${red}✗${reset} Git branch failed: ${message}`);
    return;
  }

  // Stage generated files
  const filePaths = files.map((f) => f.path).filter(Boolean);
  if (filePaths.length > 0) {
    for (const file of filePaths) {
      try {
        await git.add(file);
      } catch {
        // File might not be in git tracked path
      }
    }
    console.log(`  ${green}✓${reset} Staged ${filePaths.length} files`);
  }

  // Commit
  try {
    const key = ticketKey.toLowerCase();
    await git.commit(`feat(${key}): AI-generated implementation\n\nGenerated by NexusAI Workflow System\n\nTicket: ${ticketKey}`);
    console.log(`  ${green}✓${reset} Committed changes`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes('nothing to commit')) {
      console.log(`  ${yellow}⊘${reset} Nothing to commit`);
    } else {
      console.log(`  ${red}✗${reset} Commit failed: ${message}`);
    }
    return;
  }

  // Push
  try {
    await git.push('origin', branchName, ['--set-upstream']);
    console.log(`  ${green}✓${reset} Pushed to origin/${branchName}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(`  ${yellow}⊘${reset} Push failed: ${message}`);
    console.log(`  ${gray}Push manually: git push -u origin ${branchName}${reset}`);
  }
}

main().catch((err) => {
  console.error(`${red}Fatal error: ${err instanceof Error ? err.message : err}${reset}`);
  process.exit(1);
});
