<template>
  <div class="chat-container">
    <!-- 聊天列表侧边栏 -->
    <div class="chat-sidebar">
      <div class="chat-header">
        <h3>消息列表</h3>
      </div>
      <div class="chat-list">
        <div
          class="chat-item"
          v-for="user in chatUsers"
          :key="user.id"
          :class="{ active: currentChatUser?.id === user.id }"
          @click="selectChat(user)"
        >
          <div class="avatar-container">
            <el-avatar
              :size="40"
              :src="
                user.avatar ||
                'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
              "
            />
            <div class="unread-dot" v-if="user.unreadCount > 0"></div>
          </div>
          <div class="chat-info">
            <div class="username">{{ user.username }}</div>
            <div class="last-message">{{ user.lastMessage || "暂无消息" }}</div>
          </div>
          <div class="unread-badge" v-if="user.unreadCount > 0">
            {{ user.unreadCount }}
          </div>
        </div>
      </div>
    </div>

    <!-- 聊天内容区 -->
    <div class="chat-content">
      <template v-if="currentChatUser">
        <!-- 聊天头部 -->
        <div class="chat-content-header">
          <h3>与 {{ currentChatUser.username }} 的对话</h3>
        </div>

        <!-- 消息列表 -->
        <div class="message-container" ref="messageContainer">
          <div v-if="messages.length === 0" class="no-messages">
            暂无消息，开始聊天吧！
          </div>
          <div
            v-for="(message, index) in messages"
            :key="index"
            class="message"
            :class="{ 'message-self': message.senderId === userStore.userId }"
          >
            <div class="message-avatar">
              <el-avatar
                :size="36"
                :src="
                  message.senderId === userStore.userId
                    ? userStore.userInfo.avatar ||
                      'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
                    : currentChatUser.avatar ||
                      'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
                "
              />
            </div>
            <div class="message-bubble">
              <div class="message-content">{{ message.content }}</div>
              <div class="message-time">
                {{ formatTime(message.createTime) }}
              </div>
            </div>
          </div>
        </div>

        <!-- 输入区域 -->
        <div class="message-input">
          <el-input
            v-model="inputValue"
            type="textarea"
            :rows="3"
            placeholder="请输入消息..."
            @keyup.enter.native.prevent="sendMessage"
          />
          <el-button
            type="primary"
            @click="sendMessage"
            :disabled="!inputValue.trim()"
          >
            发送
          </el-button>
        </div>
      </template>

      <div v-else class="no-chat-selected">
        <el-empty description="请选择一个联系人开始聊天" />
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  onMounted,
  onBeforeUnmount,
  watch,
  nextTick,
  computed,
} from "vue";
import { useUserStore } from "@/store/modules/user";
import { connect, disconnect, sendPrivateMessage } from "@/utils/websocket";
import { getMessageHistory, getChatList } from "@/api/message";
import { ElMessage } from "element-plus";
import { useRoute } from "vue-router";

const userStore = useUserStore();
const route = useRoute();
const chatUsers = ref([]);
const currentChatUser = ref(null);
const messages = ref([]);
const inputValue = ref("");
const messageContainer = ref(null);

// 格式化时间
const formatTime = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return `${(date.getMonth() + 1).toString().padStart(2, "0")}
  .${date.getDate().toString().padStart(2, "0")} 
  ${date.getHours().toString().padStart(2, "0")}
  :${date.getMinutes().toString().padStart(2, "0")}`;
};

// 处理接收到的私信
const handlePrivateMessage = (message) => {
  // 如果当前正在与发送者聊天，则直接添加消息
  if (currentChatUser.value && message.senderId === currentChatUser.value.id) {
    messages.value.push({
      ...message,
      isRead: 1, // 当前正在聊天，自动设为已读
    });
    scrollToBottom();
  } else {
    // 不是当前聊天对象，设为未读
    message.isRead = 0;
  }

  // 更新聊天列表中的最后一条消息
  const userIndex = chatUsers.value.findIndex(
    (user) => user.id === message.senderId
  );
  if (userIndex > -1) {
    chatUsers.value[userIndex].lastMessage = message.content;
    if (message.isRead === 0) {
      chatUsers.value[userIndex].unreadCount =
        (chatUsers.value[userIndex].unreadCount || 0) + 1;
    }
  }

  // 重新排序聊天列表，将有新消息的用户置顶
  sortChatList();
};

// 选择聊天对象
const selectChat = async (user) => {
  currentChatUser.value = user;

  // 重置未读计数
  const userIndex = chatUsers.value.findIndex((u) => u.id === user.id);
  if (userIndex > -1) {
    chatUsers.value[userIndex].unreadCount = 0;
  }

  try {
    // 获取聊天记录
    const res = await getMessageHistory(userStore.userId, user.id);
    if (res.data && res.data.code === 1) {
      messages.value = res.data.data.map((msg) => {
        if (msg.receiverId === userStore.userId && msg.isRead === 0) {
          msg.isRead = 1;
        }
        return msg;
      });
      nextTick(() => {
        scrollToBottom();
      });
    }
  } catch (error) {
    console.error("获取消息历史失败:", error);
    ElMessage.error("获取聊天记录失败");
  }
};

// 发送消息
const sendMessage = async () => {
  if (!inputValue.value.trim() || !currentChatUser.value) return;

  const content = inputValue.value.trim();
  inputValue.value = "";

  // 使用WebSocket发送消息
  const msg = sendPrivateMessage(
    userStore.userId,
    currentChatUser.value.id,
    content
  );

  if (msg) {
    // 将自己发送的消息添加到消息列表中
    messages.value.push({
      senderId: userStore.userId,
      receiverId: currentChatUser.value.id,
      content: content,
      createTime: new Date().toISOString(),
    });

    // 更新聊天列表中的最后一条消息
    const userIndex = chatUsers.value.findIndex(
      (user) => user.id === currentChatUser.value.id
    );
    if (userIndex > -1) {
      chatUsers.value[userIndex].lastMessage = content;
    }

    // 滚动到底部
    nextTick(() => {
      scrollToBottom();
    });
  } else {
    ElMessage.error("消息发送失败，请检查网络连接");
  }
};

// 滚动到底部
const scrollToBottom = () => {
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
  }
};

// 重新排序聊天列表
const sortChatList = () => {
  chatUsers.value.sort((a, b) => {
    // 有未读消息的优先
    if ((a.unreadCount || 0) > 0 && (b.unreadCount || 0) === 0) return -1;
    if ((a.unreadCount || 0) === 0 && (b.unreadCount || 0) > 0) return 1;
    return 0;
  });
};

// 获取聊天列表
const loadChatList = async () => {
  try {
    const res = await getChatList(userStore.userId);
    console.log("获取聊天列表:", res.data.data);
    if (res.data && res.data.code === 1) {
      chatUsers.value = res.data.data.map((user) => ({
        ...user,
        unreadCount: 0,
        lastMessage: "",
      }));
    }
  } catch (error) {
    console.error("获取聊天列表失败:", error);
    ElMessage.error("获取聊天列表失败");
  }
};

// 处理从用户主页跳转过来的聊天请求
const handleChatFromUserPage = () => {
  const targetId = route.query.targetId;
  const targetName = route.query.targetName;
  const targetAvatar = route.query.targetAvatar;

  if (targetId && targetName) {
    // 检查用户是否已在聊天列表中
    const existingUserIndex = chatUsers.value.findIndex(
      (user) => user.id === parseInt(targetId)
    );

    if (existingUserIndex > -1) {
      // 如果用户已在列表中，直接选择该用户开始聊天
      selectChat(chatUsers.value[existingUserIndex]);
    } else {
      // 如果用户不在列表中，添加该用户到聊天列表
      const newUser = {
        id: parseInt(targetId),
        username: targetName,
        avatar: targetAvatar,
        lastMessage: "",
        unreadCount: 0,
      };
      chatUsers.value.push(newUser);
      // 选择该用户开始聊天
      selectChat(newUser);
    }
  }
};

onMounted(() => {
  loadChatList();
  connect(handlePrivateMessage);
  handleChatFromUserPage();
});

onBeforeUnmount(() => {
  disconnect();
});
</script>

<style scoped>
.chat-container {
  display: flex;
  height: calc(100vh - 120px);
  max-width: 1200px;
  margin: 0 auto;
  background: var(--bg-primary);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.chat-sidebar {
  width: 280px;
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
}

.chat-header {
  padding: 15px;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-tertiary);
}

.chat-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.chat-list {
  flex: 1;
  overflow-y: auto;
}

.chat-item {
  display: flex;
  align-items: center;
  padding: 15px;
  cursor: pointer;
  position: relative;
  border-bottom: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.chat-item:hover {
  background-color: var(--bg-hover);
}

.chat-item.active {
  background-color: var(--bg-hover);
  border-left: 4px solid var(--primary-color);
}

.avatar-container {
  position: relative;
  margin-right: 12px;
}

.unread-dot {
  position: absolute;
  top: 0;
  right: 0;
  width: 8px;
  height: 8px;
  background-color: var(--error-color);
  border-radius: 50%;
}

.chat-info {
  flex: 1;
  overflow: hidden;
}

.username {
  font-weight: 500;
  margin-bottom: 4px;
  color: var(--text-primary);
}

.last-message {
  color: var(--text-secondary);
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.unread-badge {
  min-width: 18px;
  height: 18px;
  background-color: var(--error-color);
  border-radius: 9px;
  color: white;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 6px;
}

.chat-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--bg-secondary);
}

.chat-content-header {
  padding: 15px;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-primary);
}

.chat-content-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.message-container {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  background-color: var(--bg-secondary);
}

.no-messages {
  text-align: center;
  color: var(--text-secondary);
  padding: 20px;
}

.message {
  display: flex;
  margin-bottom: 15px;
}

.message-self {
  flex-direction: row-reverse;
}

.message-avatar {
  margin: 0 10px;
}

.message-bubble {
  max-width: 70%;
  padding: 10px 15px;
  border-radius: var(--radius-md);
  background-color: var(--bg-primary);
  box-shadow: var(--shadow-sm);
}

.message-self .message-bubble {
  background-color: var(--primary-color-light);
}

.message-content {
  word-break: break-word;
  color: var(--text-primary);
}

.message-time {
  font-size: 12px;
  color: var(--text-tertiary);
  text-align: right;
  margin-top: 4px;
}

.message-input {
  padding: 15px;
  border-top: 1px solid var(--border-color);
  background: var(--bg-primary);
  display: flex;
  flex-direction: column;
}

.message-input .el-button {
  align-self: flex-end;
  margin-top: 10px;
}

.no-chat-selected {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-secondary);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .chat-container {
    height: calc(100vh - 60px);
    border-radius: 0;
    flex-direction: column;
  }

  .chat-sidebar {
    width: 100%;
    height: 40%;
    border-right: none;
    border-bottom: 1px solid var(--border-color);
  }

  .chat-content {
    height: 60%;
  }

  .message-bubble {
    max-width: 80%;
  }
}

@media (max-width: 480px) {
  .chat-item {
    padding: 10px;
  }

  .username {
    font-size: 14px;
  }

  .last-message {
    font-size: 12px;
  }

  .message-content {
    font-size: 14px;
  }

  .message-bubble {
    padding: 8px 12px;
  }
}
</style>
