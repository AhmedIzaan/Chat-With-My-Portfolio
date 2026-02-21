'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import { streamChat, ChatMessage as ChatMessageType } from '@/lib/api';

export default function ChatPage() {
    const [messages, setMessages] = useState<ChatMessageType[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [streamingContent, setStreamingContent] = useState('');
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            {/* Header */}
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10"
            >
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span className="text-sm font-medium">Back to Home</span>
                            </motion.button>
                        </Link>
                        <h1 className="text-lg md:text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Portfolio Chat
                        </h1>
                        <div className="w-24" /> {/* Spacer for centering */}
                    </div>
                </div>
            </motion.header>

            {/* Chat Container */}
            <div className="container mx-auto px-4 py-6 max-w-4xl h-[calc(100vh-180px)] flex flex-col">
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
                                className="px-4 py-2 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
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
];
