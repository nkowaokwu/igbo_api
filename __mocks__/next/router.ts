import * as next from 'next/dist/client/router';

export const useRouter = jest.fn(() => ({
  push: jest.fn(),
}));

export default next;
