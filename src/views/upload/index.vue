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
          :action="uploadUrl"
          list-type="text"
          :on-success="handleUploadSuccess"
          :on-error="handleUploadError"
          :on-progress="handleUploadProgress"
          :before-upload="beforeUpload"
          :headers="headers"
          name="file"
        >
          <el-button type="primary">选取文件</el-button>
          <template #tip>
            <div class="el-upload__tip">支持各种类型的文件上传</div>
          </template>
        </el-upload>
      </div>
    </div>
    <div class="upload-item" v-if="fileUrl">
      <div class="item-info">
        <div class="item-title">文件链接</div>
        <div class="item-desc">您的文件已成功上传，可以复制下方链接</div>
      </div>
      <div class="item-action">
        <el-input v-model="fileUrl" readonly>
          <template #append>
            <el-button @click="copyFileUrl">复制</el-button>
          </template>
        </el-input>
      </div>
    </div>
    <div class="upload-item" v-if="uploadProgress > 0 && uploadProgress < 100">
      <div class="item-info">
        <div class="item-title">上传进度</div>
      </div>
      <div class="item-action">
        <el-progress
          :percentage="uploadProgress"
          :format="percentageFormat"
        ></el-progress>
      </div>
    </div>
    <div class="upload-records" v-if="uploadHistory.length > 0">
      <div class="records-title">上传历史</div>
      <el-table :data="uploadHistory" style="width: 100%">
        <el-table-column
          prop="fileName"
          label="文件名"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="fileSize"
          label="文件大小"
          width="120"
        ></el-table-column>
        <el-table-column prop="fileUrl" label="文件链接">
          <template #default="scope">
            <div class="url-container">
              <span class="url-text">{{ scope.row.fileUrl }}</span>
              <el-button
                size="small"
                type="primary"
                @click="copyUrl(scope.row.fileUrl)"
                >复制</el-button
              >
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="uploadTime"
          label="上传时间"
          width="180"
        ></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/store/modules/user";
import request from "@/utils/request";

// 响应式数据
const uploadUrl = ref(
  import.meta.env.VITE_APP_URL
    ? `${import.meta.env.VITE_APP_URL}/upload/file`
    : "http://localhost:8080/api/upload/file"
);
const fileUrl = ref("");
const uploadProgress = ref(0);
const uploadHistory = ref([]);
const headers = ref({
  // 如果需要额外的头部信息
});

// 在组件挂载时获取上传历史记录
onMounted(() => {
  getUploadHistory();
});

// 上传前验证
const beforeUpload = (file) => {
  // 可以在这里添加文件验证逻辑
  const isLt50M = file.size / 1024 / 1024 < 50;
  if (!isLt50M) {
    ElMessage.error("文件大小不能超过 50MB!");
    return false;
  }
  return true;
};

// 上传成功处理
const handleUploadSuccess = (response, file, fileList) => {
  ElMessage.success("文件上传成功");
  fileUrl.value = response.data; // 假设后端返回的data字段是文件URL

  // 添加到上传历史
  uploadHistory.value.unshift({
    fileName: file.name,
    fileSize: formatFileSize(file.size),
    fileUrl: response.data,
    uploadTime: new Date().toLocaleString(),
  });

  // 保存到本地存储
  saveUploadHistory();

  // 重置上传进度
  uploadProgress.value = 0;
};

// 上传错误处理
const handleUploadError = (error, file, fileList) => {
  // Element Plus 的 Upload 组件会传入一个错误对象，可能是字符串或错误对象
  let errorMessage = "未知错误";

  if (typeof error === "string") {
    errorMessage = error;
  } else if (error && error.message) {
    errorMessage = error.message;
  } else if (error && error.status) {
    errorMessage = `状态码: ${error.status}`;
  }

  ElMessage.error(`文件上传失败: ${errorMessage}`);
  uploadProgress.value = 0;
};

// 上传进度处理
const handleUploadProgress = (event, file) => {
  uploadProgress.value = Math.round(event.percent);
};

// 进度条格式化显示
const percentageFormat = (percentage) => {
  return percentage === 100 ? "完成" : `${percentage}%`;
};

// 文件大小格式化
const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// 复制当前文件URL
const copyFileUrl = () => {
  copyToClipboard(fileUrl.value);
};

// 复制指定URL
const copyUrl = (url) => {
  copyToClipboard(url);
};

// 通用复制到剪贴板方法
const copyToClipboard = (text) => {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      ElMessage.success("链接已复制到剪贴板");
    })
    .catch(() => {
      ElMessage.error("复制失败，请手动复制");
    });
};

// 获取上传历史记录
const getUploadHistory = () => {
  const history = localStorage.getItem("uploadHistory");
  if (history) {
    try {
      uploadHistory.value = JSON.parse(history);
    } catch (e) {
      uploadHistory.value = [];
    }
  }
};

// 保存上传历史记录
const saveUploadHistory = () => {
  // 只保存最近的10条记录
  const historyToSave = uploadHistory.value.slice(0, 10);
  localStorage.setItem("uploadHistory", JSON.stringify(historyToSave));
};

// 手动上传文件的方法
const uploadFile = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return request
    .post(uploadUrl.value.replace(/^http:\/\/[^/]+\/api/, ""), formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        uploadProgress.value = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
      },
    })
    .then((response) => {
      if (response.data.code === 200) {
        ElMessage.success("文件上传成功");
        fileUrl.value = response.data.data;
        return response.data.data;
      } else {
        throw new Error(response.data.message || "上传失败");
      }
    })
    .catch((error) => {
      ElMessage.error("上传失败: " + error.message);
      throw error;
    });
};
</script>

<style scoped>
.upload-container {
  padding: 20px;
  background-color: var(--bg-secondary);
  min-height: calc(100vh - 52px);
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
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

.records-title {
  font-size: 24px;
  color: var(--text-primary);
  margin: 30px 0 20px;
}

.url-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.url-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 300px;
}

@media (max-width: 768px) {
  .upload-container {
    padding: 10px;
  }

  .upload-title {
    font-size: 24px;
  }

  .upload-item {
    padding: 10px;
  }

  .item-title {
    font-size: 16px;
  }

  .item-desc {
    font-size: 12px;
  }

  .url-text {
    max-width: 150px;
  }
}
</style>
