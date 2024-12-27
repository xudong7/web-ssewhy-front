<template>
  <div class="home-container">
    <!-- 封面和个人信息区域 -->
    <div class="cover-section">
      <div class="cover-image">
        <img :src="userInfo.cover" :alt="userInfo.username" class="cover-image-ratio">
      </div>
      <div class="user-info">
        <div class="avatar">
          <img :src="userInfo.avatar" :alt="userInfo.username">
        </div>
        <div class="user-info-content">
          <h1 class="username">{{ userInfo.username }}</h1>
          <p class="headline">个人简介</p>
          <div class="user-stats">
            <span>{{ userInfo.followCart }} 关注</span>
            <span>{{ userInfo.fansCart }} 粉丝</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <div class="nav-tabs">
        <span
          v-for="(tab, index) in tabs" 
          :key="index"
          :class="{ active: currentTab === tab.key }"
          @click="currentTab = tab.key"
        >{{ tab.name }}</span>
      </div>
      
      <div class="content-list">
        <component :is="currentComponent"></component>
      </div>
    </div>
  </div>
</template>

<script>
import {getUserInfoById} from "@/api/user.js";

export default {
  name: 'Home',
  data() {
    return {
      currentTab: 'dynamic',
      tabs: [
        { key: 'dynamic', name: '动态' },
        { key: 'answers', name: '回答' },
        { key: 'articles', name: '文章' },
        { key: 'pins', name: '想法' }
      ],
      userInfo: {},
    }
  },
  computed: {
    currentComponent() {
      const components = {
        dynamic: 'UserDynamic',
        answers: 'UserAnswers',
        articles: 'UserArticles',
        pins: 'UserPins'
      }
      return components[this.currentTab]
    }
  },
  methods: {
    async getUserInfo() {
      const userId = 1;
      const res = await getUserInfoById(userId);
      this.userInfo = res.data.data;
    }
  },
  mounted() {
    this.getUserInfo();
  }
}
</script>

<style scoped>
.home-container {
  width: 65%;
  background: #f6f6f6;
  min-height: 100vh;
  margin: 0 auto;
}

.cover-section {
  position: relative;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
}

.cover-image {
  height: 320px;
  background: #e5e5e5;
  overflow: hidden;
  position: relative;
}

.cover-image-ratio {
  width: 100%;
  height: auto;
  object-fit: cover;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.user-info {
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: flex-start;
  position: relative;
  top: -48px;
}

.avatar {
  width: 180px;
  height: 180px;
  border-radius: 4px;
  border: 4px solid #fff;
  overflow: hidden;
  background: #fff;
  flex-shrink: 0;
  margin-right: 32px;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-info-content {
  padding-top: 48px;
}

.username {
  margin: 0 0 8px;
  font-size: 26px;
  font-weight: 600;
  color: #121212;
}

.headline {
  color: #646464;
  font-size: 15px;
  margin-bottom: 16px;
  line-height: 1.6;
}

.user-stats {
  color: #646464;
  font-size: 15px;
}

.user-stats span {
  margin-right: 32px;
  cursor: pointer;
}

.user-stats span:hover {
  color: #175199;
}

.main-content {
  margin: 10px auto;
  background: #fff;
  border-radius: 2px;
  box-shadow: 0 1px 3px rgba(18,18,18,0.1);
}

.nav-tabs {
  padding: 0 20px;
  border-bottom: 1px solid #f0f0f0;
}

.nav-tabs span {
  display: inline-block;
  padding: 16px 20px;
  color: #121212;
  cursor: pointer;
  font-size: 16px;
  margin-right: 8px;
}

.nav-tabs span:hover {
  color: #175199;
}

.nav-tabs span.active {
  color: #056DE8;
  border-bottom: 3px solid #056DE8;
  font-weight: 500;
}

.content-list {
  min-height: 200px;
  padding: 0 20px;
}
</style>