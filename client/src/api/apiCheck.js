import axios from "axios";

axios.defaults.withCredentials = true;
const API = axios.create({
  baseURL: "http://localhost:2000/api",
  withCredentials: true,
});

//attach token to every request

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
