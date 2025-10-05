import axios from "axios";


const API = axios.create({
  baseURL: "http://192.168.100.177:8000", 
});

API.interceptors.request.use(async (config) => {
  const token = global.authToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
