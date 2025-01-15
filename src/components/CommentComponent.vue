<template>
  <div class="comment-component">
    <h2>Comments</h2>
    <!-- 评论数量 -->
    <div class="comment-count">{{ comments.length }} 条评论</div>
    <!-- 写评论 -->
    <div class="comment-input-container">
      <el-avatar
        :src="userStore.userInfo.avatar"
        class="comment-input-avatar"
        @click="goToHome"
      />
      <el-input
        v-model="content"
        class="comment-input"
        placeholder="说点什么..."
        type="textarea"
        :rows="3"
      />
      <el-button type="primary" @click="addComment" class="comment-button">
        评论
      </el-button>
    </div>
    <!-- 展示评论 -->
    <div class="comment-list">
      <div v-for="comment in comments" :key="comment.id" class="comment-item">
        <el-avatar
          :src="comment.avatar"
          class="comment-avatar"
          @click="goToUser(comment.userId)"
        />
        <div class="comment-content">
          <div class="comment-header">
            <span class="comment-username">{{ comment.username }}</span>
            <span class="comment-time">{{ comment.time }}</span>
          </div>
          <p class="comment-text">{{ comment.content }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCommentsByArticleId, addComment } from "@/api/comment";
import { useUserStore } from "@/store/modules/user";
import { getUserInfoById } from "@/api/user";

export default {
  name: "CommentComponent",
  data() {
    return {
      articleId: 0,
      content: "",
      comments: [],
      userStore: useUserStore(),
    };
  },
  methods: {
    async init() {
      this.articleId = this.$route.params.articleId;
      const res = await getCommentsByArticleId(this.articleId);
      this.comments = res.data.data;
      this.comments.forEach(async (comment) => {
        const res = await getUserInfoById(comment.userId);
        const user = res.data.data;
        comment.avatar = user.avatar;
        comment.username = user.username;
        comment.time = this.processDate(comment.createTime);
      });
    },
    async addComment() {
      if (!this.content) {
        ElMessage.error("请输入内容");
        return;
      }
      const res = await addComment({
        userId: this.userStore.userId,
        articleId: this.articleId,
        content: this.content,
      });
      if (res.data.code === 1) {
        this.content = "";
        this.init();
      }
    },
    goToUser(userId) {
      if (userId == this.userStore.userId) {
        this.$router.push(`/home`);
      } else {
        this.$router.push(`/user/${userId}`);
      }
    },
    goToHome() {
      this.$router.push(`/home`);
    },
    processDate(date) {
      // 如果时间和当前时间差小于1分钟 显示刚刚
      const now = new Date();
      const diff = now - new Date(date);
      if (diff < 60000) {
        return "刚刚";
      }
      return new Date(date).toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        // second: "2-digit",
      });
    },
  },
  async mounted() {
    this.init();
  },
};
</script>

<style scoped>
.comment-component {
  margin: 20px auto;
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.comment-count {
  font-size: 14px;
  margin-bottom: 10px;
  color: #666;
}

.comment-input-container {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;
}

.comment-input-avatar {
  width: 40px;
  height: 40px;
  margin-right: 10px;
  cursor: pointer;
}

.comment-input {
  flex: 1;
  border-radius: 5px;
}

.comment-button {
  margin-left: 10px;
}

.comment-list {
  margin-top: 20px;
  border: 1px solid #fff;
  border-radius: 5px;
  padding: 10px;
}

.comment-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;
}

.comment-avatar {
  width: 40px;
  height: 40px;
  margin-right: 10px;
  cursor: pointer;
}

.comment-content {
  flex: 1;
  background: #fff;
  border-radius: 5px;
  padding: 10px 15px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.comment-username {
  font-weight: bold;
  color: #333;
}

.comment-time {
  font-size: 12px;
  color: #999;
}

.comment-text {
  font-size: 14px;
  color: #555;
  line-height: 1.5;
}
</style>
