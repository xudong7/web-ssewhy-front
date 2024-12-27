// src/utils/request.js
import axios from "axios";

const request = axios.create({
    baseURL: 'http://localhost:8080/api', // import.meta.env.VITE_APP_URL,
    timeout: 5000,
});
/**
 * 请求拦截器
 */
request.interceptors.request.use(
    (config) => {
        console.log("请求参数：", config);
        return config; // 确保返回 config
    },
    (error) => {
        return Promise.reject(error);
    }
);
/**
 * 响应拦截器
 */
request.interceptors.response.use(
    (response) => {
        console.log("响应参数：", response);
        return response; // 确保返回 response
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default request;
