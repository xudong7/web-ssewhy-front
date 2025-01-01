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
                <img
                  :src="article.cover"
                  alt="封面"
                  class="article-cover-img"
                />
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
  </div>
</template>

<script>
import { getArticleList } from "@/api/article";
import { View, Star, Collection, ChatDotRound } from "@element-plus/icons-vue";
import AdComponent from "@/components/AdComponent.vue";

export default {
  name: "Hall",
  components: {
    View,
    Star,
    Collection,
    ChatDotRound,
    AdComponent,
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
  background-color: #f6f6f6;
  padding-top: 20px;
}

.hall-container {
  width: 1400px;
  margin: 0 auto;
  display: flex;
  gap: 20px;
  position: relative;
}

/* 左侧区域 */
.left-aside {
  width: 150px;
  flex-shrink: 0;
}

/* 主内容区 */
.main-content {
  flex: 1;
  min-width: 0; /* 防止内容溢出 */
  margin: 0 20px; /* 增加两侧间距 */
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.article-item {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(18, 18, 18, 0.1);
  overflow: hidden;
}

.article-header {
  display: flex;
  padding: 20px;
  cursor: pointer;
  gap: 20px;
}

.article-cover {
  width: 240px; /* 增加封面图片宽度 */
  height: 160px; /* 等比例增加高度 */
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
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

.article-main {
  flex: 1;
  min-width: 0; /* 防止内容溢出 */
}

.article-title {
  font-size: 18px;
  font-weight: 600;
  color: #121212;
  margin-bottom: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.article-description {
  font-size: 15px;
  color: #646464;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  max-height: 4.8em;
}

.article-footer {
  padding: 12px 20px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  gap: 24px;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #8590a6;
  font-size: 14px;
  cursor: pointer;
  transition: color 0.3s ease;
}

.action-item:hover {
  color: #056de8;
}

/* 右侧区域 */
.right-aside {
  width: 260px;
  flex-shrink: 0;
}

/* 响应式处理 */
@media screen and (max-width: 1400px) {
  .hall-container {
    width: 1100px; /* 增加容器宽度 */
  }

  .main-content {
    margin: 0 30px; /* 稍微减小间距 */
  }
}

@media screen and (max-width: 1200px) {
  .hall-container {
    width: 100%;
    max-width: 1000px; /* 增加最大宽度 */
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
