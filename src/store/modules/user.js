// src/store/modules/user.js
import { defineStore } from "pinia";
import { ref } from "vue";
import { getUserInfoById } from "@/api/user";

export const useUserStore = defineStore(
  "user",
  () => {
    const userId = ref(0);
    const role = ref("");
    const token = ref("");
    const userInfo = ref({});
    /**
     * 登录
     */
    async function handleLogin(data) {
      token.value = data.token;
      userId.value = data.userId;
      try {
        const res = await getUserInfoById(data.userId);
        userInfo.value = res.data.data;
      } catch (error) {
        console.error("获取用户信息失败:", error);
      }
    }

    /**
     * 退出登录
     */
    function handleLogout() {
      token.value = "";
      userId.value = 0;
      userInfo.value = {};
      role.value = "";
    }

    /**
     * 更新用户信息
     */
    function updateUserInfo(data) {
      userInfo.value.username = data.username;
      userInfo.value.avatar = data.avatar;
      userInfo.value.cover = data.cover;
    }

    return {
      userId,
      role,
      token,
      userInfo,
      handleLogin,
      handleLogout,
      updateUserInfo,
    };
  },
  {
    // npm i pinia-plugin-persistedstate
    persist: true, // 开启持久化
  },
);
