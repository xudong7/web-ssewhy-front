<template>
  <header class="header">
    <div class="header-container">
      <div class="header-left">
        <div class="logo">
          <span @click="goHall"> sse-why </span>
        </div>
        <el-menu
          :default-active="activeMenu"
          mode="horizontal"
          class="menu"
          @select="handleSelect"
        >
          <el-menu-item index="hall" @click="goHall">主页</el-menu-item>
          <el-menu-item index="download" @click="goDownload">下载</el-menu-item>
          <el-menu-item index="knowledge" @click="goKnowledge"
            >知识</el-menu-item
          >
          <el-menu-item index="pins" @click="goPins">想法</el-menu-item>
        </el-menu>
      </div>
      <div class="header-search">
        <div class="search-bar">
          <el-input
            v-model="searchText"
            placeholder="搜索你感兴趣的内容..."
            class="search-input"
            @focus="handleFocus"
            @blur="handleBlur"
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <el-icon class="search-icon"><Search /></el-icon>
            </template>
          </el-input>
        </div>
        <div>
          <el-button type="primary" class="search-button" @click="handleSearch"
            >搜索</el-button
          >
        </div>
      </div>
      <div class="user-actions">
        <span
          ><el-icon class="icon"><Message /></el-icon>消息</span
        >
        <span
          ><el-icon class="icon"><ChatDotRound /></el-icon>私信</span
        >
        <span @click="goWrite"
          ><el-icon class="icon"><Edit /></el-icon>创作</span
        >
        <span @click="goLogin"
          ><el-icon class="icon"><SwitchButton /></el-icon>登出</span
        >
        <el-avatar
          @click="goHome"
          :size="36"
          :src="userStore.userInfo.avatar"
        ></el-avatar>
        <!-- <span>{{ userStore.userInfo.username }}</span> -->
      </div>
    </div>
  </header>
  <el-main class="main-content">
    <router-view></router-view>
  </el-main>
  <FooterComponent />
</template>

<script>
import { useUserStore } from "@/store/modules/user";
import { Search } from "@element-plus/icons-vue";
import {
  Message,
  ChatDotRound,
  Edit,
  SwitchButton,
} from "@element-plus/icons-vue";
import FooterComponent from "@/components/FooterComponent.vue";

export default {
  name: "HeaderLayout",
  components: {
    Search,
    Message,
    ChatDotRound,
    Edit,
    SwitchButton,
    FooterComponent,
  },
  data() {
    return {
      activeMenu: this.getActiveMenu(),
      userStore: useUserStore(),
      searchText: "",
      isFocused: false,
      userStore: useUserStore(),
    };
  },
  methods: {
    handleFocus() {
      this.isFocused = true;
    },
    handleBlur() {
      this.isFocused = false;
    },
    handleSearch() {
      // 跳转到搜索页面
      if (this.searchText) {
        this.$router.push(`/search?keyword=${this.searchText}`);
      } else {
        this.$router.push("/hall");
      }
    },
    goHome() {
      this.$router.push("/home");
    },
    goHall() {
      this.$router.push("/hall");
    },
    goDownload() {
      this.$router.push("/download");
    },
    goKnowledge() {
      this.$router.push("/knowledge");
    },
    goPins() {
      this.$router.push("/pins");
    },
    goWrite() {
      this.$router.push("/write");
    },
    getActiveMenu() {
      const path = this.$route.path;
      return path.split("/").pop();
    },
    goLogin() {
      this.userStore.handleLogout();
      this.$router.push("/login");
    },
  },
  watch: {
    $route() {
      this.activeMenu = this.getActiveMenu();
    },
  },
};
</script>

<style scoped>
/* Header Styles */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
  height: auto;
  background-color: #ffffff;
  box-shadow: 0 1px 3px rgba(18, 18, 18, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  white-space: nowrap;
}

.header-container {
  width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.header-left {
  display: flex;
  align-items: center;
  min-width: 400px;
}

.header-search {
  flex: 1;
  display: flex;
  justify-content: center;
  max-width: 800px;
  min-width: 500px;
  padding: 0 20px;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: #056de8;
  margin-right: 20px;
  cursor: pointer;
}

.menu {
  border-bottom: none;
  flex-grow: 1;
  display: flex;
  justify-content: flex-start;
  margin-bottom: 0;
  align-items: center;
}

.search-bar {
  width: 100%;
  max-width: 400px;
}

.search-bar :deep(.el-input__wrapper) {
  background-color: #f6f6f6;
  border-radius: 999px;
  padding: 0 12px;
  transition: all 0.2s;
}

.search-bar :deep(.el-input__wrapper.is-focus) {
  background-color: #fff;
  box-shadow: 0 0 0 2px rgba(5, 109, 232, 0.1);
}

.search-bar :deep(.el-input__inner) {
  height: 36px;
  font-size: 16px;
  color: #121212;
}

.search-bar :deep(.el-input__inner)::placeholder {
  color: #8590a6;
}

.search-icon {
  font-size: 18px;
  color: #8590a6;
  margin-right: 8px;
}

.search-button {
  background-color: #3b82f6;
  border: none;
  border-radius: 999px;
  transition: all 0.2s;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 14px;
  padding: 0 16px;
  height: 36px;
  margin-left: 16px;
}

.search-button:hover {
  background-color: #056de8;
  color: #fff;
}

.user-actions {
  display: flex;
  align-items: center;
  min-width: 400px;
  justify-content: flex-end;
}

.user-actions span {
  margin-right: 15px;
  cursor: pointer;
  transition: color 0.3s;
  color: #8590a6;
  font-size: 14px;
  display: flex;
  align-items: center;
}

.user-actions span:hover {
  color: #056de8;
}

.user-actions span:hover .icon {
  color: #056de8;
}

.icon {
  margin-right: 5px;
  font-size: 14px;
  color: #8590a6;
  transition: color 0.3s;
}

.el-avatar {
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color 0.2s;
}

.el-avatar:hover {
  border-color: #056de8;
}

/* Main Content Styles */
.main-content {
  margin-top: 52px;
  min-height: calc(100vh - 52px);
  background-color: #f6f6f6;
  padding: 0;
}

/* 响应式处理 */
@media screen and (max-width: 1400px) {
  .header-container {
    width: 1100px;
  }
}

@media screen and (max-width: 1200px) {
  .header-container {
    width: 100%;
    max-width: 1000px;
  }
}

@media screen and (max-width: 1000px) {
  .header-left {
    min-width: 300px;
  }

  .header-search {
    min-width: 300px;
  }

  .user-actions {
    min-width: 300px;
  }
}

@media screen and (max-width: 768px) {
  .header-container {
    padding: 0 10px;
  }

  .header-left {
    min-width: auto;
  }

  .header-search {
    min-width: auto;
  }

  .user-actions {
    min-width: auto;
  }
}
</style>
