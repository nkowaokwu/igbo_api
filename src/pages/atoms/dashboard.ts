import { atom } from 'jotai';
import { Developer } from '../../types';

export const developerAtom = atom<Developer | undefined>(undefined);
