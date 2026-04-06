import type { AttachedFile } from '@/store/slices/chatSlice';

let pendingVoiceMessage: AttachedFile | null = null;

export function setPendingVoiceMessage(file: AttachedFile) {
  pendingVoiceMessage = file;
}

export function consumePendingVoiceMessage(): AttachedFile | null {
  const file = pendingVoiceMessage;
  pendingVoiceMessage = null;
  return file;
}

export function peekPendingVoiceMessage(): AttachedFile | null {
  return pendingVoiceMessage;
}
