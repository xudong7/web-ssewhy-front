import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import App from "./App.vue";
import router from "./router";
import ElementPlus from "element-plus";

// 引入样式文件
import "element-plus/dist/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";
import "./styles/variables.css";
import "./styles/element-plus.css";
import "highlight.js/styles/vs2015.css";
// import 'highlight.js/styles/vs2015.css';
// import 'highlight.js/styles/github.css';
// import 'highlight.js/styles/xcode.css';
// import "highlight.js/styles/atom-one-dark.css";
// import 'highlight.js/styles/default.css';

const app = createApp(App);
const pinia = createPinia();

// 使用持久化插件
pinia.use(piniaPluginPersistedstate);

app.use(ElementPlus);
app.use(pinia);
app.use(router);
app.mount("#app");
