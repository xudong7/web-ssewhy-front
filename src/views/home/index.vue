<template>
  <div class="home-container">
    <!-- 封面和个人信息区域 -->
    <div class="cover-section">
      <div class="cover-image">
        <img :src="userInfo.coverImage" :alt="userInfo.username" class="cover-image-ratio">
      </div>
      <div class="user-info">
        <div class="avatar">
          <img :src="userInfo.avatar" :alt="userInfo.username">
        </div>
        <div class="user-info-content">
          <h1 class="username">{{ userInfo.username }}</h1>
          <p class="headline">{{ userInfo.headline }}</p>
          <div class="user-stats">
            <span>{{ userInfo.followingCount }} 关注</span>
            <span>{{ userInfo.followerCount }} 粉丝</span>
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
      userInfo: {
        username: '用户名',
        headline: '个人简介',
        coverImage: 'https://pic1.zhimg.com/v2-f232653f46209bc5d6310f83034381c7_1440w.jpg?source=32738c0c',
        avatar: 'https://picx.zhimg.com/v2-c1785039cba7dea512f25cc7d0481328_xll.jpg?source=32738c0c&needBackground=1',
        followingCount: 0,
        followerCount: 0
      }
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