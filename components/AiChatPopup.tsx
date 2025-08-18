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
        if (index % 2 === 1) { // It's a list match from the regex
            const listItems = part.trim().split('\n').map(item => {
                const content = item.replace(/^\s*[\*-]\s+/, '');
                // Handle bold and italic within list items
                const innerHtml = content
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>');
                return `<li class="ml-2">${innerHtml}</li>`;
            }).join('');
            return `<ul class="list-disc list-inside space-y-1 my-2">${listItems}</ul>`;
        } else { // It's a non-list part
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
                    <Link to={to} onClick={onLinkClick} className="btn-primary !py-2 !px-4 !text-sm">
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
const CloseIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>);
const SendIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>);
const ThumbsUpIcon: React.FC<{ filled?: boolean }> = ({ filled }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill={filled ? 'currentColor' : 'none'} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.562 8H12V4a2 2 0 00-2-2l-1.5 2.5" />
    </svg>
);
const ThumbsDownIcon: React.FC<{ filled?: boolean }> = ({ filled }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill={filled ? 'currentColor' : 'none'} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.106-1.79l-.05-.025A4 4 0 0011.057 2H5.642a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.438 12H8v4a2 2 0 002 2l1.5-2.5" />
    </svg>
);
const AiAvatar = () => (
    <div className="w-8 h-8 rounded-full bg-primary flex-shrink-0 ring-1 ring-secondary/30 shadow-lg overflow-hidden">
        <NexoraLogo className="w-full h-full object-cover" />
    </div>
);
const UserAvatar = () => (<div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 text-gray-400 ring-1 ring-white/20"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></div>);
const TypingIndicator: React.FC = () => (
    <div className="flex items-center gap-1.5 py-2 px-1">
        <span className="h-2 w-2 bg-gray-400 rounded-full animate-pulse-fast [animation-delay:-0.3s]"></span>
        <span className="h-2 w-2 bg-gray-400 rounded-full animate-pulse-fast [animation-delay:-0.15s]"></span>
        <span className="h-2 w-2 bg-gray-400 rounded-full animate-pulse-fast"></span>
    </div>
);

// Types
interface Message {
  id: string; sender: 'user' | 'ai'; text: string;
  feedbackState?: 'pending' | 'good' | 'bad';
}

// Main Component
interface AiChatPopupProps { isOpen: boolean; setIsOpen: (isOpen: boolean) => void; }
const AiChatPopup: React.FC<AiChatPopupProps> = ({ isOpen, setIsOpen }) => {
    const { t, locale } = useI18n();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatInstance = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const suggestions = [t('ai_chat_suggestion_1'), t('ai_chat_suggestion_2'), t('ai_chat_suggestion_3'), t('ai_chat_suggestion_4')].filter(s => s);
    const ai = useRef<GoogleGenAI | null>(null);

    // Initialization
    useEffect(() => {
        if (isOpen && !chatInstance.current) {
            try {
                ai.current = new GoogleGenAI({ apiKey: process.env.API_KEY });

                const faqs = getFaqs(t);
                const faqContext = faqs.map(faq => `Question: ${faq.q}\nAnswer: ${faq.a}`).join('\n\n---\n');

                const systemInstruction = `You are Nexora AI+, an advanced eSIM AI Agent for eSIM Myanmar (${BRAND_INFO.domain}), integrated with Google Cloud and the Gemini API Gateway. Your purpose is to provide excellent, accurate customer support and facilitate eSIM sales.

**CORE DIRECTIVES:**
1.  **Language Mastery:** Your entire response MUST be in the user's language, which is currently **${locale === 'en' ? 'English' : 'Burmese'}**. You must be able to switch languages seamlessly if the user does.
2.  **Scope of Knowledge:** Your expertise is strictly limited to eSIMs, Myanmar travel, our company's services, our blog content, and our operational partners. For any out-of-scope questions, politely state you cannot assist and refocus on our services.
3.  **Primary Knowledge Source:** The following FAQ is your primary source of truth. Base your answers on this information.
    <KNOWLEDGE_BASE>
    ${faqContext}
    </KNOWLEDGE_BASE>
4.  **Tone & Formatting:** Be friendly, helpful, and concise. Use markdown for emphasis (e.g., **bold text** or *italic text*) and lists to improve readability.
5.  **Website Navigation:** Guide users to relevant pages using markdown links: \`[link text](/path)\`. Available paths: / (Home), /buy-esim, /compatibility, /how-it-works, /help-center, /blog.
6.  **Sales Facilitation:** If a user expresses intent to buy or view plans, your response MUST be exactly: "${t('ai_chat_purchase_redirect')} [${t('ai_chat_purchase_redirect_cta')}](/buy-esim)". This is a critical function.
7.  **Compatibility-to-Sales Flow:** After confirming a device's compatibility, ALWAYS follow up by asking if they want to see plans, e.g., "Yes, that device is compatible. [Would you like to see our eSIM plans?](/buy-esim)".
8.  **Troubleshooting:** For issues like "payment failed" or "my eSIM isn't working", be empathetic. Ask for their Order Number to understand the situation, then reassure them you're there to help and guide them to our dedicated support channels like Viber for resolution of specific account issues.
`;
                
                chatInstance.current = ai.current.chats.create({
                    model: 'gemini-2.5-flash',
                    config: {
                        systemInstruction: systemInstruction,
                    }
                });
                setMessages([{ id: 'greeting', sender: 'ai', text: t('ai_chat_greeting') }]);
            } catch (error) {
                console.error("Failed to initialize AI Chat:", error);
                setMessages([{ id: 'error', sender: 'ai', text: "Sorry, I'm having trouble connecting right now." }]);
            }
        } else if (!isOpen) {
            setMessages([]);
            chatInstance.current = null;
        }
    }, [isOpen, locale, t]);

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isLoading]);
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 144)}px`;
        }
    }, [input]);

    const addMessage = (msg: Message) => setMessages(prev => [...prev, msg]);
    const updateMessage = (id: string, newProps: Partial<Message>) => setMessages(prev => prev.map(msg => msg.id === id ? { ...msg, ...newProps } : msg));


    const sendMessage = async (messageText: string) => {
        if (!messageText.trim() || isLoading) return;
        
        const text = messageText.trim();
        setInput('');
        addMessage({ id: `user-${Date.now()}`, sender: 'user', text });

        setIsLoading(true);
        const aiMessageId = `ai-${Date.now()}`;
        
        try {
            if (!chatInstance.current) throw new Error("Chat not initialized");
            
            addMessage({ id: aiMessageId, sender: 'ai', text: '' }); // Add empty AI message bubble

            const stream = await chatInstance.current.sendMessageStream({ message: text });
            
            let fullResponse = '';
            for await (const chunk of stream) {
                fullResponse += chunk.text;
                updateMessage(aiMessageId, { text: fullResponse });
            }
            updateMessage(aiMessageId, { text: fullResponse, feedbackState: 'pending' });

        } catch (error) {
            console.error("AI Chat send error:", error);
            updateMessage(aiMessageId, { text: t('ai_chat_error'), feedbackState: 'pending' });
        } finally {
            setIsLoading(false);
            setTimeout(() => textareaRef.current?.focus(), 100);
        }
    };

    const handleSend = () => sendMessage(input);
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } };
    
    return (
        <div className={`fixed inset-0 z-[60] bg-primary/70 backdrop-blur-md transition-opacity duration-300 flex items-center justify-center p-0 sm:p-4 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false); }} aria-modal="true" role="dialog">
            <style>{`.animate-typing-indicator { animation: typing-indicator 1.5s ease-in-out infinite; } @keyframes typing-indicator { 0% { transform: translateX(-50%); } 100% { transform: translateX(300%); } }`}</style>
            <div onClick={(e) => e.stopPropagation()} className={`flex flex-col w-full max-w-2xl h-full sm:h-[90vh] sm:max-h-[700px] glass-card !bg-primary/95 !border-secondary/20 !rounded-none sm:!rounded-2xl shadow-2xl shadow-black/40 overflow-hidden transition-all duration-300 ease-out ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                <header className="flex items-center justify-between p-4 border-b border-secondary/20 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary flex-shrink-0 ring-2 ring-secondary/30 shadow-lg overflow-hidden">
                            <NexoraLogo className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-xl">{t('ai_chat_title')}</h3>
                            <p className="text-xs text-secondary/70">{t('ai_chat_powered_by')}</p>
                        </div>
                    </div>
                    <button onClick={() => setIsOpen(false)} aria-label={t('ai_chat_close')} className="p-2 text-gray-300 hover:text-white rounded-full hover:bg-white/10 transition-colors"><CloseIcon/></button>
                </header>

                <div className="flex-grow p-4 space-y-5 overflow-y-auto" aria-live="polite">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex items-end gap-3 animate-fadeInUp ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.sender === 'ai' && <AiAvatar />}
                            <div className={`max-w-[85%] sm:max-w-[75%] shadow-md text-base leading-relaxed ${msg.sender === 'user' ? 'bg-gradient-to-br from-secondary/80 to-secondary text-primary font-medium rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl rounded-br-lg px-4 py-3' : 'glass-card !bg-primary/70 !p-3 !rounded-tr-2xl !rounded-tl-lg !rounded-br-2xl !rounded-bl-2xl'}`}>
                                {!msg.text && isLoading ? (
                                    <TypingIndicator />
                                ) : (
                                    <div className={`prose prose-sm max-w-none prose-p:my-1 ${msg.sender === 'ai' ? 'prose-invert' : ''}`}>
                                        <MessageContent text={msg.text} onLinkClick={() => setIsOpen(false)} />
                                    </div>
                                )}
                                {msg.sender === 'ai' && msg.feedbackState && msg.text && (
                                    <div className="mt-3 pt-2 border-t border-white/20">
                                        {msg.feedbackState === 'pending' ? (
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-gray-400">{t('ai_chat_feedback_prompt')}</span>
                                                <div className="flex items-center gap-2">
                                                    <button onClick={() => updateMessage(msg.id, { feedbackState: 'good' })} className="p-1 rounded-full text-gray-400 hover:bg-green-500/20 hover:text-green-500 transition-colors" aria-label="Good response"><ThumbsUpIcon /></button>
                                                    <button onClick={() => updateMessage(msg.id, { feedbackState: 'bad' })} className="p-1 rounded-full text-gray-400 hover:bg-red-500/20 hover:text-red-500 transition-colors" aria-label="Bad response"><ThumbsDownIcon /></button>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-xs text-gray-400 italic flex items-center gap-2">
                                                {msg.feedbackState === 'good' ? <ThumbsUpIcon filled /> : <ThumbsDownIcon filled />}
                                                <span>{msg.feedbackState === 'good' ? t('ai_chat_feedback_thanks_good') : t('ai_chat_feedback_thanks_bad')}</span>
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                            {msg.sender === 'user' && <UserAvatar />}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <footer className="p-4 border-t border-secondary/20 flex-shrink-0">
                    {messages.length <= 1 && (
                        <div className="grid grid-cols-2 gap-2 mb-3">
                            {suggestions.slice(0, 4).map((s, i) => (
                                <button key={i} onClick={() => sendMessage(s)} className="btn-chat text-sm text-left justify-start">
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}
                    <div className="relative flex items-center">
                        <label htmlFor="ai-chat-input" className="sr-only">{t('ai_chat_placeholder')}</label>
                        <textarea
                            id="ai-chat-input"
                            ref={textareaRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={t('ai_chat_placeholder')}
                            rows={1}
                            className="w-full resize-none bg-primary/80 border border-white/20 rounded-2xl py-3 pl-4 pr-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary/80 focus:border-secondary transition-all"
                            disabled={isLoading}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isLoading}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-secondary text-primary disabled:bg-secondary/40 disabled:cursor-not-allowed transition-all transform hover:scale-110 active:scale-100"
                            aria-label="Send message"
                        >
                            <SendIcon />
                        </button>
                    </div>
                    <p className="text-xs text-center text-gray-500 mt-2 px-4">{t('ai_chat_disclaimer')}</p>
                </footer>
            </div>
        </div>
    );
};

export default AiChatPopup;