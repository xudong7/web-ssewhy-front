import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import {ElementPlusResolver} from "unplugin-vue-components/resolvers";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // 自动导入
    AutoImport({
      // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
      imports: ["vue", "vue-router", "@vueuse/core"],
      resolvers: [
        // 自动导入 Element Plus 相关函数
        ElementPlusResolver(),
      ],
      // 配置文件位置 (false:关闭自动生成)
      dts: resolve(__dirname, "src/types/auto-imports.d.ts"),
    }),
    Components({
      resolvers: [
        // 自动导入 Element Plus 组件
        ElementPlusResolver(),
      ],
      // 指定自定义组件位置(默认:src/components)
      dirs: ["src/**/components"],
      // 配置文件位置 (false:关闭自动生成)
      dts: resolve(__dirname, "src/types/components.d.ts"),
    }),
  ],
  resolve: {
    // 导入文件时省略文件扩展名
    extensions: [".js", ".ts", ".vue", ".json", "es"],
    // 配置路径别名
    alias: { "@": resolve(__dirname, "src") },
  },
  css: {
    // CSS 预处理器
    preprocessorOptions: {
      // 定义全局 SCSS 变量
      scss: {
        javascriptEnabled: true,
        additionalData: "@use '/src/styles/variables.scss' as *;",
      },
    },
  },
})
