<template>
  <header class="header">
    <div class="header-container">
      <div class="header-left">
        <div class="logo">
          <span @click="goHall"> sse-why </span>
        </div>
        <el-menu
          :default-active="activeMenu"
          :ellipsis="false"
          class="menu"
          mode="horizontal"
          @select="handleSelect"
        >
          <el-menu-item index="hall" @click="goHall" class="hide-mobile"
            >主页</el-menu-item
          >
          <el-menu-item index="download" @click="goDownload" class="hide-mobile"
            >下载</el-menu-item
          >
          <el-menu-item
            index="knowledge"
            @click="goKnowledge"
            class="hide-mobile"
            >知识</el-menu-item
          >
          <!-- <el-menu-item index="pins" @click="goPins" class="hide-mobile"
            >想法</el-menu-item
          > -->
        </el-menu>
      </div>
      <div class="header-search">
        <div class="search-bar">
          <el-input
            v-model="searchText"
            placeholder="搜索..."
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
          <el-button
            type="primary"
            class="search-button hide-mobile"
            @click="handleSearch"
            >搜索</el-button
          >
        </div>
      </div>
      <div class="user-actions">
        <!-- <span class="hide-mobile"
          ><el-icon class="icon"><Message /></el-icon>
          <div class="hide-mobile">消息</div>
        </span> -->
        <span class="hide-mobile" @click="goUpload"
          ><el-icon class="icon"><Upload /></el-icon>
          <div class="hide-mobile">上传</div>
        </span>
        <span class="hide-mobile"
          ><el-icon class="icon"><ChatDotRound /></el-icon>
          <div class="hide-mobile">交流</div>
        </span>
        <span @click="goWrite"
          ><el-icon class="icon"><Edit /></el-icon>
          <div class="hide-mobile">创作</div>
        </span>
        <span @click="toggleTheme">
          <el-icon class="icon" v-if="isDarkTheme"><Moon /></el-icon>
          <el-icon class="icon" v-else><Sunny /></el-icon>
          <div class="hide-mobile">{{ isDarkTheme ? "深色" : "浅色" }}</div>
        </span>
        <span @click="goLogin">
          <el-icon class="icon"><SwitchButton /></el-icon>
          <span class="hide-mobile">登出</span>
        </span>
        <el-avatar
          @click="goHome"
          :size="36"
          :src="userStore.userInfo.avatar"
        ></el-avatar>
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
  Moon,
  Sunny,
  Upload,
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
    Moon,
    Sunny,
    Upload,
    FooterComponent,
  },
  data() {
    return {
      activeMenu: this.getActiveMenu(),
      userStore: useUserStore(),
      searchText: "",
      isFocused: false,
      isDarkTheme: false,
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
    goUpload() {
      this.$router.push("/upload");
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
    toggleTheme() {
      this.isDarkTheme = !this.isDarkTheme;
      // 设置 HTML data-theme 属性
      document.documentElement.setAttribute(
        "data-theme",
        this.isDarkTheme ? "dark" : "light",
      );
      // 设置 Element Plus 暗黑模式
      if (this.isDarkTheme) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      localStorage.setItem("theme", this.isDarkTheme ? "dark" : "light");
    },
  },
  watch: {
    $route() {
      this.activeMenu = this.getActiveMenu();
    },
  },
  mounted() {
    // 从 localStorage 中获取主题设置
    const savedTheme = localStorage.getItem("theme") || "light";
    this.isDarkTheme = savedTheme === "dark";
    // 设置 HTML data-theme 属性
    document.documentElement.setAttribute("data-theme", savedTheme);
    // 设置 Element Plus 暗黑模式
    if (this.isDarkTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
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
  background-color: var(--bg-primary);
  box-shadow: var(--shadow-sm);
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
  color: var(--primary-color);
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

.el-menu-item {
  font-size: 14px;
  padding-right: 20px;
  padding-top: 5px;
}

.search-bar {
  width: 100%;
  max-width: 400px;
}

.search-bar :deep(.el-input__wrapper) {
  background-color: var(--bg-tertiary);
  border-radius: var(--radius-full);
  padding: 0 12px;
  transition: var(--transition-all);
}

.search-bar :deep(.el-input__wrapper.is-focus) {
  background-color: var(--bg-primary);
  box-shadow: 0 0 0 2px var(--primary-bg);
}

.search-bar :deep(.el-input__inner) {
  height: 36px;
  font-size: 16px;
  color: var(--text-primary);
}

.search-bar :deep(.el-input__inner)::placeholder {
  color: var(--text-tertiary);
}

.search-icon {
  font-size: 18px;
  color: var(--text-tertiary);
  margin-right: 8px;
}

.search-button {
  background-color: var(--primary-color);
  border: none;
  border-radius: var(--radius-full);
  transition: var(--transition-all);
  color: var(--text-inverse);
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 14px;
  padding: 0 16px;
  height: 36px;
  margin-left: 16px;
}

.search-button:hover {
  background-color: var(--primary-hover);
  color: var(--text-inverse);
}

.user-actions {
  display: flex;
  align-items: center;
  min-width: 400px;
  padding-top: 5px;
  justify-content: flex-end;
}

.user-actions span {
  margin-right: 15px;
  cursor: pointer;
  transition: var(--transition-colors);
  color: var(--text-tertiary);
  font-size: 14px;
  display: flex;
  align-items: center;
}

.user-actions span :hover {
  color: var(--primary-color);
}

.user-actions span :hover .icon {
  color: var(--primary-color);
}

.icon {
  margin-right: 5px;
  font-size: 14px;
  color: var(--text-tertiary);
  transition: var(--transition-colors);
}

.el-avatar {
  cursor: pointer;
  border: 2px solid transparent;
  transition: var(--transition-colors);
}

.el-avatar:hover {
  border-color: var(--primary-color);
}

/* Main Content Styles */
.main-content {
  margin-top: 52px;
  min-height: calc(100vh - 52px);
  background-color: var(--bg-secondary);
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
    padding-right: 10px;
  }

  .header-left {
    min-width: auto;
  }

  .logo {
    padding-left: 5px;
    margin: 0;
    font-size: 20px;
  }

  .header-search {
    min-width: 120px;
    padding-right: 10px;
    padding-top: 5px;
  }

  .search-bar {
    max-width: 150px;
  }

  .user-actions {
    min-width: 15px;
  }

  .user-actions span {
    margin-right: 10px;
  }

  .hide-mobile {
    display: none !important;
  }

  .menu {
    padding: 0 5px;
  }

  .el-menu-item {
    padding-right: 10px;
    padding-top: 5px;
  }

  .search-bar :deep(.el-input__inner) {
    height: 32px;
    font-size: 12px;
  }

  .el-avatar {
    width: 32px;
    height: 32px;
  }
}

/* 添加平板响应式样式 */
@media screen and (min-width: 769px) and (max-width: 1024px) {
  .header-container {
    width: 100%;
    padding: 0 15px;
  }

  .header-search {
    min-width: 200px;
  }

  .user-actions {
    min-width: 250px;
  }
}
</style>
