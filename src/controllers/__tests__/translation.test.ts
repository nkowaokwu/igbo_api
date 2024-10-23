import axios from 'axios';
import {
  requestFixture,
  responseFixture,
  nextFunctionFixture,
} from '../../../__tests__/shared/fixtures';
import { getTranslation } from '../translation';

describe('translation', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('calls Nkọwa okwu ML translation server', async () => {
    const req = requestFixture({
      body: { igbo: 'aka' },
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'main_key',
      },
    });
    const res = responseFixture();
    const next = nextFunctionFixture();
    jest.spyOn(axios, 'request').mockResolvedValue({
      data: { igbo: 'aka' },
    });
    await getTranslation(req, res, next);
    expect(res.send).toHaveBeenCalled();
  });

  it('throws validation error when input is too long', async () => {
    const req = requestFixture({
      body: { igbo: 'aka'.repeat(100) },
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'main_key',
      },
    });
    const res = responseFixture();
    const next = nextFunctionFixture();
    jest.spyOn(axios, 'request').mockResolvedValue({
      data: { igbo: 'aka'.repeat(100) },
    });
    await getTranslation(req, res, next);
    expect(next).toHaveBeenCalled();
  });
  it('throws validation error when input string is empty', async () => {
    const req = requestFixture({
      body: { igbo: '' },
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'main_key',
      },
    });
    const res = responseFixture();
    const next = nextFunctionFixture();
    jest.spyOn(axios, 'request').mockResolvedValue({
      data: { igbo: '' },
    });
    await getTranslation(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
