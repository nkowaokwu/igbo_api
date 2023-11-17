import { ReactElement } from 'react';
import { configure } from '@testing-library/react';

configure({ testIdAttribute: 'data-test' });

jest.mock('i18next');
jest.mock('next/router');

const TestContext = ({ children }: { children: ReactElement }) => children;

export default TestContext;
