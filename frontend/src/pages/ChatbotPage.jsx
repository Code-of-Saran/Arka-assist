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
  Lightbulb,
  Mic,
  Sparkles
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
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
      
      {/* Header - Liquid Glass & Deep Green Accent */}
      <div className="glass-light p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#0B6623] uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-[#0B6623]" />
            <span>{t('chat_offline_badge')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#17351F] tracking-tight">
            {t('chat_title')}
          </h1>
          <p className="text-xs sm:text-sm text-[#4A3A30] mt-0.5 font-medium">
            {t('chat_subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            type="button"
            onClick={() => setIsVoiceOpen(true)}
            className="px-3.5 py-2 rounded-2xl text-xs font-bold btn-glass-secondary flex items-center gap-1.5 shadow-glass cursor-pointer backdrop-blur-md text-[#17351F]"
          >
            <Mic className="w-3.5 h-3.5 text-[#0B6623]" />
            <span>{isTamil ? 'குரல் பயன்முறை' : 'Voice Mode'}</span>
          </button>
          <button
            type="button"
            onClick={handleClearChat}
            className="px-3.5 py-2 rounded-2xl text-xs font-semibold btn-glass-secondary text-[#5F5148] hover:text-[#17351F] flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 text-[#5F5148]" />
            <span>{t('chat_clear')}</span>
          </button>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="glass-light p-4 rounded-3xl space-y-2.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#17351F]">
          <Lightbulb className="w-3.5 h-3.5 text-[#0B6623]" />
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
                className="px-3 py-1.5 rounded-xl text-xs font-bold glass-card-light text-[#17351F] hover:border-[#0B6623] transition-all text-left cursor-pointer"
              >
                {promptText}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="glass-light p-6 rounded-3xl min-h-[460px] max-h-[580px] overflow-y-auto flex flex-col justify-between relative">
        
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
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-glass ${
                    isUser
                      ? 'bg-[#0B6623] text-white border border-white/20'
                      : 'bg-[#0B6623]/10 text-[#0B6623] border border-[#0B6623]/25'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-5 h-5 text-[#0B6623]" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[80%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-[#0B6623] text-white rounded-tr-none font-medium shadow-glass border border-white/15'
                      : 'glass-card-light text-[#17351F] rounded-tl-none border border-[#765341]/20 whitespace-pre-line shadow-xs'
                  }`}
                >
                  <p className={`${isUser ? 'text-white' : 'text-[#17351F]'} font-medium`}>{msg.text}</p>
                  {msg.source && (
                    <span className="block mt-2 pt-2 border-t border-[#765341]/15 text-[10px] text-[#0B6623] font-mono font-bold">
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
              <div className="w-9 h-9 rounded-2xl bg-[#0B6623]/10 text-[#0B6623] border border-[#0B6623]/25 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div className="p-3.5 rounded-2xl rounded-tl-none glass-card-light border border-[#765341]/20 flex items-center gap-1.5 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-[#0B6623] animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-[#0B6623] animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-[#0B6623] animate-bounce [animation-delay:0.4s]"></span>
                <span className="text-xs text-[#5F5148] ml-2 font-bold">
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
          className="relative pt-3 border-t border-[#765341]/15"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={t('chat_placeholder')}
            className="w-full pl-4 pr-24 py-3.5 rounded-2xl text-xs sm:text-sm glass-input-light text-[#17351F] placeholder-[#5F5148] focus:outline-none focus:border-[#0B6623] font-medium transition-all"
          />
          <div className="absolute right-2 top-4.5 flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsVoiceOpen(true)}
              title="Voice Assistant"
              className="p-2 rounded-xl text-[#0B6623] hover:bg-[#0B6623]/10 transition-colors cursor-pointer"
            >
              <Mic className="w-4 h-4" />
            </button>
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="p-2 rounded-xl btn-glass-primary disabled:opacity-30 text-white transition-all cursor-pointer shadow-glass"
            >
              <Send className="w-4 h-4 text-white" />
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

