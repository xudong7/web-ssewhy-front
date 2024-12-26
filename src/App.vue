<template>
  <component :is="currentLayout">
    <router-view></router-view>
  </component>
</template>

<script>
import HomeLayout from './layouts/HomeLayout.vue';
import NotFoundLayout from './layouts/NotFoundLayout.vue';

export default {
  data() {
    return {
      currentLayout: this.getLayout(), // 获取当前布局
    };
  },
  methods: {
    getLayout() {
      if (this.$route.path === '/404') {
        return NotFoundLayout;
      }
      return HomeLayout;
    }
  },
  watch: {
    $route() {
      this.currentLayout = this.getLayout(); // 路由变化时切换布局
    }
  }
};
</script>

