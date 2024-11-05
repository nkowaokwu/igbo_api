import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import Demo from '../../pages/components/Demo/Demo';
import TestContext from '../components/TestContext';

describe('Demo', () => {
  it('renders the demo for speech to text', async () => {
    const { findByText } = render(
      <TestContext>
        <Demo searchWord="word" />
      </TestContext>
    );

    await findByText('Record, upload, or select Igbo audio to transcribe into text');
    await findByText('Speaker 1');
    await findByText('Speaker 2');
    await findByText('Speaker 3');
    await findByText('Transcribe');
  });

  it('renders the demo for translate', async () => {
    const { findByText } = render(
      <TestContext>
        <Demo searchWord="word" />
      </TestContext>
    );

    userEvent.click(await findByText('Translate'));
    await findByText('Type in Igbo to see its English translation');
  });

  it('renders the demo for dictionary', async () => {
    const { findByText, findByPlaceholderText } = render(
      <TestContext>
        <Demo searchWord="word" />
      </TestContext>
    );

    userEvent.click(await findByText('Dictionary'));
    await findByPlaceholderText('⌨️ i.e. please or biko');
    await findByText('Dialects');
    await findByText('Examples');
    await findByText('Search');
    await findByText('Response');
  });
});
