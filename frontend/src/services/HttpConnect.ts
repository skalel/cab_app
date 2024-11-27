import axios from "axios";

const HttpConnect = axios.create({
  baseURL: import.meta.env.APP_API_BASE_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

export default HttpConnect;