import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';

export default function FlashMessages() {
    const { flash } = usePage().props;
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const newMessages = [];
        if (flash?.success) {
            newMessages.push({
                id: Date.now() + Math.random(),
                type: 'success',
                text: flash.success,
            });
        }
        if (flash?.error) {
            newMessages.push({
                id: Date.now() + Math.random(),
                type: 'error',
                text: flash.error,
            });
        }

        if (newMessages.length > 0) {
            setMessages((prev) => [...prev, ...newMessages]);
        }
    }, [flash]);

    const removeMessage = (id) => {
        setMessages((prev) => prev.filter((msg) => msg.id !== id));
    };

    return (
        <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
            <AnimatePresence>
                {messages.map((msg) => (
                    <ToastItem key={msg.id} msg={msg} onClose={() => removeMessage(msg.id)} />
                ))}
            </AnimatePresence>
        </div>
    );
}

function ToastItem({ msg, onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const isSuccess = msg.type === 'success';

    return (
        <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-2xl shadow-xl border backdrop-blur-md ${
                isSuccess
                    ? 'bg-emerald-500 text-white border-emerald-400/30'
                    : 'bg-rose-500 text-white border-rose-400/30'
            }`}
        >
            <div className="flex items-center gap-2.5">
                {isSuccess ? (
                    <svg className="w-5 h-5 flex-shrink-0 text-emerald-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                ) : (
                    <svg className="w-5 h-5 flex-shrink-0 text-rose-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                )}
                <span className="text-sm font-bold tracking-wide">{msg.text}</span>
            </div>
            <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors flex-shrink-0 active:scale-90"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </motion.div>
    );
}
