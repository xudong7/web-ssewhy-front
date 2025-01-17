<template>
  <div class="footer">
    <p @click="goToGithub">© 2024 sse-why.com</p>
  </div>
</template>

<script>
export default {
  name: "FooterComponent",
  methods: {
    goToGithub() {
      window.open("https://github.com/xudong7/web-ssewhy-front", "_blank");
    },
  },
};
</script>

<style scoped>
.footer {
  text-align: center;
  padding: 10px 0;
  background-color: var(--bg-primary);
  color: #8590a6;
  font-size: 14px;
}

.footer p {
  cursor: pointer;
  transition: all 0.3s ease;
}

.footer p:hover {
  color: #000;
}
</style>
