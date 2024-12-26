<!--src/views/login/index.vue-->
<script setup>
import useUserStore from "../../store/modules/user";
import { getCodeInfo } from "../../api/user";
import { onMounted, ref } from "vue";

const userStore = useUserStore();
const captchaInfo = ref("");

/**
 * 登录
 */
function login() {
  userStore
    .handleLogin()
    .then((res) => {
      ElMessage.success(res);
    })
    .catch((err) => {
      ElMessage.error(err);
    });
}

/**
 * 退出登录
 */
function loginOut() {
  userStore
    .handleLogout()
    .then(() => {
      ElMessage.success("退出登录成功");
    })
    .catch((err) => {
      ElMessage.error(err);
    });
}

onMounted(() => {
  getCodeInfo(new Date().getTime()).then(({ data }) => {
    captchaInfo.value = data.result;
  });
});
</script>

<template>
  <div class="login-container">
    <el-button type="primary" @click="login">登 录</el-button>
    <el-button type="primary" @click="loginOut">退出登录</el-button>

    <hr />
    <h1>当前登录状态：{{ userStore.loginStatus ? "已登录" : "未登录" }}</h1>
    <ul>
      <li>用户名：{{ userStore.userInfo.name }}</li>
      <li>头 像：<img :src="userStore.userInfo.avatar" alt="" /></li>
      <li>验证码：<img :src="captchaInfo" alt="" /></li>
    </ul>
  </div>
</template>
