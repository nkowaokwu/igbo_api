import axios from 'axios';
import {
  requestFixture,
  responseFixture,
  nextFunctionFixture,
} from '../../__tests__/shared/fixtures';
import { MAIN_KEY } from '../../../__tests__/shared/constants';
import { getTranslation } from '../translation';

describe('translation', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('calls Nkọwa okwu ML translation server', async () => {
    const req = requestFixture({
      body: { text: 'aka', sourceLanguageCode: 'ibo', destinationLanguageCode: 'eng' },
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': MAIN_KEY,
      },
    });
    const res = responseFixture();
    const next = nextFunctionFixture();
    jest.spyOn(axios, 'request').mockResolvedValue({
      data: { text: 'aka', sourceLanguageCode: 'ibo', destinationLanguageCode: 'eng' },
    });
    await getTranslation(req, res, next);
    expect(res.send).toHaveBeenCalled();
  });

  it('throws validation error when input is too long', async () => {
    const req = requestFixture({
      body: { text: 'aka'.repeat(100), sourceLanguageCode: 'ibo', destinationLanguageCode: 'eng' },
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': MAIN_KEY,
      },
    });
    const res = responseFixture();
    const next = nextFunctionFixture();
    jest.spyOn(axios, 'request').mockResolvedValue({
      data: { text: 'aka'.repeat(100), sourceLanguageCode: 'ibo', destinationLanguageCode: 'eng' },
    });
    await getTranslation(req, res, next);
    expect(next).toHaveBeenCalledWith(
      new Error('Cannot translate text greater than 120 characters')
    );
  });
  it('throws validation error when input string is empty', async () => {
    const req = requestFixture({
      body: { text: '', sourceLanguageCode: 'ibo', destinationLanguageCode: 'eng' },
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': MAIN_KEY,
      },
    });
    const res = responseFixture();
    const next = nextFunctionFixture();
    jest.spyOn(axios, 'request').mockResolvedValue({
      data: { text: '', sourceLanguageCode: 'ibo', destinationLanguageCode: 'eng' },
    });
    await getTranslation(req, res, next);
    expect(next).toHaveBeenCalledWith(new Error('Cannot translate empty string'));
  });
  it('throws validation error for unsupported language combinations', async () => {
    const req = requestFixture({
      body: { text: 'aka', sourceLanguageCode: 'ibo', destinationLanguageCode: 'hau' },
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': MAIN_KEY,
      },
    });
    const res = responseFixture();
    const next = nextFunctionFixture();
    jest.spyOn(axios, 'request').mockResolvedValue({
      data: { text: 'aka', sourceLanguageCode: 'ibo', destinationLanguageCode: 'hau' },
    });
    await getTranslation(req, res, next);
    expect(next).toHaveBeenCalledWith(new Error('ibo to hau translation is not yet supported'));
  });
  it('throws validation error for missing keys', async () => {
    const req = requestFixture({
      body: { text: 'aka' },
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': MAIN_KEY,
      },
    });
    const res = responseFixture();
    const next = nextFunctionFixture();
    jest.spyOn(axios, 'request').mockResolvedValue({
      data: { text: 'aka' },
    });
    await getTranslation(req, res, next);
    expect(next).toHaveBeenCalledWith(
      new Error(
        'Validation error: Required at "sourceLanguageCode"; Required at "destinationLanguageCode"'
      )
    );
  });
});
