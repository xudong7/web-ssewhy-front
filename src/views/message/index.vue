<template>
  <div class="message-container">
    <div class="message-header">
      <h2>我的消息</h2>
    </div>
    <div class="message-list">
      <div v-for="message in messages" :key="message.id" class="message-item">
        <el-avatar :src="message.senderAvatar" :size="40"></el-avatar>
        <div class="message-content">
          <div class="message-info">
            <span class="sender-name">{{ message.senderName }}</span>
            <span class="message-time">{{ message.time }}</span>
          </div>
          <div class="message-text">{{ message.content }}</div>
        </div>
      </div>
      <el-empty v-if="messages.length === 0" description="暂无消息"></el-empty>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      messages: [
        {
          id: 1,
          senderName: "张三",
          senderAvatar:
            "https://th.bing.com/th/id/OIP.ClY0OPQozu6eTKTQEt1hgwHaHa",
          content: "你好,最近怎么样?",
          time: "2024-01-10 10:30",
        },
        {
          id: 2,
          senderName: "李四",
          senderAvatar:
            "https://th.bing.com/th/id/OIP.ClY0OPQozu6eTKTQEt1hgwHaHa",
          content: "新文章写得不错!",
          time: "2024-01-09 15:20",
        },
      ],
    };
  },
};
</script>

<style scoped>
.message-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.message-header {
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.message-header h2 {
  font-size: 20px;
  color: #333;
  margin: 0;
}

.message-list {
  background: #fff;
  border-radius: 8px;
}

.message-item {
  display: flex;
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.message-content {
  margin-left: 15px;
  flex: 1;
}

.message-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.sender-name {
  font-weight: bold;
  color: #333;
}

.message-time {
  color: #999;
  font-size: 12px;
}

.message-text {
  color: #666;
  line-height: 1.5;
}
</style>
