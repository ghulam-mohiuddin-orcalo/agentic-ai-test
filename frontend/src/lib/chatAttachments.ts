import type { AttachedFile } from '@/store/slices/chatSlice';

export type AttachmentInputSource = AttachedFile['source'];

const MB = 1024 * 1024;

export const FILE_LIMITS = {
  document: 25 * MB,
  image: 12 * MB,
  audio: 20 * MB,
  video: 80 * MB,
};

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function inferAttachmentKind(type: string, source?: AttachmentInputSource): AttachedFile['kind'] {
  if (source === 'voice') return 'audio';
  if (source === 'screen') return 'screen';
  if (source === 'video') return 'video';
  if (type.startsWith('image/')) return 'image';
  if (type.startsWith('audio/')) return 'audio';
  if (type.startsWith('video/')) return 'video';
  return 'file';
}

export function validateSelectedFile(file: File, category: 'document' | 'image') {
  if (category === 'image') {
    if (!file.type.startsWith('image/')) {
      return 'Please choose an image file.';
    }

    if (file.size > FILE_LIMITS.image) {
      return 'Images must be smaller than 12 MB.';
    }

    return null;
  }

  if (file.type.startsWith('image/')) {
    return 'Use the image button for photos and screenshots.';
  }

  if (file.size > FILE_LIMITS.document) {
    return 'Files must be smaller than 25 MB.';
  }

  return null;
}

export function getSupportedRecorderMimeType(candidates: string[], fallback: string) {
  if (typeof MediaRecorder === 'undefined' || typeof MediaRecorder.isTypeSupported !== 'function') {
    return fallback;
  }

  return candidates.find((candidate) => MediaRecorder.isTypeSupported(candidate)) ?? fallback;
}

export function getFileExtension(mimeType: string, fallback: string) {
  if (mimeType.includes('ogg')) return 'ogg';
  if (mimeType.includes('mp4')) return 'mp4';
  if (mimeType.includes('mpeg')) return 'mp3';
  if (mimeType.includes('wav')) return 'wav';
  if (mimeType.includes('webm')) return 'webm';
  return fallback;
}

export function blobToDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

export async function createAttachmentFromFile(
  file: File | Blob,
  options: {
    name: string;
    type?: string;
    source?: AttachmentInputSource;
    durationSeconds?: number;
  }
): Promise<AttachedFile> {
  const resolvedType = options.type ?? file.type ?? 'application/octet-stream';
  const dataUrl = await blobToDataUrl(file);

  return {
    id: crypto.randomUUID(),
    name: options.name,
    type: resolvedType,
    size: file.size,
    dataUrl,
    kind: inferAttachmentKind(resolvedType, options.source),
    source: options.source ?? 'upload',
    durationSeconds: options.durationSeconds,
  };
}

export function isPreviewableVideo(file: AttachedFile) {
  return file.kind === 'video' || file.kind === 'screen';
}

export function isAudioAttachment(file: AttachedFile) {
  return file.kind === 'audio';
}
