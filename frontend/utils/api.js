import axios from "axios";


const API = axios.create({
  baseURL: "http://192.168.1.44:10000", 
});

API.interceptors.request.use(async (config) => {
  const token = global.authToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;



// import axios from "axios";

// const API = axios.create({
//   baseURL: "https://library-it.onrender.com", 
// });

// API.interceptors.request.use(async (config) => {
//   const token = global.authToken;
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default API;
