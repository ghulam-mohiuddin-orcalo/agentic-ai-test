'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { AttachedFile } from '@/store/slices/chatSlice';

type CameraFacingMode = 'user' | 'environment';

function getSupportedVideoMimeType(): string {
  const candidates = [
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm',
    'video/mp4',
  ];

  for (const mimeType of candidates) {
    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(mimeType)) {
      return mimeType;
    }
  }

  return 'video/webm';
}

function readBlobAsDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

export function useVideoRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewStream, setPreviewStream] = useState<MediaStream | null>(null);
  const [recordedVideo, setRecordedVideo] = useState<AttachedFile | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [facingMode, setFacingMode] = useState<CameraFacingMode>('user');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
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

  const stopLivePreview = useCallback(() => {
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current = null;
    setPreviewStream(null);
  }, []);

  const cleanupStream = useCallback(() => {
    stopLivePreview();
    mediaRecorderRef.current = null;
    setPreviewStream(null);
    setIsCameraOpen(false);
    setIsRecording(false);
    stopTimer();
    setElapsedSeconds(0);
  }, [stopLivePreview, stopTimer]);

  useEffect(() => {
    return () => {
      cleanupStream();
    };
  }, [cleanupStream]);

  const openCamera = useCallback(async (mode?: CameraFacingMode) => {
    if (!isSupported) {
      setError('Camera recording is not supported in this browser.');
      return false;
    }

    const targetMode = mode ?? facingMode;
    setError(null);

    try {
      stopTimer();
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: targetMode } },
        audio: true,
      });

      mediaStreamRef.current = stream;
      setPreviewStream(stream);
      setIsCameraOpen(true);
      setFacingMode(targetMode);
      return true;
    } catch (cameraError) {
      console.error('Camera access failed:', cameraError);
      setError('Camera permission denied. Please allow camera and microphone access.');
      cleanupStream();
      return false;
    }
  }, [cleanupStream, facingMode, isSupported, stopTimer]);

  const startRecording = useCallback(async () => {
    const ready = mediaStreamRef.current ? true : await openCamera();
    if (!ready || !mediaStreamRef.current) {
      return;
    }

    chunksRef.current = [];
    setRecordedVideo(null);
    setElapsedSeconds(0);

    try {
      const mimeType = getSupportedVideoMimeType();
      const recorder = new MediaRecorder(mediaStreamRef.current, { mimeType });
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
    } catch (recordingError) {
      console.error('Video recording failed:', recordingError);
      setError('Could not start video recording.');
      cleanupStream();
    }
  }, [cleanupStream, openCamera, stopTimer]);

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

        stopLivePreview();
        mediaRecorderRef.current = null;

        if (videoBlob.size === 0) {
          resolve(null);
          return;
        }

        void readBlobAsDataUrl(videoBlob)
          .then((dataUrl) => {
            const file: AttachedFile = {
              name: `webcam-video-${Date.now()}.webm`,
              type: videoBlob.type || 'video/webm',
              size: videoBlob.size,
              dataUrl,
              source: 'upload',
            };
            setRecordedVideo(file);
            resolve(file);
          })
          .catch(() => {
            setError('Could not process the recorded video.');
            resolve(null);
          });
      };

      if (recorder.state === 'recording') {
        recorder.requestData();
      }
      recorder.stop();
    });
  }, [recordedVideo, stopLivePreview, stopTimer]);

  const closeRecorder = useCallback(() => {
    setRecordedVideo(null);
    cleanupStream();
    chunksRef.current = [];
  }, [cleanupStream]);

  const retakeRecording = useCallback(async () => {
    setRecordedVideo(null);
    chunksRef.current = [];
    setElapsedSeconds(0);
    await startRecording();
  }, [startRecording]);

  const switchCamera = useCallback(async () => {
    const nextMode: CameraFacingMode = facingMode === 'user' ? 'environment' : 'user';
    await openCamera(nextMode);
  }, [facingMode, openCamera]);

  return {
    isSupported,
    isRecording,
    isCameraOpen,
    previewStream,
    recordedVideo,
    elapsedSeconds,
    facingMode,
    error,
    openCamera,
    startRecording,
    stopRecording,
    closeRecorder,
    retakeRecording,
    switchCamera,
  };
}
