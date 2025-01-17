<template>
  <div class="home-container">
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
            <span> 0 关注</span>
            <span> 0 粉丝</span>
          </div>
          <div class="edit-profile">
            <el-button type="primary" size="medium" @click="handleEditProfile"
              >编辑个人资料</el-button
            >
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
          >{{ tab.name }}</span
        >
      </div>

      <div class="content-list">
        <component :is="currentComponent"></component>
      </div>
    </div>

    <!-- 编辑个人资料对话框 -->
    <el-dialog title="编辑个人资料" v-model="dialogVisible" width="500px">
      <el-form :model="editForm" label-width="80px">
        <!-- <el-form-item label="用户名">
          <el-input v-model="editForm.username"></el-input>
        </el-form-item> -->
        <el-form-item label="头像">
          <el-upload
            class="avatar-uploader"
            action="/api/upload"
            :show-file-list="false"
            :on-change="handleAvatarChange"
            accept="image/*"
            name="file"
          >
            <img
              v-if="editForm.avatar"
              :src="editForm.avatar"
              class="avatar-preview"
            />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="封面">
          <el-upload
            class="cover-uploader"
            action="/api/upload"
            :show-file-list="false"
            :on-change="handleCoverChange"
            accept="image/*"
            name="file"
          >
            <img
              v-if="editForm.cover"
              :src="editForm.cover"
              class="cover-preview"
            />
            <el-icon v-else class="cover-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSaveProfile">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { useUserStore } from "@/store/modules/user";
import { Plus } from "@element-plus/icons-vue";
import { uploadImage } from "@/api/article";
import { updateUserInfo } from "@/api/user";
import UserArticles from "@/components/UserArticles.vue";
import UserCollect from "@/components/UserCollect.vue";
import UserFollow from "@/components/UserFollow.vue";
import UserFans from "@/components/UserFans.vue";

export default {
  name: "Home",
  components: {
    Plus,
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
      this.userInfo = this.userStore.userInfo;
    },
    handleEditProfile() {
      this.editForm = {
        username: this.userInfo.username,
        avatar: this.userInfo.avatar || "",
        cover: this.userInfo.cover || "",
      };
      this.dialogVisible = true;
    },
    async handleAvatarChange(file) {
      try {
        const formData = new FormData();
        formData.append("file", file.raw);
        const res = await uploadImage(formData);
        if (res.data.code === 1) {
          this.editForm.avatar = res.data.data;
          ElMessage.success("头像上传成功");
        } else {
          ElMessage.error(res.data.msg || "头像上传失败");
        }
      } catch (error) {
        console.error("头像上传失败:", error);
        ElMessage.error("头像上传失败");
      }
    },
    async handleCoverChange(file) {
      try {
        const formData = new FormData();
        formData.append("file", file.raw);
        const res = await uploadImage(formData);
        if (res.data.code === 1) {
          this.editForm.cover = res.data.data;
          ElMessage.success("封面上传成功");
        } else {
          ElMessage.error(res.data.msg || "封面上传失败");
        }
      } catch (error) {
        console.error("封面上传失败:", error);
        ElMessage.error("封面上传失败");
      }
    },
    async handleSaveProfile() {
      try {
        const updateData = {
          id: this.userStore.userId,
          username: this.editForm.username,
          avatar: this.editForm.avatar,
          cover: this.editForm.cover,
        };

        const res = await updateUserInfo(updateData);
        if (res.data.code === 1) {
          // 更新 store 中的用户信息
          this.userStore.updateUserInfo(updateData);

          // 更新本地显示
          this.userInfo.username = updateData.username;
          this.userInfo.avatar = updateData.avatar;
          this.userInfo.cover = updateData.cover;

          ElMessage.success("个人资料更新成功");
          this.dialogVisible = false;
        } else {
          ElMessage.error(res.data.msg || "更新失败");
        }
      } catch (error) {
        console.error("更新个人资料失败:", error);
        ElMessage.error("更新失败，请稍后重试");
      }
    },
  },
  mounted() {
    this.getUserInfo();
  },
};
</script>

<style scoped>
.home-container {
  width: 1200px;
  min-height: 100vh;
  margin: 0 auto;
  background: var(--bg-secondary);
}

.cover-section {
  position: relative;
  background: var(--bg-primary);
  border-radius: var(--radius-md);
  margin-bottom: 10px;
  box-shadow: var(--shadow-sm);
}

.cover-image {
  width: 100%;
  height: 320px;
  background: var(--bg-tertiary);
  overflow: hidden;
  position: relative;
  border-radius: var(--radius-md) var(--radius-md) 0 0;
}

.cover-image-ratio {
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: var(--bg-tertiary);
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
  border-radius: var(--radius-md);
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
  background: var(--bg-tertiary);
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
  color: var(--primary-color);
}

.edit-profile {
  margin-top: 16px;
  color: var(--text-primary);
}

.edit-profile:hover {
  color: var(--primary-color);
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
  border-radius: var(--radius-md);
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
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

/* 上传组件样式 */
.avatar-uploader,
.cover-uploader {
  border: 1px dashed var(--border-color);
  border-radius: var(--radius-md);
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
  background: var(--bg-tertiary);
}

.cover-preview {
  width: 200px;
  height: 100px;
  display: block;
  object-fit: cover;
  background: var(--bg-tertiary);
}

.home-card {
  background: var(--bg-primary);
}

.avatar-wrapper {
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

.content-wrapper {
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

/* 对话框样式 */
:deep(.el-dialog) {
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
}

:deep(.el-dialog__title) {
  color: var(--text-primary);
}

:deep(.el-dialog__body) {
  color: var(--text-secondary);
}

:deep(.el-form-item__label) {
  color: var(--text-primary);
}

:deep(.el-input__inner) {
  background: var(--bg-secondary);
  border-color: var(--border-color);
  color: var(--text-primary);
}

:deep(.el-input__inner:hover),
:deep(.el-input__inner:focus) {
  border-color: var(--primary-color);
}
</style>
