import request from "@/utils/request";

/**
 * 获取全部评论
 * @param
 * @returns {*}
 */
export function getAllComments() {
  return request.get(`/comment`);
}

/**
 * 根据articleId获取评论
 * @param articleId
 * @returns {*}
 */
export function getCommentsByArticleId(articleId) {
  return request.get(`/comment/${articleId}`);
}

/**
 * 添加评论
 * @param comment
 * @returns {*}
 */
export function addComment(comment) {
  return request.post(`/comment`, comment);
}
