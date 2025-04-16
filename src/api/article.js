/*
 * @Author: xudong7 13433126742@163.com
 * @Date: 2024-12-28 19:28:12
 * @LastEditors: xudong7 13433126742@163.com
 * @LastEditTime: 2025-01-02 17:10:42
 * @FilePath: \front\src\api\article.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from "@/utils/request";

/**
 * 获取文章列表
 * @returns {*}
 */
export function getArticleList() {
  return request.get(`/article`);
}

/**
 * 获取id对应的文章
 * @param id
 * @returns {*}
 */
export function getArticleById(id) {
  return request.get(`/article/${id}`);
}

/**
 * 模糊搜索文章
 * @param keyword
 * @returns {*}
 */
export function searchArticle(keyword) {
  return request.get(`/article/search?keyword=${keyword}`);
}

/**
 * 获取搜索建议
 * @param keyword
 * @returns {*}
 */
export function getSearchSuggestions(keyword) {
  return request.get(`/search/suggestions?keyword=${keyword}`);
}

/**
 * 发布文章
 * @param data
 * @returns {*}
 */
export function publishArticle(data) {
  return request.post(`/article`, data);
}

/**
 * 处理喜欢
 * @param articleId
 * @param userId
 * @returns {*}
 */
export function handleLike(articleId, userId) {
  return request.post(`/article/like?articleId=${articleId}&userId=${userId}`);
}

/**
 * 上传图片
 * @param data
 * @returns {*}
 */
export function uploadImage(data) {
  return request.post(`/upload`, data);
}
