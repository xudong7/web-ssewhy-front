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
  background-color: #f6f6f6;
  min-height: calc(100vh - 52px);
}
</style>
