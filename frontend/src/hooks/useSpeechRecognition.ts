'use client';

import { useState, useRef, useCallback } from 'react';
import type { AttachedFile } from '@/store/slices/chatSlice';
import {
  createAttachmentFromFile,
  getFileExtension,
  getSupportedRecorderMimeType,
} from '@/lib/chatAttachments';

type BrowserSpeechRecognitionConstructor = new () => BrowserSpeechRecognition;

interface BrowserSpeechRecognitionEvent {
  results: {
    length: number;
    [index: number]: {
      isFinal: boolean;
      length: number;
      [index: number]: {
        transcript: string;
      };
    };
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
}

export interface SpeechCaptureResult {
  transcript: string;
  audioFile: AttachedFile | null;
}

type SpeechMode = 'dictation' | 'record';

interface UseSpeechRecognitionReturn {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
}

const AUDIO_CANDIDATES = [
  'audio/webm;codecs=opus',
  'audio/webm',
  'audio/mp4',
  'audio/ogg;codecs=opus',
  'audio/ogg',
];

export function useSpeechRecognition(
  onResult?: (result: SpeechCaptureResult) => void,
  mode: SpeechMode = 'record'
): UseSpeechRecognitionReturn {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);

  const speechRecognitionConstructor =
    typeof window !== 'undefined'
      ? ((window as Window & {
          SpeechRecognition?: BrowserSpeechRecognitionConstructor;
          webkitSpeechRecognition?: BrowserSpeechRecognitionConstructor;
        }).SpeechRecognition ??
        (window as Window & {
          SpeechRecognition?: BrowserSpeechRecognitionConstructor;
          webkitSpeechRecognition?: BrowserSpeechRecognitionConstructor;
        }).webkitSpeechRecognition)
      : undefined;

  const isSupported =
    mode === 'dictation'
      ? typeof window !== 'undefined' && typeof speechRecognitionConstructor !== 'undefined'
      : typeof window !== 'undefined' &&
        !!navigator.mediaDevices?.getUserMedia &&
        typeof MediaRecorder !== 'undefined';

  const cleanup = useCallback(() => {
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current = null;
    mediaRecorderRef.current = null;
    audioChunksRef.current = [];
    recognitionRef.current = null;
  }, []);

  const startListening = useCallback(() => {
    if (!isSupported) {
      setError(mode === 'dictation'
        ? 'Voice typing is not supported in this browser.'
        : 'Voice recording is not supported in this browser.');
      return;
    }

    if (mode === 'dictation') {
      setError(null);
      setTranscript('');

      if (!speechRecognitionConstructor) {
        setError('Voice typing is not supported in this browser.');
        return;
      }

      const recognition = new speechRecognitionConstructor();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        let nextTranscript = '';
        for (let index = 0; index < event.results.length; index += 1) {
          nextTranscript += event.results[index][0]?.transcript ?? '';
        }

        const normalizedTranscript = nextTranscript.trim();
        setTranscript(normalizedTranscript);

        const lastResult = event.results[event.results.length - 1];
        if (lastResult?.isFinal && normalizedTranscript) {
          onResult?.({
            transcript: normalizedTranscript,
            audioFile: null,
          });
        }
      };

      recognition.onerror = (event) => {
        setIsListening(false);
        if (event.error !== 'no-speech' && event.error !== 'aborted') {
          setError('Could not capture voice typing. Please try again.');
        }
        cleanup();
      };

      recognition.onend = () => {
        setIsListening(false);
        cleanup();
      };

      recognition.start();
      return;
    }

    void (async () => {
      setError(null);
      setTranscript('');
      audioChunksRef.current = [];

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;

        const mimeType = getSupportedRecorderMimeType(AUDIO_CANDIDATES, 'audio/webm');
        const recorder = new MediaRecorder(stream, { mimeType });
        mediaRecorderRef.current = recorder;

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        recorder.onstart = () => {
          setIsListening(true);
        };

        recorder.onstop = () => {
          setIsListening(false);

          const audioBlob = new Blob(audioChunksRef.current, {
            type: recorder.mimeType || mimeType || 'audio/webm',
          });

          if (audioBlob.size === 0) {
            setError('Could not process the voice message.');
            cleanup();
            return;
          }

          try {
            const resolvedMimeType = audioBlob.type || mimeType || 'audio/webm';
            const extension = getFileExtension(resolvedMimeType, 'webm');

            void createAttachmentFromFile(audioBlob, {
              name: `voice-message-${Date.now()}.${extension}`,
              type: resolvedMimeType,
              source: 'voice',
            }).then((audioFile) => {
              onResult?.({
                transcript: '',
                audioFile,
              });
            });
          } catch {
            setError('Could not process the voice message.');
          } finally {
            cleanup();
          }
        };

        recorder.start(250);
      } catch (recordingError) {
        setIsListening(false);
        setError('Microphone permission denied. Please allow microphone access.');
        cleanup();
        console.error('Voice recording failed:', recordingError);
      }
    })();
  }, [cleanup, isSupported, mode, onResult, speechRecognitionConstructor]);

  const stopListening = useCallback(() => {
    if (mode === 'dictation') {
      const recognition = recognitionRef.current;
      if (recognition) {
        recognition.stop();
      } else {
        setIsListening(false);
        cleanup();
      }
      return;
    }

    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== 'inactive') {
      if (recorder.state === 'recording') {
        try {
          recorder.requestData();
        } catch {
          // Some browsers may not support requestData during stop flow.
        }
      }
      recorder.stop();
    } else {
      setIsListening(false);
      cleanup();
    }
  }, [cleanup, mode]);

  return {
    isListening,
    isSupported,
    transcript,
    error,
    startListening,
    stopListening,
  };
}
