import { User } from 'firebase/auth';
import axiosBase, { AxiosPromise, AxiosRequestConfig } from 'axios';
import { auth } from '../../services/firebase';
import { Developer, DeveloperResponse } from '../../types';
import isProduction from '../utils/isProduction';

const API_ROUTE = !isProduction() ? 'http://localhost:8080' : 'https://igboapi.com';

export const createAuthorizationHeader = async (): Promise<string> => {
  const { currentUser } = auth;
  const accessToken = (await currentUser?.getIdToken?.()) || '';
  return `Bearer ${accessToken}`;
};

const createHeaders = async () => ({
  Authorization: await createAuthorizationHeader(),
});

export const axios = async <T>(config: AxiosRequestConfig): Promise<AxiosPromise<T>> =>
  axiosBase({
    ...config,
    url: `${API_ROUTE}${config.url}`,
    headers: {
      ...(config.headers || {}),
      ...(await createHeaders()),
    },
  });

/**
 * Creates a new Developer document in MongoDB
 * @param data Object include developer's name, email, and password
 * @returns
 */
export const postDeveloper = async (data: { [key: string]: string | number }) => {
  const res = await axios<{ message: string, apiKey: string }>({
    method: 'POST',
    url: '/api/v1/developers',
    data,
  });

  return res;
};

/**
 * Updates the existing Developer in MongoDB
 * @param user Object includes user's Firebase Id and email
 * @returns
 */
export const putDeveloper = async (user: Partial<User>) => {
  const res = await axios<{ message: string, developer: Developer }>({
    method: 'PUT',
    url: '/api/v1/developers',
    data: {
      firebaseId: user.uid,
      email: user.email,
      name: user.displayName,
    },
  });

  return res.data;
};

export const getDeveloper = async (firebaseId: string): Promise<DeveloperResponse> => {
  const res = await axios<DeveloperResponse>({
    method: 'GET',
    url: `/api/v1/developers/${firebaseId}`,
  });
  return res.data;
};
