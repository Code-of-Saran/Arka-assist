import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  startVoiceRecognition,
  stopVoiceRecognition,
  speakText,
  stopSpeaking,
  isSpeechRecognitionSupported,
  checkVoiceAvailability
} from '../services/voiceNavigation';
import { processVoiceIntent } from '../services/api';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  ArrowRight,
  Compass,
  AlertCircle,
  CornerDownLeft,
  Loader2,
  Info
} from 'lucide-react';

const VoiceAssistantModal = ({ isOpen, onClose }) => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const isTamil = language === 'ta';

  // Voice States: 'ready' | 'listening' | 'processing' | 'speaking' | 'error'
  const [voiceState, setVoiceState] = useState('ready');
  const [transcript, setTranscript] = useState('');
  const [responseMsg, setResponseMsg] = useState('');
  const [targetRoute, setTargetRoute] = useState(null);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [voiceNotice, setVoiceNotice] = useState('');
  const [textInput, setTextInput] = useState('');
  const [availability, setAvailability] = useState({ sttSupported: true, ttsSupported: true, hasLanguageVoice: true });

  useEffect(() => {
    if (isOpen) {
      const avail = checkVoiceAvailability(language);
      setAvailability(avail);

      if (!avail.sttSupported) {
        setVoiceNotice('Voice input is not supported by this browser. You can type your question instead.');
      } else if (isTamil && !avail.hasLanguageVoice) {
        setVoiceNotice('Tamil voice output is unavailable on this device. Tamil text response is still available.');
      } else {
        setVoiceNotice('');
      }

      // Auto greeting
      const greeting = isTamil
        ? 'வணக்கம்! அர்கா-அசிஸ்ட் குரல் வழிகாட்டி தயாராக உள்ளது. உங்கள் கேள்வியை பேசுங்கள்.'
        : 'Hello! Arka-assist voice companion is ready. Speak your farming question or command.';
      setResponseMsg(greeting);

      if (ttsEnabled) {
        setVoiceState('speaking');
        speakText(
          greeting,
          language,
          () => setVoiceState('ready'),
          (warn) => setVoiceNotice(warn)
        );
      } else {
        setVoiceState('ready');
      }
    } else {
      stopVoiceRecognition();
      stopSpeaking();
      setVoiceState('ready');
      setTranscript('');
      setResponseMsg('');
      setTargetRoute(null);
      setErrorMessage('');
      setVoiceNotice('');
    }
  }, [isOpen, language]);

  if (!isOpen) return null;

  const handleStartListening = () => {
    setErrorMessage('');
    setTranscript('');
    setVoiceState('listening');

    startVoiceRecognition({
      language,
      onStart: () => setVoiceState('listening'),
      onResult: async ({ finalTranscript, interimTranscript, isFinal }) => {
        setTranscript(finalTranscript || interimTranscript);
        if (isFinal && finalTranscript) {
          setVoiceState('processing');
          await handleProcessQuery(finalTranscript);
        }
      },
      onError: (err) => {
        setVoiceState('error');
        setErrorMessage(err.message || (isTamil ? 'புரியவில்லை. மீண்டும் முயற்சிக்கவும்.' : 'Couldn\'t understand. Try again.'));
      },
      onEnd: () => {
        // If ended without transcript or error, revert to ready
        if (voiceState === 'listening') {
          setVoiceState('ready');
        }
      }
    });
  };

  const handleStopListening = () => {
    stopVoiceRecognition();
    if (transcript) {
      setVoiceState('processing');
      handleProcessQuery(transcript);
    } else {
      setVoiceState('ready');
    }
  };

  const handleProcessQuery = async (queryText) => {
    if (!queryText.trim()) {
      setVoiceState('ready');
      return;
    }

    setVoiceState('processing');
    try {
      const result = await processVoiceIntent(queryText, language);
      const spoken = result.speech_response || result.message_en || (isTamil ? 'கோரிக்கை பெறப்பட்டது.' : 'Request received.');
      setResponseMsg(spoken);

      if (ttsEnabled) {
        setVoiceState('speaking');
        speakText(
          spoken,
          language,
          () => setVoiceState('ready'),
          (warn) => setVoiceNotice(warn)
        );
      } else {
        setVoiceState('ready');
      }

      if (result.type === 'navigation_action' && result.target_route) {
        setTargetRoute(result.target_route);
        setTimeout(() => {
          onClose();
          navigate(result.target_route);
        }, 1600);
      }
    } catch (err) {
      setVoiceState('error');
      setErrorMessage(err.message || (isTamil ? 'கோரிக்கையை செயல்படுத்துவதில் பிழை.' : 'Error processing request.'));
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    setTranscript(textInput);
    handleProcessQuery(textInput);
    setTextInput('');
  };

  const sampleCommands = isTamil
    ? [
        { label: '🌾 பயிர் நிலை', cmd: 'இன்றைய பயிர் நிலை எப்படி இருக்கிறது' },
        { label: '🌦️ வானிலை', cmd: 'இன்றைய வானிலை காட்டு' },
        { label: '💰 சந்தை விலை', cmd: 'இன்றைய சந்தை விலை என்ன' },
        { label: '⚖️ விற்பனை முடிவு', cmd: 'பயிரை இப்போது விற்கலாமா' },
        { label: '🗺️ 3D பண்ணை', cmd: '3D பண்ணை மாதிரி காட்டு' }
      ]
    : [
        { label: "🌾 Crop Health", cmd: "How is my crop today?" },
        { label: "🌦️ Weather", cmd: "Show today's weather" },
        { label: "💰 Market Price", cmd: "Show today market price" },
        { label: "⚖️ Sell or Wait", cmd: "Should I sell my crop?" },
        { label: "🗺️ 3D Farm", cmd: "Show my 3D farm" }
      ];

  // Helper for status label & color
  const getStatusInfo = () => {
    switch (voiceState) {
      case 'listening':
        return { label: isTamil ? '🎤 கேட்கிறது...' : '🎤 Listening...', color: 'text-rose-600 dark:text-rose-400 font-bold' };
      case 'processing':
        return { label: isTamil ? '🤖 புரிந்து கொள்ள முயல்கிறது...' : '🤖 Understanding...', color: 'text-amber-600 dark:text-amber-400 font-bold' };
      case 'speaking':
        return { label: isTamil ? '🔊 அர்கா-அசிஸ்ட் பேசுகிறது...' : '🔊 Arka-assist is speaking...', color: 'text-leaf-600 dark:text-leaf-400 font-bold' };
      case 'error':
        return { label: isTamil ? '⚠️ புரியவில்லை. மீண்டும் முயற்சிக்கவும்.' : '⚠️ Couldn\'t understand. Try again.', color: 'text-rose-600 font-bold' };
      default:
        return { label: isTamil ? '🎤 தட்டச்சு அல்லது தட்டி பேசுங்கள்' : '🎤 Tap microphone to speak', color: 'text-earth-700 dark:text-cream-200 font-medium' };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-cream-50 dark:bg-darkbg-card border border-cream-300 dark:border-darkbg-border shadow-2xl transition-all">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cream-200 dark:border-darkbg-border bg-forest-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-forest-700 flex items-center justify-center text-leaf-300 shadow-inner">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight">{t('voice_assistant_title')}</h3>
              <p className="text-[11px] text-forest-200">{t('voice_assistant_subtitle')}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setTtsEnabled(!ttsEnabled);
                if (voiceState === 'speaking') {
                  stopSpeaking();
                  setVoiceState('ready');
                }
              }}
              type="button"
              className={`p-2 rounded-full transition-all ${
                ttsEnabled ? 'bg-forest-800 text-leaf-300 hover:bg-forest-700' : 'bg-forest-950 text-earth-400 hover:bg-forest-900'
              }`}
              title={ttsEnabled ? 'Voice readout enabled' : 'Voice readout muted'}
            >
              {ttsEnabled ? <Volume2 className="w-4.5 h-4.5" /> : <VolumeX className="w-4.5 h-4.5" />}
            </button>
            <button
              onClick={onClose}
              type="button"
              className="p-2 rounded-full bg-forest-800 hover:bg-rose-600 text-white transition-colors"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">

          {/* Voice Notice (e.g. Tamil voice availability fallback) */}
          {voiceNotice && (
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
              <Info className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
              <div className="flex-1 font-medium leading-relaxed">{voiceNotice}</div>
            </div>
          )}
          
          {/* Central Microphone Action Hub */}
          <div className="flex flex-col items-center justify-center py-3">
            <div className="relative">
              {voiceState === 'listening' && (
                <div className="absolute inset-0 -m-5 rounded-full bg-rose-500/25 animate-ping" />
              )}
              {voiceState === 'speaking' && (
                <div className="absolute inset-0 -m-4 rounded-full bg-leaf-500/25 animate-pulse" />
              )}
              
              <button
                onClick={voiceState === 'listening' ? handleStopListening : handleStartListening}
                type="button"
                className={`relative w-24 h-24 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 transform active:scale-95 ${
                  voiceState === 'listening'
                    ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/40 scale-105'
                    : voiceState === 'processing'
                    ? 'bg-amber-600 text-white shadow-amber-500/30'
                    : voiceState === 'speaking'
                    ? 'bg-leaf-600 hover:bg-leaf-700 text-white shadow-leaf-500/40'
                    : 'bg-forest-600 hover:bg-forest-700 text-white shadow-forest-600/30 hover:scale-105'
                }`}
              >
                {voiceState === 'processing' ? (
                  <Loader2 className="w-10 h-10 animate-spin" />
                ) : voiceState === 'listening' ? (
                  <MicOff className="w-10 h-10 animate-bounce" />
                ) : voiceState === 'speaking' ? (
                  <Volume2 className="w-10 h-10 animate-pulse" />
                ) : (
                  <Mic className="w-10 h-10" />
                )}
              </button>
            </div>

            <span className={`mt-4 text-xs tracking-wide ${statusInfo.color}`}>
              {statusInfo.label}
            </span>

            {targetRoute && (
              <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-leaf-100 dark:bg-leaf-950/80 text-leaf-800 dark:text-leaf-300 text-xs font-bold animate-bounce border border-leaf-300 dark:border-leaf-800">
                <Compass className="w-3.5 h-3.5" />
                <span>{isTamil ? 'பக்கத்திற்கு நகர்கிறது...' : `Navigating to ${targetRoute}...`}</span>
              </div>
            )}
          </div>

          {/* Spoken & Recognized Display */}
          <div className="p-4 rounded-2xl bg-white dark:bg-darkbg-surface border border-cream-200 dark:border-darkbg-border space-y-2.5 shadow-sm">
            <div className="text-[11px] font-bold uppercase tracking-wider text-earth-500 dark:text-darkbg-muted flex items-center justify-between">
              <span>{isTamil ? 'அடையாளம் காணப்பட்ட குரல்' : 'Recognized Voice'}</span>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-cream-100 dark:bg-darkbg-card text-forest-800 dark:text-cream-200">
                {language === 'ta' ? 'தமிழ் (ta-IN)' : 'English (en-IN)'}
              </span>
            </div>
            
            <p className="text-sm font-semibold text-forest-950 dark:text-cream-50 min-h-[1.5rem] italic">
              {transcript ? `"${transcript}"` : (isTamil ? 'பேச காத்திருக்கிறது...' : 'Awaiting voice input...')}
            </p>

            {responseMsg && (
              <div className="pt-3 border-t border-cream-200 dark:border-darkbg-border/60">
                <div className="text-[11px] font-bold text-forest-700 dark:text-leaf-400 flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-leaf-500" />
                  <span>Arka-assist Response</span>
                </div>
                <p className="text-xs text-earth-900 dark:text-cream-200 leading-relaxed font-medium">
                  {responseMsg}
                </p>
              </div>
            )}
          </div>

          {errorMessage && (
            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-900 dark:text-rose-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Quick Voice Command Chips */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-earth-500 dark:text-darkbg-muted mb-2">
              {t('voice_try_commands')}
            </div>
            <div className="flex flex-wrap gap-2">
              {sampleCommands.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setTranscript(sample.cmd);
                    handleProcessQuery(sample.cmd);
                  }}
                  type="button"
                  className="px-3 py-1.5 rounded-full text-xs font-semibold bg-cream-100 dark:bg-darkbg-surface hover:bg-forest-100 dark:hover:bg-forest-950/70 text-forest-900 dark:text-cream-200 border border-cream-300 dark:border-darkbg-border transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <span>{sample.label}</span>
                  <ArrowRight className="w-3 h-3 text-leaf-600 dark:text-leaf-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Text Input Fallback */}
          <form onSubmit={handleManualSubmit} className="pt-1 flex items-center gap-2">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={isTamil ? 'அல்லது உங்கள் கேள்வியை இங்கே தட்டச்சு செய்யவும்...' : 'Or type your farming question here...'}
              className="flex-1 px-4 py-2.5 rounded-xl text-xs bg-white dark:bg-darkbg-surface border border-cream-300 dark:border-darkbg-border text-forest-950 dark:text-cream-50 focus:outline-none focus:ring-2 focus:ring-forest-500"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              <span>{isTamil ? 'கேள்' : 'Ask'}</span>
              <CornerDownLeft className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default VoiceAssistantModal;

