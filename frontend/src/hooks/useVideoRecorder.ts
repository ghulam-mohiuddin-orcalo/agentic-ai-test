'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { AttachedFile } from '@/store/slices/chatSlice';
import {
  createAttachmentFromFile,
  getFileExtension,
  getSupportedRecorderMimeType,
} from '@/lib/chatAttachments';

type CameraFacingMode = 'user' | 'environment';

const VIDEO_CANDIDATES = [
  'video/webm;codecs=vp9,opus',
  'video/webm;codecs=vp8,opus',
  'video/webm',
  'video/mp4',
];

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
  const videoTrackEndedHandlerRef = useRef<(() => void) | null>(null);

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
    const [videoTrack] = mediaStreamRef.current?.getVideoTracks() ?? [];
    if (videoTrack && videoTrackEndedHandlerRef.current) {
      videoTrack.removeEventListener('ended', videoTrackEndedHandlerRef.current);
      videoTrackEndedHandlerRef.current = null;
    }

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

  useEffect(() => cleanupStream, [cleanupStream]);

  const openCamera = useCallback(
    async (mode?: CameraFacingMode) => {
      if (!isSupported) {
        setError('Camera recording is not supported in this browser.');
        return false;
      }

      const targetMode = mode ?? facingMode;
      setError(null);

      try {
        cleanupStream();

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: targetMode } },
          audio: true,
        });

        const [videoTrack] = stream.getVideoTracks();
        const endedHandler = () => {
          setError('Camera preview ended. Please start again.');
          cleanupStream();
        };

        videoTrack?.addEventListener('ended', endedHandler);
        videoTrackEndedHandlerRef.current = endedHandler;
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
    },
    [cleanupStream, facingMode, isSupported]
  );

  const startRecording = useCallback(async () => {
    const ready = mediaStreamRef.current ? true : await openCamera();
    if (!ready || !mediaStreamRef.current) {
      return false;
    }

    chunksRef.current = [];
    setRecordedVideo(null);
    setElapsedSeconds(0);
    setError(null);

    try {
      const mimeType = getSupportedRecorderMimeType(VIDEO_CANDIDATES, 'video/webm');
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
          setElapsedSeconds((previous) => previous + 1);
        }, 1000);
      };

      recorder.start(250);
      return true;
    } catch (recordingError) {
      console.error('Video recording failed:', recordingError);
      setError('Could not start video recording.');
      cleanupStream();
      return false;
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
      const recordedDuration = elapsedSeconds;

      recorder.onstop = () => {
        const videoBlob = new Blob(chunksRef.current, {
          type: recorder.mimeType || 'video/webm',
        });

        stopLivePreview();
        mediaRecorderRef.current = null;

        if (videoBlob.size === 0) {
          setError('Could not process the recorded video.');
          resolve(null);
          return;
        }

        const extension = getFileExtension(videoBlob.type, 'webm');

        void createAttachmentFromFile(videoBlob, {
          name: `video-message-${Date.now()}.${extension}`,
          type: videoBlob.type || 'video/webm',
          source: 'video',
          durationSeconds: recordedDuration,
        })
          .then((file) => {
            setRecordedVideo(file);
            resolve(file);
          })
          .catch(() => {
            setError('Could not process the recorded video.');
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
  }, [elapsedSeconds, recordedVideo, stopLivePreview, stopTimer]);

  const closeRecorder = useCallback(() => {
    setRecordedVideo(null);
    chunksRef.current = [];
    cleanupStream();
  }, [cleanupStream]);

  const retakeRecording = useCallback(async () => {
    setRecordedVideo(null);
    chunksRef.current = [];
    setElapsedSeconds(0);
    return startRecording();
  }, [startRecording]);

  const switchCamera = useCallback(async () => {
    const nextMode: CameraFacingMode = facingMode === 'user' ? 'environment' : 'user';
    const reopened = await openCamera(nextMode);
    if (reopened && isRecording) {
      await startRecording();
    }
  }, [facingMode, isRecording, openCamera, startRecording]);

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
