<template>
  <div class="user-articles">
    <el-loading :loading="loading" />

    <div v-if="!loading && articles.length === 0" class="empty-state">
      <el-empty description="暂无文章">
        <template #extra>
          <el-button
            type="primary"
            class="create-button"
            @click="$router.push('/write')"
          >
            <el-icon><Plus /></el-icon>
            创作文章
          </el-button>
        </template>
      </el-empty>
    </div>

    <div v-else class="article-list">
      <div class="article-item" v-for="article in articles" :key="article.id">
        <div class="article-header" @click="goDetail(article.id)">
          <div class="article-main">
            <h2 class="article-title">{{ article.title }}</h2>
            <p class="article-description">
              {{ formatContent(article.content) }}
            </p>
            <div class="article-meta">
              <span class="create-time">
                <el-icon><Calendar /></el-icon>
                {{ formatDate(article.createTime) }}
              </span>
              <span
                class="status"
                :class="article.status === 1 ? 'published' : 'draft'"
              >
                <el-icon><Document /></el-icon>
                {{ article.status === 1 ? "已发布" : "草稿" }}
              </span>
            </div>
          </div>
          <div v-if="article.cover" class="article-cover">
            <img :src="article.cover" alt="封面" class="article-cover-img" />
          </div>
        </div>

        <div class="article-footer">
          <div class="action-items">
            <span class="action-item">
              <el-icon><View /></el-icon>
              {{ article.views || 0 }} 阅读
            </span>
            <span class="action-item">
              <el-icon><Star /></el-icon>
              {{ article.likes || 0 }} 喜欢
            </span>
            <span class="action-item">
              <el-icon><Collection /></el-icon>
              {{ article.marks || 0 }} 收藏
            </span>
            <span class="action-item">
              <el-icon><ChatDotRound /></el-icon>
              {{ article.comments || 0 }} 评论
            </span>
          </div>
          <div class="article-actions">
            <el-button type="primary" link @click="goDetail(article.id)">
              阅读全文
              <el-icon class="el-icon--right"><ArrowRight /></el-icon>
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getArticleList } from "@/api/article";
import { useUserStore } from "@/store/modules/user";
import {
  Calendar,
  Document,
  View,
  Star,
  Collection,
  ChatDotRound,
  ArrowRight,
  Plus,
} from "@element-plus/icons-vue";

export default {
  name: "UserArticles",
  components: {
    Calendar,
    Document,
    View,
    Star,
    Collection,
    ChatDotRound,
    ArrowRight,
    Plus,
  },
  data() {
    return {
      articles: [],
      userStore: useUserStore(),
      loading: false,
    };
  },
  methods: {
    async getUserArticles() {
      this.loading = true;
      try {
        // 获取当前路由信息
        const currentRoute = this.$route;
        let userId;

        // 根据路由名称判断获取哪个用户的文章
        if (currentRoute.name === "Home") {
          // 在个人主页显示当前登录用户的文章
          userId = this.userStore.userId;
        } else if (currentRoute.name === "User") {
          // 在用户页面显示对应用户的文章
          userId = currentRoute.params.userId;
        }

        // 获取文章列表
        const res = await getArticleList();

        this.articles = res.data.data.filter(
          // userId 是字符串类型,需要转换为数字类型
          (article) => article.userId === parseInt(userId),
        );
      } catch (error) {
        console.error("获取用户文章失败:", error);
        ElMessage.error("获取文章列表失败");
      } finally {
        this.loading = false;
      }
    },
    formatContent(content) {
      if (!content) return "";
      const maxLength = 200;
      const plainText = content.replace(/<[^>]+>/g, "");
      return plainText.length > maxLength
        ? plainText.slice(0, maxLength) + "..."
        : plainText;
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    },
    goDetail(articleId) {
      this.$router.push(`/detail/${articleId}`);
    },
  },
  mounted() {
    this.getUserArticles();
  },
  watch: {
    // 监听路由变化,重新获取文章列表
    $route() {
      this.getUserArticles();
    },
  },
};
</script>

<style scoped>
.user-articles {
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

.create-button {
  margin-top: var(--spacing-md);
  width: 140px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 16px 0;
}

.article-item {
  background: var(--bg-primary);
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid #ebeef5;
  position: relative;
  margin-bottom: 8px;
}

.article-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border-color: #e4e7ed;
}

.article-item::after {
  content: "";
  position: absolute;
  bottom: -8px;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, #e4e7ed 50%, transparent);
  opacity: 0.6;
}

.article-header {
  display: flex;
  justify-content: space-between;
  padding: 20px 24px;
  cursor: pointer;
  position: relative;
  background: linear-gradient(to bottom, #ffffff, #fafafa);
}

.article-main {
  flex: 1;
  margin-right: 24px;
}

.article-cover {
  width: 200px;
  height: 134px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #ebeef5;
}

.article-cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.article-cover-img:hover {
  transform: scale(1.05);
}

.article-title {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  line-height: 1.4;
  margin-bottom: 12px;
  transition: color 0.3s ease;
}

.article-item:hover .article-title {
  color: var(--primary-color);
}

.article-description {
  font-size: 15px;
  color: #606266;
  line-height: 1.6;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  position: relative;
  padding-right: 16px;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  color: #909399;
  font-size: 14px;
  padding-top: 8px;
  border-top: 1px dashed #ebeef5;
}

.article-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.status {
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;
}

.status.published {
  background: rgba(64, 158, 255, 0.1);
  color: #409eff;
}

.status.draft {
  background: rgba(144, 147, 153, 0.1);
  color: #909399;
}

.article-footer {
  padding: 16px 24px;
  background: #fafafa;
  border-top: 1px solid #ebeef5;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.action-items {
  display: flex;
  align-items: center;
  gap: 24px;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #909399;
  font-size: 14px;
  transition: all 0.3s ease;
  padding: 4px 8px;
  border-radius: 4px;
}

.action-item:hover {
  color: var(--primary-color);
  background: rgba(64, 158, 255, 0.1);
}

.article-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

:deep(.el-icon) {
  font-size: 16px;
  vertical-align: middle;
}

:deep(.el-button--link) {
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

:deep(.el-button--link:hover) {
  background: rgba(64, 158, 255, 0.1);
}

:deep(.el-empty__description) {
  margin-top: var(--spacing-lg);
  color: var(--text-tertiary);
}

@media screen and (max-width: 768px) {
  .article-cover {
    width: 120px;
    height: 80px;
  }

  .article-header {
    padding: 16px;
  }

  .article-footer {
    padding: 12px 16px;
    flex-direction: column;
    gap: 12px;
  }

  .action-items {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
