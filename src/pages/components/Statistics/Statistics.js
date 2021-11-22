import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GITHUB_CONTRIBUTORS } from '../../../siteConstants';
import Stat from './Stat';

const Statistics = () => {
  const [contributorDetails, setContributorsDetails] = useState(null);

  useEffect(() => {
    axios
      .get(`${GITHUB_CONTRIBUTORS}`)
      .then((response) => {
        setContributorsDetails(response.data);
      })
      .catch(() => {});
  }, []);
  return (
    <div>
      <div className="flex flex-col lg:flex-row flex-wrap justify-center items-center bg-gray-200 py-6">
        {/* TODO: dynamically pull all data */}
        <Stat value="8,000" header="Words in the database" />
        <Stat value="2,000" header="Example Igbo sentences" />
        <Stat value="1,400" header="Word audio pronunciations" />
        <Stat value="500" header="Standard Igbo words" />
      </div>
      <div className="flex flex-col lg:flex-row flex-wrap justify-center items-center bg-gray-200 py-6">
        {contributorDetails ? (
          <Stat value={contributorDetails.length} header="GitHub Contributors">
            <div className="flex flex-row flex-wrap justify-center items-center">
              {contributorDetails.slice(0, 10).map((contributor) => (
                <div>
                  <img
                    src={contributor.avatar_url}
                    className=" text-gray-700 bg-gray-400  w-12  m-2 rounded-full"
                    alt="github avatar"
                  />
                </div>
              ))}
            </div>
          </Stat>
        ) : null}
        <Stat value="80" header="Members in Slack" />
        {/* TODO: dynamically pull data */}
        <Stat value="16" header="GitHub stars" />
      </div>
    </div>
  );
};

Statistics.defaultProps = {
  title: '',
  description: '',
};

export default Statistics;
