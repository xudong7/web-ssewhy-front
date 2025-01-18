<template>
  <div class="download-page">
    <div class="download-header">
      <h1>资源下载</h1>
      <p class="desc">这里提供了一些有用的学习资源和工具下载</p>
    </div>

    <div class="download-content">
      <el-card
        v-for="(item, index) in downloadList"
        :key="index"
        class="download-item"
      >
        <div class="item-info">
          <div class="item-title">{{ item.title }}</div>
          <div class="item-desc">{{ item.description }}</div>
          <div class="item-meta">
            <span>大小: {{ item.size }}</span>
            <span>下载次数: {{ item.downloads }}</span>
            <span>更新时间: {{ item.updateTime }}</span>
          </div>
        </div>
        <div class="item-action">
          <el-button type="primary" @click="handleDownload(item)">
            下载
          </el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "Download",
  data() {
    return {
      downloadList: [
        {
          title: "前端开发学习资料",
          description: "包含HTML、CSS、JavaScript等前端基础知识的学习资料",
          size: "120MB",
          downloads: 1234,
          updateTime: "2023-05-20",
          url: "https://caihanlin.com/mypaper/modeling/figure.pdf",
        },
        {
          title: "Vue.js 实战教程",
          description: "Vue.js框架的完整实战教程，包含实例代码",
          size: "85MB",
          downloads: 986,
          updateTime: "2023-06-15",
          url: "https://example.com/vue-tutorial.zip",
        },
        {
          title: "开发工具合集",
          description: "常用开发工具打包下载，包含VSCode、Git等",
          size: "500MB",
          downloads: 756,
          updateTime: "2023-07-01",
          url: "https://example.com/dev-tools.zip",
        },
      ],
    };
  },
  methods: {
    handleDownload(item) {
      window.open(item.url);
    },
  },
};
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
  margin-bottom: 40px;
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

.download-content {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.download-item {
  display: flex;
  flex-direction: column;
  background-color: var(--bg-primary);
}

.item-info {
  flex: 1;
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

.item-meta {
  display: flex;
  gap: 16px;
  color: var(--text-tertiary);
  font-size: 12px;
  margin-bottom: 16px;
}

.item-action {
  text-align: right;
}

.download-container {
  background-color: var(--bg-secondary);
}

.download-title {
  color: var(--text-primary);
}

.download-tag {
  color: var(--text-tertiary);
}

.download-item-title {
  color: var(--text-primary);
}

.download-item-desc {
  color: var(--text-secondary);
}

.download-item-tag {
  color: var(--text-tertiary);
}
</style>
