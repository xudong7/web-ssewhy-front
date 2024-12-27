import request from "@/utils/request";

/**
 * 获取文章列表
 * @returns {*}
 */
export function getArticleList() {
  return request.get('/article');
}

/**
 * 获取id对应文章
 * @param id
 * @returns {*}
 */
export function getArticleById(id) {
  return request.get(`/article/${id}`);
}
