import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Stat from './Stat';

const Statistics = ({
  totalWords,
  totalExamples,
  totalAudioPronunciations,
  totalStandardIgboWords,
  totalNsibidiWords,
  contributors,
  stars,
}) => {
  const { t } = useTranslation();
  const totalSlackMembers = 100;
  return (
    <div className="w-full flex flex-col justify-center items-center bg-gray-200 space-y-6">
      <div className="flex flex-row justify-center items-center flex-wrap w-full lg:w-9/12">
        <Stat value={totalWords} header={t('Words in the database').replace('{{number}}', totalWords)} />
        <Stat value={totalExamples} header={t('Example Igbo sentences').replace('{{number}}', totalExamples)} />
        <Stat
          value={totalAudioPronunciations}
          header={t('Word audio pronunciations').replace('{{number}}', totalAudioPronunciations)}
        />
        <Stat
          value={totalStandardIgboWords}
          header={t('Standard Igbo words').replace('{{number}}', totalStandardIgboWords)}
        />
        <Stat value={totalNsibidiWords} header={t('Words in Nsịbịdị').replace('{{number}}', totalNsibidiWords)} />
      </div>
      <div className="flex flex-row justify-center items-center flex-wrap w-full lg:w-9/12">
        {contributors ? (
          <Stat
            value={contributors.length}
            header={t('GitHub Contributors').replace('{{number}}', contributors.length)}
          >
            <div className="flex flex-row flex-wrap justify-center items-center">
              {contributors.slice(0, 10).map((contributor) => (
                <div key={contributor.avatar_url}>
                  <img
                    src={contributor.avatar_url}
                    className=" text-gray-700 bg-gray-400 w-12 m-2 rounded-full"
                    alt="github avatar"
                  />
                </div>
              ))}
            </div>
          </Stat>
        ) : null}
        <Stat
          value={totalSlackMembers}
          header={t('Members in Slack').replace('{{number}}', totalSlackMembers)}
          exact={false}
        />
        <Stat value={stars} header={t('GitHub stars').replace('{{number}}', stars)} />
      </div>
    </div>
  );
};

Statistics.propTypes = {
  totalWords: PropTypes.number,
  totalExamples: PropTypes.number,
  totalAudioPronunciations: PropTypes.number,
  totalStandardIgboWords: PropTypes.number,
  totalNsibidiWords: PropTypes.number,
  contributors: PropTypes.arrayOf(PropTypes.shape({})),
  stars: PropTypes.number,
};

Statistics.defaultProps = {
  totalWords: 0,
  totalExamples: 0,
  totalAudioPronunciations: 0,
  totalStandardIgboWords: 0,
  totalNsibidiWords: 0,
  contributors: [],
  stars: 0,
};

export default Statistics;
