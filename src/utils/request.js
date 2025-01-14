/*
 * @Author: xudong7 13433126742@163.com
 * @Date: 2024-12-26 22:38:02
 * @LastEditors: xudong7 13433126742@163.com
 * @LastEditTime: 2025-01-11 15:30:14
 * @FilePath: \front\src\utils\request.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// src/utils/request.js
import axios from "axios";
import { useUserStore } from "@/store/modules/user";
import { ElMessage } from "element-plus";

const request = axios.create({
  baseURL: "http://localhost:8080/api", // import.meta.env.VITE_APP_URL,
  timeout: 5000,
});

/**
 * 请求拦截器
 */
request.interceptors.request.use(
  (config) => {
    // pinia
    const userStore = useUserStore();
    const token = userStore.token;
    // const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("请求参数：", config);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/**
 * 响应拦截器
 */
request.interceptors.response.use(
  (response) => {
    console.log("响应数据：", response);
    return response;
  },
  (error) => {
    // 统一错误处理
    if (error.response) {
      switch (error.response.status) {
        case 400:
          console.error("请求参数错误");
          break;
        case 401:
          console.error("未授权，请登录");
          ElMessage.error("未授权，请登录");
          setTimeout(() => {
            window.location.href = "http://localhost:5173/login";
          }, 1000);
          break;
        case 403:
          console.error("拒绝访问");
          break;
        case 404:
          console.error("请求地址出错");
          break;
        case 408:
          console.error("请求超时");
          break;
        case 500:
          console.error("服务器内部错误");
          break;
        case 501:
          console.error("服务未实现");
          break;
        case 502:
          console.error("网关错误");
          break;
        case 503:
          console.error("服务不可用");
          break;
        case 504:
          console.error("网关超时");
          break;
        case 505:
          console.error("HTTP版本不受支持");
          break;
        default:
          console.error("网络错误");
      }
    }
    return Promise.reject(error);
  },
);

export default request;
