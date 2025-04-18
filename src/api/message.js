import request from "@/utils/request";

// 获取两个用户之间的消息历史
export function getMessageHistory(userId, otherUserId) {
  return request.get(`/messages?userId=${userId}&otherUserId=${otherUserId}`);
}

// 获取用户的聊天列表
export function getChatList(userId) {
  return request.get(`/chatList?userId=${userId}`);
}
