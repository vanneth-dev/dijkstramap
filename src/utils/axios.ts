import axios from "axios";
import type { AxiosInstance } from "axios";
const APIURL = import.meta.env.VITE_API_URL || 'http://152.42.177.107:2025';
const Axios: AxiosInstance = axios.create({
  baseURL: APIURL + "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default Axios;
