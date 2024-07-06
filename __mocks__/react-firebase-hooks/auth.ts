import { decodedIdTokenFixture } from '../../__tests__/shared/uiFixtures';

export const onAuthStateChanged = jest.fn(() => () => {});

export const useAuthState = jest.fn(() => [decodedIdTokenFixture(), false]);
