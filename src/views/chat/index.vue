<template>
  <div class="chat-container">
    <div class="chat-sidebar">
      <div class="chat-header">
        <h3>聊天列表</h3>
      </div>
      <div class="chat-list">
        <div
          v-for="chat in chatList"
          :key="chat.id"
          class="chat-item"
          :class="{ active: currentChat?.id === chat.id }"
          @click="selectChat(chat)"
        >
          <el-avatar :src="chat.avatar" :size="40"></el-avatar>
          <div class="chat-info">
            <div class="chat-name">{{ chat.name }}</div>
            <div class="chat-preview">{{ chat.lastMessage }}</div>
          </div>
          <div class="chat-meta">
            <div class="chat-time">{{ chat.lastTime }}</div>
            <el-badge
              v-if="chat.unread"
              :value="chat.unread"
              class="unread-badge"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="chat-main">
      <template v-if="currentChat">
        <div class="chat-title">
          <span>{{ currentChat.name }}</span>
        </div>

        <div class="message-container" ref="messageContainer">
          <div
            v-for="msg in messages"
            :key="msg.id"
            class="message-item"
            :class="{ 'message-mine': msg.isMine }"
          >
            <el-avatar :src="msg.avatar" :size="36"></el-avatar>
            <div class="message-content">
              <div class="message-text">{{ msg.content }}</div>
              <div class="message-time">{{ msg.time }}</div>
            </div>
          </div>
        </div>

        <div class="input-area">
          <el-input
            v-model="messageText"
            type="textarea"
            :rows="3"
            placeholder="输入消息..."
            @keyup.enter.native="sendMessage"
          />
          <el-button type="primary" @click="sendMessage">发送</el-button>
        </div>
      </template>

      <div v-else class="no-chat">
        <el-empty description="选择一个聊天" />
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from "@/store/modules/user";

export default {
  data() {
    return {
      chatList: [
        {
          id: 1,
          name: "张三",
          avatar: "https://th.bing.com/th/id/OIP.ClY0OPQozu6eTKTQEt1hgwHaHa",
          lastMessage: "好的,下次见",
          lastTime: "12:30",
          unread: 2,
        },
        {
          id: 2,
          name: "李四",
          avatar: "https://th.bing.com/th/id/OIP.ClY0OPQozu6eTKTQEt1hgwHaHa",
          lastMessage: "收到了,谢谢",
          lastTime: "昨天",
          unread: 0,
        },
      ],
      currentChat: null,
      messages: [],
      messageText: "",
      userStore: useUserStore(),
      mine: {},
    };
  },
  methods: {
    init() {
      this.mine = this.userStore.userInfo;
    },
    selectChat(chat) {
      this.currentChat = chat;
      // 模拟加载消息
      this.messages = [
        {
          id: 1,
          content: "你好啊",
          time: "12:00",
          avatar: chat.avatar,
          isMine: false,
        },
        {
          id: this.mine.id,
          content: "你好,最近怎么样?",
          time: "12:01:33",
          avatar: this.mine.avatar,
          isMine: true,
        },
        {
          id: 1,
          content: "我很好,谢谢关心",
          time: "12:02:33",
          avatar: chat.avatar,
          isMine: false,
        },
      ];
    },
    sendMessage() {
      if (!this.messageText.trim()) return;

      this.messages.push({
        id: Date.now(),
        content: this.messageText,
        time: new Date().toLocaleTimeString(),
        avatar: this.mine.avatar,
        isMine: true,
      });

      this.messageText = "";
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },
    scrollToBottom() {
      const container = this.$refs.messageContainer;
      container.scrollTop = container.scrollHeight;
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<style scoped>
.chat-container {
  display: flex;
  width: 60%;
  text-align: center;
  margin: 0 auto;
  height: calc(100vh - 60px);
  background: #f4f4f4;
}

.chat-sidebar {
  width: 300px;
  background: #fff;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
}

.chat-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.chat-list {
  flex: 1;
  overflow-y: auto;
}

.chat-item {
  display: flex;
  padding: 15px;
  cursor: pointer;
  align-items: center;
  border-bottom: 1px solid #f5f5f5;
}

.chat-item:hover {
  background: #f5f5f5;
}

.chat-item.active {
  background: #e6f7ff;
}

.chat-info {
  flex: 1;
  margin-left: 10px;
}

.chat-name {
  font-weight: bold;
  margin-bottom: 5px;
}

.chat-preview {
  font-size: 13px;
  color: #999;
}

.chat-meta {
  text-align: right;
}

.chat-time {
  font-size: 12px;
  color: #999;
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.chat-title {
  padding: 20px;
  background: #fff;
  border-bottom: 1px solid #ddd;
}

.message-container {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background: #f4f4f4;
}

.message-item {
  display: flex;
  margin-bottom: 20px;
  align-items: flex-start;
}

.message-mine {
  flex-direction: row-reverse;
}

.message-content {
  margin: 0 10px;
  max-width: 60%;
}

.message-text {
  padding: 10px 15px;
  background: #fff;
  border-radius: 4px;
  word-break: break-all;
}

.message-mine .message-text {
  background: #95ec69;
}

.message-time {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
  text-align: right;
}

.input-area {
  padding: 20px;
  background: #fff;
  border-top: 1px solid #ddd;
  display: flex;
  align-items: flex-end;
}

.input-area .el-button {
  margin-left: 10px;
}

.no-chat {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
}
</style>
