import request from "@/utils/request";

/**
 * 获取上传的文件列表
 * @returns {Promise}
 */
export function getUploadedFiles() {
  return request.get("/upload/file");
}

/**
 * 下载文件（增加下载计数）
 * @param {number} fileId 文件ID
 * @returns {Promise}
 */
export function downloadFile(fileId) {
  return request.get(`/upload/file/${fileId}`);
}
