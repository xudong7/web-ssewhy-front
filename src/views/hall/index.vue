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
            @click="handleClick(topic.id)"
        >
          <div class="topic-header">
            <div v-if="topic.cover" class="topic-cover">
              <img :src="topic.cover" alt="封面" />
            </div>
            <div class="topic-content">
              <h2 class="topic-title">{{ topic.title }}</h2>
              <p class="topic-description">{{ topic.content }}</p>
            </div>
          </div>
          <div class="topic-footer">
            <span class="action-item"><i class="el-icon-thumb"></i> {{ topic.likes }} 赞同</span>
            <span class="action-item"><i class="el-icon-chat-dot-round"></i> {{ topic.comments }} 评论</span>
            <span class="action-item"><i class="el-icon-share"></i> 分享</span>
            <span class="action-item"><i class="el-icon-star-off"></i> 收藏</span>
            <span class="action-item"><i class="el-icon-heart"></i> 喜欢</span>
          </div>
        </div>
      </div>
    </el-main>
    <!-- Right Column -->
    <el-aside class="right-aside">
      <div class="right-column">
        <div class="recommended-follows">
          <h3 class="recommended-title">推荐关注</h3>
          <div class="user-list">
            <div class="user-card" v-for="user in recommendedUsers" :key="user.id">
              <div class="user-avatar">
                <img :src="user.avatar" alt="用户头像"/>
              </div>
              <div class="user-info">
                <div class="username">{{ user.username }}</div>
                <div class="description">{{ user.description }}</div>
                <el-button type="primary" size="small" class="follow-btn">关注</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-aside>

  </el-container>
</template>

<script>
import { getArticleList } from "@/api/article.js";

export default {
  data() {
    return {
      topics: [],
      recommendedUsers: [
        {
          id: 1,
          avatar: "https://via.placeholder.com/40",
          username: "徐斌",
          description: "你关注的「寻尘客」也关注...",
        },
        {
          id: 2,
          avatar: "https://via.placeholder.com/40",
          username: "贾明子",
          description: "你关注的「自然科学」领域答主",
        },
        {
          id: 3,
          avatar: "https://via.placeholder.com/40",
          username: "rq cen",
          description: "你关注的「教育」领域答主",
        },
        {
          id: 4,
          avatar: "https://via.placeholder.com/40",
          username: "Azul",
          description: "",
        },
      ],
    };
  },
  methods: {
    handleClick(topicId) {
      // Navigate to the topic details page
      this.$router.push(`/topics/${topicId}`);
    },
    async getArticleList() {
      const res = await getArticleList();
      this.topics = res.data.data;
    }
  },
  mounted() {
    this.getArticleList();
  }
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
  right: 15%;
  top: 7%;
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
  width: 200px;
  height: 150px;
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

/* Recommended Follows Section */
.recommended-follows {
  background: #fff;
  border-radius: 8px;
}

.recommended-title {
  font-size: 16px;
  font-weight: 600;
  color: #121212;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.user-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.user-card {
  display: flex;
  align-items: flex-start;
  padding: 12px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.user-card:hover {
  background-color: #f6f6f6;
}

.user-avatar {
  margin-right: 12px;
  flex-shrink: 0;
}

.user-avatar img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.username {
  font-size: 15px;
  font-weight: 500;
  color: #121212;
}

.description {
  font-size: 13px;
  color: #8590a6;
  margin-bottom: 8px;
}

.follow-btn {
  width: fit-content;
  font-size: 14px;
  padding: 4px 16px;
  border-radius: 3px;
  background-color: #056de8;
  color: #fff;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.follow-btn:hover {
  background-color: #0461cf;
}
</style>