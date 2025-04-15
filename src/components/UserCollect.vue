<template>
  <div class="user-collect" v-loading="loading">
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
import { getArticleById, getArticleList } from "@/api/article";
import { getUserInfoById } from "@/api/user";
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
  name: "UserCollect",
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
    async getUserCollect() {
      this.loading = true;
      try {
        const currentRoute = this.$route;
        let userId;
        if (currentRoute.name === "Home") {
          userId = this.userStore.userId;
        } else if (currentRoute.name === "User") {
          userId = currentRoute.params.userId;
        }

        // 获取用户信息，获取用户的marksCart属性
        const userRes = await getUserInfoById(userId);
        const userData = userRes.data.data;

        // 使用用户的marksCart，它已经是一个List<Integer>类型
        const markedArticleIds = userData.marksCart || [];

        if (markedArticleIds.length === 0) {
          this.articles = [];
          return;
        }

        // 获取所有文章
        const articlesRes = await getArticleList();
        const allArticles = articlesRes.data.data || [];

        // 筛选出用户收藏的文章
        this.articles = allArticles.filter((article) =>
          markedArticleIds.includes(article.id)
        );
      } catch (error) {
        console.error("获取用户收藏文章失败:", error);
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
    this.getUserCollect();
  },
  watch: {
    $route() {
      this.getUserCollect();
    },
  },
};
</script>

<style scoped>
.user-collect {
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
  gap: var(--spacing-lg);
  padding: var(--spacing-md) 0;
}

.article-item {
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid var(--border-light);
  position: relative;
  margin-bottom: var(--spacing-sm);
}

.article-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--border-hover);
}

.article-item::after {
  content: "";
  position: absolute;
  bottom: -8px;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--bg-primary) 50%,
    transparent
  );
  opacity: 0.6;
}

.article-header {
  display: flex;
  justify-content: space-between;
  padding: var(--spacing-lg) var(--spacing-xl);
  cursor: pointer;
  position: relative;
  background: var(--bg-primary);
}

.article-main {
  flex: 1;
  margin-right: var(--spacing-xl);
}

.article-cover {
  width: 200px;
  height: 134px;
  border-radius: var(--radius-md);
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-light);
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
  color: var(--text-primary);
  line-height: 1.4;
  margin-bottom: var(--spacing-md);
  transition: color 0.3s ease;
}

.article-item:hover .article-title {
  color: var(--primary-color);
}

.article-description {
  font-size: 15px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: var(--spacing-md);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  position: relative;
  padding-right: var(--spacing-md);
}

.article-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  color: var(--text-tertiary);
  font-size: 14px;
  padding-top: var(--spacing-sm);
  border-top: 1px solid var(--border-light);
}

.article-meta span {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.status {
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--radius-sm);
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-weight: 500;
}

.status.published {
  background: var(--bg-secondary);
  color: var(--primary-color);
}

.status.draft {
  background: var(--bg-secondary);
  color: var(--text-tertiary);
}

.article-footer {
  padding: var(--spacing-md) var(--spacing-xl);
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.action-items {
  display: flex;
  align-items: center;
  gap: var(--spacing-xl);
}

.action-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--text-tertiary);
  font-size: 14px;
  transition: all 0.3s ease;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
}

.action-item:hover {
  color: var(--primary-color);
  background: var(--bg-secondary);
}

@media screen and (max-width: 768px) {
  .user-collect {
    padding: 10px;
  }

  .empty-state {
    min-height: 300px;
    padding: var(--spacing-md);
  }

  .article-list {
    gap: 10px;
    padding: 5px 0;
  }

  .article-item {
    border-radius: 8px;
    margin-bottom: 8px;
  }

  .article-header {
    padding: 12px;
  }

  .article-main {
    margin-right: 10px;
  }

  .article-cover {
    width: 90px;
    height: 60px;
  }

  .article-title {
    font-size: 16px;
    margin-bottom: 8px;
  }

  .article-description {
    font-size: 13px;
    line-height: 1.4;
    margin-bottom: 8px;
    -webkit-line-clamp: 2;
  }

  .article-meta {
    font-size: 12px;
    gap: 8px;
  }

  .article-footer {
    padding: 10px;
    flex-direction: column;
    gap: 8px;
  }

  .action-items {
    width: 100%;
    justify-content: space-between;
    gap: 4px;
    flex-wrap: wrap;
  }

  .action-item {
    font-size: 12px;
    padding: 4px 6px;
  }

  .create-button {
    width: 120px;
    height: 36px;
    font-size: 14px;
  }
}

@media screen and (max-width: 320px) {
  .user-collect {
    padding: 8px;
  }

  .article-cover {
    width: 80px;
    height: 50px;
  }

  .article-title {
    font-size: 15px;
  }

  .article-description {
    font-size: 12px;
  }

  .action-item {
    font-size: 11px;
    padding: 3px 5px;
  }

  .article-meta {
    font-size: 11px;
  }
}
</style>
