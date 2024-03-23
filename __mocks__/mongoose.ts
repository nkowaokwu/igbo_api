import mongoose from 'mongoose';
export { Types, Schema, Document } from 'mongoose';

export class Model {
  local = {};
  constructor(value: object) {
    this.local = value;
  }

  static find() {
    return [];
  }

  static findOne() {
    return {
      type: 'static',
      toJSON: () => ({ type: 'static' }),
      save: () => ({ type: 'static' }),
    };
  }

  save() {
    return { ...this.local, save: () => this.local };
  }
}

export const closeMock = jest.fn();
export const modelMock = jest.fn(() => Model);
const connection = {
  readyState: 1,
  close: closeMock,
  model: modelMock,
};

export default {
  ...mongoose,
  connection,
  createConnection: jest.fn(() => connection),
  on: jest.fn(),
};
