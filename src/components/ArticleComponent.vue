<template>
  <div class="article-container">
    <div class="article-content">
      <div v-if="article.cover" class="cover-container">
        <img
          :src="article.cover"
          alt="cover"
          class="article-cover"
          @click="showImagePreview(article.cover)"
        />
      </div>
      <h1 class="article-title">{{ article.title }}</h1>
      <div class="article-info">
        <span class="author">作者：{{ author.username }}</span>
        <span class="create-time"
          >创建时间：{{ processDate(article.createTime) }}</span
        >
        <span class="update-time"
          >更新时间：{{ processDate(article.updateTime) }}</span
        >
      </div>
      <div class="article-body" v-html="processContent(article.content)"></div>
    </div>

    <!-- 图片预览组件 -->
    <el-image-viewer
      v-if="showViewer"
      :url-list="[previewUrl]"
      @close="closeViewer"
    />

    <!-- 赞同按钮和收藏按钮 -->
    <div class="button-container">
      <el-button type="primary" @click="handleLike">赞同</el-button>
      <el-button type="primary" @click="handleMark">收藏</el-button>
    </div>

    <!-- 右侧目录栏 -->
    <div class="toc-container">
      <div class="toc-title">
        <i class="el-icon-menu"></i>
        目录
      </div>
      <div class="toc-content" v-html="generateToc(article.content)"></div>
    </div>
  </div>
</template>

<script>
import { getArticleById, handleLike } from "@/api/article.js";
import { getUserInfoById, handleCollection } from "@/api/user.js";
import { marked } from "marked";
import { useUserStore } from "@/store/modules/user.js";

export default {
  name: "ArticleComponent",
  data() {
    return {
      article: {},
      showViewer: false,
      previewUrl: "",
      activeHeading: "",
      author: {},
      userStore: useUserStore(),
    };
  },
  methods: {
    async handleLike() {
      const userId = this.userStore.userId;
      const articleId = this.article.id;
      const res = await handleLike(articleId, userId);
      if (res.data.data) {
        ElMessage.success("点赞");
      } else {
        ElMessage.success("取消点赞");
      }
    },
    async handleMark() {
      const userId = this.userStore.userId;
      const articleId = this.article.id;
      const res = await handleCollection(userId, articleId);
      if (res.data.data) {
        ElMessage.success("收藏");
      } else {
        ElMessage.success("取消收藏");
      }
    },
    async getArticle() {
      try {
        const articleId = this.$route.params.articleId;
        const res = await getArticleById(articleId);
        // 筛选status为1的文章
        this.article = res.data.data;

        // 获取作者信息
        if (this.article.userId) {
          const userRes = await getUserInfoById(this.article.userId);
          this.author = userRes.data.data;
        }
      } catch (error) {
        console.error("获取文章失败:", error);
      }
    },
    processDate(date) {
      return new Date(date).toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    },
    processContent(content) {
      if (!content) return "";
      // 先将markdown转换为HTML
      let htmlContent = marked(content);
      // 为标题添加id
      htmlContent = this.addHeadingIds(htmlContent);
      // 将图片标签替换为带有div包裹的形式,并添加点击事件
      return htmlContent.replace(
        /<img(.*?)src="(.*?)"(.*?)>/g,
        '<div class="image-wrapper"><img$1src="$2"$3 onclick="window.previewImage(\'$2\')"></div>',
      );
    },
    showImagePreview(url) {
      this.previewUrl = url;
      this.showViewer = true;
    },
    closeViewer() {
      this.showViewer = false;
    },
    // 为标题添加id
    addHeadingIds(content) {
      return content.replace(
        /<h([1-6])(.*?)>(.*?)<\/h\1>/g,
        (match, level, attrs, text) => {
          const id = text.toLowerCase().replace(/\s+/g, "-");
          return `<h${level}${attrs} id="${id}">${text}</h${level}>`;
        },
      );
    },
    // 生成目录
    generateToc(content) {
      if (!content) return "";
      // 先将markdown转换为HTML
      const htmlContent = marked(content);
      const headings = htmlContent.match(/<h([1-6])(.*?)>(.*?)<\/h\1>/g) || [];
      let toc = "";

      headings.forEach((heading) => {
        const level = heading.match(/<h([1-6])/)[1];
        const text = heading.replace(/<[^>]+>/g, "");
        const id = text.toLowerCase().replace(/\s+/g, "-");
        const indent = (level - 1) * 20;

        toc += `<div class="toc-item ${this.activeHeading === id ? "active" : ""}" style="padding-left: ${indent}px">
          <a href="#${id}" @click="scrollToHeading('${id}')">
            <span class="toc-dot"></span>
            ${text}
          </a>
        </div>`;
      });

      return toc;
    },
    scrollToHeading(id) {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        this.activeHeading = id;
      }
    },
  },
  mounted() {
    this.getArticle();
    // 添加全局方法用于图片预览
    window.previewImage = (url) => {
      this.showImagePreview(url);
    };
  },
  beforeUnmount() {
    // 清理全局方法
    window.previewImage = null;
  },
};
</script>

<style scoped>
.article-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(18, 18, 18, 0.1);
  position: relative;
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
  cursor: pointer;
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
  white-space: pre-wrap;
  word-wrap: break-word;
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
  width: 100%;
  height: auto;
  border-radius: 8px;
  display: block;
  cursor: pointer;
}

/* 目录样式 */
.toc-container {
  position: fixed;
  right: 20px;
  top: 100px;
  width: 280px;
  max-height: 80vh;
  overflow-y: auto;
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.toc-container:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.toc-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0f2f7;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 8px;
}

.toc-content {
  font-size: 14px;
}

.toc-item {
  margin: 4px 0;
  position: relative;
}

.toc-item a {
  color: #5a6c84;
  text-decoration: none;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  padding: 6px 0;
  font-size: 14px;
  line-height: 1.6;
}

.toc-dot {
  width: 6px;
  height: 6px;
  background: #cbd5e1;
  border-radius: 50%;
  margin-right: 8px;
  transition: all 0.3s ease;
}

.toc-item a:hover {
  color: #1890ff;
  padding-left: 4px;
}

.toc-item a:hover .toc-dot {
  background: #1890ff;
  transform: scale(1.2);
}

.toc-item.active a {
  color: #1890ff;
  font-weight: 600;
}

.toc-item.active .toc-dot {
  background: #1890ff;
  transform: scale(1.2);
}
</style>
