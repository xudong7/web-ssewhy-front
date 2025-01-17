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
  background: var(--bg-primary);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  padding: 0;
  margin-bottom: 8px;
}

.recommended-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
}

.recommended-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: var(--text-tertiary);
  cursor: pointer;
  transition: var(--transition-colors);
}

.refresh-btn:hover {
  color: var(--primary-color);
}

.user-list {
  padding: 8px 16px;
}

.user-card {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid var(--border-light);
}

.user-card:last-child {
  border-bottom: none;
}

.user-avatar {
  cursor: pointer;
  margin-right: 12px;
  flex-shrink: 0;
}

.user-info {
  flex: 1;
  margin: 0 12px;
  min-width: 0;
}

.username {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 4px;
  cursor: pointer;
}

.username:hover {
  color: var(--primary-color);
}

.description {
  font-size: 13px;
  color: var(--text-tertiary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.follow-btn {
  padding: 0 12px;
  height: 28px;
  font-size: 13px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  gap: 4px;
  transition: var(--transition-all);
}

.follow-btn.is-followed {
  background-color: var(--bg-tertiary);
  border-color: var(--border-color);
  color: var(--text-tertiary);
}

.follow-btn.is-followed:hover {
  background-color: var(--bg-hover);
  color: var(--error-color);
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
  background: var(--bg-primary);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  padding: 16px;
}

.image-carousel {
  margin-bottom: 20px;
}

.carousel-content {
  position: relative;
  height: 100%;
  border-radius: var(--radius-md);
  overflow: hidden;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.carousel-content:hover .carousel-image {
  transform: scale(1.05);
}

.carousel-title {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.6);
  color: var(--text-inverse);
  font-size: 14px;
}

.ad-list {
  margin-top: 16px;
}

.ad-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: var(--transition-all);
}

.ad-item:hover {
  background: var(--bg-hover);
}

.ad-image {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-sm);
  margin-right: 12px;
}

.ad-info {
  flex: 1;
}

.ad-title {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.ad-desc {
  font-size: 13px;
  color: var(--text-tertiary);
  line-height: 1.5;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: var(--bg-tertiary);
  color: var(--text-tertiary);
}

.loading-spinner {
  margin-bottom: 8px;
}

.loading-text {
  font-size: 14px;
  color: var(--text-tertiary);
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
