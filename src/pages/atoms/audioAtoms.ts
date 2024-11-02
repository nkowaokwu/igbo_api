import { atom } from 'jotai';

interface DefaultAudio {
  audioUrl: string;
  audioId: string;
}

/**
 * Atoms for audio logic.
 */

export const audioDataAtom = atom({ audioUrl: '' });
export const mediaBlobUrlAtom = atom('');
export const selectedDefaultAudioAtom = atom<DefaultAudio | undefined>(undefined);
