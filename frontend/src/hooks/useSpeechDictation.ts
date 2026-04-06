'use client';

import { useCallback, useMemo, useRef, useState } from 'react';

type BrowserSpeechRecognitionConstructor = new () => BrowserSpeechRecognition;

interface BrowserSpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  [index: number]: {
    transcript: string;
  };
}

interface BrowserSpeechRecognitionEvent {
  results: {
    length: number;
    [index: number]: BrowserSpeechRecognitionResult;
  };
}

interface BrowserSpeechRecognitionErrorEvent {
  error: string;
}

interface BrowserSpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: BrowserSpeechRecognitionEvent) => void) | null;
  onerror: ((event: BrowserSpeechRecognitionErrorEvent) => void) | null;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

interface DictationResult {
  finalText: string;
  interimText: string;
}

export function useSpeechDictation(onResult: (result: DictationResult) => void) {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);

  const SpeechRecognitionCtor = useMemo(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    return (
      (window as Window & { SpeechRecognition?: BrowserSpeechRecognitionConstructor }).SpeechRecognition ??
      (window as Window & { webkitSpeechRecognition?: BrowserSpeechRecognitionConstructor }).webkitSpeechRecognition
    );
  }, []);

  const isSupported = typeof window !== 'undefined' && typeof SpeechRecognitionCtor !== 'undefined';

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  const startListening = useCallback(() => {
    if (!SpeechRecognitionCtor) {
      setError('Voice typing is not supported in this browser.');
      return;
    }

    setError(null);
    recognitionRef.current?.abort();

    const recognition = new SpeechRecognitionCtor();
    recognitionRef.current = recognition;
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      let interimText = '';
      let finalText = '';

      for (let index = 0; index < event.results.length; index += 1) {
        const transcript = event.results[index][0]?.transcript ?? '';
        if (event.results[index].isFinal) {
          finalText += transcript;
        } else {
          interimText += transcript;
        }
      }

      onResult({
        finalText: finalText.trim(),
        interimText: interimText.trim(),
      });
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      if (event.error !== 'aborted' && event.error !== 'no-speech') {
        setError('Voice typing failed. Please try again.');
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognition.start();
  }, [SpeechRecognitionCtor, onResult]);

  return {
    isListening,
    isSupported,
    error,
    startListening,
    stopListening,
  };
}
