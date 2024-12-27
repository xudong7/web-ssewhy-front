<template>
  <div class="write-container">
    <div class="write-header">
      <el-input
          v-model="title"
          placeholder="请输入文章标题..."
          class="title-input"
      />
      <div class="header-actions">
        <el-button type="info" plain>保存草稿</el-button>
        <el-button type="primary" @click="publishArticle">发布文章</el-button>
      </div>
    </div>

    <div class="editor-container">
      <div class="editor-toolbar">
        <el-upload
            class="image-upload"
            action="/api/upload"
            :show-file-list="false"
            :on-success="handleImageSuccess"
        >
          <el-button type="primary" icon="el-icon-picture">插入图片</el-button>
        </el-upload>
      </div>
      
      <div class="editor-main">
        <div class="markdown-editor">
          <el-input
              type="textarea"
              v-model="content"
              :rows="20"
              placeholder="开始创作..."
              @input="updatePreview"
          />
        </div>
        <div class="markdown-preview" v-html="previewContent"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { marked } from 'marked';
import { publishArticle } from '@/api/article';

export default {
  name: "Write",
  data() {
    return {
      title: '',
      content: '',
      previewContent: ''
    }
  },
  methods: {
    updatePreview() {
      this.previewContent = marked(this.content)
    },
    handleImageSuccess(res) {
      // 在光标位置插入图片markdown语法
      const imageUrl = res.data.url
      const imageMarkdown = `![image](${imageUrl})\n`
      this.content += imageMarkdown
      this.updatePreview()
    },
    publishArticle() {
      // TODO: 实现文章发布逻辑
      if (!this.title.trim()) {
        ElMessage.error('please input title')
        return
      }
      if (!this.content.trim()) {
        ElMessage.error('please input content') 
        return
      }
      // 调用发布API
      publishArticle({
        title: this.title,
        content: this.content
      }).then(res => {
        ElMessage.success('publish success')
        this.$router.push('/hall')
      })
    }
  }
}
</script>

<style scoped>
.write-container {
  padding: 24px;
  background: #fff;
  min-height: calc(100vh - 52px);
  max-width: 1200px;
  margin: 0 auto;
}

.write-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.title-input {
  width: 70%;
}

.title-input :deep(.el-input__inner) {
  font-size: 24px;
  height: 48px;
  padding: 0 20px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.editor-container {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.editor-toolbar {
  padding: 12px;
  border-bottom: 1px solid #e4e7ed;
  background: #f9fafb;
  border-radius: 8px 8px 0 0;
}

.editor-main {
  display: flex;
  min-height: 600px;
}

.markdown-editor {
  flex: 1;
  border-right: 1px solid #e4e7ed;
}

.markdown-preview {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background: #fafbfc;
}

:deep(.el-textarea__inner) {
  border: none;
  resize: none;
  height: 100%;
  font-family: "Monaco", monospace;
  font-size: 15px;
  line-height: 1.6;
  padding: 20px;
}

.markdown-body {
  font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: #24292e;
}

.markdown-body img {
  max-width: 100%;
  border-radius: 4px;
}

.markdown-body h1,
.markdown-body h2 {
  border-bottom: 1px solid #eaecef;
  padding-bottom: 0.3em;
}

.markdown-body pre {
  background-color: #f6f8fa;
  border-radius: 6px;
  padding: 16px;
  overflow: auto;
}
</style>
