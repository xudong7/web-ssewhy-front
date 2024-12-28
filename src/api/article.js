import request from "@/utils/request";

/**
 * ��ȡ�����б�
 * @returns {*}
 */
export function getArticleList() {
  return request.get("/article");
}

/**
 * ��ȡid��Ӧ����
 * @param id
 * @returns {*}
 */
export function getArticleById(id) {
  return request.get(`/article/${id}`);
}

/**
 * ��������
 * @param data
 * @returns {*}
 */
export function publishArticle(data) {
  return request.post("/article", data);
}
