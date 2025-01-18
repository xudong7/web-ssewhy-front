<template>
  <div class="upload-container">
    <div class="upload-title">上传文件</div>
    <div class="upload-item">
      <div class="item-info">
        <div class="item-title">上传文件</div>
        <div class="item-desc">上传文件到服务器</div>
      </div>
      <div class="item-action">
        <el-upload
          action="/api/upload"
          list-type="text"
          :on-change="handleFileChange"
          :auto-upload="false"
          name="file"
        >
          <el-button slot="trigger" type="primary">选取文件</el-button>
        </el-upload>
      </div>
    </div>
    <div class="upload-item">
      <div class="item-info">
        <div class="item-title">文件 URL</div>
        <div class="item-desc">输入文件的 URL 地址</div>
      </div>
      <div class="item-action">
        <el-input v-model="fileUrl" placeholder="请输入文件 URL"></el-input>
        <el-button type="primary" @click="handleUrlUpload">提交 URL</el-button>
      </div>
    </div>
    <div class="upload-item">
      <div class="item-info">
        <div class="item-title">文件信息</div>
        <div class="item-desc">输入文件的标题和描述</div>
      </div>
      <div class="item-action">
        <el-input v-model="fileTitle" placeholder="请输入文件标题"></el-input>
        <el-input
          v-model="fileDescription"
          type="textarea"
          placeholder="请输入文件描述"
        ></el-input>
        <el-button type="primary" @click="submitFileInfo"
          >提交文件信息</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fileList: [],
      fileUrl: "",
      fileTitle: "",
      fileDescription: "",
    };
  },
  methods: {
    handleFileChange(file, fileList) {
      this.fileList = fileList;
      alert(JSON.stringify(this.fileList));
    },
    handleUrlUpload() {
      if (this.fileUrl) {
        console.log("File URL:", this.fileUrl);
        // 这里可以添加处理文件 URL 的逻辑
      } else {
        this.$message.error("请输入文件 URL");
      }
    },
    submitFileInfo() {
      if (this.fileTitle && this.fileDescription) {
        console.log("File Title:", this.fileTitle);
        console.log("File Description:", this.fileDescription);
        // 这里可以添加处理文件信息的逻辑
      } else {
        this.$message.error("请输入文件标题和描述");
      }
    },
  },
};
</script>

<style scoped>
.upload-container {
  padding: 20px;
  background-color: var(--bg-secondary);
  min-height: calc(100vh - 52px);
  max-width: 1200px;
  margin: 0 auto;
}

.upload-title {
  font-size: 32px;
  color: var(--text-primary);
  text-align: center;
  margin-bottom: 40px;
}

.upload-item {
  display: flex;
  flex-direction: column;
  background-color: var(--bg-primary);
  padding: 20px;
  margin-bottom: 20px;
}

.item-info {
  margin-bottom: 20px;
}

.item-title {
  font-size: 18px;
  font-weight: bold;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.item-desc {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 16px;
  line-height: 1.5;
}

.item-action {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
