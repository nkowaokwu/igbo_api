import { Schema } from 'mongoose';
import LanguageEnum from '../shared/constants/LanguageEnum';
import SearchSourceEnum from '../shared/constants/SearchSourceEnum';
import { toJSONPlugin, toObjectPlugin } from './plugins';

export const searchSchema = new Schema(
  {
    term: { type: String, required: true },
    normalizedTerm: { type: String, required: true },
    language: { type: String, enum: [LanguageEnum.ENGLISH, LanguageEnum.IGBO], required: true },
    source: { type: String, enum: Object.values(SearchSourceEnum), required: true },
    noResultsFound: { type: Boolean, required: true },
    searchedAt: { type: Date, default: Date.now },
  },
  { toObject: toObjectPlugin }
);

searchSchema.index({ normalizedTerm: 1, language: 1 });
searchSchema.index({ searchedAt: 1 });

toJSONPlugin(searchSchema);
