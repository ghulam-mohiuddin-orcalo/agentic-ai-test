export interface QuickGuide {
  id: string;
  icon: string;
  title: string;
  description: string;
  color: string;
  bg: string;
  sections: {
    title: string;
    content: string;
    tips?: string[];
    code?: string;
  }[];
}

export const QUICK_GUIDES: QuickGuide[] = [
  {
    id: 'prompt-engineering',
    icon: '\uD83D\uDCA1',
    title: 'Prompt Engineering Tips',
    description:
      'Master the art of crafting prompts that produce accurate, relevant, and high-quality AI responses every time.',
    color: '#C8622A',
    bg: '#FDF1EB',
    sections: [
      {
        title: 'Crafting Effective Prompts',
        content:
          'A well-structured prompt is the foundation of every great AI interaction. The key principles are clarity, specificity, and providing sufficient context. Think of prompting as giving instructions to a skilled colleague who has no prior knowledge of your project. The more precise your instructions, the more useful the output.',
        tips: [
          'Be explicit about the desired output format (bullet points, JSON, markdown table, etc.).',
          'Include relevant context and constraints upfront rather than correcting after the fact.',
          'Specify the audience or expertise level the response should target.',
          'Use delimiters like triple quotes or XML tags to separate instructions from input data.',
          'Break complex requests into sequential steps the model can follow.',
        ],
        code: `// Example: Structured prompt with clear format instructions
const prompt = \`
You are a technical documentation writer for a developer platform.

Task: Write a concise API reference for the following endpoint.

Endpoint: POST /api/v1/agents
Auth: JWT required
Body: { name: string, description: string, systemPrompt: string, modelId: string }

Output format:
- Method and URL as heading
- Authentication requirement
- Request body schema as a markdown table
- Two curl examples (minimal and full)
- Three common error codes with descriptions
\`;

// API call using NexusAI
const response = await fetch('/api/v1/chat/conversations/' + convId + '/messages', {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${token}\`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    role: 'user',
    content: prompt,
  }),
});`,
      },
      {
        title: 'Advanced Techniques',
        content:
          'Once you have mastered basic prompting, these advanced strategies unlock significantly better results. Chain-of-thought prompting forces the model to reason step by step, reducing errors on complex problems. Few-shot examples teach the model the exact pattern you want. Role-playing assigns expertise that shapes tone, depth, and terminology throughout the response.',
        tips: [
          'Chain-of-thought: Add "Think step by step" or "Show your reasoning" to multi-step problems to dramatically reduce logic errors.',
          'Few-shot: Provide 2-3 input/output examples before your actual query so the model learns the expected pattern.',
          'Role-playing: Start with "You are a senior security engineer with 15 years of experience" to anchor the model in domain expertise.',
          'Self-critique: Ask the model to review and improve its own answer before presenting the final version.',
          'Iterative refinement: Use follow-up messages to narrow in on the exact output you need rather than restarting.',
        ],
        code: `// Few-shot example: Teaching the model a specific format
const fewShotPrompt = \`
Extract key information from customer feedback.

Examples:
Input: "The checkout page took forever to load and my card was declined twice."
Output: { "sentiment": "negative", "issues": ["slow page load", "payment failure"], "urgency": "high" }

Input: "Love the new dashboard but wish I could export to PDF."
Output: { "sentiment": "positive", "issues": ["missing PDF export"], "urgency": "low" }

Now process this:
Input: "\${userFeedback}"
Output:\`;

// Chain-of-thought for complex analysis
const cotPrompt = \`
Analyze the following database query for performance issues.
Think step by step:
1. Identify all tables involved
2. Check join conditions and indexing opportunities
3. Look for full table scans or Cartesian products
4. Estimate the query complexity
5. Suggest specific optimizations with SQL rewrites

Query:
\${sqlQuery}
\`;`,
      },
      {
        title: 'Common Mistakes to Avoid',
        content:
          'Even experienced developers make these prompting errors. Vague instructions produce vague outputs. Overloading a single prompt with unrelated tasks leads to confused responses. Ignoring token limits causes truncated outputs. Being aware of these pitfalls will save you time and tokens across every interaction.',
        tips: [
          'Avoid vague prompts: "Write something about AI" will produce generic content. Instead specify topic, length, tone, and format.',
          'Do not overload one prompt with too many tasks. Split unrelated requests into separate messages for better results.',
          'Remember that the model has no memory of past conversations. Include all necessary context in each new session.',
          'Avoid leading questions that bias the output. Instead of "Why is X better?" ask "Compare X and Y objectively."',
          'Watch your token budget. Long system prompts and large context inputs consume tokens that reduce the space available for the response.',
          'Never assume the model knows your codebase. Paste relevant code snippets directly into the prompt rather than referring to file names.',
        ],
        code: `// BAD: Vague prompt produces generic output
"Explain machine learning"

// GOOD: Specific prompt produces targeted output
"Explain supervised machine learning in 3 paragraphs
for a junior developer audience. Include one real-world
example from web application development. Use simple
language and avoid mathematical notation."

// BAD: Overloaded prompt confuses the model
"Write a Python function that sorts a list, explain how
merge sort works, create a test suite, and also write a
blog post about sorting algorithms"

// GOOD: Focused single-task prompt
"Write a Python function that sorts a list of dictionaries
by a given key in descending order. Handle edge cases:
empty list, missing keys, and None values. Include type
hints and a docstring."`,
      },
    ],
  },
  {
    id: 'agent-creation',
    icon: '\uD83E\uDD16',
    title: 'Agent Creation Guide',
    description:
      'Learn how to build, configure, and deploy custom AI agents on NexusAI that automate tasks and interact with users.',
    color: '#0A5E49',
    bg: '#E2F5EF',
    sections: [
      {
        title: 'What are AI Agents?',
        content:
          'AI agents are autonomous programs that use large language models as their reasoning engine to perform tasks, make decisions, and interact with external systems. Unlike simple chatbots that respond to individual messages, agents maintain context over multi-step workflows, use tools to take real actions, and can operate with varying degrees of independence. On NexusAI, agents wrap a chosen AI model with a custom system prompt, optional tools, and deployment settings to create a purpose-built AI worker.',
        tips: [
          'Agents differ from chatbots in that they can take actions through tools (API calls, database queries, file operations).',
          'The system prompt is the single most important factor in determining agent behavior and output quality.',
          'Agents can be deployed as persistent endpoints that other applications call programmatically.',
          'Choose a model that matches your agent\'s task: fast models for real-time responses, reasoning models for complex analysis.',
          'Start simple and iterate. A well-scoped agent with clear instructions outperforms a complex one with vague goals.',
        ],
      },
      {
        title: 'Building Your First Agent',
        content:
          'Creating an agent on NexusAI takes just a few steps. You define the agent\'s identity and behavior through a system prompt, select an AI model that fits the task, and deploy it to a live endpoint. This walkthrough covers the creation of a customer support agent from start to finish.',
        tips: [
          'Start with a clear one-sentence mission statement for your agent before writing the full system prompt.',
          'Test your agent with at least 5-10 different inputs before deploying to catch edge cases early.',
          'Use the "Test Agent" feature in the builder to iterate quickly without creating a deployment.',
          'Choose a model with enough context window to handle the longest conversations your agent will encounter.',
        ],
        code: `// Step 1: Create an agent via the NexusAI API
const agent = await fetch('/api/v1/agents', {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${token}\`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Support Bot',
    description: 'Handles customer support queries for a SaaS product',
    systemPrompt: \`You are a friendly and efficient customer support agent for CloudVault, a cloud storage SaaS product.

Your responsibilities:
- Answer questions about pricing, features, and account management
- Troubleshoot common issues (upload failures, sync errors, billing)
- Escalate complex technical issues by collecting relevant details
- Never make up features or pricing. If unsure, say so and offer to escalate.

Tone: Professional but warm. Use the customer's name when provided.
Response format: Start with a direct answer, then provide additional context.
If the issue requires human review, end with: "I've flagged this for our team. Reference #ABC123"\`,
    modelId: 'claude-sonnet-4-5',
  }),
});

const { id: agentId } = await agent.json();

// Step 2: Test the agent before deploying
const testResult = await fetch(\`/api/v1/agents/\${agentId}/test\`, {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${token}\`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    message: 'I was charged twice for my Pro subscription this month.',
  }),
});

// Step 3: Deploy when satisfied
await fetch(\`/api/v1/agents/\${agentId}/deploy\`, {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${token}\`,
  },
});`,
      },
      {
        title: 'Best Practices',
        content:
          'A great agent is the product of careful prompt engineering, appropriate model selection, and thorough testing. These best practices will help you build agents that are reliable, cost-effective, and genuinely useful to your users.',
        tips: [
          'Write system prompts that define what the agent should do AND what it should not do. Guardrails prevent unwanted behavior.',
          'Include explicit error handling instructions: "If you cannot find the answer, say so rather than guessing."',
          'Set a reasonable max token limit on responses to control costs and prevent runaway generation.',
          'Version your system prompts. Keep a changelog so you can roll back if a prompt update degrades performance.',
          'Monitor usage stats to identify common queries that your agent struggles with, then refine the prompt for those cases.',
          'Select cost-efficient models for high-volume agents. Use premium models only for tasks that require advanced reasoning.',
          'Use the NexusAI usage dashboard to track token consumption per agent and set budget alerts.',
        ],
        code: `// Well-structured system prompt template
const systemPrompt = \`# Role
You are a [AGENT_ROLE] for [COMPANY_NAME].

# Capabilities
- [CAPABILITY_1]
- [CAPABILITY_2]
- [CAPABILITY_3]

# Limitations
- You cannot access real-time stock prices or financial data.
- You cannot process payments or modify billing directly.
- You do not have access to the user's private files.

# Instructions
1. Greet the user by name if available.
2. Understand the intent behind the message.
3. Provide a direct answer first, then offer related information.
4. If the question falls outside your capabilities, say: "That's outside my area. Let me connect you with a specialist."
5. Keep responses under 200 words unless the user asks for detail.

# Output Format
- Use markdown for structure (headings, lists, code blocks).
- Include relevant links from the knowledge base when available.
- End with a follow-up question to keep the conversation moving.\`;

// Monitoring agent performance via usage API
const stats = await fetch('/api/v1/usage/stats', {
  headers: { 'Authorization': \`Bearer \${token}\` },
});
const { totalTokens, totalCost, byModel } = await stats.json();`,
      },
    ],
  },
  {
    id: 'pricing-guide',
    icon: '\uD83D\uDCB0',
    title: 'Pricing & Cost Optimization',
    description:
      'Understand how AI model pricing works, estimate your costs accurately, and learn strategies to reduce spending without sacrificing quality.',
    color: '#1E4DA8',
    bg: '#EBF0FC',
    sections: [
      {
        title: 'Understanding Token Pricing',
        content:
          'AI models charge based on tokens, which are roughly equivalent to 4 characters or 0.75 words in English. Every request has two token costs: input tokens (your prompt plus conversation history) and output tokens (the model\'s response). Output tokens are typically 2-5x more expensive than input tokens. Pricing is quoted per million tokens and varies dramatically between models, from $0.10/1M tokens for budget options to $15.00/1M tokens for premium reasoning models.',
        tips: [
          '1 token is approximately 4 characters or 3/4 of a word in English. "Hello world" is about 3 tokens.',
          'Input tokens are cheaper than output tokens. GPT-4.1 charges $2.00/1M input vs $8.00/1M output.',
          'System prompts are sent with every message, so a 500-token system prompt adds up across thousands of requests.',
          'Streaming does not reduce token costs. You still pay for the full response regardless of delivery method.',
          'Images and files are converted to tokens based on resolution and length. A single image can cost hundreds of tokens.',
        ],
        code: `// Estimating token costs for a typical conversation
const TOKENS_PER_WORD = 1.33; // approximate for English
const INPUT_COST_PER_M = 2.00;  // GPT-4.1 input: $2.00 per 1M tokens
const OUTPUT_COST_PER_M = 8.00; // GPT-4.1 output: $8.00 per 1M tokens

function estimateCost(
  systemPromptWords: number,
  conversationWords: number,
  responseWords: number,
): { inputCost: number; outputCost: number; total: string } {
  const inputTokens = Math.ceil(
    (systemPromptWords + conversationWords) * TOKENS_PER_WORD,
  );
  const outputTokens = Math.ceil(responseWords * TOKENS_PER_WORD);

  const inputCost = (inputTokens / 1_000_000) * INPUT_COST_PER_M;
  const outputCost = (outputTokens / 1_000_000) * OUTPUT_COST_PER_M;

  return {
    inputCost,
    outputCost,
    total: '$' + (inputCost + outputCost).toFixed(6),
  };
}

// Example: 50-word system prompt, 200-word conversation, 150-word response
const cost = estimateCost(50, 200, 150);
// => { inputCost: 0.000664, outputCost: 0.001596, total: '$0.002260' }

// Scale to 10,000 conversations/day
const dailyCost = parseFloat(cost.total.replace('$', '')) * 10_000;
// => ~$22.60/day or ~$678/month for GPT-4.1`,
      },
      {
        title: 'Cost Optimization Strategies',
        content:
          'Reducing AI costs does not mean reducing quality. The most effective strategies involve choosing the right model for each task, minimizing unnecessary token usage, and caching repeated queries. A thoughtful approach to model routing alone can cut costs by 60-80% with no perceptible difference in output quality.',
        tips: [
          'Use a fast, cheap model (Gemini Flash, DeepSeek V3) for classification, extraction, and formatting tasks.',
          'Reserve premium models (Claude Opus, o3) for complex reasoning that cheaper models genuinely cannot handle.',
          'Implement a model router: start with a cheap model, escalate to a premium one only if the response confidence is low.',
          'Compress your system prompts. Remove repetition and merge redundant instructions to save input tokens on every request.',
          'Cache frequent queries and their responses. If 20% of your queries are repeated, caching eliminates 20% of your costs.',
          'Use batch processing for non-real-time workloads. Some providers offer 50% discounts on batch API calls.',
          'Set max_tokens on every request. Uncapped responses can consume your entire budget on a single malformed prompt.',
          'Trim conversation history instead of sending the full chat. Keep only the last 5-10 messages plus a summary.',
        ],
        code: `// Model router: use the cheapest model that gets the job done
const MODEL_TIERS = {
  basic: { model: 'gemini-2.0-flash', cost: 0.10 },   // classification, extraction
  standard: { model: 'gpt-4.1-mini', cost: 0.40 },    // general Q&A, writing
  advanced: { model: 'claude-sonnet-4-5', cost: 3.00 }, // analysis, coding
  premium: { model: 'claude-opus-4', cost: 15.00 },    // complex reasoning
};

function selectModel(taskComplexity: 'basic' | 'standard' | 'advanced' | 'premium') {
  return MODEL_TIERS[taskComplexity];
}

// Smart truncation: keep system prompt + last N messages + summary
function trimHistory(
  messages: Array<{ role: string; content: string }>,
  maxMessages: number = 10,
): Array<{ role: string; content: string }> {
  if (messages.length <= maxMessages) return messages;

  const systemMsgs = messages.filter((m) => m.role === 'system');
  const conversationMsgs = messages.filter((m) => m.role !== 'system');
  const recent = conversationMsgs.slice(-maxMessages);

  // Older messages get summarized into one context message
  const older = conversationMsgs.slice(0, -maxMessages);
  const summary =
    '[Previous conversation summary: ' +
    older.map((m) => \`\${m.role}: \${m.content.slice(0, 80)}...\`).join(' | ') +
    ']';

  return [...systemMsgs, { role: 'user', content: summary }, ...recent];
}`,
      },
      {
        title: 'Price Comparison',
        content:
          'Model pricing varies by orders of magnitude across providers. The table below shows the current pricing for popular models on NexusAI. Remember that the cheapest model is not always the best value: a $15 model that solves your task in one shot may cost less than a $0.10 model that requires five attempts and extensive prompt engineering to produce the same result.',
        tips: [
          'Free models (Llama 4 Scout, DeepSeek V3 open weights) are ideal for development, testing, and low-stakes tasks.',
          'Budget models ($0.10-$0.50/1M tokens) handle 80% of typical workloads: summaries, formatting, classification, translation.',
          'Mid-range models ($1-$5/1M tokens) are the sweet spot for production: complex Q&A, code generation, content creation.',
          'Premium models ($10+/1M tokens) are worth it for high-value tasks: legal analysis, medical reasoning, financial modeling.',
          'Always benchmark your specific task. Model A may outperform Model B on general benchmarks but underperform on your data.',
          'Factor in speed: a model that is 5x cheaper but 5x slower may increase your infrastructure costs and hurt user experience.',
        ],
        code: `// Price comparison table (per 1M tokens, input/output)
const PRICE_COMPARISON = [
  { model: 'Gemini Flash 2.0',   input: 0.075,  output: 0.30,   tier: 'Budget' },
  { model: 'DeepSeek V3',        input: 0.14,   output: 0.28,   tier: 'Budget' },
  { model: 'GPT-4.1 Mini',       input: 0.40,   output: 1.60,   tier: 'Budget' },
  { model: 'Gemini 2.5 Pro',     input: 1.25,   output: 10.00,  tier: 'Mid-Range' },
  { model: 'GPT-4.1',            input: 2.00,   output: 8.00,   tier: 'Mid-Range' },
  { model: 'Mistral Large 3',    input: 2.00,   output: 6.00,   tier: 'Mid-Range' },
  { model: 'Claude Sonnet 4.5',  input: 3.00,   output: 15.00,  tier: 'Mid-Range' },
  { model: 'Grok 3 Beta',        input: 3.00,   output: 15.00,  tier: 'Mid-Range' },
  { model: 'Claude Opus 4',      input: 15.00,  output: 75.00,  tier: 'Premium' },
];

// Calculate monthly cost estimate for your workload
function estimateMonthlyCost(
  requestsPerDay: number,
  avgInputTokens: number,
  avgOutputTokens: number,
  modelName: string,
): string {
  const model = PRICE_COMPARISON.find((m) => m.model === modelName);
  if (!model) return 'Model not found';

  const dailyInputCost = (requestsPerDay * avgInputTokens / 1_000_000) * model.input;
  const dailyOutputCost = (requestsPerDay * avgOutputTokens / 1_000_000) * model.output;
  const monthlyCost = (dailyInputCost + dailyOutputCost) * 30;

  return \`$\${monthlyCost.toFixed(2)}/month\`;
}

// Example: 1,000 requests/day, 500 input tokens, 300 output tokens
estimateMonthlyCost(1000, 500, 300, 'GPT-4.1');
// => "$150.00/month"
estimateMonthlyCost(1000, 500, 300, 'Gemini Flash 2.0');
// => "$4.05/month" — 97% savings for tasks that don't need GPT-4.1`,
      },
    ],
  },
];
