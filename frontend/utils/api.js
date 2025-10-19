import axios from "axios";


const API = axios.create({
  baseURL: "http://192.168.1.44:4000", 
});

API.interceptors.request.use(async (config) => {
  const token = global.authToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
