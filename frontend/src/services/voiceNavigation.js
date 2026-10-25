/**
 * ARKA-ASSIST — Voice Navigation and Speech Synthesis Service
 * Provides speech-to-text recognition, natural speech synthesis (TTS),
 * and intent routing for voice-assisted farm access in English and Tamil.
 */

// Speech Recognition instance
let recognition = null;
let cachedVoices = [];
let voiceChangeListeners = [];

export function registerVoiceChangeListener(listener) {
  if (typeof listener === 'function') {
    voiceChangeListeners.push(listener);
  }
  return () => {
    voiceChangeListeners = voiceChangeListeners.filter(l => l !== listener);
  };
}

const notifyVoiceChange = () => {
  try {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      cachedVoices = window.speechSynthesis.getVoices() || [];
    }
  } catch (e) {
    cachedVoices = [];
  }
  voiceChangeListeners.forEach(fn => {
    try { fn(cachedVoices); } catch (err) { /* ignore */ }
  });
};

// Initialize voices cache and handle async voice loading in browsers
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  notifyVoiceChange();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = notifyVoiceChange;
  }
  window.speechSynthesis.addEventListener('voiceschanged', notifyVoiceChange);
}

export function isSpeechRecognitionSupported() {
  return typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
}

export function isSpeechSynthesisSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

/**
 * Helper to retrieve loaded voices reliably
 */
export function getAvailableVoices() {
  if (!isSpeechSynthesisSupported()) return [];
  if (!cachedVoices || cachedVoices.length === 0) {
    try {
      cachedVoices = window.speechSynthesis.getVoices() || [];
    } catch (e) {
      cachedVoices = [];
    }
  }
  return cachedVoices;
}

/**
 * Finds best matching voice for Tamil ('ta') or English ('en')
 * Dynamically searches for:
 * - ta-IN, ta_IN, ta
 * - Tamil, தமிழ்
 * - Google Tamil, Microsoft Valluvar, Valluvar, Kani
 */
export function findBestVoice(language = 'en') {
  const voices = getAvailableVoices();
  if (!voices || voices.length === 0) return null;

  if (language === 'ta') {
    // 1. Exact ta-IN, ta_IN, or ta locale match
    let tamilVoice = voices.find(v => {
      const l = (v.lang || '').toLowerCase().replace('_', '-');
      return l === 'ta-in' || l === 'ta';
    });

    // 2. Starts with ta- or ta_ (e.g. ta-LK, ta-SG, ta-MY)
    if (!tamilVoice) {
      tamilVoice = voices.find(v => {
        const l = (v.lang || '').toLowerCase().replace('_', '-');
        return l.startsWith('ta-');
      });
    }

    // 3. Check voice name and voiceURI against explicit Tamil identifiers:
    // ta-in, ta_in, Tamil, தமிழ், Google Tamil, Microsoft Valluvar, Valluvar, Kani
    if (!tamilVoice) {
      const searchTerms = [
        'google tamil',
        'microsoft valluvar',
        'valluvar',
        'தமிழ்',
        'tamil',
        'kani',
        'ta-in',
        'ta_in'
      ];
      tamilVoice = voices.find(v => {
        const name = (v.name || '').toLowerCase();
        const uri = (v.voiceURI || '').toLowerCase();
        const rawName = v.name || '';
        return searchTerms.some(term => 
          name.includes(term.toLowerCase()) || 
          uri.includes(term.toLowerCase()) ||
          rawName.includes('தமிழ்')
        );
      });
    }

    return tamilVoice || null;
  }

  // English matching: en-IN first, then en-US / en-GB, then any en voice
  let enVoice = voices.find(v => {
    const l = (v.lang || '').toLowerCase().replace('_', '-');
    return l === 'en-in';
  });
  if (!enVoice) {
    enVoice = voices.find(v => {
      const l = (v.lang || '').toLowerCase().replace('_', '-');
      return l.startsWith('en-');
    });
  }
  return enVoice || voices[0] || null;
}

/**
 * Check voice availability for target language
 */
export function checkVoiceAvailability(language = 'en') {
  const ttsSupported = isSpeechSynthesisSupported();
  const sttSupported = isSpeechRecognitionSupported();
  const matchedVoice = findBestVoice(language);
  
  return {
    sttSupported,
    ttsSupported,
    hasLanguageVoice: !!matchedVoice,
    voiceName: matchedVoice ? matchedVoice.name : null,
    voiceLang: matchedVoice ? matchedVoice.lang : null
  };
}

/**
 * Initialize and start voice speech-to-text recognition
 */
export function startVoiceRecognition({ language = 'en', onResult, onError, onStart, onEnd }) {
  if (!isSpeechRecognitionSupported()) {
    const errorMsg = language === 'ta'
      ? 'இந்த உலாவியில் குரல் உள்ளீடு ஆதரிக்கப்படவில்லை. உரையாக உள்ளிடலாம்.'
      : 'Voice input is not supported by this browser. You can type your question instead.';
    if (onError) onError(new Error(errorMsg));
    return null;
  }

  try {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    
    // Explicit Tamil locale vs English locale
    recognition.lang = language === 'ta' ? 'ta-IN' : 'en-IN';

    recognition.onstart = () => {
      if (onStart) onStart();
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      if (onResult) {
        onResult({
          finalTranscript: finalTranscript.trim(),
          interimTranscript: interimTranscript.trim(),
          isFinal: finalTranscript.length > 0
        });
      }
    };

    recognition.onerror = (event) => {
      console.warn('[Arka-assist Voice] Speech recognition error:', event.error);
      let errorMsg = language === 'ta'
        ? 'மைக்ரோஃபோன் பிழை. அமைப்புகளை சரிபார்த்து மீண்டும் முயற்சிக்கவும்.'
        : 'Microphone error. Please check permissions and try again.';
      if (event.error === 'not-allowed') {
        errorMsg = language === 'ta'
          ? 'மைக்ரோஃபோன் அனுமதி மறுக்கப்பட்டது. உலாவி அமைப்புகளில் அனுமதியை இயக்கவும்.'
          : 'Microphone permission was denied. Please allow microphone access in your browser settings.';
      } else if (event.error === 'no-speech') {
        errorMsg = language === 'ta'
          ? 'குரல் கேட்கவில்லை. மைக்ரோஃபோனில் தெளிவாகப் பேசவும்.'
          : 'No speech detected. Please speak clearly into the microphone.';
      } else if (event.error === 'network') {
        errorMsg = language === 'ta'
          ? 'இணைய இணைப்புப் பிழை. உரை வழியைப் பயன்படுத்தலாம்.'
          : 'Network error during speech recognition. Please verify internet connectivity or use text mode.';
      }
      if (onError) onError(new Error(errorMsg));
    };

    recognition.onend = () => {
      if (onEnd) onEnd();
    };

    recognition.start();
    return recognition;
  } catch (err) {
    if (onError) onError(err);
    return null;
  }
}

export function stopVoiceRecognition() {
  if (recognition) {
    try {
      recognition.stop();
    } catch (e) {
      // Ignore if already stopped
    }
    recognition = null;
  }
}

/**
 * Text-to-Speech audio readout
 * If device/browser lacks a Tamil voice when language is 'ta',
 * it shows fallback notice, returns gracefully, and DOES NOT incorrectly speak with an English voice.
 */
export function speakText(text, language = 'en', onEnd = null, onVoiceWarning = null) {
  if (!isSpeechSynthesisSupported() || !text) {
    if (onEnd) onEnd();
    return { success: false, reason: 'TTS not supported' };
  }

  try {
    window.speechSynthesis.cancel(); // Stop any ongoing speech

    const matchedVoice = findBestVoice(language);
    
    // Critical: If Tamil voice is not installed, do not pretend speech works with an English voice
    if (language === 'ta' && !matchedVoice) {
      const notice = 'Tamil voice output is unavailable on this device. Tamil text response is still available.';
      console.info('[Arka-assist Voice]', notice);
      if (onVoiceWarning) {
        onVoiceWarning(notice);
      }
      if (onEnd) {
        // Return UI state back to ready immediately
        setTimeout(() => onEnd(), 50);
      }
      return { 
        success: false, 
        reason: 'Tamil voice unavailable on this device', 
        noTamilVoice: true,
        fallbackToText: true 
      };
    }

    // Clean markdown formatting for clear spoken readout
    const cleanText = text.replace(/[*_#`[\]()]/g, ' ').replace(/\s+/g, ' ').trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = language === 'ta' ? 'ta-IN' : 'en-IN';
    utterance.rate = 0.92; // Slightly slower, clear cadence for farmers
    utterance.pitch = 1.0;

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    let finished = false;
    const handleEnd = () => {
      if (!finished) {
        finished = true;
        if (onEnd) onEnd();
      }
    };

    utterance.onend = handleEnd;
    utterance.onerror = (e) => {
      console.warn('[Arka-assist Voice] Speech synthesis error:', e);
      handleEnd();
    };

    window.speechSynthesis.speak(utterance);
    return { 
      success: true, 
      voiceUsed: matchedVoice ? matchedVoice.name : 'Default Browser Voice' 
    };
  } catch (err) {
    console.warn('[Arka-assist Voice] Text-to-speech error:', err);
    if (onEnd) onEnd();
    return { success: false, reason: err.message };
  }
}

export function stopSpeaking() {
  if (isSpeechSynthesisSupported()) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {
      // Ignore
    }
  }
}

