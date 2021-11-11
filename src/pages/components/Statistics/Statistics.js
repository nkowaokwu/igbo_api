import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Statistics = () => {
  const [contributorDetails, setContributorsDetails] = useState(null);

  useEffect(() => {
    axios
      .get('https://api.github.com/repos/ijemmao/igbo_api/contributors')
      .then((response) => {
        setContributorsDetails(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <div>
      <div className="flex bg-gray-200">
        <div className="flex-auto text-gray-700 text-center custom-border bg-gray-400 px-4 py-4 m-8">
          <h1 className="text-6xl">8,000+</h1>
          Words in the database
        </div>
        <div className="flex-auto text-gray-700 text-center custom-border bg-gray-400 px-4 py-2 m-8">
          <h1 className="text-6xl">2,000+</h1>
          Example sentences
        </div>

        <div className="flex text-gray-700 text-center custom-border bg-gray-400 px-4 py-2 m-8">
          <div className="flex-auto text-gray-700 px-4 py-2 m-2">
            <h1 className="text-6xl">750+</h1>
            Audio pronunciations for words
          </div>
          <div className="flex-auto text-gray-700 px-4 py-2 m-2">
            <h1 className="text-6xl">250+</h1>
            Words marked as Central Igbo
          </div>
        </div>
      </div>
      <div className="flex bg-gray-200">
        <div className="flex text-gray-700 text-center custom-border bg-gray-400 px-4 py-2 m-8">
          <div className="flex-auto text-gray-700 px-4 py-2 m-2">
            {contributorDetails && <h1 className="text-6xl">{contributorDetails.length}+</h1>}
            Github Contributors
          </div>
          <div className="grid grid-rows-2 grid-flow-col gap-0">
            {contributorDetails &&
              contributorDetails.slice(0, 10).map((contr) => (
                <div>
                  <img
                    src={contr.avatar_url}
                    className=" text-gray-700 bg-gray-400  w-12  m-2 rounded-full"
                    alt="github avatar"
                  />
                </div>
              ))}
          </div>
        </div>
        <div className="text-gray-700 text-center custom-border w-64 bg-gray-400 px-4 py-4 m-8">
          <h1 className="text-6xl">80+</h1>
          Members in the Slack
        </div>
        <div className=" text-gray-700 text-center custom-border w-64 bg-gray-400 px-4 py-2 m-8">
          <h1 className="text-6xl">16+</h1>
          GitHub stars
        </div>
      </div>
    </div>
  );
};

Statistics.defaultProps = {
  title: '',
  description: '',
};

export default Statistics;
