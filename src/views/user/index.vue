<template>
  <div class="user-container">
    <!-- 封面和个人信息区域 -->
    <div class="cover-section">
      <div class="cover-image">
        <img
          :src="userInfo.cover"
          :alt="userInfo.username"
          class="cover-image-ratio"
        />
      </div>
      <div class="user-info">
        <div class="avatar">
          <img :src="userInfo.avatar" :alt="userInfo.username" />
        </div>
        <div class="user-info-content">
          <h1 class="username">{{ userInfo.username }}</h1>
          <p class="headline">个人简介</p>
          <div class="user-stats">
            <span> {{ userInfo.followNum }} 关注</span>
            <span> {{ userInfo.fansNum }} 粉丝</span>
          </div>
          <el-button
            type="primary"
            @click="handleFollow()"
            size="small"
            class="follow-btn"
            :class="{ 'is-followed': userInfo.isFollowed }"
            :plain="!userInfo.isFollowed"
          >
            <el-icon
              ><component :is="userInfo.isFollowed ? 'Check' : 'Plus'"
            /></el-icon>
            {{ userInfo.isFollowed ? "取消关注" : "关注" }}
          </el-button>
          <!-- <div class="edit-profile">
            <el-button type="primary" size="medium" @click="handleEditProfile"
              >编辑个人资料</el-button
            >
          </div> -->
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
          >{{ tab.name }}</span
        >
      </div>

      <div class="content-list">
        <component :is="currentComponent"></component>
      </div>
    </div>
  </div>
</template>

<script>
import { Plus, Check } from "@element-plus/icons-vue";
import { getUserInfoById, handleFollow } from "@/api/user";
import UserArticles from "@/components/UserArticles.vue";
import UserCollect from "@/components/UserCollect.vue";
import UserFollow from "@/components/UserFollow.vue";
import UserFans from "@/components/UserFans.vue";
import { useUserStore } from "@/store/modules/user";

export default {
  name: "User",
  components: {
    Plus,
    Check,
    UserArticles,
    UserCollect,
    UserFollow,
    UserFans,
  },
  data() {
    return {
      currentTab: "dynamic",
      tabs: [
        { key: "dynamic", name: "动态" },
        { key: "answers", name: "回答" },
        { key: "articles", name: "文章" },
        { key: "collect", name: "收藏" },
        { key: "follow", name: "关注" },
        { key: "fans", name: "粉丝" },
        { key: "pins", name: "想法" },
      ],
      userInfo: {},
      dialogVisible: false,
      editForm: {
        username: "",
        avatar: "",
        cover: "",
      },
      userStore: useUserStore(),
    };
  },
  computed: {
    currentComponent() {
      const components = {
        dynamic: "UserDynamic",
        answers: "UserAnswers",
        articles: "UserArticles",
        collect: "UserCollect",
        follow: "UserFollow",
        fans: "UserFans",
        pins: "UserPins",
      };
      return components[this.currentTab];
    },
  },
  methods: {
    async getUserInfo() {
      const userId = this.$route.params.userId;
      const res = await getUserInfoById(userId);
      this.userInfo = res.data.data;
      this.userInfo.isFollowed =
        this.userInfo.fansCart &&
        this.userInfo.fansCart.includes(`,${this.userStore.userId},`);
      this.userInfo.followNum = this.userInfo.followCart
        .split(",")
        .filter(Boolean).length;
      this.userInfo.fansNum = this.userInfo.fansCart
        .split(",")
        .filter(Boolean).length;
    },
    async handleFollow() {
      try {
        const res = await handleFollow(this.userInfo.id, this.userStore.userId);
        if (res.data.code === 1) {
          this.userInfo.isFollowed = !this.userInfo.isFollowed;
          ElMessage.success(
            this.userInfo.isFollowed ? "关注成功" : "已取消关注",
          );
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
    this.getUserInfo();
  },
};
</script>

<style scoped>
.user-container {
  width: 1200px;
  min-height: 100vh;
  margin: 0 auto;
  background: var(--bg-secondary);
}

.cover-section {
  position: relative;
  background: var(--bg-primary);
  border-radius: 2px;
  margin-bottom: 10px;
  box-shadow: var(--shadow-sm);
}

.cover-image {
  width: 100%;
  height: 320px;
  background: var(--bg-tertiary);
  overflow: hidden;
  position: relative;
  border-radius: 2px 2px 0 0;
}

.cover-image-ratio {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-info {
  width: 100%;
  margin: 0 auto;
  padding: 20px 40px 20px;
  display: flex;
  align-items: flex-start;
  position: relative;
  top: -48px;
  box-sizing: border-box;
}

.avatar {
  width: 240px;
  height: 240px;
  border-radius: 4px;
  border: 4px solid var(--bg-primary);
  overflow: hidden;
  background: var(--bg-primary);
  flex-shrink: 0;
  margin-right: 32px;
  box-shadow: var(--shadow-sm);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-info-content {
  flex: 1;
  min-width: 0;
  padding-top: 48px;
}

.username {
  margin: 0 0 8px;
  font-size: 26px;
  font-weight: 600;
  color: var(--text-primary);
}

.headline {
  color: var(--text-secondary);
  font-size: 15px;
  margin-bottom: 16px;
  line-height: 1.6;
}

.user-stats {
  color: var(--text-secondary);
  font-size: 15px;
  margin-bottom: 16px;
}

.user-stats span {
  margin-right: 32px;
  cursor: pointer;
}

.user-stats span:hover {
  color: #175199;
}

.edit-profile {
  margin-top: 16px;
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

.main-content {
  width: 100%;
  margin: 0 auto;
  background: transparent;
  border-radius: 0;
  box-shadow: none;
}

.nav-tabs {
  background: var(--bg-primary);
  padding: 0 20px;
  border-radius: 2px;
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
}

.nav-tabs span {
  display: inline-block;
  padding: 16px 20px;
  color: var(--text-primary);
  cursor: pointer;
  font-size: 16px;
  margin-right: 8px;
}

.nav-tabs span:hover {
  color: var(--primary-color);
}

.nav-tabs span.active {
  color: var(--primary-color);
  border-bottom: 3px solid var(--primary-color);
  font-weight: 500;
}

.content-list {
  background: var(--bg-primary);
  min-height: 400px;
  padding: 0;
  border-radius: 2px;
  box-shadow: var(--shadow-sm);
}

/* 添加上传组件的样式 */
.avatar-uploader,
.cover-uploader {
  border: 1px dashed var(--border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader:hover,
.cover-uploader:hover {
  border-color: var(--primary-color);
}

.avatar-uploader-icon,
.cover-uploader-icon {
  font-size: 28px;
  color: var(--text-tertiary);
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}

.avatar-preview {
  width: 100px;
  height: 100px;
  display: block;
  object-fit: cover;
}

.cover-preview {
  width: 200px;
  height: 100px;
  display: block;
  object-fit: cover;
}

.user-card {
  background: var(--bg-primary);
}

.user-avatar-wrapper {
  background: var(--bg-tertiary);
}

.user-avatar {
  border: 4px solid var(--bg-primary);
  background: var(--bg-primary);
}

.user-name {
  color: var(--text-primary);
}

.user-bio {
  color: var(--text-secondary);
}

.user-stats {
  color: var(--text-secondary);
}

.user-link {
  color: var(--primary-color);
}

.user-action {
  background-color: var(--bg-tertiary);
  border-color: var(--border-color);
  color: var(--text-tertiary);
}

.user-action:hover {
  background-color: var(--bg-hover);
  color: var(--error-color);
}

.user-content {
  background: var(--bg-primary);
}

.content-header {
  border-bottom: 1px solid var(--border-color);
}

.content-title {
  color: var(--text-primary);
}

.content-link {
  color: var(--primary-color);
}

.content-link.active {
  color: var(--primary-color);
  border-bottom: 3px solid var(--primary-color);
}

.content-body {
  background: var(--bg-primary);
}

.upload-wrapper {
  border: 1px dashed var(--border-color);
}

.upload-wrapper:hover {
  border-color: var(--primary-color);
}

.upload-text {
  color: var(--text-tertiary);
}

/* 添加移动端适配样式 */
@media screen and (max-width: 768px) {
  .user-container {
    width: 100%;
    padding: 0;
  }

  .cover-section {
    border-radius: 0;
    margin-bottom: 0;
  }

  .cover-image {
    height: 200px;
    border-radius: 0;
  }

  .user-info {
    padding: 10px;
    flex-direction: column;
    align-items: center;
    top: -30px;
  }

  .avatar {
    width: 120px;
    height: 120px;
    margin-right: 0;
    margin-bottom: 15px;
  }

  .user-info-content {
    padding-top: 0;
    text-align: center;
    width: 100%;
  }

  .username {
    font-size: 20px;
    margin-bottom: 6px;
  }

  .headline {
    font-size: 14px;
    margin-bottom: 10px;
  }

  .user-stats {
    font-size: 14px;
    margin-bottom: 12px;
    display: flex;
    justify-content: center;
    gap: 20px;
  }

  .user-stats span {
    margin-right: 0;
  }

  .follow-btn {
    margin: 0 auto;
  }

  .nav-tabs {
    padding: 0;
    overflow-x: auto;
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;
  }

  .nav-tabs span {
    padding: 12px 15px;
    font-size: 14px;
  }

  .content-list {
    border-radius: 0;
  }
}

@media screen and (max-width: 480px) {
  .cover-image {
    height: 160px;
  }

  .avatar {
    width: 100px;
    height: 100px;
  }

  .username {
    font-size: 18px;
  }

  .headline {
    font-size: 13px;
  }

  .user-stats {
    font-size: 13px;
  }

  .nav-tabs span {
    padding: 10px 12px;
    font-size: 13px;
  }
}
</style>
