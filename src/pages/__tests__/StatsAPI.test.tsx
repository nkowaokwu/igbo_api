import * as axios from 'axios';
import {
  getGitHubContributors,
  getGitHubStars,
  getDatabaseStats,
  getWords,
  getStats,
} from '../StatsAPI';
import { API_ROUTE, GITHUB_CONTRIBUTORS, GITHUB_STARS } from '../siteConstants';
import { axiosResponseFixture } from '../../../__tests__/shared/uiFixtures';

jest.mock('axios');

describe('App', () => {
  it('gets the github contributors ', async () => {
    const axiosSpy = jest
      .spyOn(axios, 'default')
      .mockResolvedValue(axiosResponseFixture({ data: [] }));
    expect(await getGitHubContributors()).toEqual([]);
    expect(axiosSpy).toHaveBeenCalledWith({
      method: 'GET',
      url: GITHUB_CONTRIBUTORS,
      headers: {},
    });
  });

  it('gets the github stars', async () => {
    const axiosSpy = jest
      .spyOn(axios, 'default')
      .mockResolvedValue(axiosResponseFixture({ data: 0 }));
    expect(await getGitHubStars()).toEqual(0);
    expect(axiosSpy).toHaveBeenCalledWith({
      method: 'GET',
      url: GITHUB_STARS,
      headers: {},
    });
  });

  it('gets the database stats', async () => {
    const axiosSpy = jest
      .spyOn(axios, 'default')
      .mockResolvedValue(axiosResponseFixture({ data: 0 }));
    expect(await getDatabaseStats()).toEqual({});
    expect(axiosSpy).toHaveBeenCalledWith({
      method: 'GET',
      url: `${API_ROUTE}/api/v1/stats`,
      headers: {
        'X-API-Key': 'main_key',
      },
    });
  });

  it('gets the database stats', async () => {
    const axiosSpy = jest
      .spyOn(axios, 'default')
      .mockResolvedValue(axiosResponseFixture({ data: 0 }));
    expect(await getWords('eat', '&dialects=true&examples=true')).toEqual({});
    expect(axiosSpy).toHaveBeenCalledWith({
      method: 'GET',
      url: `${API_ROUTE}/api/v1/words?keyword=eat&dialects=true&examples=true`,
      headers: {
        'X-API-Key': 'main_key',
      },
    });
  });
});
