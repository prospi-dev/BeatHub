import api from './axios';

export const getNewReleases = async () => {
  const response = await api.get('/new-releases');
  return response.data;
};

export const search = async (query, type) => {
  const response = await api.get(`/search?q=${query}&type=${type}`);
  return response.data;
};
