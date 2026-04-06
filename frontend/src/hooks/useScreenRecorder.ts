'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { AttachedFile } from '@/store/slices/chatSlice';

function readBlobAsDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

function getSupportedScreenMimeType(): string {
  const candidates = [
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm',
  ];

  for (const mimeType of candidates) {
    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(mimeType)) {
      return mimeType;
    }
  }

  return 'video/webm';
}

export function useScreenRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [previewStream, setPreviewStream] = useState<MediaStream | null>(null);
  const [recordedVideo, setRecordedVideo] = useState<AttachedFile | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isSupported =
    typeof navigator !== 'undefined' &&
    !!navigator.mediaDevices?.getDisplayMedia &&
    typeof MediaRecorder !== 'undefined';

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const stopPreview = useCallback(() => {
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current = null;
    setPreviewStream(null);
  }, []);

  const closeRecorder = useCallback(() => {
    stopTimer();
    stopPreview();
    mediaRecorderRef.current = null;
    chunksRef.current = [];
    setIsPickerOpen(false);
    setIsRecording(false);
    setElapsedSeconds(0);
    setRecordedVideo(null);
  }, [stopPreview, stopTimer]);

  useEffect(() => {
    return () => {
      stopTimer();
      stopPreview();
    };
  }, [stopPreview, stopTimer]);

  const startRecording = useCallback(async () => {
    if (!isSupported) {
      setError('Screen recording is not supported in this browser.');
      return;
    }

    setError(null);
    setRecordedVideo(null);
    chunksRef.current = [];
    setElapsedSeconds(0);

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      mediaStreamRef.current = stream;
      setPreviewStream(stream);
      setIsPickerOpen(true);

      const [videoTrack] = stream.getVideoTracks();
      videoTrack?.addEventListener('ended', () => {
        if (mediaRecorderRef.current?.state === 'recording') {
          if (mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.requestData();
            mediaRecorderRef.current.stop();
          }
        } else {
          closeRecorder();
        }
      });

      const recorder = new MediaRecorder(stream, { mimeType: getSupportedScreenMimeType() });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstart = () => {
        setIsRecording(true);
        stopTimer();
        timerRef.current = setInterval(() => {
          setElapsedSeconds((prev) => prev + 1);
        }, 1000);
      };

      recorder.start(250);
    } catch (screenError) {
      console.error('Screen recording failed:', screenError);
      setError('Screen sharing was cancelled or is unavailable.');
      closeRecorder();
    }
  }, [closeRecorder, isSupported, stopTimer]);

  const stopRecording = useCallback(async (): Promise<AttachedFile | null> => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state === 'inactive') {
      return recordedVideo;
    }

    setIsRecording(false);
    stopTimer();

    return new Promise((resolve) => {
      recorder.onstop = () => {
        const videoBlob = new Blob(chunksRef.current, {
          type: recorder.mimeType || 'video/webm',
        });

        stopPreview();
        mediaRecorderRef.current = null;

        if (videoBlob.size === 0) {
          resolve(null);
          return;
        }

        void readBlobAsDataUrl(videoBlob)
          .then((dataUrl) => {
            const file: AttachedFile = {
              name: `screen-recording-${Date.now()}.webm`,
              type: videoBlob.type || 'video/webm',
              size: videoBlob.size,
              dataUrl,
              source: 'upload',
            };
            setRecordedVideo(file);
            resolve(file);
          })
          .catch(() => {
            setError('Could not process the screen recording.');
            resolve(null);
          });
      };

      if (recorder.state === 'recording') {
        recorder.requestData();
      }

      recorder.stop();
    });
  }, [recordedVideo, stopPreview, stopTimer]);

  const retakeRecording = useCallback(async () => {
    setRecordedVideo(null);
    chunksRef.current = [];
    setElapsedSeconds(0);
    await startRecording();
  }, [startRecording]);

  return {
    isSupported,
    isRecording,
    isPickerOpen,
    previewStream,
    recordedVideo,
    elapsedSeconds,
    error,
    startRecording,
    stopRecording,
    retakeRecording,
    closeRecorder,
  };
}
