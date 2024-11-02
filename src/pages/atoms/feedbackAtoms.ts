import { atom } from 'jotai';
import Feedback from '../../shared/constants/Feedback';

/**
 * Atoms for feedback logic.
 */

export const feedbackAtom = atom(Feedback.UNSPECIFIED);
export const isFeedbackSubmittedAtom = atom(false);
export const humanTranscriptionAtom = atom('');
