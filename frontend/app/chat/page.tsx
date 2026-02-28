'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, AlertCircle, Bot, Info, X } from 'lucide-react';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import { streamChat, ChatMessage as ChatMessageType } from '@/lib/api';

function ThinkingIndicator() {
    const dotVariants = {
        initial: { y: 0, opacity: 0.4 },
        animate: { y: -6, opacity: 1 },
    };
    const containerVariants = {
        animate: { transition: { staggerChildren: 0.18 } },
    };
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="flex gap-3 justify-start mb-4"
        >
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="px-5 py-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center gap-1">
                <motion.div
                    className="flex gap-1.5 items-center"
                    variants={containerVariants}
                    animate="animate"
                >
                    {[0, 1, 2].map((i) => (
                        <motion.span
                            key={i}
                            className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-blue-400 to-purple-500"
                            variants={dotVariants}
                            initial="initial"
                            animate="animate"
                            transition={{
                                duration: 0.5,
                                repeat: Infinity,
                                repeatType: 'mirror',
                                ease: 'easeInOut',
                                delay: i * 0.18,
                            }}
                        />
                    ))}
                </motion.div>
            </div>
        </motion.div>
    );
}

export default function ChatPage() {
    const [messages, setMessages] = useState<ChatMessageType[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [streamingContent, setStreamingContent] = useState('');
    const [showNotification, setShowNotification] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, streamingContent]);

    const handleSendMessage = async (content: string) => {
        setError(null);

        // Add user message
        const userMessage: ChatMessageType = {
            role: 'user',
            content,
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);
        setStreamingContent('');

        // Track accumulated content locally to avoid stale closure
        let accumulated = '';

        // Stream assistant response
        await streamChat(
            content,
            (chunk) => {
                accumulated += chunk;
                setStreamingContent(accumulated);
            },
            () => {
                // On complete, add the full message using local var (not stale state)
                const assistantMessage: ChatMessageType = {
                    role: 'assistant',
                    content: accumulated,
                    timestamp: new Date(),
                };
                setMessages((prev) => [...prev, assistantMessage]);
                setStreamingContent('');
                setIsLoading(false);
            },
            (errorMsg) => {
                setError(errorMsg);
                setIsLoading(false);
                setStreamingContent('');
            }
        );
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
            {/* Animated Background Gradients */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[40%] -left-[20%] w-[70%] h-[70%] rounded-full bg-blue-400/10 dark:bg-blue-600/5 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob" />
                <div className="absolute top-[20%] -right-[20%] w-[60%] h-[60%] rounded-full bg-purple-400/10 dark:bg-purple-600/5 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000" />
                <div className="absolute -bottom-[40%] left-[20%] w-[70%] h-[70%] rounded-full bg-indigo-400/10 dark:bg-indigo-600/5 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-4000" />
            </div>

            {/* Header */}
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-b border-white/50 dark:border-slate-800/50 sticky top-0 z-20 shadow-sm"
            >
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white/50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-700/80 border border-slate-200/50 dark:border-slate-700/50 transition-all shadow-sm"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span className="text-xs md:text-sm font-medium hidden sm:inline">Back to Home</span>
                                <span className="text-xs font-medium sm:hidden">Back</span>
                            </motion.button>
                        </Link>
                        <h1 className="text-base md:text-xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent truncate px-2">
                            Portfolio Chat
                        </h1>
                        <div className="w-16 md:w-24" /> {/* Spacer for centering */}
                    </div>
                </div>
            </motion.header>

            {/* Notification Popup */}
            <AnimatePresence>
                {showNotification && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="fixed top-24 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md"
                    >
                        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-indigo-100 dark:border-indigo-500/20 shadow-2xl rounded-2xl p-5 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-500" />
                            <button
                                onClick={() => setShowNotification(false)}
                                className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <div className="flex gap-4 pr-4">
                                <div className="mt-0.5 bg-indigo-100 dark:bg-indigo-500/20 p-2 rounded-full h-fit flex-shrink-0">
                                    <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">
                                        Welcome to the Chat!
                                    </h3>
                                    <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-2 list-disc pl-4">
                                        <li>
                                            The backend runs on Render&apos;s free tier. It may take <strong>~1 minute to wake up</strong> from a cold start for your first message.
                                        </li>
                                        <li>
                                            It uses the Gemini 2.5 Flash free API. Sometimes the daily usage quota may be exhausted.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Chat Container */}
            <div className="relative container mx-auto px-6 py-4 max-w-6xl h-[calc(100vh-73px)] flex flex-col z-10">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                    {messages.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center justify-center h-full text-center px-4"
                        >
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-4">
                                <span className="text-3xl">💬</span>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Start a Conversation
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 max-w-md mb-6">
                                Ask me anything about my experience, skills, projects, or background!
                            </p>
                        </motion.div>
                    ) : (
                        <>
                            {messages.map((message, index) => (
                                <ChatMessage
                                    key={index}
                                    role={message.role}
                                    content={message.content}
                                />
                            ))}
                            <AnimatePresence>
                                {isLoading && !streamingContent && (
                                    <ThinkingIndicator key="thinking" />
                                )}
                            </AnimatePresence>
                            {streamingContent && (
                                <ChatMessage
                                    role="assistant"
                                    content={streamingContent}
                                    isStreaming={true}
                                />
                            )}
                            <div ref={messagesEndRef} />
                        </>
                    )}
                </div>

                {/* Error Display */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2"
                    >
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-red-800 dark:text-red-400">
                                Error
                            </p>
                            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                        </div>
                    </motion.div>
                )}

                {/* Sample question chips — always visible when not loading */}
                {!isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-wrap gap-2 mb-3"
                    >
                        {sampleQuestions.map((question) => (
                            <motion.button
                                key={question}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleSendMessage(question)}
                                className="px-4 py-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-full border border-white/50 dark:border-slate-700/50 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-white/90 dark:hover:bg-slate-700/90 hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all shadow-sm"
                            >
                                {question}
                            </motion.button>
                        ))}
                    </motion.div>
                )}

                {/* Input */}
                <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
            </div>
        </div>
    );
}

const sampleQuestions = [
    "What are your technical skills?",
    "Tell me about your experience",
    "What projects have you worked on?",
    "What's your educational background?",
    "What is your LinkedIn and GitHub?",
    "How can I contact you via email?",
];
