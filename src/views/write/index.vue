<template>
  <div class="write-container">
    <div class="write-header">
      <el-input
        v-model="title"
        placeholder="请输入文章标题..."
        class="title-input"
      />
      <div class="header-actions">
        <el-button type="info" @click="saveDraft" plain>保存草稿</el-button>
        <el-button type="primary" @click="publishArticle">发布文章</el-button>
      </div>
    </div>

    <div class="editor-container">
      <div class="editor-toolbar">
        <el-upload
          class="image-upload"
          action="/api/upload"
          :show-file-list="true"
          :auto-upload="false"
          :on-change="handleImageChange"
          accept="image/*"
          name="file"
        >
          <el-button type="primary" icon="el-icon-picture" class="image-upload-button">插入图片</el-button>
        </el-upload>

        <el-upload
          class="cover-upload"
          action="/api/upload"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="handleCoverChange"
          accept="image/*"
          name="file"
        >
          <el-button type="success" icon="el-icon-picture-outline" class="cover-upload-button">设置封面</el-button>
        </el-upload>
      </div>

      <div class="editor-main">
        <div class="markdown-editor">
          <div v-if="cover" class="cover-preview">
            <img :src="cover" alt="封面预览" />
            <el-button type="danger" size="small" icon="el-icon-delete" circle @click="removeCover"></el-button>
          </div>
          <el-input
            type="textarea"
            v-model="content"
            :rows="20"
            placeholder="开始创作..."
            @input="updatePreview"
            ref="markdownEditor"
          />
        </div>
        <div class="markdown-preview" v-html="previewContent"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { marked } from "marked";
import { publishArticle, uploadImage } from "@/api/article";

export default {
  name: "Write",
  data() {
    return {
      title: "",
      content: "",
      previewContent: "",
      cover: "",
    };
  },
  methods: {
    updatePreview() {
      this.previewContent = marked(this.content);
    },
    async handleImageChange(file) {
      if (!file) return;
      
      // 上传图片
      const formData = new FormData();
      formData.append('file', file.raw);
      
      try {
        const res = await uploadImage(formData);
        const imageUrl = res.data.data;
        
        // 在光标位置插入图片HTML语法
        const imageHtml = `<img src="${imageUrl}" alt="image" style="width: 100%; object-fit: contain;">\n`;
        const textarea = this.$refs.markdownEditor.$el.querySelector('textarea');
        const startPos = textarea.selectionStart;
        const endPos = textarea.selectionEnd;
        
        this.content = this.content.substring(0, startPos) + 
                      imageHtml +
                      this.content.substring(endPos);
        
        // 更新预览
        this.updatePreview();
        
        this.$message.success('图片上传成功');
      } catch (error) {
        this.$message.error('图片上传失败');
      }
    },
    async handleCoverChange(file) {
      if (!file) return;
      
      const formData = new FormData();
      formData.append('file', file.raw);
      
      try {
        const res = await uploadImage(formData);
        this.cover = res.data.data;
        this.$message.success('封面上传成功');
      } catch (error) {
        this.$message.error('封面上传失败');
      }
    },
    removeCover() {
      this.cover = "";
    },
    getFirstImageUrl() {
      const imgMatch = this.content.match(/<img.*?src="(.*?)".*?>/);
      return imgMatch ? imgMatch[1] : "";
    },
    publishArticle() {
      if (!this.title.trim()) {
        ElMessage.error("please input title");
        return;
      }
      if (!this.content.trim()) {
        ElMessage.error("please input content");
        return;
      }
      
      // 如果没有设置封面,则获取第一张图片作为封面
      if (!this.cover) {
        this.cover = this.getFirstImageUrl();
      }
      
      // 调用发布API
      publishArticle({
        title: this.title,
        content: this.content,
        cover: this.cover,
        status: 1, // 1表示已发布
      }).then((res) => {
        ElMessage.success("publish success");
        this.$router.push("/hall");
      });
    },
    saveDraft() {
      // 如果没有设置封面,则获取第一张图片作为封面
      if (!this.cover) {
        this.cover = this.getFirstImageUrl();
      }
      
      // 调用保存草稿API
      publishArticle({
        title: this.title,
        content: this.content,
        cover: this.cover,
        status: 0, // 0表示草稿
      }).then((res) => {
        ElMessage.success("save draft success");
        this.$router.push("/draft");
      });
    },
  },
};
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

.image-upload-button {
  width: 100px;
  text-align: center;
}

.cover-upload-button {
  width: 100px;
  text-align: center;
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
  display: flex;
  gap: 12px;
}

.editor-main {
  display: flex;
  min-height: 600px;
}

.markdown-editor {
  flex: 1;
  border-right: 1px solid #e4e7ed;
  display: flex;
  flex-direction: column;
}

.cover-preview {
  position: relative;
  padding: 12px;
  border-bottom: 1px solid #e4e7ed;
}

.cover-preview img {
  width: 100%;
  max-height: 200px;
  object-fit: cover;
  border-radius: 4px;
}

.cover-preview .el-button {
  position: absolute;
  top: 20px;
  right: 20px;
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
  font-family:
    -apple-system,
    BlinkMacSystemFont,
    Segoe UI,
    Helvetica,
    Arial,
    sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: #24292e;
}

.markdown-body img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 0 auto;
  border-radius: 4px;
  object-fit: contain;
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
