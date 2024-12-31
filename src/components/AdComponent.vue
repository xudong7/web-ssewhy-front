<template>
  <div class="right-column">
    <div class="recommended-follows">
      <h3 class="recommended-title">推荐关注</h3>
      <div class="user-list">
        <div class="user-card" v-for="user in recommendedUsers" :key="user.id">
          <div class="user-avatar">
            <img :src="user.avatar" alt="用户头像" />
          </div>
          <div class="user-info">
            <div class="username">{{ user.username }}</div>
            <div class="description">{{ user.description }}</div>
            <el-button type="primary" size="small" class="follow-btn"
              >关注</el-button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAllUsers } from "@/api/user.js";
export default {
  name: "AdComponent",
  data() {
    return {
      recommendedUsers: [],
    };
  },
  methods: {
    async getRecommendedUsers() {
      const res = await getAllUsers();
      this.recommendedUsers = res.data.data;
    },
  },
  mounted() {
    this.getRecommendedUsers();
  },
};
</script>

<style scoped>
/* Recommended Follows Section */
.recommended-follows {
  background: #fff;
  border-radius: 8px;
}

.recommended-title {
  font-size: 16px;
  font-weight: 600;
  color: #121212;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.user-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.user-card {
  display: flex;
  align-items: flex-start;
  padding: 12px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.user-card:hover {
  background-color: #f6f6f6;
}

.user-avatar {
  margin-right: 12px;
  flex-shrink: 0;
}

.user-avatar img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.username {
  font-size: 15px;
  font-weight: 500;
  color: #121212;
}

.description {
  font-size: 13px;
  color: #8590a6;
  margin-bottom: 8px;
}

.follow-btn {
  width: fit-content;
  font-size: 14px;
  padding: 4px 16px;
  border-radius: 3px;
  background-color: #056de8;
  color: #fff;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.follow-btn:hover {
  background-color: #0461cf;
}

.right-column {
  flex: 1;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(18, 18, 18, 0.1);
  padding: 16px;
}
</style>
