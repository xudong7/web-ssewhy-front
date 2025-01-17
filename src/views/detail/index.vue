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
  width: 1000px;
  margin: 0 auto;
  padding: 20px;
  background-color: var(--bg-secondary);
  min-height: calc(100vh - 52px);
}

.detail-container {
  background-color: var(--bg-secondary);
}
</style>
