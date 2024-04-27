import mongoose from 'mongoose';
export { Types, Schema, Document } from 'mongoose';
import Plan from '../src/shared/constants/Plan';

export class Model {
  local = {};
  constructor(value: object) {
    this.local = { ...value, toJSON: () => value, id: 'static', plan: Plan.STARTER };
  }

  static find() {
    return [];
  }

  static findOne() {
    return {
      id: 'static',
      type: 'static',
      toJSON: () => ({ id: 'static', type: 'static' }),
      save: () => ({
        id: 'static',
        type: 'static',
        toJSON: () => ({
          id: 'static',
          type: 'static',
        }),
      }),
    };
  }

  save() {
    return { ...this.local, save: () => ({ ...this.local, toJSON: () => this.local }) };
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
