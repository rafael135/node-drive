import axios from "axios";
import { TOKEN_STORAGE_KEY } from "../contexts/UserContext";

const AxiosInstance = axios.create({ baseURL: "http://127.0.0.1:3333/api"});

AxiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(TOKEN_STORAGE_KEY);

        if(token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
    
)

export default AxiosInstance;