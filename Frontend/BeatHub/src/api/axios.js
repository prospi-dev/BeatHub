import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:7117/api/Spotify', 
});

export default api;
