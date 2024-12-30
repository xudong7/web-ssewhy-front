<template>
  <div class="register-container">
    <div class="register-box">
      <div class="register-title">
        <h2>用户注册</h2>
      </div>
      <div class="register-form">
        <el-form
          :model="registerForm"
          :rules="rules"
          ref="registerFormRef"
          label-width="80px"
        >
          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="registerForm.username"
              placeholder="请输入用户名"
              prefix-icon="el-icon-user"
            />
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input
              v-model="registerForm.password"
              type="password"
              placeholder="请输入密码"
              prefix-icon="el-icon-lock"
              show-password
            />
          </el-form-item>

          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input
              v-model="registerForm.confirmPassword"
              type="password"
              placeholder="请再次输入密码"
              prefix-icon="el-icon-lock"
              show-password
            />
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <el-input
              v-model="registerForm.email"
              placeholder="请输入邮箱"
              prefix-icon="el-icon-message"
            />
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              @click="handleRegister"
              class="register-button"
              >注册</el-button
            >
          </el-form-item>
        </el-form>
        <div class="login-link">
          已有账号？<router-link to="/login">立即登录</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { register } from "@/api/user";

export default {
  name: "Register",
  data() {
    // 密码验证规则
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.registerForm.confirmPassword !== "") {
          this.$refs.registerFormRef.validateField("confirmPassword");
        }
        callback();
      }
    };
    // 确认密码验证规则
    const validateConfirmPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.registerForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    // 邮箱验证规则
    const validateEmail = (rule, value, callback) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value === "") {
        callback(new Error("请输入邮箱"));
      } else if (!emailRegex.test(value)) {
        callback(new Error("请输入正确的邮箱格式"));
      } else {
        callback();
      }
    };

    return {
      registerForm: {
        username: "",
        password: "",
        email: "",
      },
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
          { required: true, validator: validatePass, trigger: "blur" },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur",
          },
        ],
        confirmPassword: [
          { required: true, validator: validateConfirmPass, trigger: "blur" },
        ],
        email: [{ required: true, validator: validateEmail, trigger: "blur" }],
      },
    };
  },
  methods: {
    handleRegister() {
      this.$refs.registerFormRef.validate(async (valid) => {
        if (valid) {
          try {
            // 构造注册数据，移除确认密码字段
            const registerData = {
              username: this.registerForm.username,
              password: this.registerForm.password,
              email: this.registerForm.email,
            };

            const res = await register(registerData);
            console.log("注册响应：", res); // 添加日志

            if (res.data.code === 1) {
              ElMessage.success("注册成功");
              this.$router.push("/login");
            } else {
              ElMessage.error(res.data.msg || "注册失败");
            }
          } catch (error) {
            console.error("注册失败:", error);
            if (error.response) {
              ElMessage.error(error.response.data.msg || "注册失败");
            } else {
              ElMessage.error("网络请求失败，请稍后重试");
            }
          }
        }
      });
    },
  },
};
</script>

<style scoped>
.register-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
}

.register-box {
  width: 500px;
  padding: 40px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.register-title {
  text-align: center;
  margin-bottom: 30px;
}

.register-title h2 {
  color: #303133;
  margin: 0;
}

.register-form {
  margin-top: 20px;
}

.register-button {
  width: 100%;
}

.login-link {
  text-align: center;
  margin-top: 20px;
  color: #606266;
  font-size: 14px;
}

.login-link a {
  color: #409eff;
  text-decoration: none;
}

.login-link a:hover {
  color: #66b1ff;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}

:deep(.el-input__inner) {
  height: 40px;
}

:deep(.el-button) {
  height: 40px;
  font-size: 16px;
}
</style>
