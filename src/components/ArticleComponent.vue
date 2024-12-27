<template>
  <div class="article-container">
    <div class="article-content">
      <img v-if="article.cover" :src="article.cover" alt="cover" class="article-cover"/>
      <h1 class="article-title">{{ article.title }}</h1>
      <div class="article-info">
        <span class="author">作者：{{ article.author }}</span>
        <span class="create-time">创建时间：{{ article.createTime }}</span>
        <span class="update-time">更新时间：{{ article.updateTime }}</span>
      </div>
      <div class="article-body">{{ article.content }}</div>
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
      this.article = res.data.data;
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

.article-cover {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 20px;
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
</style>
