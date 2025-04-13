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
            <span> {{ userInfo.followNum }} 关注</span>
            <span> {{ userInfo.fansNum }} 粉丝</span>
          </div>
          <div class="edit-profile">
            <el-button type="primary" size="medium" @click="handleEditProfile"
              >编辑个人资料</el-button
            >
            <el-button
              type="warning"
              size="medium"
              @click="handleChangePassword"
              >修改密码</el-button
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
        <el-form-item label="电子邮箱">
          <el-input
            v-model="editForm.email"
            placeholder="请输入电子邮箱"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input
            v-model="editForm.mobile"
            placeholder="请输入手机号码"
          ></el-input>
        </el-form-item>
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

    <!-- 修改密码对话框 -->
    <el-dialog title="修改密码" v-model="passwordDialogVisible" width="500px">
      <el-form
        :model="passwordForm"
        label-width="80px"
        :rules="passwordRules"
        ref="passwordFormRef"
      >
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input
            v-model="passwordForm.oldPassword"
            type="password"
            placeholder="请输入旧密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="passwordForm.newPassword"
            type="password"
            placeholder="请输入新密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="passwordForm.confirmPassword"
            type="password"
            placeholder="请再次输入新密码"
            show-password
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="passwordDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSavePassword"
            >确认修改</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { useUserStore } from "@/store/modules/user";
import { Plus } from "@element-plus/icons-vue";
import { uploadImage } from "@/api/article";
import { updateUserInfo, updateUserPassword } from "@/api/user";
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
      passwordDialogVisible: false,
      editForm: {
        username: "",
        avatar: "",
        cover: "",
        email: "",
        password: "",
        mobile: "",
      },
      passwordForm: {
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
      passwordRules: {
        oldPassword: [
          { required: true, message: "请输入旧密码", trigger: "blur" },
        ],
        newPassword: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          { min: 6, message: "密码长度不能少于6位", trigger: "blur" },
        ],
        confirmPassword: [
          { required: true, message: "请确认新密码", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              if (value !== this.passwordForm.newPassword) {
                callback(new Error("两次输入的密码不一致"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
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
      this.userInfo.followNum = this.userInfo.followCart
        .split(",")
        .filter(Boolean).length;
      this.userInfo.fansNum = this.userInfo.fansCart
        .split(",")
        .filter(Boolean).length;
    },
    handleEditProfile() {
      this.editForm = {
        username: this.userInfo.username,
        avatar: this.userInfo.avatar || "",
        cover: this.userInfo.cover || "",
        email: this.userInfo.email || "",
        password: "",
        mobile: this.userInfo.mobile || "",
      };
      this.dialogVisible = true;
    },
    handleChangePassword() {
      this.passwordForm = {
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      };
      this.passwordDialogVisible = true;
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
          email: this.editForm.email,
          password: this.editForm.password,
          mobile: this.editForm.mobile,
        };

        const res = await updateUserInfo(updateData);
        if (res.data.code === 1) {
          // 更新 store 中的用户信息
          this.userStore.updateUserInfo(updateData);

          // 更新本地显示
          this.userInfo.username = updateData.username;
          this.userInfo.avatar = updateData.avatar;
          this.userInfo.cover = updateData.cover;
          this.userInfo.email = updateData.email;
          this.userInfo.mobile = updateData.mobile;

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
    async handleSavePassword() {
      try {
        this.$refs.passwordFormRef.validate(async (valid) => {
          if (valid) {
            const id = this.userStore.userId;
            const oldPassword = this.passwordForm.oldPassword;
            const newPassword = this.passwordForm.newPassword;

            const res = await updateUserPassword(id, oldPassword, newPassword);
            if (res.data.code === 1) {
              ElMessage.success("密码修改成功");
              this.passwordDialogVisible = false;
            } else {
              ElMessage.error(res.data.msg || "密码修改失败");
            }
          }
        });
      } catch (error) {
        console.error("密码修改失败:", error);
        ElMessage.error("密码修改失败，请稍后重试");
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
  width: 100%;
  max-width: 1200px;
  min-height: 100vh;
  margin: 0 auto;
  background: var(--bg-secondary);
  padding: 0 20px;
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
  padding: 20px;
  display: flex;
  align-items: flex-start;
  position: relative;
  top: -48px;
  box-sizing: border-box;
  flex-wrap: wrap;
}

.avatar {
  width: 100%;
  max-width: 240px;
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
  display: flex;
  flex-wrap: wrap;
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

@media (max-width: 768px) {
  .user-info {
    flex-direction: column;
    align-items: center;
  }

  .avatar {
    margin-right: 0;
    margin-bottom: 20px;
  }

  .user-info-content {
    padding-top: 0;
    text-align: center;
  }

  .nav-tabs {
    justify-content: center;
  }

  .home-container {
    padding: 0;
    width: 100%;
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
    flex-direction: column;
    align-items: center;
    padding: 10px;
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
    margin-bottom: 5px;
  }

  .headline {
    font-size: 14px;
    margin-bottom: 10px;
  }

  .user-stats {
    font-size: 14px;
    margin-bottom: 10px;
    display: flex;
    justify-content: center;
    gap: 15px;
  }

  .user-stats span {
    margin-right: 0;
  }

  .nav-tabs {
    padding: 0;
    overflow-x: auto;
    justify-content: flex-start;
    -webkit-overflow-scrolling: touch;
    position: sticky;
    top: 52px;
    z-index: 1;
  }

  .nav-tabs span {
    padding: 12px 15px;
    font-size: 14px;
    white-space: nowrap;
  }

  .content-list {
    border-radius: 0;
  }
}

@media (max-width: 480px) {
  .cover-image {
    height: 150px;
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
