<template>
  <div class="fans-container">
    <div v-loading="loading" class="user-list">
      <div v-if="fansList.length === 0" class="empty-state">暂无粉丝</div>
      <div v-else class="user-card" v-for="user in fansList" :key="user.id">
        <div class="user-avatar" @click="goUser(user.id)">
          <el-image
            :src="user.avatar"
            alt="用户头像"
            fit="cover"
            style="width: 50px; height: 50px; border-radius: 50%"
          >
            <template #error>
              <img
                src="https://th.bing.com/th/id/OIP.ClY0OPQozu6eTKTQEt1hgwHaHa?rs=1&pid=ImgDetMain"
                alt="默认头像"
              />
            </template>
          </el-image>
        </div>
        <div class="user-info">
          <div class="username" @click="goUser(user.id)">
            {{ user.username }}
          </div>
          <div class="description">{{ user.description || "暂无简介" }}</div>
        </div>
        <el-button
          type="primary"
          @click="handleFollow(user)"
          size="small"
          class="follow-btn"
          :class="{ 'is-followed': user.isFollowed }"
          :plain="!user.isFollowed"
        >
          <el-icon
            ><component :is="user.isFollowed ? 'Check' : 'Plus'"
          /></el-icon>
          {{ user.isFollowed ? "取消关注" : "关注" }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserInfoById, handleFollow } from "@/api/user";
import { useUserStore } from "@/store/modules/user";
import { Plus, Check } from "@element-plus/icons-vue";

export default {
  name: "UserFans",
  components: {
    Plus,
    Check,
  },
  data() {
    return {
      loading: false,
      fansList: [],
      userStore: useUserStore(),
    };
  },
  computed: {
    // 根据路由判断要显示的用户ID
    targetUserId() {
      const path = this.$route.path;
      if (path.startsWith("/user/")) {
        return this.$route.params.userId;
      }
      return this.userStore.userId;
    },
  },
  methods: {
    async getFansList() {
      try {
        this.loading = true;
        const res = await getUserInfoById(this.targetUserId);
        if (res.data.code === 1) {
          const userInfo = res.data.data;
          // 从用户的fansCart中获取粉丝ID列表
          const fansIds = userInfo.fansCart
            ? userInfo.fansCart.split(",").filter((id) => id)
            : [];

          // 获取每个粉丝的详细信息
          const promises = fansIds.map((id) => getUserInfoById(id));
          const results = await Promise.all(promises);

          // 获取当前登录用户的关注列表，用于判断是否已关注这些粉丝
          const currentUserRes = await getUserInfoById(this.userStore.userId);
          const followIds = currentUserRes.data.data.followCart
            ? currentUserRes.data.data.followCart.split(",").filter((id) => id)
            : [];

          this.fansList = results
            .filter((res) => res.data.code === 1)
            .map((res) => ({
              ...res.data.data,
              isFollowed: followIds.includes(res.data.data.id.toString()),
            }));
        }
      } catch (error) {
        console.error("获取粉丝列表失败:", error);
        ElMessage.error("获取粉丝列表失败");
      } finally {
        this.loading = false;
      }
    },
    async handleFollow(user) {
      // 如果是当前登录用户，不允许关注操作
      if (user.id === this.userStore.userId) {
        ElMessage.error("不能关注自己");
        return;
      }

      try {
        const res = await handleFollow(user.id, this.userStore.userId);
        if (res.data.code === 1) {
          user.isFollowed = !user.isFollowed;
          ElMessage.success(user.isFollowed ? "关注成功" : "已取消关注");
        } else {
          ElMessage.error(res.data.msg || "操作失败");
        }
      } catch (error) {
        console.error("关注操作失败:", error);
        ElMessage.error("操作失败");
      }
    },
    goUser(id) {
      this.$router.push(`/user/${id}`);
    },
  },
  mounted() {
    this.getFansList();
  },
};
</script>

<style scoped>
.fans-container {
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(18, 18, 18, 0.1);
  padding: 20px;
}

.user-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.empty-state {
  text-align: center;
  color: #8590a6;
  padding: 40px 0;
}

.user-card {
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.user-card:hover {
  background-color: #f6f6f6;
}

.user-avatar {
  cursor: pointer;
  margin-right: 12px;
  flex-shrink: 0;
}

.user-info {
  flex: 1;
  min-width: 0;
  margin-right: 12px;
}

.username {
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  color: #121212;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.username:hover {
  color: #175199;
}

.description {
  font-size: 14px;
  color: #8590a6;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.follow-btn {
  padding: 0 12px;
  height: 28px;
  font-size: 13px;
  border-radius: 3px;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.3s ease;
}

.follow-btn.is-followed {
  background-color: #f2f3f5;
  border-color: #e5e6eb;
  color: #8590a6;
}

.follow-btn.is-followed:hover {
  background-color: #f7f8fa;
  color: #ff4d4f;
}

.follow-btn.is-followed:hover .el-icon {
  transform: scale(1.1);
}

.follow-btn :deep(.el-icon) {
  font-size: 12px;
  transition: transform 0.2s ease;
}
</style>
