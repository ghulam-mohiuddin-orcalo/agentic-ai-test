'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { AttachedFile } from '@/store/slices/chatSlice';
import {
  createAttachmentFromFile,
  getFileExtension,
  getSupportedRecorderMimeType,
} from '@/lib/chatAttachments';

const AUDIO_CANDIDATES = [
  'audio/webm;codecs=opus',
  'audio/webm',
  'audio/mp4',
  'audio/ogg;codecs=opus',
  'audio/ogg',
];

export function useVoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isSupported =
    typeof navigator !== 'undefined' &&
    !!navigator.mediaDevices?.getUserMedia &&
    typeof MediaRecorder !== 'undefined';

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const cleanup = useCallback(() => {
    stopTimer();
    recorderRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    chunksRef.current = [];
    setIsRecording(false);
    setElapsedSeconds(0);
  }, [stopTimer]);

  useEffect(() => cleanup, [cleanup]);

  const startRecording = useCallback(async () => {
    if (!isSupported) {
      setError('Voice recording is not supported in this browser.');
      return false;
    }

    setError(null);
    cleanup();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = getSupportedRecorderMimeType(AUDIO_CANDIDATES, 'audio/webm');
      const recorder = new MediaRecorder(stream, { mimeType });
      recorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstart = () => {
        setIsRecording(true);
        timerRef.current = setInterval(() => {
          setElapsedSeconds((previous) => previous + 1);
        }, 1000);
      };

      recorder.start(250);
      return true;
    } catch (recordingError) {
      console.error('Voice recording failed:', recordingError);
      setError('Microphone permission denied. Please allow microphone access.');
      cleanup();
      return false;
    }
  }, [cleanup, isSupported]);

  const stopRecording = useCallback(async () => {
    const recorder = recorderRef.current;
    if (!recorder || recorder.state === 'inactive') {
      return null;
    }

    stopTimer();

    return new Promise<AttachedFile | null>((resolve) => {
      const recordedDuration = elapsedSeconds;

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });

        if (blob.size === 0) {
          setError('Could not process the voice note.');
          cleanup();
          resolve(null);
          return;
        }

        const extension = getFileExtension(blob.type, 'webm');

        void createAttachmentFromFile(blob, {
          name: `voice-note-${Date.now()}.${extension}`,
          type: blob.type,
          source: 'voice',
          durationSeconds: recordedDuration,
        })
          .then((attachment) => {
            cleanup();
            resolve(attachment);
          })
          .catch(() => {
            setError('Could not process the voice note.');
            cleanup();
            resolve(null);
          });
      };

      try {
        recorder.requestData();
      } catch {
        // Ignore unsupported requestData implementations.
      }

      recorder.stop();
    });
  }, [cleanup, elapsedSeconds, stopTimer]);

  const cancelRecording = useCallback(() => {
    cleanup();
  }, [cleanup]);

  return {
    isSupported,
    isRecording,
    elapsedSeconds,
    error,
    startRecording,
    stopRecording,
    cancelRecording,
  };
}
