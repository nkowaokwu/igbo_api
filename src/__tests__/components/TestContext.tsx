import { ReactElement } from 'react';
import { configure } from '@testing-library/react';

configure({ testIdAttribute: 'data-test' });

jest.mock('i18next');
jest.mock('next/router');

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

const TestContext = ({ children }: { children: ReactElement }) => children;

export default TestContext;
