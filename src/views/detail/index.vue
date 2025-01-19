<template>
  <div class="detail-page">
    <ArticleComponent />
    <CommentComponent />
  </div>
</template>

<script>
export default {
  name: "Detail",
};
</script>

<style scoped>
.detail-page {
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
  padding: 20px;
  background-color: var(--bg-secondary);
  min-height: calc(100vh - 52px);
}

.detail-container {
  background-color: var(--bg-secondary);
}

@media screen and (max-width: 768px) {
  .detail-page {
    padding: 0;
    margin: 0;
    width: 100%;
    max-width: 100%;
    overflow-x: hidden; /* 防止水平滚动 */
  }
}

@media screen and (max-width: 480px) {
  .detail-page {
    padding: 0;
  }
}
</style>
