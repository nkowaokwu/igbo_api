import * as next from '../../node_modules/next/router';

export const useRouter = jest.fn(() => ({
  push: jest.fn(),
}));

export default next;
