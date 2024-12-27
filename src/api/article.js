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

/**
 * 发布文章
 * @param data
 * @returns {*}
 */
export function publishArticle(data) {
  return request.post('/article', data);
}
