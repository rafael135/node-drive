import axios from "axios";

const AxiosInstance = axios.create({ baseURL: "http://127.0.0.1:3333/api"});

export default AxiosInstance;