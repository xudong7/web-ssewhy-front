// src/api/problem.js
import request from "@/utils/request";

// 获取所有题目
export function getAllProblems() {
  return request({
    url: "/problem",
    method: "get",
  });
}

// 获取特定题目详情
export function getProblemById(id) {
  return request({
    url: `/problem/${id}`,
    method: "get",
  });
}
