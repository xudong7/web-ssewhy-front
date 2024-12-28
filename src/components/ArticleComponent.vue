<template>
  <div class="article-container">
    <div class="article-content">
      <div v-if="article.cover" class="cover-container">
        <img :src="article.cover" alt="cover" class="article-cover"/>
      </div>
      <h1 class="article-title">{{ article.title }}</h1>
      <div class="article-info">
        <span class="author">作者：{{ article.author }}</span>
        <span class="create-time">创建时间：{{ processDate(article.createTime) }}</span>
        <span class="update-time">更新时间：{{ processDate(article.updateTime) }}</span>
      </div>
      <div class="article-body" v-html="processContent(article.content)"></div>
    </div>
  </div>
</template>

<script>
import { getArticleById } from "@/api/article.js";

export default {
  name: 'ArticleComponent',
  data() {
    return {
      article: {}
    }
  },
  methods: {
    async getArticle() {
      const articleId = this.$route.params.articleId;
      const res = await getArticleById(articleId);
      // 筛选status为1的文章
      this.article = res.data.data;
      this.article = this.article.filter(item => item.status === 1);
    },
    processDate(date) {
      return new Date(date).toLocaleString('zh-CN', {year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'});
    },
    processContent(content) {
      if (!content) return '';
      // 将图片标签替换为带有div包裹的形式
      return content.replace(/<img(.*?)>/g, '<div class="image-wrapper"><img$1></div>');
    }
  },
  mounted() {
    this.getArticle();
  }
}
</script>

<style scoped>
.article-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(18, 18, 18, 0.1);
}

.article-content {
  padding: 20px;
}

.cover-container {
  width: 100%;
  margin-bottom: 20px;
}

.article-cover {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 8px;
  display: block;
}

.article-title {
  font-size: 28px;
  font-weight: bold;
  color: #121212;
  margin-bottom: 20px;
}

.article-info {
  display: flex;
  gap: 20px;
  color: #8590a6;
  font-size: 14px;
  margin-bottom: 30px;
}

.article-body {
  font-size: 16px;
  line-height: 1.8;
  color: #121212;
}

.article-body :deep(.image-wrapper) {
  margin: 20px 0;
  text-align: center;
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
}

.article-body :deep(.image-wrapper img) {
  max-width: 100%;
  height: auto;
  width: 100%;
  border-radius: 8px;
  display: block;
}
</style>
