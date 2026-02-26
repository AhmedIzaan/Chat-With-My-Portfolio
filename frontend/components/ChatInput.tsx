'use client';

import { useState, FormEvent, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
    onSendMessage: (message: string) => void;
    disabled?: boolean;
}

export default function ChatInput({ onSendMessage, disabled = false }: ChatInputProps) {
    const [input, setInput] = useState('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (input.trim() && !disabled) {
            onSendMessage(input.trim());
            setInput('');
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="relative">
            <div className="flex items-end gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/50 dark:border-slate-700/50 shadow-lg p-2 transition-all focus-within:ring-2 focus-within:ring-indigo-500/50">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about my experience, skills, or projects..."
                    disabled={disabled}
                    rows={1}
                    className="flex-1 resize-none bg-transparent px-3 py-2 text-sm md:text-base text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none max-h-32 min-h-[40px]"
                    style={{
                        height: 'auto',
                        minHeight: '40px',
                    }}
                    onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = 'auto';
                        target.style.height = Math.min(target.scrollHeight, 128) + 'px';
                    }}
                />
                <motion.button
                    type="submit"
                    disabled={!input.trim() || disabled}
                    whileHover={{ scale: disabled ? 1 : 1.05 }}
                    whileTap={{ scale: disabled ? 1 : 0.95 }}
                    className={`flex-shrink-0 p-2.5 rounded-xl transition-all ${disabled || !input.trim()
                        ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                        : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:shadow-lg'
                        }`}
                >
                    {disabled ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <Send className="w-5 h-5" />
                    )}
                </motion.button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                Press Enter to send, Shift+Enter for new line
            </p>
        </form>
    );
}
