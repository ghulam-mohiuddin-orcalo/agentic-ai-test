'use client';

import { useState, useMemo } from 'react';
import { Box, Typography, Chip, TextField, InputAdornment, IconButton, LinearProgress } from '@mui/material';
import { Search, Close, Share, BookmarkBorder, ArrowBack } from '@mui/icons-material';

interface ResearchItem {
  id: string;
  month: string;
  day: number;
  source: string;
  title: string;
  summary: string;
  tags: string[];
  url?: string;
  content?: string;
  benchmarks?: { label: string; score: number; color: string }[];
  relatedIds?: string[];
}

const FEED: ResearchItem[] = [
  {
    id: '1',
    month: 'MAR',
    day: 26,
    source: 'Google DeepMind',
    title: 'Gemini 2.5 Pro achieves new SOTA on reasoning benchmarks',
    summary:
      'Scores 83.2% on AIME 2025 math competition, outperforming all prior models on reasoning-intensive tasks.',
    tags: ['Reasoning', 'Benchmark'],
    content:
      'Google DeepMind has released Gemini 2.5 Pro, their most capable model to date, achieving state-of-the-art results on multiple reasoning benchmarks. The model scores 83.2% on the AIME 2025 math competition, a significant leap from previous models. Key improvements include enhanced chain-of-thought reasoning, better mathematical proof construction, and more reliable step-by-step problem decomposition. The model also shows strong performance on code generation tasks, scoring 92.1% on HumanEval+ and 87.4% on SWE-bench Verified. DeepMind attributes these gains to a combination of improved training data curation, novel architecture modifications to the attention mechanism, and a refined RLHF pipeline that specifically targets reasoning quality.',
    benchmarks: [
      { label: 'AIME 2025', score: 83.2, color: '#C8622A' },
      { label: 'HumanEval+', score: 92.1, color: '#1E4DA8' },
      { label: 'SWE-bench', score: 87.4, color: '#0A5E49' },
      { label: 'MMLU-Pro', score: 89.7, color: '#9B2042' },
    ],
    relatedIds: ['7', '14'],
  },
  {
    id: '2',
    month: 'MAR',
    day: 22,
    source: 'MIT CSAIL',
    title: 'Scaling laws for multimodal models: new empirical findings',
    summary:
      'Research reveals unexpected scaling dynamics when combining vision and language — efficiency gains plateau earlier than expected.',
    tags: ['Multimodal', 'Scaling'],
    content:
      'Researchers at MIT CSAIL have published a comprehensive study examining how scaling laws differ for multimodal models compared to text-only counterparts. The study analyzed over 200 model configurations across various compute budgets. Key finding: while text-only models show predictable power-law scaling, multimodal models exhibit a "plateau effect" where vision-language alignment quality stops improving after a certain compute threshold. The team proposes a modified Chinchilla scaling law that accounts for cross-modal data ratio optimization. They recommend a 3:1 text-to-image token ratio for compute-optimal training, contrary to the 1:1 ratios commonly used.',
    benchmarks: [
      { label: 'VQA v2', score: 78.5, color: '#C8622A' },
      { label: 'TextVQA', score: 71.2, color: '#1E4DA8' },
      { label: 'COCO Captions', score: 85.3, color: '#0A5E49' },
    ],
    relatedIds: ['4', '10'],
  },
  {
    id: '3',
    month: 'MAR',
    day: 18,
    source: 'Anthropic',
    title: 'Constitutional AI v2: improved alignment through iterative refinement',
    summary:
      'New methodology achieves 40% reduction in harmful outputs while preserving capability on standard benchmarks.',
    tags: ['Alignment', 'Safety'],
    content:
      'Anthropic has published details on Constitutional AI v2 (CAI-v2), an evolution of their alignment methodology. The approach introduces an iterative refinement loop where the model generates responses, critiques them against a set of principles, and revises — but now with a learned critic model rather than hand-written rules. CAI-v2 achieves a 40% reduction in harmful outputs on adversarial safety benchmarks while maintaining 99.2% of baseline capability on standard evaluations. The paper also introduces a novel "principle distillation" technique that allows smaller models to inherit alignment properties from larger ones with minimal performance degradation.',
    benchmarks: [
      { label: 'Safety Score', score: 94.8, color: '#0A5E49' },
      { label: 'Helpfulness', score: 91.3, color: '#1E4DA8' },
      { label: 'MMLU', score: 88.1, color: '#C8622A' },
    ],
    relatedIds: ['7', '8'],
  },
  {
    id: '4',
    month: 'MAR',
    day: 15,
    source: 'Meta AI',
    title: 'Llama 4 Scout & Maverick: natively multimodal from the ground up',
    summary:
      '17B MoE architecture trained on 40 trillion tokens with native understanding across text, image, and video.',
    tags: ['Open Source', 'Multimodal'],
    content:
      'Meta AI has released Llama 4, featuring two variants: Scout (17B active parameters, 16 experts) and Maverick (17B active, 128 experts). Both models are natively multimodal, trained from scratch on a mixture of text, image, and video data totaling 40 trillion tokens. Unlike previous approaches that bolt vision encoders onto language models, Llama 4 uses a unified transformer architecture with modality-specific tokenizers feeding into a shared representation space. Scout targets efficient deployment with a 10M token context window, while Maverick pushes capability boundaries. Both models are released under an open license, continuing Meta\'s commitment to open-source AI.',
    benchmarks: [
      { label: 'MMLU', score: 86.9, color: '#C8622A' },
      { label: 'ImageNet', score: 89.2, color: '#1E4DA8' },
      { label: 'VideoQA', score: 74.8, color: '#0A5E49' },
      { label: 'Context (M)', score: 10.0, color: '#9B2042' },
    ],
    relatedIds: ['2', '6'],
  },
  {
    id: '5',
    month: 'MAR',
    day: 10,
    source: 'Stanford NLP',
    title: 'Long-context recall: how models handle 1M+ token windows',
    summary:
      'Comprehensive evaluation shows sharp recall degradation beyond 200K tokens for most models tested.',
    tags: ['Long Context', 'Evaluation'],
    content:
      'Stanford NLP researchers present the most comprehensive evaluation of long-context language models to date, testing 12 frontier models on contexts ranging from 32K to 2M tokens. The study uses a novel "needle-in-a-haystack" benchmark with varying levels of retrieval difficulty. Key findings: most models maintain >95% recall up to 128K tokens, but accuracy drops sharply beyond 200K, with only two models (Gemini 2.5 Pro and GPT-4.5) maintaining >80% recall at 1M tokens. The paper introduces a "context utilization score" metric that better captures real-world long-context usage patterns compared to simple needle retrieval.',
    benchmarks: [
      { label: 'Recall @128K', score: 96.2, color: '#0A5E49' },
      { label: 'Recall @512K', score: 72.1, color: '#C8622A' },
      { label: 'Recall @1M', score: 58.4, color: '#9B2042' },
    ],
    relatedIds: ['1', '10'],
  },
  {
    id: '6',
    month: 'MAR',
    day: 5,
    source: 'DeepSeek',
    title: 'DeepSeek-R1 open weights: reproducing frontier reasoning at minimal cost',
    summary:
      'Full weight release enables fine-tuning for domain-specific reasoning at a fraction of frontier model costs.',
    tags: ['Open Source', 'Reasoning'],
    content:
      'DeepSeek has released the full weights of DeepSeek-R1, their reasoning-focused model that approaches frontier capability at a fraction of the training cost. The model uses a novel "reasoning distillation" approach where a large teacher model generates step-by-step reasoning traces that are used to train the smaller R1 model. At 67B parameters, R1 achieves 79.1% on AIME 2025 (compared to 83.2% for Gemini 2.5 Pro) while being trainable on a single 8xH100 node. The open release includes training code, data preprocessing pipelines, and detailed ablation studies, enabling the community to reproduce and extend the work.',
    benchmarks: [
      { label: 'AIME 2025', score: 79.1, color: '#C8622A' },
      { label: 'MATH-500', score: 91.4, color: '#1E4DA8' },
      { label: 'GSM8K', score: 95.2, color: '#0A5E49' },
    ],
    relatedIds: ['1', '4'],
  },
  {
    id: '7',
    month: 'FEB',
    day: 28,
    source: 'OpenAI',
    title: 'o3 system card: safety evaluation and capability assessment',
    summary:
      "Detailed analysis of o3's reasoning capabilities, novel risk mitigations, and performance on expert-level tasks.",
    tags: ['Safety', 'Reasoning'],
    content:
      'OpenAI has published the system card for o3, their most advanced reasoning model. The card details extensive safety testing including red-team evaluations across biosecurity, cybersecurity, and persuasion domains. o3 achieves expert-level performance on PhD-level science questions (89.3% on GPQA Diamond) and demonstrates novel capabilities in multi-step planning tasks. The system card also introduces a new "reasoning transparency" framework where the model can explain its chain of thought in human-interpretable terms. Safety mitigations include a learned refusal classifier trained on 50K adversarial examples and a novel "reasoning guardrail" that monitors intermediate reasoning steps for harmful intent.',
    benchmarks: [
      { label: 'GPQA Diamond', score: 89.3, color: '#C8622A' },
      { label: 'AIME 2025', score: 81.7, color: '#1E4DA8' },
      { label: 'Safety Score', score: 96.1, color: '#0A5E49' },
    ],
    relatedIds: ['1', '3'],
  },
  {
    id: '8',
    month: 'FEB',
    day: 24,
    source: 'UC Berkeley',
    title: 'RLHF vs RLAIF: a large-scale empirical comparison',
    summary:
      'Human feedback still outperforms AI feedback on nuanced creative tasks, but RLAIF closes the gap at scale.',
    tags: ['RLHF', 'Alignment'],
    content:
      'UC Berkeley researchers present the largest empirical comparison of RLHF (Reinforcement Learning from Human Feedback) and RLAIF (Reinforcement Learning from AI Feedback) to date. The study spans 8 task domains, 3 model sizes, and over 100K preference comparisons. Key findings: RLAIF matches or exceeds RLHF performance on factual Q&A, summarization, and code generation when using high-quality AI judges. However, RLHF maintains a significant advantage on creative writing, nuanced ethical reasoning, and cultural sensitivity tasks where human judgment captures subtleties that AI feedback misses. The paper proposes a hybrid approach that uses RLAIF for scalable coverage and RLHF for high-stakes domains.',
    benchmarks: [
      { label: 'RLHF Factual', score: 87.4, color: '#1E4DA8' },
      { label: 'RLAIF Factual', score: 88.1, color: '#0A5E49' },
      { label: 'RLHF Creative', score: 82.6, color: '#C8622A' },
      { label: 'RLAIF Creative', score: 73.9, color: '#9B2042' },
    ],
    relatedIds: ['3', '7'],
  },
  {
    id: '9',
    month: 'FEB',
    day: 19,
    source: 'Mistral AI',
    title: 'Mixture-of-Experts at scale: lessons from training Mixtral 8x22B',
    summary:
      'Routing instability and load balancing remain key challenges; sparse activation cuts inference cost by 4x.',
    tags: ['MoE', 'Efficiency'],
    content:
      'Mistral AI shares detailed lessons from training Mixtral 8x22B, their largest MoE model. The report covers practical challenges in MoE training at scale, including router collapse (where most tokens get sent to the same experts), load imbalance across GPUs, and the training instability that emerges beyond 10T tokens. Solutions include an auxiliary load-balancing loss, expert-level gradient clipping, and a novel "soft routing" mechanism that smoothly interpolates between experts. The result is a model with 176B total parameters but only 22B active per forward pass, achieving 4x inference cost reduction compared to a dense model of equivalent quality.',
    benchmarks: [
      { label: 'MMLU', score: 84.7, color: '#C8622A' },
      { label: 'Inference Speed', score: 94.0, color: '#0A5E49' },
      { label: 'Cost Efficiency', score: 91.2, color: '#1E4DA8' },
    ],
    relatedIds: ['4', '11'],
  },
  {
    id: '10',
    month: 'FEB',
    day: 14,
    source: 'Google Research',
    title: 'Efficient attention: linear complexity transformers revisited',
    summary:
      'New approximation scheme achieves 98% of full-attention quality at O(n) cost for sequences up to 512K.',
    tags: ['Architecture', 'Efficiency'],
    content:
      'Google Research presents a new linear attention approximation that achieves near-lossless quality compared to full quadratic attention. The key innovation is a "sliding window + global summary" approach where local attention handles nearby context while learned global summary tokens capture long-range dependencies. On sequences up to 512K tokens, the approach maintains 98% of full-attention quality while reducing compute from O(n^2) to O(n). The method is particularly effective for tasks requiring both local precision (code, structured data) and global understanding (summarization, long-document QA). The team provides optimized CUDA kernels that achieve 3.2x wall-clock speedup on A100 GPUs.',
    benchmarks: [
      { label: 'Quality Retention', score: 98.0, color: '#0A5E49' },
      { label: 'Speed @512K', score: 95.3, color: '#1E4DA8' },
      { label: 'Memory Savings', score: 87.6, color: '#C8622A' },
    ],
    relatedIds: ['5', '9'],
  },
  {
    id: '11',
    month: 'FEB',
    day: 9,
    source: 'Hugging Face',
    title: 'SmolLM2: surprisingly capable sub-1B models for edge deployment',
    summary:
      'Careful data curation and architecture choices push sub-billion-parameter models to near-3B quality on key tasks.',
    tags: ['Edge AI', 'Efficiency'],
    content:
      'Hugging Face introduces SmolLM2, a family of language models under 1 billion parameters designed for edge and mobile deployment. Through aggressive data curation (filtering 15T tokens down to 1.5T high-quality tokens), architectural innovations (grouped query attention, rotary embeddings with extended context), and a novel two-phase training schedule, SmolLM2 achieves performance comparable to 3B-parameter models on many benchmarks. The 360M variant runs at 40 tokens/second on an iPhone 15 Pro with 4-bit quantization, while the 780M variant matches Llama 2 7B on commonsense reasoning tasks. Models are released with GGUF quantizations and iOS/Android deployment guides.',
    benchmarks: [
      { label: 'HellaSwag', score: 74.1, color: '#C8622A' },
      { label: 'ARC-C', score: 68.3, color: '#1E4DA8' },
      { label: 'On-device FPS', score: 89.0, color: '#0A5E49' },
    ],
    relatedIds: ['9', '10'],
  },
  {
    id: '12',
    month: 'FEB',
    day: 3,
    source: 'Carnegie Mellon',
    title: 'Chain-of-thought prompting does not generalize across domains equally',
    summary:
      'CoT helps most on math and logic, but can hurt performance on commonsense and factual recall tasks.',
    tags: ['Prompting', 'Evaluation'],
    content:
      'CMU researchers challenge the universal effectiveness of chain-of-thought (CoT) prompting through a systematic evaluation across 15 task domains and 6 model families. While CoT significantly improves performance on mathematical reasoning (+18.4%), formal logic (+12.7%), and multi-step planning (+9.3%), it actually degrades performance on commonsense reasoning (-3.2%), factual recall (-5.1%), and simple classification (-7.8%). The paper argues that CoT introduces "reasoning overhead" that can distract models from tasks where direct pattern matching is more appropriate. The authors propose an adaptive prompting strategy that automatically selects between CoT and direct prompting based on task characteristics.',
    benchmarks: [
      { label: 'Math +CoT', score: 81.4, color: '#0A5E49' },
      { label: 'Logic +CoT', score: 77.7, color: '#1E4DA8' },
      { label: 'Commonsense +CoT', score: 62.8, color: '#9B2042' },
    ],
    relatedIds: ['1', '8'],
  },
  {
    id: '13',
    month: 'JAN',
    day: 29,
    source: 'Microsoft Research',
    title: 'Phi-4: small model, big reasoning — the data-centric approach',
    summary:
      'Synthetic data pipelines and rigorous data filtering allow 14B models to rival 70B counterparts on STEM benchmarks.',
    tags: ['Scaling', 'Data'],
    content:
      'Microsoft Research details the data-centric approach behind Phi-4, a 14B parameter model that matches or exceeds 70B models on STEM benchmarks. The key insight is that data quality and composition matter more than raw scale for reasoning tasks. Phi-4 is trained on a carefully curated mixture of web text (30%), synthetic reasoning traces (40%), textbook-quality explanations (20%), and code (10%). The synthetic data is generated by GPT-4 and Claude 3 Opus, then filtered through a multi-stage quality pipeline that removes hallucinations, checks logical consistency, and ensures diversity. The paper includes extensive ablation studies showing the contribution of each data source to final model capability.',
    benchmarks: [
      { label: 'GPQA', score: 78.4, color: '#C8622A' },
      { label: 'MATH-500', score: 88.2, color: '#1E4DA8' },
      { label: 'HumanEval', score: 85.7, color: '#0A5E49' },
    ],
    relatedIds: ['6', '15'],
  },
  {
    id: '14',
    month: 'JAN',
    day: 22,
    source: 'xAI',
    title: 'Grok-3: real-time search integration and reasoning at scale',
    summary:
      'Live web access combined with extended thinking allows Grok-3 to excel at time-sensitive analytical questions.',
    tags: ['Reasoning', 'Search'],
    content:
      'xAI presents Grok-3, a model that deeply integrates real-time web search into its reasoning process. Unlike retrieval-augmented generation (RAG) approaches that treat search as a preprocessing step, Grok-3 can dynamically decide when and what to search during multi-step reasoning. The model uses a novel "search-in-the-loop" architecture where search queries are generated as part of the chain of thought and search results are incorporated before continuing reasoning. This enables Grok-3 to answer complex, time-sensitive questions that require synthesizing current information from multiple sources. On the TriviaQA-Recent benchmark (questions about events in the last 30 days), Grok-3 achieves 84.2% accuracy compared to 31.7% for models without search access.',
    benchmarks: [
      { label: 'TriviaQA-Recent', score: 84.2, color: '#C8622A' },
      { label: 'WebQA', score: 79.8, color: '#1E4DA8' },
      { label: 'Reasoning', score: 86.1, color: '#0A5E49' },
    ],
    relatedIds: ['1', '7'],
  },
  {
    id: '15',
    month: 'JAN',
    day: 17,
    source: 'EleutherAI',
    title: 'The Pile v2: diverse open corpus for next-generation language models',
    summary:
      '825GB of high-quality filtered text across 22 diverse domains, with improved deduplication and quality scoring.',
    tags: ['Data', 'Open Source'],
    content:
      'EleutherAI releases The Pile v2, a major update to their open-source training corpus. The new version spans 825GB of deduplicated text across 22 domains including academic papers, books, code, legal documents, patents, and multilingual web text. Key improvements over v1 include: near-exact deduplication reducing redundancy by 34%, a learned quality classifier that scores each document, domain-proportional sampling to prevent overrepresentation of any single source, and comprehensive documentation of data provenance and licensing. The team also releases their full data processing pipeline, enabling organizations to create custom training corpora using the same methodology. Early experiments show models trained on Pile v2 achieve 2-4% improvements over v1-trained models across standard benchmarks.',
    benchmarks: [
      { label: 'Dedup Rate', score: 96.5, color: '#0A5E49' },
      { label: 'Quality Score', score: 88.3, color: '#1E4DA8' },
      { label: 'Domain Coverage', score: 92.0, color: '#C8622A' },
    ],
    relatedIds: ['13', '6'],
  },
];

const ALL_TAGS = Array.from(new Set(FEED.flatMap((f) => f.tags))).sort();

const TAG_COLORS: Record<string, { bg: string; color: string }> = {
  Reasoning: { bg: '#FDEDF1', color: '#9B2042' },
  Benchmark: { bg: '#EBF0FC', color: '#1E4DA8' },
  Multimodal: { bg: '#FDF1EB', color: '#C8622A' },
  Scaling: { bg: '#EBF0FC', color: '#1E4DA8' },
  Alignment: { bg: '#E2F5EF', color: '#0A5E49' },
  Safety: { bg: '#E2F5EF', color: '#0A5E49' },
  'Open Source': { bg: '#E2F5EF', color: '#0A5E49' },
  'Long Context': { bg: '#FDF5E0', color: '#8A5A00' },
  Evaluation: { bg: '#ECEAE4', color: '#5A5750' },
  RLHF: { bg: '#EBF0FC', color: '#1E4DA8' },
  MoE: { bg: '#FDF1EB', color: '#C8622A' },
  Efficiency: { bg: '#E2F5EF', color: '#0A5E49' },
  Architecture: { bg: '#EBF0FC', color: '#1E4DA8' },
  Prompting: { bg: '#FDF5E0', color: '#8A5A00' },
  Data: { bg: '#ECEAE4', color: '#5A5750' },
  'Edge AI': { bg: '#E2F5EF', color: '#0A5E49' },
  Search: { bg: '#EBF0FC', color: '#1E4DA8' },
};

export default function DiscoverPage() {
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<ResearchItem | null>(null);

  const filtered = useMemo(() => {
    let items = FEED;
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.summary.toLowerCase().includes(q) ||
          i.source.toLowerCase().includes(q) ||
          i.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (activeTag) {
      items = items.filter((i) => i.tags.includes(activeTag));
    }
    return items;
  }, [search, activeTag]);

  const relatedArticles = useMemo(() => {
    if (!selectedArticle?.relatedIds) return [];
    return FEED.filter((item) => selectedArticle.relatedIds!.includes(item.id));
  }, [selectedArticle]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'var(--bg)' }}>
      {/* Page header */}
      <Box
        sx={{
          bgcolor: 'var(--card)',
          borderBottom: '1px solid var(--border)',
          px: { xs: 2, md: 6 },
          pt: 3,
          pb: 2.5,
        }}
      >
        <Box
          sx={{
            maxWidth: 720,
            mx: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5 }}>
            <Box>
              <Typography
                sx={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: '1.625rem',
                  color: 'var(--text)',
                  lineHeight: 1.15,
                  mb: 0.375,
                }}
              >
                AI Research Feed
              </Typography>
              <Typography sx={{ fontSize: '0.9rem', color: 'var(--text2)' }}>
                Latest papers and breakthroughs from leading AI labs
              </Typography>
            </Box>

            <TextField
              size="small"
              placeholder="Search papers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ fontSize: 17, color: 'var(--text3)' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                width: 240,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '9px',
                  bgcolor: 'var(--bg)',
                  fontSize: '0.875rem',
                  '& fieldset': { borderColor: 'var(--border)' },
                  '&:hover fieldset': { borderColor: 'var(--border2)' },
                  '&.Mui-focused fieldset': { borderColor: 'var(--accent)', borderWidth: 1.5 },
                },
                '& .MuiInputBase-input::placeholder': { color: 'var(--text3)', opacity: 1 },
              }}
            />
          </Box>

          {/* Tag filter chips */}
          <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
            <Chip
              label="All"
              size="small"
              onClick={() => setActiveTag('')}
              sx={{
                height: 26,
                borderRadius: '7px',
                fontSize: '0.75rem',
                fontWeight: activeTag === '' ? 700 : 500,
                bgcolor: activeTag === '' ? 'var(--accent)' : 'transparent',
                color: activeTag === '' ? '#fff' : 'var(--text2)',
                border: activeTag === '' ? 'none' : '1px solid var(--border)',
                cursor: 'pointer',
                '&:hover': { bgcolor: activeTag === '' ? 'var(--accent2)' : 'var(--bg2)' },
              }}
            />
            {ALL_TAGS.map((tag) => {
              const tc = TAG_COLORS[tag] ?? { bg: '#ECEAE4', color: '#5A5750' };
              const isActive = activeTag === tag;
              return (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  onClick={() => setActiveTag(isActive ? '' : tag)}
                  sx={{
                    height: 26,
                    borderRadius: '7px',
                    fontSize: '0.75rem',
                    fontWeight: isActive ? 700 : 500,
                    bgcolor: isActive ? tc.color : tc.bg,
                    color: isActive ? '#fff' : tc.color,
                    border: 'none',
                    cursor: 'pointer',
                    '&:hover': { opacity: 0.85 },
                  }}
                />
              );
            })}
          </Box>
        </Box>
      </Box>

      {/* Main content area */}
      <Box
        sx={{
          maxWidth: 720,
          mx: 'auto',
          px: { xs: 2, md: 0 },
          py: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
        }}
      >
        {/* Article detail view */}
        {selectedArticle ? (
          <ArticleDetail
            article={selectedArticle}
            relatedArticles={relatedArticles}
            onBack={() => setSelectedArticle(null)}
            onSelectRelated={(item) => setSelectedArticle(item)}
          />
        ) : filtered.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography sx={{ fontSize: '2rem', mb: 1.5 }}>&#128269;</Typography>
            <Typography sx={{ fontWeight: 600, color: 'var(--text)', mb: 0.5 }}>
              No results found
            </Typography>
            <Typography sx={{ fontSize: '0.875rem', color: 'var(--text2)' }}>
              Try a different keyword or clear the filters
            </Typography>
          </Box>
        ) : (
          filtered.map((item, idx) => (
            <ResearchCard
              key={item.id}
              item={item}
              isLast={idx === filtered.length - 1}
              onClick={() => setSelectedArticle(item)}
            />
          ))
        )}
      </Box>
    </Box>
  );
}

/* ── Article Detail View ── */

interface ArticleDetailProps {
  article: ResearchItem;
  relatedArticles: ResearchItem[];
  onBack: () => void;
  onSelectRelated: (item: ResearchItem) => void;
}

function ArticleDetail({ article, relatedArticles, onBack, onSelectRelated }: ArticleDetailProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Back button */}
      <Box
        onClick={onBack}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.75,
          cursor: 'pointer',
          color: 'var(--text2)',
          fontSize: '0.85rem',
          fontWeight: 500,
          '&:hover': { color: 'var(--accent)' },
          transition: 'color 0.15s ease',
          alignSelf: 'flex-start',
        }}
      >
        <ArrowBack sx={{ fontSize: 18 }} />
        Back to feed
      </Box>

      {/* Article header */}
      <Box
        sx={{
          bgcolor: 'var(--card)',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--border)',
          p: 3.5,
        }}
      >
        {/* Source and date */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
          <Typography
            sx={{
              fontSize: '0.6875rem',
              fontWeight: 600,
              color: 'var(--text3)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {article.source}
          </Typography>
          <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'var(--border2)' }} />
          <Typography sx={{ fontSize: '0.6875rem', color: 'var(--text3)' }}>
            {article.month} {article.day}
          </Typography>
        </Box>

        {/* Title */}
        <Typography
          sx={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 700,
            fontSize: '1.5rem',
            color: 'var(--text)',
            lineHeight: 1.3,
            mb: 2,
          }}
        >
          {article.title}
        </Typography>

        {/* Tags */}
        <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', mb: 2.5 }}>
          {article.tags.map((tag) => {
            const tc = TAG_COLORS[tag] ?? { bg: '#ECEAE4', color: '#5A5750' };
            return (
              <Box
                key={tag}
                sx={{
                  px: 1,
                  py: 0.375,
                  borderRadius: '2rem',
                  bgcolor: tc.bg,
                  color: tc.color,
                  fontSize: '0.75rem',
                  fontWeight: 500,
                }}
              >
                {tag}
              </Box>
            );
          })}
        </Box>

        {/* Content */}
        <Typography
          sx={{
            fontSize: '0.925rem',
            color: 'var(--text2)',
            lineHeight: 1.75,
          }}
        >
          {article.content || article.summary}
        </Typography>

        {/* Action buttons */}
        <Box sx={{ display: 'flex', gap: 1, mt: 3, pt: 2.5, borderTop: '1px solid var(--border)' }}>
          <IconButton
            size="small"
            sx={{
              border: '1px solid var(--border)',
              borderRadius: '10px',
              px: 1.5,
              gap: 0.75,
              fontSize: '0.8rem',
              color: 'var(--text2)',
              '&:hover': { bgcolor: 'var(--bg2)', color: 'var(--accent)' },
            }}
          >
            <Share sx={{ fontSize: 16 }} />
            <Typography component="span" sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
              Share
            </Typography>
          </IconButton>
          <IconButton
            size="small"
            sx={{
              border: '1px solid var(--border)',
              borderRadius: '10px',
              px: 1.5,
              gap: 0.75,
              fontSize: '0.8rem',
              color: 'var(--text2)',
              '&:hover': { bgcolor: 'var(--bg2)', color: 'var(--accent)' },
            }}
          >
            <BookmarkBorder sx={{ fontSize: 16 }} />
            <Typography component="span" sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
              Bookmark
            </Typography>
          </IconButton>
        </Box>
      </Box>

      {/* Benchmark stats */}
      {article.benchmarks && article.benchmarks.length > 0 && (
        <Box
          sx={{
            bgcolor: 'var(--card)',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border)',
            p: 3,
          }}
        >
          <Typography
            sx={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: '1rem',
              color: 'var(--text)',
              mb: 2,
            }}
          >
            Benchmark Performance
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {article.benchmarks.map((bench) => (
              <Box key={bench.label}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text2)' }}>
                    {bench.label}
                  </Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: bench.color }}>
                    {bench.score}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={bench.score}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: 'var(--bg2)',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                      bgcolor: bench.color,
                    },
                  }}
                />
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Related articles */}
      {relatedArticles.length > 0 && (
        <Box
          sx={{
            bgcolor: 'var(--card)',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border)',
            p: 3,
          }}
        >
          <Typography
            sx={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: '1rem',
              color: 'var(--text)',
              mb: 2,
            }}
          >
            Related Articles
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {relatedArticles.map((related) => (
              <Box
                key={related.id}
                onClick={() => onSelectRelated(related)}
                sx={{
                  p: 2,
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    bgcolor: 'var(--bg2)',
                    borderColor: 'var(--border2)',
                  },
                }}
              >
                <Typography
                  sx={{
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    color: 'var(--text3)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    mb: 0.5,
                  }}
                >
                  {related.source} -- {related.month} {related.day}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    color: 'var(--text)',
                    lineHeight: 1.35,
                  }}
                >
                  {related.title}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}

/* ── Research Card (Feed List Item) ── */

function ResearchCard({ item, isLast, onClick }: { item: ResearchItem; isLast: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Box
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        display: 'flex',
        gap: 0,
        bgcolor: hovered ? 'var(--card)' : 'transparent',
        borderRadius: hovered ? 'var(--radius)' : 0,
        border: '1px solid',
        borderColor: hovered ? 'var(--border)' : 'transparent',
        borderBottom: !isLast && !hovered ? '1px solid var(--border)' : undefined,
        transition: 'all 0.15s ease',
        cursor: 'pointer',
        overflow: 'hidden',
        mb: !isLast ? 0 : 0,
      }}
    >
      {/* Date column */}
      <Box
        sx={{
          width: 80,
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          pt: 2.5,
          pb: 2,
          px: 1,
        }}
      >
        <Typography
          sx={{
            fontSize: '0.625rem',
            fontWeight: 700,
            color: 'var(--text3)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            lineHeight: 1,
            mb: 0.25,
          }}
        >
          {item.month}
        </Typography>
        <Typography
          sx={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: '2rem',
            color: 'var(--text)',
            lineHeight: 1,
          }}
        >
          {item.day}
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, py: 2.5, pr: 2.5, minWidth: 0 }}>
        {/* Source badge */}
        <Typography
          sx={{
            display: 'inline-block',
            fontSize: '0.6875rem',
            fontWeight: 600,
            color: 'var(--text3)',
            mb: 0.75,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {item.source}
        </Typography>

        {/* Title */}
        <Typography
          sx={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 700,
            fontSize: '1rem',
            color: hovered ? 'var(--accent)' : 'var(--text)',
            lineHeight: 1.35,
            mb: 0.75,
            transition: 'color 0.15s ease',
          }}
        >
          {item.title}
        </Typography>

        {/* Summary */}
        <Typography
          sx={{
            fontSize: '0.875rem',
            color: 'var(--text2)',
            lineHeight: 1.6,
            mb: 1.25,
          }}
        >
          {item.summary}
        </Typography>

        {/* Tags */}
        <Box sx={{ display: 'flex', gap: 0.625, flexWrap: 'wrap' }}>
          {item.tags.map((tag) => {
            const tc = TAG_COLORS[tag] ?? { bg: '#ECEAE4', color: '#5A5750' };
            return (
              <Box
                key={tag}
                sx={{
                  px: 0.875,
                  py: 0.25,
                  borderRadius: '2rem',
                  bgcolor: tc.bg,
                  color: tc.color,
                  fontSize: '0.6875rem',
                  fontWeight: 500,
                }}
              >
                {tag}
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
