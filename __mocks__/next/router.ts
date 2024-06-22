import * as next from 'next/dist/client/router';

export const routerPushMock = jest.fn();
export const useRouter = jest.fn(() => ({
  push: routerPushMock,
}));

export default next;
