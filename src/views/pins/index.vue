<template>
  <div class="pins-page">
    <div class="pins-header">
      <h1>想法</h1>
      <el-button type="primary" @click="createPin">发布想法</el-button>
    </div>

    <div class="pins-content">
      <el-card v-for="pin in pins" :key="pin.id" class="pin-item">
        <div class="pin-author">
          <el-avatar :size="40" :src="pin.avatar"></el-avatar>
          <div class="author-info">
            <div class="author-name">{{ pin.author }}</div>
            <div class="pin-time">{{ pin.createTime }}</div>
          </div>
        </div>
        <div class="pin-text">{{ pin.content }}</div>
        <div class="pin-images" v-if="pin.images && pin.images.length">
          <el-image
            v-for="(img, index) in pin.images"
            :key="index"
            :src="img"
            :preview-src-list="pin.images"
            class="pin-image"
          ></el-image>
        </div>
        <div class="pin-actions">
          <span class="action-item">
            <i class="el-icon-thumb"></i>
            {{ pin.likes }}
          </span>
          <span class="action-item">
            <i class="el-icon-chat-dot-round"></i>
            {{ pin.comments }}
          </span>
          <span class="action-item">
            <i class="el-icon-share"></i>
            分享
          </span>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "Pins",
  data() {
    return {
      pins: [
        {
          id: 1,
          author: "张三",
          avatar:
            "https://picx.zhimg.com/v2-c1785039cba7dea512f25cc7d0481328_xll.jpg",
          content: "今天学习了Vue.js的组件通信,收获很多!",
          createTime: "2023-07-20 10:30",
          likes: 12,
          comments: 3,
          images: [
            "https://picx.zhimg.com/v2-c1785039cba7dea512f25cc7d0481328_xll.jpg",
          ],
        },
        {
          id: 2,
          author: "李四",
          avatar:
            "https://picx.zhimg.com/v2-c1785039cba7dea512f25cc7d0481328_xll.jpg",
          content: "分享一个好用的前端开发工具",
          createTime: "2023-07-19 15:20",
          likes: 8,
          comments: 5,
          images: [],
        },
      ],
    };
  },
  methods: {
    createPin() {
      this.$router.push("/write");
    },
  },
};
</script>

<style scoped>
.pins-page {
  padding: 20px;
  background-color: var(--bg-secondary);
  min-height: calc(100vh - 52px);
  max-width: 800px;
  margin: 0 auto;
}

.pins-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.pin-item {
  margin-bottom: 20px;
  background-color: var(--bg-primary);
}

.pin-author {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.author-info {
  margin-left: 12px;
}

.author-name {
  font-weight: bold;
  font-size: 16px;
  color: var(--text-primary);
}

.pin-time {
  font-size: 12px;
  color: var(--text-tertiary);
}

.pin-text {
  margin-bottom: 12px;
  line-height: 1.6;
  color: var(--text-secondary);
}

.pin-images {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.pin-image {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
}

.pin-actions {
  display: flex;
  gap: 24px;
  color: var(--text-tertiary);
}

.action-item {
  cursor: pointer;
}

.action-item:hover {
  color: var(--primary-color);
}

.pins-container {
  background-color: var(--bg-secondary);
}

.pin-link {
  color: var(--primary-color);
}
</style>
