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
