import React, { ReactElement } from 'react';
import { configure } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import ChakraTheme from '../../shared/constants/ChakraTheme';

configure({ testIdAttribute: 'data-test' });

jest.mock('i18next');
jest.mock('next/router');
jest.mock('react-firebase-hooks/auth');
jest.mock('@chakra-ui/react');

global.fetch = jest.fn();
window.scrollTo = jest.fn();

Object.defineProperty(window, 'MediaRecorder', {
  writable: true,
  value: jest.fn().mockImplementation(() => ({
    start: jest.fn(),
    ondataavailable: jest.fn(),
    onerror: jest.fn(),
    state: '',
    stop: jest.fn(),
    pause: jest.fn(),
    resume: jest.fn(),
  })),
});

Object.defineProperty(MediaRecorder, 'isTypeSupported', {
  writable: true,
  value: () => true,
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

const queryClient = new QueryClient();

const TestContext = ({ children }: { children: ReactElement }) => (
  <QueryClientProvider client={queryClient}>
    <ChakraProvider theme={ChakraTheme}>{children}</ChakraProvider>
  </QueryClientProvider>
);

export default TestContext;
