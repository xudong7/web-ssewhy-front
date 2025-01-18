<template>
  <div class="not-found-container">
    <div class="loading">
      <div class="loading-text">
        <span>找</span>
        <span>不</span>
        <span>到</span>
        <span>页</span>
        <span>面</span>
        <span>啦</span>
        <span>~</span>
      </div>
      <div class="loading-desc">即将返回首页...</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NotFoundLayout",
  mounted() {
    setTimeout(() => {
      this.$router.push("/hall");
    }, 3000);
  },
};
</script>

<style scoped>
.not-found-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--bg-primary);
}

.loading {
  text-align: center;
}

.loading-text {
  font-size: 24px;
  color: var(--text-primary);
}

.loading-text span {
  display: inline-block;
  margin: 0 2px;
  animation: bounce 1.4s infinite ease-in-out;
}

.loading-text span:nth-child(1) {
  animation-delay: 0s;
}
.loading-text span:nth-child(2) {
  animation-delay: 0.1s;
}
.loading-text span:nth-child(3) {
  animation-delay: 0.2s;
}
.loading-text span:nth-child(4) {
  animation-delay: 0.3s;
}
.loading-text span:nth-child(5) {
  animation-delay: 0.4s;
}
.loading-text span:nth-child(6) {
  animation-delay: 0.5s;
}
.loading-text span:nth-child(7) {
  animation-delay: 0.6s;
}

@keyframes bounce {
  0%,
  80%,
  100% {
    transform: scale(0);
    opacity: 0;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.loading-desc {
  margin-top: 20px;
  color: #8590a6;
  font-size: 14px;
}
</style>
