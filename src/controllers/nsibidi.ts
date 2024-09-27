import mongoose, { Connection } from 'mongoose';
import { handleQueries, packageResponse } from './utils';
import { MiddleWare } from '../types/express';
import { searchNsibidiCharactersQuery } from './utils/queries';
import { findNsibidiCharactersWithMatch } from './utils/buildDocs';
import { nsibidiCharacterSchema } from '../models/NsibidiCharacter';
import { NsibidiCharacter } from '../types/nsibidiCharacter';

export const getNsibidiCharacters: MiddleWare = async (req, res, next) => {
  try {
    const { searchWord, version, skip, limit } = await handleQueries(req);

    const query = searchNsibidiCharactersQuery(searchWord);

    const { nsibidiCharacters: allNsibidiCharacters, contentLength } =
      await findNsibidiCharactersWithMatch({
        match: query,
        version,
      });
    const nsibidiCharacters = allNsibidiCharacters.slice(skip, skip + limit);

    return packageResponse({
      res,
      docs: nsibidiCharacters,
      contentLength,
      version,
    });
  } catch (err) {
    return next(err);
  }
};

export const getNsibidiCharacter: MiddleWare = async (req, res, next) => {
  try {
    const { id, version } = await handleQueries(req);

    const nsibidiCharacter = await findNsibidiCharactersWithMatch({
      match: { _id: new mongoose.Types.ObjectId(id) },
      version,
    }).then(async (data) => {
      if (!data.nsibidiCharacters[0]) {
        throw new Error('No word exists with the provided id.');
      }
      return data.nsibidiCharacters[0];
    });

    return packageResponse({
      res,
      docs: nsibidiCharacter,
      contentLength: 1,
      version,
    });
  } catch (err) {
    return next(err);
  }
};

/* Creates Nsibidi Character documents in MongoDB database for testing */
export const createNsibidiCharacter = async (data: NsibidiCharacter, connection: Connection) => {
  const Nsibidi = connection.model('NsibidiCharacter', nsibidiCharacterSchema);
  const nsibidi = new Nsibidi(data);
  await nsibidi.save();
};
