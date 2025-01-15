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
        <el-avatar
          :src="author.avatar"
          @click="goToAuthor(author.id)"
          class="author-avatar"
          style="width: 36px; height: 36px"
        />
        <span class="author-name" @click="goToAuthor(author.id)"
          >作者：{{ author.username }}</span
        >
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
    <div class="action-buttons">
      <div
        class="action-button"
        :class="{ active: isLiked }"
        @click="handleLike"
      >
        <el-icon class="action-icon like-icon"><Star /></el-icon>
        <span class="action-text">{{ isLiked ? "已喜欢" : "喜欢" }}</span>
      </div>
      <div
        class="action-button"
        :class="{ active: isMarked }"
        @click="handleMark"
      >
        <el-icon class="action-icon collect-icon"><Collection /></el-icon>
        <span class="action-text">{{ isMarked ? "已收藏" : "收藏" }}</span>
      </div>
    </div>

    <!-- 右侧目录栏 -->
    <div class="toc-container">
      <div class="toc-title">
        <i class="el-icon-menu"></i>
        目录
      </div>
      <div class="toc-content" v-html="generateToc(article.content)"></div>
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
import { getArticleById, handleLike } from "@/api/article.js";
import { getUserInfoById, handleCollection } from "@/api/user.js";
import { marked } from "marked";
import { useUserStore } from "@/store/modules/user.js";
import { Star, Collection, CaretTop } from "@element-plus/icons-vue";

export default {
  name: "ArticleComponent",
  components: {
    Star,
    Collection,
    CaretTop,
  },
  data() {
    return {
      article: {},
      showViewer: false,
      previewUrl: "",
      activeHeading: "",
      author: {},
      userStore: useUserStore(),
      isLiked: false,
      isMarked: false,
    };
  },
  methods: {
    async handleLike() {
      const userId = this.userStore.userId;
      const articleId = this.article.id;
      const res = await handleLike(articleId, userId);
      if (res.data.data) {
        this.isLiked = true;
        ElMessage.success("点赞成功");
      } else {
        this.isLiked = false;
        ElMessage.success("取消点赞");
      }
    },
    async handleMark() {
      const userId = this.userStore.userId;
      const articleId = this.article.id;
      const res = await handleCollection(userId, articleId);
      if (res.data.data) {
        this.isMarked = true;
        ElMessage.success("收藏成功");
      } else {
        this.isMarked = false;
        ElMessage.success("取消收藏");
      }
    },
    async getArticle() {
      try {
        const articleId = this.$route.params.articleId;
        const res = await getArticleById(articleId);
        // 获取当前登录用户信息
        const res2 = await getUserInfoById(this.userStore.userId);
        const user = res2.data.data;

        // 筛选status为1的文章
        this.article = res.data.data;
        this.isLiked =
          this.article.likesCart &&
          this.article.likesCart.includes(`,${this.userStore.userId},`);
        this.isMarked =
          user.markCart && user.markCart.includes(`,${this.article.id},`);

        // 获取作者信息
        if (this.article.userId) {
          const userRes = await getUserInfoById(this.article.userId);
          this.author = userRes.data.data;
        }
      } catch (error) {
        console.error("获取文章失败:", error);
      }
    },
    goToAuthor(authorId) {
      if (authorId == this.userStore.userId) {
        this.$router.push(`/home`);
      } else {
        this.$router.push(`/user/${authorId}`);
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

        toc += `<div class="toc-item ${
          this.activeHeading === id ? "active" : ""
        }" style="padding-left: ${indent}px">
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
  max-width: 100%;
  margin: 20px auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(18, 18, 18, 0.1);
  position: relative;
}

.article-content {
  padding: 20px;
  min-width: 0;
}

.cover-container {
  width: 100%;
  margin-bottom: 20px;
}

.author-avatar {
  cursor: pointer;
}

.author-avatar:hover {
  transform: scale(1.1);
}

.author-name {
  cursor: pointer;
}

.author-name:hover {
  color: #056de8;
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

.action-buttons {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 12px 20px;
  margin-top: 40px;
  border-top: 1px solid #f0f2f5;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 3px;
  transition: all 0.2s ease;
  color: #8590a6;
  background: transparent;
}

.action-button:hover {
  background-color: #f2f3f5;
  color: #76839b;
}

.action-icon {
  font-size: 16px;
  transition: all 0.2s ease;
}

.action-text {
  font-size: 14px;
  font-weight: 500;
}

.like-icon {
  color: inherit;
}

.collect-icon {
  color: inherit;
}

.action-button.active {
  color: #056de8;
  background-color: rgba(5, 109, 232, 0.1);
}

.action-button.active:hover {
  background-color: rgba(5, 109, 232, 0.15);
  color: #056de8;
}

.action-button.active .like-icon {
  color: #056de8;
}

.action-button.active .collect-icon {
  color: #056de8;
}

.toc-container {
  position: fixed;
  right: 5%;
  top: 12vh;
  width: 200px;
  max-height: 80vh;
  overflow-y: auto;
  background: #ffffff;
  padding: 20px 16px;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  z-index: 10;
}

@media (max-width: 1650px) {
  .toc-container {
    display: none;
  }
}

@media (max-width: 768px) {
  .article-info {
    flex-direction: column;
    align-items: flex-start;
  }

  .article-body {
    font-size: 14px;
  }

  .action-buttons {
    gap: 12px;
  }

  .back-to-top {
    display: none;
  }
}

@media (max-width: 480px) {
  .article-container {
    padding: 15px;
  }

  .cover-container {
    margin-bottom: 10px;
  }

  .article-cover {
    max-height: 300px;
  }

  .toc-container {
    width: 160px;
    top: 8vh;
  }

  .action-buttons {
    gap: 8px;
  }

  .article-info {
    font-size: 12px;
    gap: 10px;
  }

  .article-body {
    font-size: 12px;
  }
}

.toc-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 24px;
  padding-bottom: 14px;
  border-bottom: 3px solid #f0f2f7;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 12px;
}

.toc-title i {
  font-size: 24px;
  color: #056de8;
}

.toc-content {
  font-size: 16px;
  line-height: 1.6;
  color: #5a6c84;
  letter-spacing: 0.5px;
  text-shadow: 0.5px 0.5px 2px rgba(0, 0, 0, 0.1);
}

.toc-item {
  margin: 8px 0;
  position: relative;
}

.toc-item a {
  color: #5a6c84;
  text-decoration: none;
  display: flex;
  align-items: center;
  padding: 10px 0;
  font-size: 16px;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
  font-family: "Arial", sans-serif;
  font-weight: 500;
}

.toc-item a:hover {
  color: #1890ff;
  padding-left: 10px;
  border-left-color: #1890ff;
  font-weight: 600;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.toc-dot {
  width: 8px;
  height: 8px;
  background: #cbd5e1;
  border-radius: 50%;
  margin-right: 12px;
  transition: all 0.3s ease;
}

.toc-item a:hover .toc-dot {
  background: #1890ff;
  transform: scale(1.4);
}

.toc-item.active a {
  color: #1890ff;
  font-weight: 600;
}

.toc-item.active .toc-dot {
  background: #1890ff;
  transform: scale(1.4);
}

.back-to-top {
  --el-backtop-bg-color: #fff;
  --el-backtop-hover-bg-color: #f0f2f7;
}

.back-top-content {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #606266;
}

.back-top-content .el-icon {
  font-size: 16px;
  margin-bottom: 2px;
}

:deep(.el-backtop) {
  width: 56px;
  height: 56px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

:deep(.el-backtop:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}
</style>
