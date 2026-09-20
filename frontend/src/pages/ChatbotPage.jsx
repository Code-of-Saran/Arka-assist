import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { askAssistant } from '../services/api';
import chatbotData from '../data/chatbot.json';
import VoiceAssistantModal from '../components/VoiceAssistantModal';
import {
  Bot,
  User,
  Send,
  Trash2,
  Sparkles,
  ShieldCheck,
  HelpCircle,
  CornerDownLeft,
  Lightbulb,
  Mic
} from 'lucide-react';

const ChatbotPage = () => {
  const { t, language } = useLanguage();
  const isTamil = language === 'ta';

  const initialMessages = [
    {
      id: 1,
      sender: 'assistant',
      text: isTamil
        ? "வணக்கம்! நான் உங்கள் Arka-assist AI விவசாய நுண்ணறிவு உதவியாளர். பயிர் தேர்வு, வெப்ப அழுத்தம், சந்தை நிலவரம், உரம் மற்றும் அரசு திட்டங்கள் குறித்து என்னிடம் கேட்கலாம்."
        : "Hello! I am your Arka-assist Multimodal AI Farm Intelligence Assistant. Ask me anything about crop planning, thermal stress, market prices, soil diagnostics, or government schemes. I work seamlessly offline with live farm context!"
    }
  ];

  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await askAssistant(text, language);
      const answer = isTamil ? (response.answer_ta || response.answer_en) : response.answer_en;
      
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'assistant',
            text: answer,
            source: response.source
          }
        ]);
        setIsTyping(false);
      }, 500);
    } catch (err) {
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'assistant',
            text: isTamil ? 'மன்னிக்கவும், தகவலைப் பெற முடியவில்லை.' : 'Apologies, could not fetch response.'
          }
        ]);
        setIsTyping(false);
      }, 400);
    }
  };

  const handleClearChat = () => {
    setMessages(initialMessages);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-darkbg-card border border-cream-300 dark:border-darkbg-border shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-forest-700 dark:text-leaf-400 uppercase tracking-wider mb-1">
            <Bot className="w-4 h-4" />
            <span>{t('chat_offline_badge')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-forest-950 dark:text-cream-50 tracking-tight">
            {t('chat_title')}
          </h1>
          <p className="text-xs sm:text-sm text-earth-700 dark:text-cream-200/80 mt-0.5">
            {t('chat_subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            type="button"
            onClick={() => setIsVoiceOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-forest-50 dark:bg-darkbg-surface text-forest-800 dark:text-leaf-300 hover:bg-forest-100 border border-forest-300 dark:border-forest-700/60 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Mic className="w-3.5 h-3.5 text-forest-600 dark:text-leaf-400 animate-pulse" />
            <span>{isTamil ? 'குரல் பயன்முறை' : 'Voice Mode'}</span>
          </button>
          <button
            type="button"
            onClick={handleClearChat}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-cream-100 dark:bg-darkbg-surface hover:bg-rose-50 dark:hover:bg-rose-950/40 text-earth-700 dark:text-cream-200 hover:text-rose-600 dark:hover:text-rose-400 border border-cream-300 dark:border-darkbg-border transition-all flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t('chat_clear')}</span>
          </button>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="p-4 rounded-2xl bg-cream-50/80 dark:bg-darkbg-surface/60 border border-cream-300/80 dark:border-darkbg-border space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-earth-700 dark:text-cream-200">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          <span>{t('chat_suggested_title')}:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {chatbotData.suggested_prompts.map((p, idx) => {
            const promptText = isTamil ? p.ta : p.en;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(promptText)}
                className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white dark:bg-darkbg-card hover:bg-forest-50 dark:hover:bg-darkbg-border text-forest-900 dark:text-cream-100 border border-cream-300 dark:border-darkbg-border transition-all text-left shadow-sm"
              >
                {promptText}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="p-6 rounded-3xl bg-white dark:bg-darkbg-card border border-cream-300 dark:border-darkbg-border shadow-soft min-h-[440px] max-h-[550px] overflow-y-auto flex flex-col justify-between">
        
        {/* Messages List */}
        <div className="space-y-4 mb-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                    isUser
                      ? 'bg-earth-600 text-white'
                      : 'bg-gradient-to-br from-forest-600 to-leaf-500 text-white'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-5 h-5" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[80%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-forest-700 text-white rounded-tr-none font-medium'
                      : 'bg-cream-100 dark:bg-darkbg-surface text-earth-900 dark:text-cream-100 rounded-tl-none border border-cream-200 dark:border-darkbg-border whitespace-pre-line'
                  }`}
                >
                  <p>{msg.text}</p>
                  {msg.source && (
                    <span className="block mt-2 pt-2 border-t border-cream-300/40 dark:border-darkbg-border/60 text-[10px] text-earth-500 dark:text-darkbg-muted font-mono">
                      Source: {msg.source}
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing Animation */}
          {isTyping && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-forest-600 text-white flex items-center justify-center">
                <Bot className="w-5 h-5 animate-pulse" />
              </div>
              <div className="p-3.5 rounded-2xl rounded-tl-none bg-cream-100 dark:bg-darkbg-surface border border-cream-200 dark:border-darkbg-border flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-forest-600 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-forest-600 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-forest-600 animate-bounce [animation-delay:0.4s]"></span>
                <span className="text-xs text-earth-600 dark:text-darkbg-muted ml-2 font-medium">
                  {t('chat_typing')}
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="relative pt-2 border-t border-cream-200 dark:border-darkbg-border"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={t('chat_placeholder')}
            className="w-full pl-4 pr-14 py-3 rounded-2xl text-xs sm:text-sm bg-cream-50 dark:bg-darkbg-surface border border-cream-300 dark:border-darkbg-border text-earth-900 dark:text-cream-50 focus:outline-none focus:ring-2 focus:ring-forest-500 font-medium"
          />
          <div className="absolute right-2 top-3.5 flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsVoiceOpen(true)}
              title="Voice Assistant"
              className="p-2 rounded-xl text-forest-700 dark:text-leaf-400 hover:bg-cream-200 dark:hover:bg-darkbg-border transition-colors"
            >
              <Mic className="w-4 h-4" />
            </button>
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="p-2 rounded-xl bg-forest-700 hover:bg-forest-800 disabled:opacity-40 text-white transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>

      </div>

      <VoiceAssistantModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
      />

    </div>
  );
};

export default ChatbotPage;
