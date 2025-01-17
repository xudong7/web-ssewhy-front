<!--
 * @Author: xudong7 13433126742@163.com
 * @Date: 2024-12-26 22:40:22
 * @LastEditors: xudong7 13433126742@163.com
 * @LastEditTime: 2025-01-17 16:35:44
 * @FilePath: \front\src\layouts\NotFoundLayout.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
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
  background: #f7f9fa;
}

.loading {
  text-align: center;
}

.loading-text {
  font-size: 24px;
  color: #1a1a1a;
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
