import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";

const HttpConnect = axios.create({
  baseURL: import.meta.env.APP_API_BASE_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

HttpConnect.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const errorMessage = error.response?.data?.error_description || "Ocorreu um erro desconhecido!";
    toast.error(errorMessage);
    return Promise.reject(error);
  }
);

export default HttpConnect;