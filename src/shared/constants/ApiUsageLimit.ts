import ApiType from './ApiType';

const ApiUsageLimit = {
  [ApiType.DICTIONARY]: 2500,
  [ApiType.SPEECH_TO_TEXT]: 20,
  [ApiType.TRANSLATE]: 5,
};

export default ApiUsageLimit;
