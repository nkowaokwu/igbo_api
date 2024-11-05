import { httpsCallable } from 'firebase/functions';
import { functions } from '../../services/firebase';
/**
 * Custom hook for using Firebase callable functions
 * @param name Name of the exported function in Firebase
 */
export const useCallable = (name: string, payload: any): any => {
  const callableFunction = httpsCallable(functions, name);
  return callableFunction(payload);
};
