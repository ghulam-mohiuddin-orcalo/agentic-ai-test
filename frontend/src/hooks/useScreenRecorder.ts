'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { AttachedFile } from '@/store/slices/chatSlice';
import {
  createAttachmentFromFile,
  getFileExtension,
  getSupportedRecorderMimeType,
} from '@/lib/chatAttachments';

const SCREEN_CANDIDATES = [
  'video/webm;codecs=vp9,opus',
  'video/webm;codecs=vp8,opus',
  'video/webm',
];

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

  useEffect(() => closeRecorder, [closeRecorder]);

  const startRecording = useCallback(async () => {
    if (!isSupported) {
      setError('Screen recording is not supported in this browser.');
      return false;
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
          try {
            mediaRecorderRef.current.requestData();
          } catch {
            // Ignore unsupported requestData implementations.
          }
          mediaRecorderRef.current.stop();
        } else {
          closeRecorder();
        }
      });

      const recorder = new MediaRecorder(stream, {
        mimeType: getSupportedRecorderMimeType(SCREEN_CANDIDATES, 'video/webm'),
      });
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
          setElapsedSeconds((previous) => previous + 1);
        }, 1000);
      };

      recorder.start(250);
      return true;
    } catch (screenError) {
      console.error('Screen recording failed:', screenError);
      setError('Screen sharing was cancelled or is unavailable.');
      closeRecorder();
      return false;
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
      const recordedDuration = elapsedSeconds;

      recorder.onstop = () => {
        const videoBlob = new Blob(chunksRef.current, {
          type: recorder.mimeType || 'video/webm',
        });

        stopPreview();
        mediaRecorderRef.current = null;

        if (videoBlob.size === 0) {
          setError('Could not process the screen recording.');
          resolve(null);
          return;
        }

        const extension = getFileExtension(videoBlob.type, 'webm');

        void createAttachmentFromFile(videoBlob, {
          name: `screen-recording-${Date.now()}.${extension}`,
          type: videoBlob.type || 'video/webm',
          source: 'screen',
          durationSeconds: recordedDuration,
        })
          .then((file) => {
            setRecordedVideo(file);
            resolve(file);
          })
          .catch(() => {
            setError('Could not process the screen recording.');
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
  }, [elapsedSeconds, recordedVideo, stopPreview, stopTimer]);

  const retakeRecording = useCallback(async () => {
    setRecordedVideo(null);
    chunksRef.current = [];
    setElapsedSeconds(0);
    return startRecording();
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
