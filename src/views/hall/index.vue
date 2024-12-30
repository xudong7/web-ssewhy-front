<template>
  <el-container class="homepage">
    <el-aside></el-aside>
    <!-- Main Content -->
    <el-main class="main-content">
      <div class="left-column">
        <div
          class="topic"
          v-for="topic in topics"
          :key="topic.id"
          @click="goDetail(topic.id)"
        >
          <div class="topic-header">
            <div v-if="topic.cover" class="topic-cover">
              <img :src="topic.cover" alt="封面" class="topic-cover-img" />
            </div>
            <div class="topic-content">
              <h2 class="topic-title">{{ topic.title }}</h2>
              <p class="topic-description">
                {{ formatContent(topic.content) }}
              </p>
            </div>
          </div>
          <div class="topic-footer">
            <span class="action-item"
              ><i class="el-icon-thumb"></i> {{ topic.likes }} 赞同</span
            >
            <span class="action-item"
              ><i class="el-icon-chat-dot-round"></i>
              {{ topic.comments }} 评论</span
            >
            <span class="action-item"><i class="el-icon-share"></i> 分享</span>
            <span class="action-item"
              ><i class="el-icon-star-off"></i> 收藏</span
            >
            <span class="action-item"><i class="el-icon-heart"></i> 喜欢</span>
          </div>
        </div>
      </div>
    </el-main>
    <!-- Right Column -->
    <el-aside class="right-aside">
      <AdComponent />
    </el-aside>
  </el-container>
</template>

<script>
import { getArticleList } from "@/api/article.js";

export default {
  data() {
    return {
      topics: [],
    };
  },
  methods: {
    async getArticleList() {
      const res = await getArticleList();
      // 筛选status为1的文章
      this.topics = res.data.data;
      this.topics = this.topics.filter((item) => item.status === 1);
    },
    goDetail(topicId) {
      this.$router.push({
        path: `/detail/${topicId}`,
      });
    },
    formatContent(content) {
      if (!content) return "";
      // 每30个字符添加一个换行符
      const maxLength = 250;
      const chunkSize = 60;
      if (content.length > maxLength) {
        content = content.substring(0, maxLength) + "...";
      }
      return content.match(new RegExp(`.{1,${chunkSize}}`, "g")).join("\n");
    },
  },
  mounted() {
    this.getArticleList();
  },
};
</script>

<style scoped>
/* General Styles */
.homepage {
  font-family: Arial, sans-serif;
  width: 80%;
}

body {
  margin: 0;
  font-family: Arial, sans-serif;
  justify-content: center;
}

.nav span {
  margin-right: 20px;
  cursor: pointer;
  font-size: 14px;
  color: #555;
}

.search-bar input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.search-bar button {
  padding: 8px 12px;
  margin-left: 5px;
  background-color: #007aff;
  color: #fff;
  border: none;
  border-radius: 4px;
}

.user-actions {
  display: flex;
  align-items: center;
}

.user-actions img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-left: 15px;
}

/* Main Layout */
.main-content {
  display: flex;
  padding: 20px;
  background-color: #f9f9f9;
  justify-content: center;
  align-items: stretch;
  width: 80%;
  margin: 0 auto;
}

.left-column {
  flex: 3;
  margin-right: 20px;
  align-items: center;
}

.right-aside {
  position: fixed;
  right: 12%;
  top: 6%;
  width: 300px !important;
  height: 100vh;
  overflow-y: auto;
}

.right-column {
  flex: 1;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(18, 18, 18, 0.1);
  padding: 16px;
}

.topic {
  margin-bottom: 20px;
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  margin-left: 10%;
  margin-top: 1%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  width: 75%;
  box-sizing: border-box;
  box-shadow: 0 1px 3px rgba(18, 18, 18, 0.1);
}

.topic:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.topic-header {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.topic-cover {
  width: 320px;
  height: 200px;
  overflow: hidden;
  border-radius: 8px;
  flex-shrink: 0;
}

.topic-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.topic-cover img:hover {
  transform: scale(1.05);
}

.topic-cover-img {
  width: 100%;
  height: auto;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.topic-content {
  flex: 1;
}

.topic-title {
  margin: 0 0 10px 0;
  font-size: 20px;
  color: #121212;
  line-height: 1.4;
}

.topic-description {
  font-size: 15px;
  color: #646464;
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  white-space: pre-line;
}

.topic-footer {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
}

.action-item {
  display: flex;
  align-items: center;
  margin-right: 20px;
  color: #8590a6;
  font-size: 14px;
  cursor: pointer;
  transition: color 0.2s ease;
}

.action-item:hover {
  color: #056de8;
}

.action-item i {
  margin-right: 4px;
  font-size: 16px;
}
</style>
