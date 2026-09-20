/**
 * ARKA-ASSIST — Voice Navigation and Speech Synthesis Service
 * Provides speech-to-text recognition, natural speech synthesis (TTS),
 * and intent routing for voice-assisted farm access in English and Tamil.
 */

// Speech Recognition instance
let recognition = null;
let cachedVoices = [];

// Initialize voices cache and handle async voice loading in browsers
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  const loadVoices = () => {
    try {
      cachedVoices = window.speechSynthesis.getVoices() || [];
    } catch (e) {
      cachedVoices = [];
    }
  };
  loadVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }
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
    cachedVoices = window.speechSynthesis.getVoices() || [];
  }
  return cachedVoices;
}

/**
 * Finds best matching voice for Tamil ('ta') or English ('en')
 */
export function findBestVoice(language = 'en') {
  const voices = getAvailableVoices();
  if (!voices || voices.length === 0) return null;

  if (language === 'ta') {
    // 1. Exact ta-IN or ta match
    let tamilVoice = voices.find(v => v.lang && (v.lang.toLowerCase() === 'ta-in' || v.lang.toLowerCase() === 'ta_in' || v.lang.toLowerCase() === 'ta'));
    // 2. Contains ta in lang code
    if (!tamilVoice) {
      tamilVoice = voices.find(v => v.lang && v.lang.toLowerCase().includes('ta'));
    }
    // 3. Check voice name for Tamil keywords
    if (!tamilVoice) {
      tamilVoice = voices.find(v => v.name && (v.name.toLowerCase().includes('tamil') || v.name.toLowerCase().includes('valluvar') || v.name.toLowerCase().includes('kani')));
    }
    return tamilVoice || null;
  }

  // English fallback matching en-IN, en-US, en-GB
  let enVoice = voices.find(v => v.lang && (v.lang.toLowerCase() === 'en-in' || v.lang.toLowerCase() === 'en_in'));
  if (!enVoice) {
    enVoice = voices.find(v => v.lang && v.lang.toLowerCase().startsWith('en'));
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
    if (onError) onError(new Error('Voice input is not supported by this browser. You can type your question instead.'));
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
      let errorMsg = 'Microphone error. Please check permissions and try again.';
      if (event.error === 'not-allowed') {
        errorMsg = 'Microphone permission was denied. Please allow microphone access in your browser settings.';
      } else if (event.error === 'no-speech') {
        errorMsg = 'No speech detected. Please speak clearly into the microphone.';
      } else if (event.error === 'network') {
        errorMsg = 'Network error during speech recognition. Please verify internet connectivity or use text mode.';
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
 */
export function speakText(text, language = 'en', onEnd = null, onVoiceWarning = null) {
  if (!isSpeechSynthesisSupported() || !text) {
    if (onEnd) onEnd();
    return { success: false, reason: 'TTS not supported' };
  }

  try {
    window.speechSynthesis.cancel(); // Stop any ongoing speech

    // Clean markdown formatting for clear spoken readout
    const cleanText = text.replace(/[*_#`[\]()]/g, ' ').replace(/\s+/g, ' ').trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = language === 'ta' ? 'ta-IN' : 'en-IN';
    utterance.rate = 0.92; // Slightly slower, clear cadence for farmers
    utterance.pitch = 1.0;

    const matchedVoice = findBestVoice(language);
    
    if (language === 'ta' && !matchedVoice) {
      console.info('[Arka-assist Voice] No native Tamil TTS voice found on this device.');
      if (onVoiceWarning) {
        onVoiceWarning('Tamil voice output is unavailable on this device. Tamil text response is still available.');
      }
    }

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = () => onEnd();
    }

    window.speechSynthesis.speak(utterance);
    return { success: true, voiceUsed: matchedVoice ? matchedVoice.name : 'Default Browser Voice' };
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

