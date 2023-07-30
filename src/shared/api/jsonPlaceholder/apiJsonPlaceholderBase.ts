import axios from 'axios';

export const jsonPlaceholderAxiosInstance = axios.create({
  baseURL: process.env.SERVER_URL,
});

jsonPlaceholderAxiosInstance.interceptors.request.use(async (config) => {
  const token = 'some-token';

  config.headers.Authorization = `Token ${token}`;

  return config;
});
