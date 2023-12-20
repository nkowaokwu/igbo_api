import { configure } from '@testing-library/react';

configure({ testIdAttribute: 'data-test' });

jest.mock('i18next');
jest.mock('next/router');

const TestContext = ({ children }: { children: any }) => children;

export default TestContext;
