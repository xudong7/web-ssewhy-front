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
        // 确保 fans 和 follows 属性存在
        if (userInfo.value.fans === undefined) userInfo.value.fans = 0;
        if (userInfo.value.follows === undefined) userInfo.value.follows = 0;
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
      userInfo.value.email = data.email;
      userInfo.value.mobile = data.mobile;
      userInfo.value.phone = data.mobile; // 同步更新phone字段

      // 更新 fans 和 follows 属性 (如果有提供)
      if (data.fans !== undefined) userInfo.value.fans = data.fans;
      if (data.follows !== undefined) userInfo.value.follows = data.follows;

      // 同步更新关注和粉丝数计数
      if (data.fansCart) {
        userInfo.value.fansCart = data.fansCart;
        if (Array.isArray(data.fansCart)) {
          userInfo.value.fans = data.fansCart.length;
        }
      }

      if (data.followsCart) {
        userInfo.value.followsCart = data.followsCart;
        if (Array.isArray(data.followsCart)) {
          userInfo.value.follows = data.followsCart.length;
        }
      }
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
  }
);
