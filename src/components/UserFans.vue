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
.user-fans {
  max-width: 900px;
  margin: 0 auto;
  padding: var(--spacing-lg);
}

.empty-state {
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl) 0;
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.user-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.user-card {
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid var(--border-light);
  padding: var(--spacing-md);
  display: flex;
  align-items: center;
}

.user-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--border-hover);
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-right: var(--spacing-md);
  background: var(--bg-tertiary);
  flex-shrink: 0;
  cursor: pointer;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.user-info {
  flex: 1;
  min-width: 0;
  margin-right: var(--spacing-md);
}

.username {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
  cursor: pointer;
}

.username:hover {
  color: var(--primary-color);
}

.description {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.follow-btn {
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--radius-md);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: var(--primary-color);
  color: var(--bg-primary);
  border: none;
}

.follow-btn:hover {
  background: var(--primary-hover);
}

.follow-btn.is-followed {
  background: var(--bg-tertiary);
  color: var(--text-secondary);
}

.follow-btn.is-followed:hover {
  background: var(--error-color);
  color: var(--bg-primary);
}

@media screen and (max-width: 768px) {
  .user-card {
    padding: var(--spacing-sm);
  }

  .user-avatar {
    width: 40px;
    height: 40px;
    margin-right: var(--spacing-sm);
  }

  .username {
    font-size: 14px;
  }

  .description {
    font-size: 12px;
  }
}
</style>
