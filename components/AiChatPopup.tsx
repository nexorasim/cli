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
                return `<li>${innerHtml}</li>`;
            }).join('');
            return `<ul class="list-disc list-inside space-y-1 my-2 ml-4">${listItems}</ul>`;
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
                    <Link to={to} onClick={onLinkClick} className="inline-flex items-center px-3 py-1.5 bg-cyan-500 text-slate-900 font-medium rounded-lg hover:bg-cyan-400 transition-colors text-sm">
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
    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
        <svg className="h-4 w-4 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
    </div>
);

const AiAvatar = () => (
    <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center flex-shrink-0 overflow-hidden">
        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9l-5.91 5.74L17.18 22 12 19.27 6.82 22l1.09-7.26L2 9l6.91-.74L12 2z"/>
        </svg>
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
    timestamp: string;
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
    const [sessionId] = useState(`session-${Date.now()}`);
    const chatInstance = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const suggestions = [
        "How do I activate my eSIM?",
        "What are your data plans?", 
        "Is my phone compatible?",
        "How to contact support?"
    ];

    useEffect(() => {
        if (isOpen && !chatInstance.current) {
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                const faqs = getFaqs(t);
                const faqContext = faqs.map(faq => `Q: ${faq.q}\nA: ${faq.a}`).join('\n\n');

                const systemInstruction = `You are an AI assistant for eSIM Myanmar. Answer questions about eSIM services in ${locale === 'en' ? 'English' : 'Burmese'}. 

FAQ Reference:
${faqContext}

Guidelines:
- Keep responses concise and helpful
- For purchase inquiries, direct to: [View eSIM Plans](/buy-esim)
- For technical support, recommend contacting support
- Use friendly, professional tone
- Focus on eSIM and Myanmar travel topics`;
                
                chatInstance.current = ai.chats.create({
                    model: 'gemini-2.5-flash',
                    config: { systemInstruction }
                });
                
                setMessages([{ 
                    id: 'greeting', 
                    sender: 'ai', 
                    text: "Hello! I'm your eSIM Myanmar AI assistant. How can I help you today?",
                    timestamp: new Date().toISOString()
                }]);
            } catch (error) {
                console.error("Failed to initialize AI Chat:", error);
                setMessages([{ 
                    id: 'error', 
                    sender: 'ai', 
                    text: "Sorry, I'm having trouble connecting right now. Please try again later.",
                    timestamp: new Date().toISOString()
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

    const addMessage = (msg: Omit<Message, 'timestamp'>) => {
        const messageWithTimestamp = { ...msg, timestamp: new Date().toISOString() };
        setMessages(prev => [...prev, messageWithTimestamp]);
    };

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
            updateMessage(aiMessageId, "I'm sorry, I encountered an error. Please try again or contact our support team.");
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
                <div className={`w-full max-w-lg bg-white rounded-2xl shadow-2xl transform transition-all duration-300 overflow-hidden ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                    
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 bg-gray-50 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <AiAvatar />
                            <div>
                                <h3 className="font-semibold text-gray-900">Ask AI Assistant</h3>
                                <p className="text-xs text-gray-500">eSIM Myanmar Support</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsOpen(false)} 
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                            aria-label="Close chat"
                        >
                            <CloseIcon />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="h-96 overflow-y-auto p-4 space-y-4 bg-white">
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

                    {/* Input Area */}
                    <div className="p-4 bg-gray-50 border-t border-gray-200">
                        {messages.length <= 1 && (
                            <div className="grid grid-cols-1 gap-2 mb-4">
                                {suggestions.slice(0, 4).map((suggestion, i) => (
                                    <button 
                                        key={i} 
                                        onClick={() => sendMessage(suggestion)} 
                                        className="text-xs text-left px-3 py-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors text-gray-700"
                                    >
                                        {suggestion}
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
                                style={{minHeight: '40px', maxHeight: '100px'}}
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isLoading}
                                className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                                aria-label="Send message"
                            >
                                <SendIcon />
                            </button>
                        </div>
                        
                        <p className="text-xs text-gray-500 mt-2 text-center">
                            AI responses may contain errors. Verify important information.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AiChatPopup;