'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { User, Bot } from 'lucide-react';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
}

const markdownComponents: React.ComponentProps<typeof ReactMarkdown>['components'] = {
  p: ({ children }) => (
    <p className="mb-2 last:mb-0 leading-relaxed text-sm md:text-base">{children}</p>
  ),
  h1: ({ children }) => (
    <h1 className="text-xl font-bold mt-4 mb-2 text-slate-900 dark:text-white">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-lg font-bold mt-3 mb-2 text-slate-900 dark:text-white">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-base font-semibold mt-3 mb-1 text-slate-800 dark:text-slate-100">{children}</h3>
  ),
  ul: ({ children }) => (
    <ul className="my-2 space-y-1 pl-4">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="my-2 space-y-1 pl-5 list-decimal">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="flex gap-2 text-sm md:text-base leading-relaxed">
      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-indigo-400 dark:bg-indigo-500 flex-shrink-0" />
      <span>{children}</span>
    </li>
  ),
  // Override li for ordered lists — the bullet dot doesn't apply there
  strong: ({ children }) => (
    <strong className="font-semibold text-slate-900 dark:text-white">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic text-slate-700 dark:text-slate-300">{children}</em>
  ),
  code: ({ children, className }) => {
    const isBlock = className?.includes('language-');
    return isBlock ? (
      <code className="block bg-slate-100 dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 rounded-lg px-4 py-3 my-2 text-xs font-mono overflow-x-auto whitespace-pre">
        {children}
      </code>
    ) : (
      <code className="bg-slate-100 dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 rounded px-1.5 py-0.5 text-xs font-mono">
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="my-2 rounded-xl overflow-hidden">{children}</pre>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-indigo-400 dark:border-indigo-500 pl-4 my-2 text-slate-600 dark:text-slate-400 italic text-sm">
      {children}
    </blockquote>
  ),
  hr: () => (
    <hr className="my-3 border-slate-200 dark:border-slate-700" />
  ),
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="text-indigo-500 dark:text-indigo-400 underline underline-offset-2 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors break-all">
      {children}
    </a>
  ),
};

export default function ChatMessage({ role, content, isStreaming = false }: ChatMessageProps) {
  const isUser = role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-md">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}

      <div
        className={`max-w-[85%] md:max-w-[75%] px-4 md:px-5 py-3 md:py-3.5 rounded-2xl shadow-sm ${isUser
          ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-tr-sm'
          : 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-white/50 dark:border-slate-700/50 text-slate-800 dark:text-slate-200 rounded-tl-sm'
          }`}
      >
        {isUser ? (
          <p className="text-sm md:text-base">{content}</p>
        ) : (
          <div className="min-w-0">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {content}
            </ReactMarkdown>
            {isStreaming && (
              <span className="inline-block w-1.5 h-4 ml-1 bg-indigo-400 dark:bg-indigo-500 animate-pulse rounded-sm" />
            )}
          </div>
        )}
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 dark:bg-slate-200 flex items-center justify-center shadow-md">
          <User className="w-5 h-5 text-white dark:text-slate-900" />
        </div>
      )}
    </motion.div>
  );
}
