<template>
  <div class="right-column">
    <!-- 用户推荐部分 -->
    <div class="recommended-follows">
      <div class="recommended-header">
        <h3 class="recommended-title">
          <el-icon><UserFilled /></el-icon>
          推荐关注
        </h3>
        <span class="refresh-btn" @click="refreshUsers">
          <el-icon><Refresh /></el-icon>
          换一批
        </span>
      </div>
      <div class="user-list">
        <div class="user-card" v-for="user in recommendedUsers" :key="user.id">
          <div class="user-avatar" @click="goUser(user.id)">
            <el-image
              :src="user.avatar"
              alt="用户头像"
              fit="cover"
              style="width: 50px; height: 50px; border-radius: 50%"
            >
              <template #error>
                <img
                  src="https://th.bing.com/th/id/OIP.ClY0OPQozu6eTKTQEt1hgwHaHa?rs=1&pid=ImgDetMain"
                  alt="默认头像"
                />
              </template>
            </el-image>
          </div>
          <div class="user-info">
            <div class="username" @click="goUser(user.id)">
              {{ user.username }}
            </div>
            <div class="description">{{ user.description || "暂无简介" }}</div>
          </div>
          <el-button
            type="primary"
            @click="handleFollow(user)"
            size="small"
            class="follow-btn"
            :class="{ 'is-followed': user.isFollowed }"
            :plain="!user.isFollowed"
          >
            <el-icon
              ><component :is="user.isFollowed ? 'Check' : 'Plus'"
            /></el-icon>
            {{ user.isFollowed ? "取消关注" : "关注" }}
          </el-button>
        </div>
      </div>
    </div>

    <!-- 图片轮播部分 -->
    <div class="carousel-section">
      <el-carousel
        :interval="3000"
        type="card"
        height="200px"
        :autoplay="true"
        trigger="click"
        class="image-carousel"
      >
        <el-carousel-item v-for="(item, index) in carouselItems" :key="index">
          <div class="carousel-content" @click="handleClick(item.link)">
            <el-image :src="item.image" fit="cover" lazy class="carousel-image">
              <template #placeholder>
                <div class="image-placeholder">
                  <div class="loading-spinner"></div>
                  <div class="loading-text">{{ item.title }}</div>
                </div>
              </template>
              <template #error>
                <div class="image-placeholder">
                  <el-icon><Picture /></el-icon>
                </div>
              </template>
            </el-image>
            <div class="carousel-title">{{ item.title }}</div>
          </div>
        </el-carousel-item>
      </el-carousel>

      <div class="ad-list">
        <div
          v-for="(ad, index) in adItems"
          :key="index"
          class="ad-item"
          @click="handleClick(ad.link)"
        >
          <el-image :src="ad.image" fit="cover" lazy class="ad-image">
            <template #placeholder>
              <div class="image-placeholder">
                <div class="loading-spinner"></div>
                <div class="loading-text">{{ ad.title }}</div>
              </div>
            </template>
            <template #error>
              <div class="image-placeholder">
                <el-icon><Picture /></el-icon>
              </div>
            </template>
          </el-image>
          <div class="ad-info">
            <div class="ad-title">{{ ad.title }}</div>
            <div class="ad-desc">{{ ad.description }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAllUsers, handleFollow } from "@/api/user.js";
import { useUserStore } from "@/store/modules/user.js";
import {
  Picture,
  Plus,
  Refresh,
  UserFilled,
  Loading,
  Check,
} from "@element-plus/icons-vue";

export default {
  name: "AdComponent",
  components: {
    Picture,
    Plus,
    Refresh,
    UserFilled,
    Loading,
    Check,
  },
  data() {
    return {
      recommendedUsers: [],
      allUsers: [],
      userStore: useUserStore(),
      carouselItems: [
        {
          image: "https://picsum.photos/800/400?random=1",
          title: "探索编程的奥秘",
          link: "/knowledge",
        },
        {
          image: "https://picsum.photos/800/400?random=2",
          title: "最新技术动态",
          link: "/hall",
        },
        {
          image: "https://picsum.photos/800/400?random=3",
          title: "加入我们的社区",
          link: "/pins",
        },
      ],
      adItems: [
        {
          image: "https://picsum.photos/300/200?random=4",
          title: "编程入门指南",
          description: "从零开始学习编程的完整路线",
          link: "/knowledge",
        },
        {
          image: "https://picsum.photos/300/200?random=5",
          title: "技术社区互动",
          description: "分享你的见解，参与技术讨论",
          link: "/pins",
        },
      ],
    };
  },
  methods: {
    async getRecommendedUsers() {
      try {
        const res = await getAllUsers();
        if (res.data.code === 1) {
          // 获取所有用户信息，过滤掉当前登录用户
          this.allUsers = res.data.data
            .filter((user) => user.id !== this.userStore.userId)
            .map((user) => ({
              ...user,
              // 检查用户的fansCart字符串中是否包含当前登录用户ID
              isFollowed:
                user.fansCart &&
                user.fansCart.includes(`,${this.userStore.userId},`),
            }));
          this.refreshUsers();
        } else {
          ElMessage.error(res.data.msg || "获取用户列表失败");
        }
      } catch (error) {
        console.error("获取推荐用户失败:", error);
        ElMessage.error("获取推荐用户失败");
      }
    },
    refreshUsers() {
      this.recommendedUsers = this.allUsers
        .sort(() => Math.random() - 0.5)
        .slice(0, 5);
    },
    goUser(id) {
      this.$router.push(`/user/${id}`);
    },
    handleClick(link) {
      if (link) {
        this.$router.push(link);
      }
    },
    async handleFollow(user) {
      try {
        const res = await handleFollow(user.id, this.userStore.userId);
        if (res.data.code === 1) {
          user.isFollowed = !user.isFollowed;
          ElMessage.success(user.isFollowed ? "关注成功" : "已取消关注");
        } else {
          ElMessage.error(res.data.msg || "操作失败");
        }
      } catch (error) {
        console.error("关注操作失败:", error);
        ElMessage.error("操作失败");
      }
    },
  },
  mounted() {
    this.getRecommendedUsers();
  },
};
</script>

<style scoped>
.right-column {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 推荐关注部分样式 */
.recommended-follows {
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(18, 18, 18, 0.1);
  padding: 0;
  margin-bottom: 8px;
}

.recommended-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f6f6f6;
}

.recommended-title {
  font-size: 15px;
  font-weight: 600;
  color: #121212;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.recommended-title :deep(.el-icon) {
  font-size: 16px;
  color: #8590a6;
}

.refresh-btn {
  font-size: 14px;
  color: #8590a6;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
}

.refresh-btn:hover {
  color: #175199;
}

.user-list {
  display: flex;
  flex-direction: column;
}

.user-card {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  transition: background-color 0.2s;
  position: relative;
}

.user-card:hover {
  background-color: #f6f6f6;
}

.user-avatar {
  cursor: pointer;
  margin-right: 12px;
  flex-shrink: 0;
}

.user-info {
  flex: 1;
  min-width: 0;
  margin-right: 12px;
}

.username {
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #121212;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.username:hover {
  color: #175199;
}

.description {
  font-size: 13px;
  color: #8590a6;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.follow-btn {
  padding: 0 12px;
  height: 28px;
  font-size: 13px;
  border-radius: 3px;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.3s ease;
}

.follow-btn.is-followed {
  background-color: #f2f3f5;
  border-color: #e5e6eb;
  color: #8590a6;
}

.follow-btn.is-followed:hover {
  background-color: #f7f8fa;
  color: #ff4d4f;
}

.follow-btn.is-followed:hover .el-icon {
  transform: scale(1.1);
}

.follow-btn :deep(.el-icon) {
  font-size: 12px;
  transition: transform 0.2s ease;
}

/* 轮播图部分样式 */
.carousel-section {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(18, 18, 18, 0.1);
  padding: 16px;
}

.image-carousel {
  margin-bottom: 20px;
}

.carousel-content {
  width: 100%;
  height: 100%;
  position: relative;
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
}

.carousel-image {
  width: 100%;
  height: 100%;
  transition: transform 0.3s ease;
}

.carousel-content:hover .carousel-image {
  transform: scale(1.05);
}

.carousel-title {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: #fff;
  font-size: 16px;
  font-weight: 500;
}

.ad-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ad-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  background: #f9fafb;
  cursor: pointer;
  transition: all 0.3s ease;
}

.ad-item:hover {
  background: #f0f2f7;
  transform: translateX(4px);
}

.ad-image {
  width: 120px;
  height: 80px;
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;
}

.ad-info {
  flex: 1;
  min-width: 0;
}

.ad-title {
  font-size: 16px;
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ad-desc {
  font-size: 14px;
  color: #6b7280;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f7f8f9;
  position: relative;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #e5e7eb;
  border-top-color: #8590a6;
  border-radius: 50%;
  animation: loading-rotate 0.8s linear infinite;
  margin-bottom: 8px;
}

.loading-text {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.6));
  color: #fff;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@keyframes loading-rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

:deep(.el-carousel__item) {
  border-radius: 8px;
}

:deep(.el-carousel__item--card) {
  border-radius: 8px;
}

:deep(.el-carousel__item--card.is-active) {
  transform: translateX(0) scale(1.1) !important;
}
</style>
