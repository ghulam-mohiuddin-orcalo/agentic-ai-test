import type { AttachedFile } from '@/store/slices/chatSlice';

const STORAGE_KEY = 'nexusai-composer-draft';

interface ComposerDraft {
  text: string;
  attachments: AttachedFile[];
}

let memoryDraft: ComposerDraft = {
  text: '',
  attachments: [],
};

export function readComposerDraft(): ComposerDraft {
  if (typeof window === 'undefined') {
    return memoryDraft;
  }

  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return memoryDraft;
    }

    const parsed = JSON.parse(saved) as ComposerDraft;
    memoryDraft = {
      text: parsed.text ?? '',
      attachments: Array.isArray(parsed.attachments) ? parsed.attachments : [],
    };
  } catch {
    // Ignore corrupt drafts and keep the in-memory copy.
  }

  return memoryDraft;
}

export function writeComposerDraft(draft: ComposerDraft) {
  memoryDraft = draft;

  if (typeof window === 'undefined') {
    return;
  }

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  } catch {
    // Ignore storage quota issues and keep the in-memory draft.
  }
}

export function clearComposerDraft() {
  memoryDraft = {
    text: '',
    attachments: [],
  };

  if (typeof window === 'undefined') {
    return;
  }

  sessionStorage.removeItem(STORAGE_KEY);
}
