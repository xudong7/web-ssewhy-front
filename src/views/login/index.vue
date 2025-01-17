<!--src/views/login/index.vue-->
<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-title">
        <h2>欢迎登录</h2>
      </div>
      <div class="login-form">
        <el-form :model="loginForm" :rules="rules" ref="loginFormRef">
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="请输入用户名"
              prefix-icon="el-icon-user"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              prefix-icon="el-icon-lock"
              show-password
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleLogin" class="login-button"
              >登录</el-button
            >
          </el-form-item>
        </el-form>
        <div class="login-options">
          <el-checkbox v-model="rememberMe">记住我</el-checkbox>
          <router-link to="/register" class="register-link"
            >注册账号</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { login } from "@/api/user";
import { useUserStore } from "@/store/modules/user";

export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
      },
      rememberMe: false,
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    handleLogin() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (valid) {
          try {
            const res = await login(this.loginForm);
            console.log("登录响应：", res);
            if (res.data.code === 1) {
              const userStore = useUserStore();
              // 后端返回的token和id
              await userStore.handleLogin({
                token: res.data.data.token,
                userId: res.data.data.id,
              });

              ElMessage.success("登录成功");
              this.$router.push("/hall");
            } else {
              ElMessage.error(res.data.msg || "登录失败");
            }
          } catch (error) {
            console.error("登录失败:", error);
            ElMessage.error("登录失败，请稍后重试");
          }
        }
      });
    },
  },
};
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--bg-secondary);
}

.login-box {
  width: 400px;
  padding: 40px;
  background: var(--bg-primary);
  border-radius: 8px;
  box-shadow: var(--shadow-sm);
}

.login-title {
  text-align: center;
  margin-bottom: 30px;
  color: var(--text-primary);
}

.login-title h2 {
  margin: 0;
}

.login-form {
  margin-top: 20px;
  background: var(--bg-primary);
}

.login-button {
  width: 100%;
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: var(--text-inverse);
}

.login-button:hover {
  background-color: var(--primary-hover);
  border-color: var(--primary-hover);
  color: var(--text-inverse);
}

.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.register-link {
  color: var(--primary-color);
  text-decoration: none;
}

.register-link:hover {
  color: var(--primary-hover);
}
</style>
