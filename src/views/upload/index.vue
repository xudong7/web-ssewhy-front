<template>
  <div class="upload-container">
    <div class="upload-title">上传文件</div>
    <div class="upload-form">
      <el-form
        :model="formData"
        :rules="rules"
        ref="uploadFormRef"
        label-width="100px"
      >
        <el-form-item label="文件标题" prop="title">
          <el-input
            v-model="formData.title"
            placeholder="请输入文件标题"
          ></el-input>
        </el-form-item>
        <el-form-item label="文件描述" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            rows="4"
            placeholder="请输入文件描述"
          ></el-input>
        </el-form-item>
        <el-form-item label="上传文件" prop="file">
          <el-upload
            :action="uploadUrl"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
            :on-progress="handleUploadProgress"
            :before-upload="beforeUpload"
            :on-change="handleFileChange"
            :headers="headers"
            :data="uploadData"
            name="file"
            :auto-upload="false"
            ref="uploadRef"
          >
            <template #trigger>
              <el-button type="primary">选择文件</el-button>
            </template>
            <template #tip>
              <div class="el-upload__tip">
                支持各种类型的文件上传，大小不超过50MB
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>

      <div class="upload-action">
        <el-button
          type="primary"
          @click="submitUpload"
          :loading="uploading"
          :disabled="!formData.file"
        >
          {{ uploading ? "上传中..." : "上传文件" }}
        </el-button>
      </div>
    </div>

    <div class="upload-item" v-if="uploadProgress > 0">
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

    <div class="upload-records" v-if="uploadHistory.length > 0">
      <div class="records-title">上传历史</div>
      <el-table :data="uploadHistory" style="width: 100%">
        <el-table-column
          prop="title"
          label="标题"
          width="180"
        ></el-table-column>
        <el-table-column prop="description" label="描述" width="200">
          <template #default="scope">
            <el-tooltip
              :content="scope.row.description"
              placement="top"
              :hide-after="0"
            >
              <div class="description-text">{{ scope.row.description }}</div>
            </el-tooltip>
          </template>
        </el-table-column>
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
import { ref, onMounted, computed } from "vue";
import { ElMessage, ElLoading } from "element-plus";
import { useUserStore } from "@/store/modules/user";
import request from "@/utils/request";

// 获取当前用户信息
const userStore = useUserStore();
const userId = computed(() => userStore.userId);

// 响应式数据
const uploadUrl = ref(
  import.meta.env.VITE_APP_URL
    ? `${import.meta.env.VITE_APP_URL}/upload/file`
    : "http://localhost:8080/api/upload/file"
);
const fileUrl = ref("");
const uploadProgress = ref(0);
const uploadHistory = ref([]);
const uploading = ref(false);
const uploadFormRef = ref(null);
const uploadRef = ref(null);

// 上传表单数据
const formData = ref({
  title: "",
  description: "",
  file: null,
  userId: userId,
  size: 0,
  url: "",
});

// 上传额外参数
const uploadData = computed(() => ({
  userId: userId.value,
  title: formData.value.title,
  description: formData.value.description,
}));

// 表单验证规则
const rules = {
  title: [
    { required: true, message: "请输入文件标题", trigger: "blur" },
    {
      min: 2,
      max: 50,
      message: "标题长度应在 2 到 50 个字符之间",
      trigger: "blur",
    },
  ],
  description: [
    { required: true, message: "请输入文件描述", trigger: "blur" },
    { max: 200, message: "描述不能超过 200 个字符", trigger: "blur" },
  ],
  file: [{ required: true, message: "请选择要上传的文件", trigger: "change" }],
};

// 请求头
const headers = ref({
  // 如果需要额外的头部信息
});

// 在组件挂载时获取上传历史记录
onMounted(() => {
  getUploadHistory();
});

// 文件改变时的处理
const handleFileChange = (file) => {
  formData.value.file = file.raw;
  formData.value.size = file.size;
  // 设置文件名到标题（如果标题为空）
  if (!formData.value.title) {
    formData.value.title = file.name;
  }
};

// 提交上传
const submitUpload = () => {
  uploadFormRef.value.validate((valid) => {
    if (valid) {
      if (!formData.value.file) {
        ElMessage.warning("请选择要上传的文件");
        return;
      }
      uploading.value = true;

      // 手动上传文件
      const formDataObject = new FormData();
      formDataObject.append("file", formData.value.file);
      formDataObject.append("userId", userId.value);
      formDataObject.append("title", formData.value.title);
      formDataObject.append("description", formData.value.description);
      formDataObject.append("size", Math.floor(formData.value.size)); // 确保大小是整数

      uploadFile(formDataObject);
    }
  });
};

// 上传前验证
const beforeUpload = (file) => {
  // 文件大小验证
  const isLt50M = file.size / 1024 / 1024 < 50;
  if (!isLt50M) {
    ElMessage.error("文件大小不能超过 50MB!");
    return false;
  }

  formData.value.size = file.size;
  return true;
};

// 上传成功处理
const handleUploadSuccess = (response, file, fileList) => {
  uploading.value = false;
  ElMessage.success("文件上传成功");
  fileUrl.value = response.data; // 假设后端返回的data字段是文件URL
  formData.value.url = response.data;

  // 添加到上传历史
  uploadHistory.value.unshift({
    title: formData.value.title,
    description: formData.value.description,
    fileName: file.name,
    fileSize: formatFileSize(file.size),
    fileUrl: response.data,
    uploadTime: new Date().toLocaleString(),
    userId: userId.value,
    size: file.size,
  });

  // 保存到本地存储
  saveUploadHistory();

  // 重置上传进度
  uploadProgress.value = 0;

  // 重置表单
  resetForm();
};

// 上传错误处理
const handleUploadError = (error, file, fileList) => {
  uploading.value = false;
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

// 重置表单
const resetForm = () => {
  formData.value = {
    title: "",
    description: "",
    file: null,
    userId: userId.value,
    size: 0,
    url: "",
  };
  if (uploadRef.value) {
    uploadRef.value.clearFiles();
  }
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
const uploadFile = (formDataObject) => {
  const loadingInstance = ElLoading.service({
    text: "上传中...",
    background: "rgba(0, 0, 0, 0.7)",
  });

  return request
    .post("/upload/file", formDataObject, {
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
      loadingInstance.close();
      uploading.value = false;

      if (response.data.code === 1) {
        ElMessage.success(response.data.msg || "文件上传成功");
        fileUrl.value = response.data.data;

        // 添加到上传历史
        uploadHistory.value.unshift({
          title: formData.value.title,
          description: formData.value.description,
          fileName: formData.value.file.name,
          fileSize: formatFileSize(formData.value.size),
          fileUrl: response.data.data,
          uploadTime: new Date().toLocaleString(),
          userId: userId.value,
          size: formData.value.size,
        });

        // 保存到本地存储
        saveUploadHistory();

        // 重置表单
        resetForm();

        return response.data.data;
      } else {
        throw new Error(response.data.msg || "上传失败");
      }
    })
    .catch((error) => {
      loadingInstance.close();
      uploading.value = false;
      ElMessage.error("上传失败: " + (error.message || "未知错误"));
      console.error("上传错误:", error);
      return null;
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
}

.upload-title {
  font-size: 32px;
  color: var(--text-primary);
  text-align: center;
  margin-bottom: 40px;
}

.upload-form {
  background-color: var(--bg-primary);
  border-radius: 8px;
  padding: 30px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.upload-action {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.upload-item {
  display: flex;
  flex-direction: column;
  background-color: var(--bg-primary);
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
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

.description-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 200px;
}

@media (max-width: 768px) {
  .upload-container {
    padding: 10px;
  }

  .upload-title {
    font-size: 24px;
  }

  .upload-form {
    padding: 15px;
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

  .description-text {
    max-width: 100px;
  }
}
</style>
