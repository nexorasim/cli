import React, { useState, useRef, useEffect } from 'react';
import { useI18n } from '../hooks/useI18n';
import { GoogleGenAI, Chat } from '@google/genai';
import { BRAND_INFO } from '../constants';
import NexoraLogo from './NexoraLogo';
import { Link } from 'react-router-dom';
import { getFaqs } from '../data/faq';

const parseSimpleMarkdown = (text: string): string => {
    let html = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const listRegex = /((?:^\s*[\*-]\s+.*\n?)+)/gm;
    const parts = html.split(listRegex);

    return parts.map((part, index) => {
        if (index % 2 === 1) {
            const listItems = part.trim().split('\n').map(item => {
                const content = item.replace(/^\s*[\*-]\s+/, '');
                const innerHtml = content
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>');
                return `<li class="ml-2">${innerHtml}</li>`;
            }).join('');
            return `<ul class="list-disc list-inside space-y-1 my-2">${listItems}</ul>`;
        } else {
            return part
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/\n/g, '<br />');
        }
    }).join('');
};

const MessageContent: React.FC<{ text: string; onLinkClick: () => void }> = ({ text, onLinkClick }) => {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = text.split(linkRegex);
    const content = parts.map((part, index) => {
        if (index % 3 === 0) {
            return <span key={index} dangerouslySetInnerHTML={{ __html: parseSimpleMarkdown(part) }} />;
        } else if (index % 3 === 1) {
            const label = part;
            const to = parts[index + 1];
            return (
                <div className="mt-3" key={index}>
                    <Link to={to} onClick={onLinkClick} className="inline-flex items-center px-4 py-2 bg-cyan-500 text-slate-900 font-medium rounded-lg hover:bg-cyan-400 transition-colors text-sm">
                        {label}
                    </Link>
                </div>
            );
        }
        return null;
    }).filter(Boolean);

    return <>{content}</>;
};

// UI Icons
const CloseIcon = () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const SendIcon = () => (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
    </svg>
);

const UserAvatar = () => (
    <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center flex-shrink-0 text-white">
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
    </div>
);

const AiAvatar = () => (
    <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center flex-shrink-0 overflow-hidden">
        <NexoraLogo className="w-full h-full object-cover" />
    </div>
);

const TypingIndicator: React.FC = () => (
    <div className="flex items-center gap-1 py-2">
        <span className="h-2 w-2 bg-gray-400 rounded-full animate-pulse"></span>
        <span className="h-2 w-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></span>
        <span className="h-2 w-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></span>
    </div>
);

interface Message {
  id: string; 
  sender: 'user' | 'ai'; 
  text: string;
}

interface AiChatPopupProps { 
    isOpen: boolean; 
    setIsOpen: (isOpen: boolean) => void; 
}

const AiChatPopup: React.FC<AiChatPopupProps> = ({ isOpen, setIsOpen }) => {
    const { t, locale } = useI18n();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatInstance = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const suggestions = [
        t('ai_chat_suggestion_1'), 
        t('ai_chat_suggestion_2'), 
        t('ai_chat_suggestion_3'), 
        t('ai_chat_suggestion_4')
    ].filter(s => s);
    
    const ai = useRef<GoogleGenAI | null>(null);

    useEffect(() => {
        if (isOpen && !chatInstance.current) {
            try {
                ai.current = new GoogleGenAI({ apiKey: process.env.API_KEY });
                const faqs = getFaqs(t);
                const faqContext = faqs.map(faq => `Q: ${faq.q}\nA: ${faq.a}`).join('\n\n');

                const systemInstruction = `You are an AI assistant for eSIM Myanmar. Answer questions about eSIM services in ${locale === 'en' ? 'English' : 'Burmese'}. Use the following FAQ as reference:

${faqContext}

Keep responses concise and helpful. For purchase inquiries, use: [View eSIM Plans](/buy-esim)`;
                
                chatInstance.current = ai.current.chats.create({
                    model: 'gemini-2.5-flash',
                    config: { systemInstruction }
                });
                
                setMessages([{ 
                    id: 'greeting', 
                    sender: 'ai', 
                    text: t('ai_chat_greeting') 
                }]);
            } catch (error) {
                console.error("Failed to initialize AI Chat:", error);
                setMessages([{ 
                    id: 'error', 
                    sender: 'ai', 
                    text: "Sorry, I'm having trouble connecting right now." 
                }]);
            }
        } else if (!isOpen) {
            setMessages([]);
            chatInstance.current = null;
        }
    }, [isOpen, locale, t]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const addMessage = (msg: Message) => setMessages(prev => [...prev, msg]);
    const updateMessage = (id: string, text: string) => setMessages(prev => 
        prev.map(msg => msg.id === id ? { ...msg, text } : msg)
    );

    const sendMessage = async (messageText: string) => {
        if (!messageText.trim() || isLoading) return;
        
        const text = messageText.trim();
        setInput('');
        addMessage({ id: `user-${Date.now()}`, sender: 'user', text });

        setIsLoading(true);
        const aiMessageId = `ai-${Date.now()}`;
        
        try {
            if (!chatInstance.current) throw new Error("Chat not initialized");
            
            addMessage({ id: aiMessageId, sender: 'ai', text: '' });

            const stream = await chatInstance.current.sendMessageStream({ message: text });
            
            let fullResponse = '';
            for await (const chunk of stream) {
                fullResponse += chunk.text;
                updateMessage(aiMessageId, fullResponse);
            }

        } catch (error) {
            console.error("AI Chat send error:", error);
            updateMessage(aiMessageId, t('ai_chat_error'));
        } finally {
            setIsLoading(false);
            setTimeout(() => textareaRef.current?.focus(), 100);
        }
    };

    const handleSend = () => sendMessage(input);
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };
    
    return (
        <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setIsOpen(false)}
            />
            
            {/* Modal */}
            <div className="relative z-10 flex items-center justify-center min-h-full p-4">
                <div className={`w-full max-w-md bg-white rounded-2xl shadow-2xl transform transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <AiAvatar />
                            <div>
                                <h3 className="font-semibold text-gray-900">Ask AI Assistant</h3>
                                <p className="text-xs text-gray-500">Powered by Nexora AI+</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsOpen(false)} 
                            className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <CloseIcon />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="h-96 overflow-y-auto p-4 space-y-4">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.sender === 'ai' && <AiAvatar />}
                                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                                    msg.sender === 'user' 
                                        ? 'bg-cyan-500 text-white rounded-br-md' 
                                        : 'bg-gray-100 text-gray-800 rounded-bl-md'
                                }`}>
                                    {!msg.text && isLoading ? (
                                        <TypingIndicator />
                                    ) : (
                                        <MessageContent text={msg.text} onLinkClick={() => setIsOpen(false)} />
                                    )}
                                </div>
                                {msg.sender === 'user' && <UserAvatar />}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-gray-200">
                        {messages.length <= 1 && (
                            <div className="grid grid-cols-1 gap-2 mb-4">
                                {suggestions.slice(0, 2).map((s, i) => (
                                    <button 
                                        key={i} 
                                        onClick={() => sendMessage(s)} 
                                        className="text-xs text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-gray-700"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        )}
                        <div className="flex gap-2">
                            <textarea
                                ref={textareaRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask about eSIMs or our services..."
                                rows={1}
                                className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                disabled={isLoading}
                                style={{minHeight: '36px', maxHeight: '100px'}}
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isLoading}
                                className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                            >
                                <SendIcon />
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 text-center">AI can make mistakes. Verify important information.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AiChatPopup;