// src/api/code.js
import axios from "axios";

// 创建一个新的axios实例，因为代码运行API地址与项目API可能不同
const codeRequest = axios.create({
  baseURL: "http://localhost:2358",
  timeout: 10000,
});

// 添加认证信息到每个请求
codeRequest.interceptors.request.use(
  (config) => {
    // 为每个请求添加认证参数
    config.params = {
      ...config.params,
      "X-Auth-Token": "f6583e60-b13b-4228-b554-2eb332ca64e7",
      "X-Auth-User": "a1133bc6-a0f6-46bf-a2d8-6157418c6fe2",
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 提交代码运行
export function submitCodeRun(data) {
  return codeRequest({
    url: "/submissions",
    method: "post",
    data,
  });
}

// 获取代码运行结果
export function getCodeRunResult(token) {
  return codeRequest({
    url: `/submissions/${token}`,
    method: "get",
  });
}

// 比较输出与预期输出是否完全相同
export function compareOutputs(actual, expected) {
  if (!expected) return true;

  // 规范化输出内容，移除尾部空白字符
  const normalizeOutput = (output) => {
    if (!output) return "";
    return output.replace(/\r\n/g, "\n").trim();
  };

  const normalizedActual = normalizeOutput(actual);
  const normalizedExpected = normalizeOutput(expected);

  return normalizedActual === normalizedExpected;
}

// 根据不同语言获取对应的language_id
export function getLanguageId(language) {
  const languageMap = {
    javascript: "63", // Node.js
    python: "71", // Python 3
    java: "62", // Java
    cpp: "54", // C++
    c: "50", // C (gcc)
  };
  return languageMap[language.toLowerCase()] || "63"; // 默认返回JavaScript
}
