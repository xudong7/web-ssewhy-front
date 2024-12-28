<template>
  <header class="header">
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
        <el-menu-item index="knowledge" @click="goKnowledge">知识</el-menu-item>
        <el-menu-item index="pins" @click="goPins">想法</el-menu-item>
      </el-menu>
    </div>
    <div class="header-search">
      <div class="search-bar">
        <el-input
          placeholder="搜索你感兴趣的内容..."
          prefix-icon="el-icon-search"
          class="search-input"
        >
          <template #append>
            <el-button type="primary" class="search-button"> 搜索 </el-button>
          </template>
        </el-input>
      </div>
    </div>
    <div class="user-actions">
      <span>消息</span>
      <span>私信</span>
      <span @click="goWrite">创作</span>
      <span>草稿箱</span>
      <el-avatar
        @click="goHome"
        :size="36"
        src="https://picx.zhimg.com/v2-c1785039cba7dea512f25cc7d0481328_xll.jpg?source=32738c0c&needBackground=1"
      ></el-avatar>
    </div>
  </header>
  <el-main class="main-content">
    <router-view></router-view>
  </el-main>
</template>

<script>
export default {
  name: "HeaderLayout",
  data() {
    return {
      activeMenu: this.getActiveMenu(),
    };
  },
  methods: {
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
  padding: 0 40px;
  height: 52px;
  background-color: #ffffff;
  box-shadow: 0 1px 3px rgba(18, 18, 18, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
  flex: 0 0 30%;
}

.header-search {
  display: flex;
  align-items: center;
  gap: 20px;
  flex: 0 0 20%;
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
}

.search-bar {
  width: 400px;
  flex-shrink: 0;
  position: relative;
}

.search-bar :deep(.el-input__inner) {
  font-size: 14px;
  background: #f6f6f6;
  border: 2px solid transparent;
  padding-left: 20px;
  transition: all 0.3s ease;
}

.search-bar :deep(.el-input__inner):hover,
.search-bar :deep(.el-input__inner):focus {
  background: #ffffff;
  border-color: #056de8;
  box-shadow: 0 0 8px rgba(5, 109, 232, 0.2);
}

.search-bar :deep(.el-input-group__append) {
  background-color: #056de8;
  border: none;
  padding: 0 20px;
  transition: all 0.3s ease;
}

.search-bar :deep(.el-input-group__append button) {
  background: transparent;
  border: none;
  font-size: 16px;
  padding: 8px 15px;
  color: #fff;
}

.search-bar :deep(.el-input-group__append):hover {
  background-color: #0461cf;
}

.search-button {
  border-top-right-radius: 999px;
  border-bottom-right-radius: 999px;
}

.user-actions {
  display: flex;
  align-items: center;
  font-size: 14px;
}

.user-actions span {
  margin-right: 15px;
  cursor: pointer;
  transition: color 0.3s;
}

.user-actions span:hover {
  color: #056de8;
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
</style>
