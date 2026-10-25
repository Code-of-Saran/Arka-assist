import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  startVoiceRecognition,
  stopVoiceRecognition,
  speakText,
  stopSpeaking,
  checkVoiceAvailability,
  registerVoiceChangeListener
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
  Info,
  Globe
} from 'lucide-react';

const VoiceAssistantModal = ({ isOpen, onClose }) => {
  const { language, toggleLanguage, t } = useLanguage();
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
  const [availability, setAvailability] = useState({ sttSupported: true, ttsSupported: true, hasLanguageVoice: false });

  // Update and listen for available voices dynamically
  useEffect(() => {
    if (!isOpen) {
      stopVoiceRecognition();
      stopSpeaking();
      setVoiceState('ready');
      setTranscript('');
      setResponseMsg('');
      setTargetRoute(null);
      setErrorMessage('');
      setVoiceNotice('');
      return;
    }

    const refreshVoiceState = () => {
      const avail = checkVoiceAvailability(language);
      setAvailability(avail);

      if (!avail.sttSupported) {
        setVoiceNotice(isTamil
          ? 'இந்த உலாவியில் குரல் உள்ளீடு ஆதரிக்கப்படவில்லை. நீங்கள் கீழே தட்டச்சு செய்யலாம்.'
          : 'Voice input is not supported by this browser. You can type your question instead.');
      } else if (isTamil && !avail.hasLanguageVoice) {
        setVoiceNotice('Tamil voice output is unavailable on this device. Tamil text response is still available.');
      } else {
        setVoiceNotice('');
      }
      return avail;
    };

    const currentAvail = refreshVoiceState();
    const unregister = registerVoiceChangeListener(() => {
      refreshVoiceState();
    });

    // Auto greeting
    const greeting = isTamil
      ? 'வணக்கம்! அர்கா-அசிஸ்ட் குரல் வழிகாட்டி தயாராக உள்ளது. உங்கள் கேள்வியை பேசுங்கள்.'
      : 'Hello! Arka-assist voice companion is ready. Speak your farming question or command.';
    setResponseMsg(greeting);

    // Speak greeting ONLY if TTS enabled and voice actually exists for language
    if (ttsEnabled && (!isTamil || currentAvail.hasLanguageVoice)) {
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

    return () => {
      unregister();
    };
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
        setErrorMessage(err.message || (isTamil ? 'புரியவில்லை. மீண்டும் முயற்சிக்கவும்.' : "Couldn't understand. Try again."));
      },
      onEnd: () => {
        setVoiceState((prev) => (prev === 'listening' ? 'ready' : prev));
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
      const spoken = result.speech_response || result.message_ta || result.message_en || (isTamil ? 'கோரிக்கை பெறப்பட்டது.' : 'Request received.');
      setResponseMsg(spoken);

      const latestAvail = checkVoiceAvailability(language);
      if (ttsEnabled && (!isTamil || latestAvail.hasLanguageVoice)) {
        setVoiceState('speaking');
        speakText(
          spoken,
          language,
          () => setVoiceState('ready'),
          (warn) => setVoiceNotice(warn)
        );
      } else {
        setVoiceState('ready');
        if (isTamil && !latestAvail.hasLanguageVoice) {
          setVoiceNotice('Tamil voice output is unavailable on this device. Tamil text response is still available.');
        }
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
        { label: '🌦️ வானிலை', cmd: 'இன்று வானிலை எப்படி இருக்கிறது?' },
        { label: '❓ பயிர் பிரச்சனை', cmd: 'என் பயிருக்கு என்ன பிரச்சனை?' },
        { label: '🚜 இன்றைய பணி', cmd: 'இன்று என் வயலுக்கு என்ன செய்ய வேண்டும்?' },
        { label: '🧪 உரப் பரிந்துரை', cmd: 'என் பயிருக்கு ஏற்ற உரத்தை பரிந்துரைக்கவும்.' },
        { label: '💰 சந்தை விலை', cmd: 'இன்றைய சந்தை விலை என்ன' }
      ]
    : [
        { label: '🌾 Crop Health', cmd: 'How is my crop today?' },
        { label: '🌦️ Weather', cmd: 'What is the weather today?' },
        { label: '💰 Market Price', cmd: 'Show today market price' },
        { label: '⚖️ Sell or Wait', cmd: 'Should I sell my crop?' },
        { label: '🗺️ 3D Farm', cmd: 'Show my 3D farm' }
      ];

  // Voice Status indicators
  const getStatusInfo = () => {
    switch (voiceState) {
      case 'listening':
        return {
          label: isTamil ? '🔴 கேட்கிறது...' : '🔴 Listening...',
          color: 'text-[#4F8F5B] font-bold'
        };
      case 'processing':
        return {
          label: isTamil ? '🤖 புரிந்து கொள்ள முயல்கிறது...' : '🤖 Understanding...',
          color: 'text-[#B8A77A] font-bold'
        };
      case 'speaking':
        return {
          label: isTamil ? '🔊 அர்கா-அசிஸ்ட் பேசுகிறது...' : '🔊 Arka-assist is speaking...',
          color: 'text-[#4F8F5B] font-bold'
        };
      case 'error':
        return {
          label: isTamil ? '⚠️ புரியவில்லை. மீண்டும் முயற்சிக்கவும்.' : "⚠️ Couldn't understand. Try again.",
          color: 'text-[#C46F52] font-bold'
        };
      default:
        return {
          label: isTamil ? '🎤 பேச மைக்ரோஃபோனைத் தட்டவும்' : '🎤 Tap microphone to speak',
          color: 'text-[#D8C7AE] font-medium'
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-2xl animate-fade-in">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl glass-modal border border-white/20 shadow-2xl bg-[#654536]/95 text-white transition-all">
        
        {/* Header with Liquid Glass style */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/15 bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#0B6623] text-white flex items-center justify-center shadow-glass border border-white/20">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight text-white">{t('voice_assistant_title')}</h3>
              <p className="text-[11px] text-[#4F8F5B] font-medium">{t('voice_assistant_subtitle')}</p>
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
              className={`p-2 rounded-xl transition-all border ${
                ttsEnabled
                  ? 'bg-[#0B6623]/40 text-white border-[#0B6623]/60 shadow-sm'
                  : 'bg-white/10 text-[#D8C7AE] border-white/15'
              }`}
              title={ttsEnabled ? 'Voice readout enabled' : 'Voice readout muted'}
            >
              {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              type="button"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#D8C7AE] hover:text-white border border-white/15 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">

          {/* Voice Notice */}
          {voiceNotice && (
            <div className="p-3.5 rounded-2xl glass-card border border-[#C46F52]/40 bg-[#C46F52]/20 text-xs text-white flex items-start gap-2.5">
              <Info className="w-4 h-4 shrink-0 text-[#C46F52] mt-0.5" />
              <div className="flex-1 font-medium leading-relaxed">{voiceNotice}</div>
            </div>
          )}
          
          {/* Central Microphone Liquid Glass Orb */}
          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative flex items-center justify-center">
              {/* Outer Pulse Rings */}
              {voiceState === 'listening' && (
                <div className="absolute w-36 h-36 rounded-full bg-[#0B6623]/35 animate-ping" />
              )}
              {voiceState === 'speaking' && (
                <div className="absolute w-36 h-36 rounded-full bg-[#0B6623]/40 animate-voice-pulse" />
              )}
              
              <button
                onClick={voiceState === 'listening' ? handleStopListening : handleStartListening}
                type="button"
                className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 transform active:scale-95 border ${
                  voiceState === 'listening'
                    ? 'bg-gradient-to-br from-[#0B6623] to-[#08752A] text-white border-white/40 shadow-[0_0_35px_rgba(11,102,35,0.6)] scale-105'
                    : voiceState === 'processing'
                    ? 'bg-gradient-to-br from-[#765341] to-[#654536] text-white border-white/30 shadow-[0_0_30px_rgba(118,83,65,0.5)]'
                    : voiceState === 'speaking'
                    ? 'bg-gradient-to-br from-[#0B6623] to-[#4F8F5B] text-white border-white/40 shadow-[0_0_35px_rgba(11,102,35,0.6)] scale-105'
                    : 'bg-white/15 hover:bg-white/25 text-white border-white/20 shadow-glass hover:scale-105'
                }`}
              >
                {voiceState === 'processing' ? (
                  <Loader2 className="w-9 h-9 animate-spin text-white" />
                ) : voiceState === 'listening' ? (
                  <MicOff className="w-9 h-9 animate-bounce text-white" />
                ) : voiceState === 'speaking' ? (
                  <Volume2 className="w-9 h-9 animate-pulse text-white" />
                ) : (
                  <Mic className="w-9 h-9 text-white" />
                )}
              </button>
            </div>

            <span className={`mt-4 text-xs tracking-wide ${statusInfo.color}`}>
              {statusInfo.label}
            </span>

            {targetRoute && (
              <div className="mt-2.5 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#0B6623]/30 border border-[#0B6623]/50 text-[#4F8F5B] text-xs font-bold animate-bounce shadow-sm">
                <Compass className="w-3.5 h-3.5 text-[#4F8F5B]" />
                <span>{isTamil ? 'பக்கத்திற்கு நகர்கிறது...' : `Navigating to ${targetRoute}...`}</span>
              </div>
            )}
          </div>

          {/* Spoken & Recognized Display */}
          <div className="p-4 rounded-2xl glass-card border border-white/15 bg-white/5 space-y-2.5 shadow-sm">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#4F8F5B] flex items-center justify-between">
              <span>{isTamil ? 'அடையாளம் காணப்பட்ட குரல்' : 'Recognized Voice'}</span>
              <button
                type="button"
                onClick={toggleLanguage}
                title="Switch voice recognition & TTS language"
                className="font-mono text-[10px] px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 transition-all border border-white/20 cursor-pointer shadow-xs active:scale-95"
              >
                <Globe className="w-3 h-3 text-[#4F8F5B]" />
                <span>{language === 'ta' ? 'தமிழ் (ta-IN)' : 'English (en-IN)'}</span>
              </button>
            </div>
            
            <p className="text-sm font-semibold text-white min-h-[1.5rem] italic">
              {transcript ? `"${transcript}"` : (isTamil ? 'பேச காத்திருக்கிறது...' : 'Awaiting voice input...')}
            </p>

            {responseMsg && (
              <div className="pt-3 border-t border-white/15">
                <div className="text-[11px] font-bold text-[#4F8F5B] flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#4F8F5B]" />
                  <span>Arka-assist Response</span>
                </div>
                <p className="text-xs text-[#F1E8DF] leading-relaxed font-medium">
                  {responseMsg}
                </p>
              </div>
            )}
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-2xl glass-card bg-[#C46F52]/20 border border-[#C46F52]/40 text-xs text-white flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#C46F52] mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Quick Voice Command Chips */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#D8C7AE] mb-2">
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
                  className="px-3 py-1.5 rounded-full text-xs font-semibold glass-card text-white hover:border-white/40 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <span>{sample.label}</span>
                  <ArrowRight className="w-3 h-3 text-[#4F8F5B]" />
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
              className="flex-1 px-4 py-2.5 rounded-xl text-xs bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-[#4F8F5B]"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl btn-glass-primary text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <span>{isTamil ? 'கேள்' : 'Ask'}</span>
              <CornerDownLeft className="w-3.5 h-3.5 text-white" />
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default VoiceAssistantModal;

