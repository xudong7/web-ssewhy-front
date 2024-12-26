<template>
  <header class="header">
    <div class="logo">XXX</div>
    <div class="search-bar">
      <input type="text" placeholder="提问" />
      <button>搜索</button>
    </div>
    <div class="user-actions">
      <span>消息</span>
      <span>私信</span>
      <span>创作中心</span>
      <span>草稿箱</span>
      <img src="https://img.icons8.com/ios/452/user" alt="用户头像" />
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
    getActiveMenu() {
      const path = this.$route.path;
      return "hall";
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
  padding: 15px 30px;
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid #f0f0f0;
  font-family: Arial, sans-serif;
}

.logo {
  font-size: 28px;
  font-weight: bold;
  color: #333;
}

.search-bar {
  display: flex;
  align-items: center;
  position: relative;
}

.search-bar input {
  padding: 8px 15px;
  border: 1px solid #ccc;
  border-radius: 25px;
  width: 250px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s;
}

.search-bar input:focus {
  border-color: #007aff;
}

.search-bar button {
  padding: 8px 15px;
  background-color: #007aff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 25px;
  position: absolute;
  right: -10px;
  transition: background-color 0.3s;
}

.search-bar button:hover {
  background-color: #0056b3;
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
  color: #007aff;
}

.user-actions img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid #007aff;
  cursor: pointer;
}

/* Main Content Styles */
.main-content {
  padding: 20px;
  background-color: #f9f9f9;
}
</style>
