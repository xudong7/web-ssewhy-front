<template>
  <div class="knowledge-page">
    <div class="knowledge-header">
      <h1>知识</h1>
      <el-button type="primary" @click="goWrite">分享知识</el-button>
    </div>

    <div class="knowledge-content">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="最新" name="latest">
          <div class="article-list">
            <el-card
              v-for="article in articles"
              :key="article.id"
              class="article-item"
            >
              <div class="article-info">
                <h2 class="article-title" @click="goDetail(article.id)">
                  {{ article.title }}
                </h2>
                <p class="article-desc">{{ article.description }}</p>
                <div class="article-meta">
                  <span class="author">{{ article.author }}</span>
                  <span class="time">{{ article.createTime }}</span>
                  <span class="views">阅读 {{ article.views }}</span>
                  <span class="likes">点赞 {{ article.likes }}</span>
                </div>
              </div>
              <img
                v-if="article.cover"
                :src="article.cover"
                class="article-cover"
              />
            </el-card>
          </div>
        </el-tab-pane>
        <el-tab-pane label="热门" name="hot">
          <div class="article-list">
            <el-card
              v-for="article in hotArticles"
              :key="article.id"
              class="article-item"
            >
              <div class="article-info">
                <h2 class="article-title" @click="goDetail(article.id)">
                  {{ article.title }}
                </h2>
                <p class="article-desc">{{ article.description }}</p>
                <div class="article-meta">
                  <span class="author">{{ article.author }}</span>
                  <span class="time">{{ article.createTime }}</span>
                  <span class="views">阅读 {{ article.views }}</span>
                  <span class="likes">点赞 {{ article.likes }}</span>
                </div>
              </div>
              <img
                v-if="article.cover"
                :src="article.cover"
                class="article-cover"
              />
            </el-card>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  name: "Knowledge",
  data() {
    return {
      activeTab: "latest",
      articles: [
        {
          id: 1,
          title: "前端开发最佳实践",
          description: "分享一些前端开发中的经验和技巧，帮助提高开发效率...",
          author: "张三",
          createTime: "2023-07-20",
          views: 1234,
          likes: 88,
          cover: "https://picsum.photos/200/100",
        },
        {
          id: 2,
          title: "Vue3 组合式API详解",
          description: "深入讲解Vue3组合式API的使用方法和实践案例...",
          author: "李四",
          createTime: "2023-07-19",
          views: 2345,
          likes: 120,
          cover: "https://picsum.photos/200/100",
        },
      ],
      hotArticles: [
        {
          id: 3,
          title: "2023年前端技术趋势",
          description: "解析2023年前端技术发展趋势，为技术选型提供参考...",
          author: "王五",
          createTime: "2023-07-18",
          views: 5678,
          likes: 230,
          cover: "https://picsum.photos/200/100",
        },
      ],
    };
  },
  methods: {
    goWrite() {
      this.$router.push("/write");
    },
    goDetail(id) {
      this.$router.push(`/detail/${id}`);
    },
  },
};
</script>

<style scoped>
.knowledge-page {
  padding: 20px;
  background-color: #f6f6f6;
  min-height: calc(100vh - 52px);
  max-width: 1200px;
  margin: 0 auto;
}

.knowledge-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.knowledge-content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
}

.article-list {
  margin-top: 20px;
}

.article-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.article-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.article-info {
  flex: 1;
  margin-right: 20px;
}

.article-title {
  font-size: 18px;
  color: #121212;
  margin-bottom: 10px;
}

.article-desc {
  color: #666;
  font-size: 14px;
  margin-bottom: 10px;
  line-height: 1.5;
}

.article-meta {
  color: #8590a6;
  font-size: 13px;
}

.article-meta span {
  margin-right: 15px;
}

.article-cover {
  width: 200px;
  height: 120px;
  object-fit: cover;
  border-radius: 4px;
}
</style>
