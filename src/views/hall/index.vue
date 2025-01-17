<template>
  <div class="hall-page">
    <div class="hall-container">
      <!-- 左侧空白区域 -->
      <div class="left-aside"></div>

      <!-- 主内容区 -->
      <div class="main-content">
        <div class="article-list">
          <div
            class="article-item"
            v-for="article in articles"
            :key="article.id"
          >
            <div class="article-header" @click="goDetail(article.id)">
              <div v-if="article.cover" class="article-cover">
                <el-image
                  :src="article.cover"
                  fit="cover"
                  lazy
                  class="cover-image"
                >
                  <template #error>
                    <div class="image-slot">
                      <el-icon><Picture /></el-icon>
                    </div>
                  </template>
                </el-image>
              </div>
              <div class="article-main">
                <h2 class="article-title">{{ article.title }}</h2>
                <p class="article-description">
                  {{ formatContent(article.content) }}
                </p>
              </div>
            </div>
            <div class="article-footer">
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
          </div>
        </div>
      </div>

      <!-- 右侧广告区域 -->
      <div class="right-aside">
        <AdComponent />
      </div>
    </div>

    <!-- 返回顶部按钮 -->
    <el-backtop
      :right="40"
      :bottom="80"
      :visibility-height="300"
      class="back-to-top"
    >
      <div class="back-top-content">
        <el-icon><CaretTop /></el-icon>
        <span>顶部</span>
      </div>
    </el-backtop>
  </div>
</template>

<script>
import { getArticleList } from "@/api/article";
import {
  View,
  Star,
  Collection,
  ChatDotRound,
  CaretTop,
  Picture,
} from "@element-plus/icons-vue";

export default {
  name: "Hall",
  components: {
    View,
    Star,
    Collection,
    ChatDotRound,
    CaretTop,
    Picture,
  },
  data() {
    return {
      articles: [],
      loading: false,
    };
  },
  methods: {
    async getArticles() {
      this.loading = true;
      try {
        const res = await getArticleList();
        if (res.data.code === 1) {
          this.articles = res.data.data.filter((item) => item.status === 1);
        }
      } catch (error) {
        console.error("获取文章列表失败:", error);
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
    goDetail(articleId) {
      this.$router.push(`/detail/${articleId}`);
    },
  },
  mounted() {
    this.getArticles();
  },
};
</script>

<style scoped>
.hall-page {
  min-height: calc(100vh - 52px);
  background-color: var(--bg-secondary);
  padding-top: 20px;
}

.hall-container {
  width: 1500px;
  margin: 0 auto;
  display: flex;
  gap: 20px;
  position: relative;
}

/* 左侧区域 */
.left-aside {
  width: 120px;
  flex-shrink: 0;
}

/* 主内容区 */
.main-content {
  flex: 1;
  min-width: 0;
  margin: 0 20px;
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.article-item {
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.article-header {
  display: flex;
  padding: 20px;
  cursor: pointer;
  gap: 20px;
}

.article-cover {
  width: 240px;
  height: 160px;
  border-radius: var(--radius-md);
  overflow: hidden;
  margin-right: 24px;
  cursor: pointer;
}

.cover-image {
  width: 100%;
  height: 100%;
  transition: var(--transition-all);
}

.cover-image:hover {
  transform: scale(1.05);
}

.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: var(--bg-tertiary);
  color: var(--text-tertiary);
  font-size: 24px;
}

.article-main {
  flex: 1;
  min-width: 0;
}

.article-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.article-description {
  font-size: 15px;
  color: var(--text-secondary);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  max-height: 4.8em;
}

.article-footer {
  padding: 12px 20px;
  border-top: 1px solid var(--border-light);
  display: flex;
  align-items: center;
  gap: 24px;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-tertiary);
  font-size: 14px;
  cursor: pointer;
  transition: var(--transition-colors);
}

.action-item:hover {
  color: var(--primary-color);
}

/* 右侧区域 */
.right-aside {
  width: 360px;
  flex-shrink: 0;
}

/* 返回顶部按钮样式 */
.back-to-top {
  --el-backtop-bg-color: var(--bg-primary);
  --el-backtop-hover-bg-color: var(--bg-hover);
}

.back-top-content {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: var(--text-secondary);
}

.back-top-content .el-icon {
  font-size: 16px;
  margin-bottom: 2px;
}

:deep(.el-backtop) {
  width: 56px;
  height: 56px;
  box-shadow: var(--shadow-sm);
  transition: var(--transition-all);
}

:deep(.el-backtop:hover) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
}

/* 响应式处理 */
@media screen and (max-width: 1400px) {
  .hall-container {
    width: 1100px;
  }

  .main-content {
    margin: 0 30px;
  }
}

@media screen and (max-width: 1200px) {
  .hall-container {
    width: 100%;
    max-width: 1000px;
    padding: 0 20px;
  }

  .main-content {
    margin: 0 20px;
  }
}

@media screen and (max-width: 1000px) {
  .left-aside {
    display: none;
  }

  .right-aside {
    display: none;
  }

  .main-content {
    margin: 0;
  }
}

@media screen and (max-width: 768px) {
  .article-header {
    flex-direction: column;
  }

  .article-cover {
    width: 100%;
    height: 200px;
  }

  .article-footer {
    flex-wrap: wrap;
    gap: 16px;
  }
}
</style>
