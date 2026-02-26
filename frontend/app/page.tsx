'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, MessageSquare, Sparkles, Zap, Code2, Database, BrainCircuit } from 'lucide-react';

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[40%] -left-[20%] w-[70%] h-[70%] rounded-full bg-blue-400/20 dark:bg-blue-600/10 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob" />
        <div className="absolute top-[20%] -right-[20%] w-[60%] h-[60%] rounded-full bg-purple-400/20 dark:bg-purple-600/10 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000" />
        <div className="absolute -bottom-[40%] left-[20%] w-[70%] h-[70%] rounded-full bg-indigo-400/20 dark:bg-indigo-600/10 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-4000" />
      </div>

      {/* Hero Section */}
      <div className="relative container mx-auto px-4 py-16 md:py-24 z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Animated Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-white/40 dark:bg-slate-800/40 backdrop-blur-md rounded-full border border-white/50 dark:border-slate-700/50 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              AI-Powered Portfolio Assistant
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight text-slate-900 dark:text-white"
          >
            Chat With My <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              Interactive Portfolio
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Skip the reading. Ask questions about my experience, skills, and projects directly to my AI twin.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/chat">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all flex items-center gap-3 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center gap-2 group-hover:text-white transition-colors duration-300">
                  <MessageSquare className="w-5 h-5" />
                  Start Chatting
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>
            </Link>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid md:grid-cols-3 gap-6 mt-24"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                whileHover={{ y: -8 }}
                className="p-8 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-3xl border border-white/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all text-left group"
              >
                <div className="w-14 h-14 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 transition-all">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Tech Stack */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-24 text-center"
          >
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-6 uppercase tracking-wider">Powered by modern tech</p>
            <div className="flex flex-wrap justify-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-300">
              {['Next.js 15', 'FastAPI', 'Gemini 2.5', 'LangChain', 'ChromaDB', 'Tailwind CSS'].map((tech) => (
                <span key={tech} className="px-5 py-2.5 bg-white/40 dark:bg-slate-800/40 backdrop-blur-md rounded-full border border-white/50 dark:border-slate-700/50 shadow-sm hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors cursor-default">
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}

const features = [
  {
    title: 'Instant Answers',
    description: 'Get immediate, accurate responses about my experience, skills, and projects through natural conversation.',
    icon: <Zap className="w-7 h-7 text-amber-500" />,
  },
  {
    title: 'RAG Architecture',
    description: 'Built with Retrieval Augmented Generation to ensure answers are strictly grounded in my actual resume data.',
    icon: <BrainCircuit className="w-7 h-7 text-indigo-500" />,
  },
  {
    title: 'Vector Search',
    description: 'Semantic embeddings power the search, understanding the context and meaning behind your questions.',
    icon: <Database className="w-7 h-7 text-emerald-500" />,
  },
];

