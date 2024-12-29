// src/store/modules/user.js
import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore("user", () => {
  const userInfo = ref({});
  const role = ref("");
  const token = ref("");
  
  /**
   * 登录
   */
  function handleLogin(_token) {
    token.value = _token;
  }

  /**
   * 退出登录
   */
  function handleLogout() {
    token.value = "";
  }

  return {
    userInfo,
    role,
    token,
    handleLogin,
    handleLogout,
  };
});
