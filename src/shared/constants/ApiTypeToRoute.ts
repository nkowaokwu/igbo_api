import ApiType from './ApiType';

const ApiTypeToRoute = {
  [ApiType.SPEECH_TO_TEXT]: 'speech-to-text',
  [ApiType.TRANSLATE]: 'translate',
};

export default ApiTypeToRoute;
