'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Box, Typography } from '@mui/material';
import CodeBlock from './CodeBlock';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <Box className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Paragraphs
          p: ({ children }) => (
            <Typography
              component="p"
              sx={{
                fontSize: '0.9375rem',
                lineHeight: 1.75,
                color: 'var(--text)',
                my: 0.5,
                '&:first-of-type': { mt: 0 },
                '&:last-child': { mb: 0 },
              }}
            >
              {children}
            </Typography>
          ),

          // Headings
          h1: ({ children }) => (
            <Typography
              component="h1"
              sx={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: 'var(--text)',
                mt: 2.5,
                mb: 1,
                lineHeight: 1.3,
              }}
            >
              {children}
            </Typography>
          ),
          h2: ({ children }) => (
            <Typography
              component="h2"
              sx={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--text)',
                mt: 2,
                mb: 0.75,
                lineHeight: 1.3,
              }}
            >
              {children}
            </Typography>
          ),
          h3: ({ children }) => (
            <Typography
              component="h3"
              sx={{
                fontSize: '1.0625rem',
                fontWeight: 600,
                color: 'var(--text)',
                mt: 1.5,
                mb: 0.5,
                lineHeight: 1.4,
              }}
            >
              {children}
            </Typography>
          ),

          // Bold
          strong: ({ children }) => (
            <Box component="strong" sx={{ fontWeight: 700, color: 'var(--text)' }}>
              {children}
            </Box>
          ),

          // Italic
          em: ({ children }) => (
            <Box component="em" sx={{ fontStyle: 'italic' }}>
              {children}
            </Box>
          ),

          // Inline code
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !match && !className;

            if (!isInline) {
              const language = match ? match[1] : undefined;
              const codeString = String(children).replace(/\n$/, '');
              return <CodeBlock language={language} code={codeString} />;
            }

            // Inline code
            return (
              <Box
                component="code"
                sx={{
                  fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', 'Consolas', monospace",
                  fontSize: '0.8125rem',
                  bgcolor: 'var(--bg2)',
                  color: 'var(--accent)',
                  px: 0.75,
                  py: 0.25,
                  borderRadius: '4px',
                  border: '1px solid var(--border)',
                }}
                {...props}
              >
                {children}
              </Box>
            );
          },

          // Pre (code block wrapper) - handled by code component above
          pre: ({ children }) => <>{children}</>,

          // Unordered list
          ul: ({ children }) => (
            <Box
              component="ul"
              sx={{
                pl: 2.5,
                my: 1,
                listStyleType: 'disc',
                '& li': {
                  fontSize: '0.9375rem',
                  lineHeight: 1.75,
                  color: 'var(--text)',
                  mb: 0.25,
                },
                '& li::marker': {
                  color: 'var(--accent)',
                },
              }}
            >
              {children}
            </Box>
          ),

          // Ordered list
          ol: ({ children }) => (
            <Box
              component="ol"
              sx={{
                pl: 2.5,
                my: 1,
                listStyleType: 'decimal',
                '& li': {
                  fontSize: '0.9375rem',
                  lineHeight: 1.75,
                  color: 'var(--text)',
                  mb: 0.25,
                },
                '& li::marker': {
                  color: 'var(--accent)',
                  fontWeight: 600,
                },
              }}
            >
              {children}
            </Box>
          ),

          // List items
          li: ({ children }) => (
            <Box component="li" sx={{ mb: 0.25 }}>
              {children}
            </Box>
          ),

          // Blockquote
          blockquote: ({ children }) => (
            <Box
              component="blockquote"
              sx={{
                borderLeft: '3px solid var(--accent)',
                pl: 2,
                py: 0.5,
                my: 1.5,
                bgcolor: 'var(--accent-lt)',
                borderRadius: '0 8px 8px 0',
                '& p': { my: 0.25, color: 'var(--text2)' },
              }}
            >
              {children}
            </Box>
          ),

          // Horizontal rule
          hr: () => (
            <Box
              component="hr"
              sx={{
                border: 'none',
                borderTop: '1px solid var(--border2)',
                my: 2,
              }}
            />
          ),

          // Links
          a: ({ href, children }) => (
            <Box
              component="a"
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: 'var(--blue)',
                textDecoration: 'none',
                fontWeight: 500,
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              {children}
            </Box>
          ),

          // Table
          table: ({ children }) => (
            <Box
              component="table"
              sx={{
                width: '100%',
                borderCollapse: 'collapse',
                my: 1.5,
                fontSize: '0.875rem',
                '& th, & td': {
                  border: '1px solid var(--border2)',
                  px: 1.5,
                  py: 1,
                  textAlign: 'left',
                },
                '& th': {
                  bgcolor: 'var(--bg2)',
                  fontWeight: 600,
                  color: 'var(--text)',
                },
                '& td': {
                  color: 'var(--text2)',
                },
              }}
            >
              {children}
            </Box>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </Box>
  );
}
