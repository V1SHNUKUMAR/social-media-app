import axios from "axios";

const API_URL = import.meta.env.BACKEND_API_URL

export const makeRequest = axios.create({
  baseURL: API_URL || "http://localhost:8800/api/",
  withCredentials: true,
});
