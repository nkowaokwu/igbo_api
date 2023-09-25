import { Document, Types } from 'mongoose';

export type NsibidiCharacter = {
  nsibidi: string;
  definitions: { text: string }[];
  pronunciation: string;
  radicals: Types.ObjectId[] | string[];
  wordClass: string;
};

export interface NsibidiCharacterDocument extends NsibidiCharacter, Document<any> {
  _id: Types.ObjectId;
  __v: number;
  id: string;
}
