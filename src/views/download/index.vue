<template>
  <div class="download-page">
    <div class="download-header">
      <h1>资源下载</h1>
      <p class="desc">这里提供了各种学习资源和工具，点击下载按钮即可获取</p>
    </div>

    <div class="search-container">
      <el-input
        v-model="searchQuery"
        placeholder="搜索文件名或描述"
        prefix-icon="Search"
        clearable
        @input="handleSearch"
      >
        <template #append>
          <el-button @click="handleSearch">搜索</el-button>
        </template>
      </el-input>
    </div>

    <div v-loading="loading" class="download-content">
      <el-empty
        v-if="filteredFiles.length === 0"
        :description="searchQuery ? '未找到匹配的资源' : '暂无可下载资源'"
      ></el-empty>

      <el-card
        v-for="item in paginatedFiles"
        :key="item.id"
        class="download-item"
        :body-style="{ padding: '20px' }"
      >
        <div class="file-icon">
          <el-icon size="24">
            <component :is="getFileIcon(item.url)"></component>
          </el-icon>
        </div>
        <div class="item-info">
          <div class="item-title">{{ item.title }}</div>
          <div class="item-desc">{{ item.description }}</div>
          <div class="item-meta">
            <span>大小: {{ formatFileSize(item.size) }}</span>
            <span>下载次数: {{ item.downloads || 0 }}</span>
            <span>上传时间: {{ formatDate(item.createdTime) }}</span>
          </div>
        </div>
        <div class="item-action">
          <el-tooltip content="点击下载文件" placement="top">
            <el-button type="primary" @click="handleDownload(item)">
              <el-icon><Download /></el-icon>
              下载
            </el-button>
          </el-tooltip>
          <el-button type="text" @click="copyDownloadLink(item)">
            <el-icon><CopyDocument /></el-icon>
            复制链接
          </el-button>
        </div>
      </el-card>
    </div>

    <el-pagination
      v-if="filteredFiles.length > 0"
      class="pagination"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="filteredFiles.length"
      :page-size="pageSize"
      :page-sizes="[6, 9, 12, 15]"
      @current-change="handlePageChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { getUploadedFiles, downloadFile } from "@/api/upload";
import {
  Document,
  Download,
  CopyDocument,
  Search,
} from "@element-plus/icons-vue";

// 响应式数据
const downloadList = ref([]);
const loading = ref(false);
const searchQuery = ref("");
const currentPage = ref(1);
const pageSize = ref(9);

// 搜索过滤
const filteredFiles = computed(() => {
  if (!searchQuery.value) {
    return downloadList.value;
  }

  const query = searchQuery.value.toLowerCase();
  return downloadList.value.filter(
    (item) =>
      item.title?.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query)
  );
});

// 当前页的文件
const paginatedFiles = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredFiles.value.slice(start, end);
});

// 获取文件列表
const fetchFileList = async () => {
  loading.value = true;
  try {
    const res = await getUploadedFiles();
    if (res.data.code === 1) {
      downloadList.value = res.data.data || [];
    } else {
      ElMessage.error(res.data.msg || "获取资源列表失败");
    }
  } catch (error) {
    console.error("获取资源列表失败:", error);
    ElMessage.error("获取资源列表失败，请稍后重试");
  } finally {
    loading.value = false;
  }
};

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1; // 重置到第一页
};

// 处理下载
const handleDownload = (item) => {
  // 如果没有下载API，直接打开链接下载
  // 这里直接打开链接下载
  downloadFile(item.id)
    .then((res) => {
      if (res.data.code === 1) {
        window.open(item.url, "_blank");
        // ElMessage.success("文件下载成功");
      } else {
        ElMessage.error(res.data.msg || "下载失败");
      }
    })
    .catch((error) => {
      console.error("下载文件失败:", error);
      ElMessage.error("下载文件失败，请稍后重试");
    });
  ElMessage.success("开始下载文件");
};

// 复制下载链接
const copyDownloadLink = (item) => {
  navigator.clipboard
    .writeText(item.url)
    .then(() => {
      ElMessage.success("下载链接已复制到剪贴板");
    })
    .catch(() => {
      ElMessage.error("复制失败，请手动复制");
    });
};

// 分页处理
const handlePageChange = (page) => {
  currentPage.value = page;
};

// 每页条数变化
const handleSizeChange = (size) => {
  pageSize.value = size;
  currentPage.value = 1; // 重置到第一页
};

// 根据文件URL获取图标
const getFileIcon = (url) => {
  if (!url) return "Document";

  const extension = url.split(".").pop().toLowerCase();

  // 根据扩展名返回不同图标
  const iconMap = {
    pdf: "Document",
    doc: "Document",
    docx: "Document",
    xls: "Document",
    xlsx: "Document",
    ppt: "Document",
    pptx: "Document",
    txt: "Document",
    jpg: "Picture",
    jpeg: "Picture",
    png: "Picture",
    gif: "Picture",
    svg: "Picture",
    mp3: "VideoPlay",
    mp4: "VideoPlay",
    avi: "VideoPlay",
    mov: "VideoPlay",
    zip: "FolderOpened",
    rar: "FolderOpened",
    "7z": "FolderOpened",
    tar: "FolderOpened",
    gz: "FolderOpened",
  };

  return iconMap[extension] || "Document";
};

// 格式化文件大小
const formatFileSize = (bytes) => {
  if (!bytes) return "未知";

  const KB = 1024;
  const MB = KB * 1024;
  const GB = MB * 1024;

  if (bytes < KB) {
    return bytes + " B";
  } else if (bytes < MB) {
    return (bytes / KB).toFixed(2) + " KB";
  } else if (bytes < GB) {
    return (bytes / MB).toFixed(2) + " MB";
  } else {
    return (bytes / GB).toFixed(2) + " GB";
  }
};

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return "未知";

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch (e) {
    return "未知";
  }
};

// 组件挂载时获取文件列表
onMounted(() => {
  fetchFileList();
});
</script>

<style scoped>
.download-page {
  padding: 20px;
  background-color: var(--bg-secondary);
  min-height: calc(100vh - 52px);
  max-width: 1200px;
  margin: 0 auto;
}

.download-header {
  text-align: center;
  margin-bottom: 30px;
}

.download-header h1 {
  font-size: 32px;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.download-header .desc {
  font-size: 16px;
  color: var(--text-tertiary);
}

.search-container {
  margin-bottom: 30px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.download-content {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
  min-height: 200px;
}

.download-item {
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.download-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.file-icon {
  position: absolute;
  top: 20px;
  right: 20px;
  color: var(--text-tertiary);
  opacity: 0.3;
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.item-title {
  font-size: 18px;
  font-weight: bold;
  color: var(--text-primary);
  margin-bottom: 12px;
  padding-right: 30px;
}

.item-desc {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 16px;
  line-height: 1.5;
  flex-grow: 1;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.item-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  color: var(--text-tertiary);
  font-size: 12px;
  margin-bottom: 16px;
}

.item-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 30px;
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .download-header h1 {
    font-size: 24px;
  }

  .download-header .desc {
    font-size: 14px;
  }

  .download-content {
    grid-template-columns: 1fr;
  }

  .item-title {
    font-size: 16px;
  }

  .item-desc {
    font-size: 12px;
  }

  .item-meta {
    font-size: 10px;
    gap: 8px;
  }

  .item-action {
    flex-direction: column;
    gap: 10px;
    align-items: stretch;
  }

  .item-action .el-button {
    margin-left: 0;
  }
}
</style>
