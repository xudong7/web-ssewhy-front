import request from "@/utils/request";

/**
 * 获取验证码
 * @param checkKey
 */
export function getCodeInfo(checkKey) {
  return request({
    method: "get",
    url: "",
  });
}

/**
 * 获取id对应的用户信息
 * @param id
 * @returns {*}
 */
export function getUserInfoById(userId) {
  return request.get(`/user/${userId}`);
}
/**
 * 获取全部用户
 */
export function getAllUsers() {
  return request.get(`/user`);
}

/**
 * 登录
 * @param data
 * @returns {*}
 */
export function login(data) {
  return request.post(`/login`, data);
}

/**
 * 注册
 * @param data
 * @returns {*}
 */
export function register(data) {
  return request.post(`/register`, data);
}

/**
 * 更新用户信息
 * @param data
 * @returns {*}
 */
export function updateUserInfo(data) {
  return request.put(`/user`, data);
}

/**
 * 处理收藏夹
 * @param userId
 * @param articleId
 * @returns {*}
 */
export function handleCollection(userId, articleId) {
  return request.post(`/user/collect?userId=${userId}&articleId=${articleId}`);
}

/**
 * 处理关注
 * @param userId
 * @param fanId
 * @returns {*}
 */
export function handleFollow(userId, fanId) {
  return request.post(`/user/fan?userId=${userId}&fanId=${fanId}`);
}

/**
 * 修改用户密码
 * @param id 用户ID
 * @param oldPassword 旧密码
 * @param newPassword 新密码
 * @returns {*}
 */
export function updateUserPassword(id, oldPassword, newPassword) {
  return request.put(
    `/user/password?id=${id}&oldPassword=${oldPassword}&newPassword=${newPassword}`
  );
}
