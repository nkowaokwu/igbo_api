import { atom } from 'jotai';
import { DeveloperResponse } from '../../types';

export const developerAtom = atom<DeveloperResponse | undefined>(undefined);
