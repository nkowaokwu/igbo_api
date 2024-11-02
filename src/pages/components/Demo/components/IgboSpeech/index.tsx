import { useAtomValue } from 'jotai';
import { mediaBlobUrlAtom, predictionTextAtom } from '../../../../atoms';
import ConvertToTextButton from './components/ConvertToTextButton';
import ResultText from './components/ResultText';

const IgboSpeech = () => {
  const predictText = useAtomValue(predictionTextAtom);
  const mediaBlobUrl = useAtomValue(mediaBlobUrlAtom);
  return (
    <>
      <ResultText />
      <ConvertToTextButton
        mediaBlobUrl={mediaBlobUrl}
        hasPredicted={Boolean(mediaBlobUrl && predictText)}
      />
    </>
  );
};

export default IgboSpeech;
