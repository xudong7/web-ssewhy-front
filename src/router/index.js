/*
 * @Author: xudong7 13433126742@163.com
 * @Date: 2024-12-28 19:28:12
 * @LastEditors: xudong7 13433126742@163.com
 * @LastEditTime: 2025-01-02 20:11:09
 * @FilePath: \front\src\router\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";

const router = new createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: () => import("../layouts/HomeLayout.vue"),
      children: [
        {
          path: "",
          redirect: "/hall",
        },
        {
          path: "hall",
          name: "Hall",
          component: () => import("../views/hall/index.vue"),
        },
        {
          path: "home",
          name: "Home",
          component: () => import("../views/home/index.vue"),
        },
        {
          path: "detail/:articleId",
          name: "Detail",
          component: () => import("../views/detail/index.vue"),
        },
        {
          path: "download",
          name: "Download",
          component: () => import("../views/download/index.vue"),
        },
        {
          path: "knowledge",
          name: "Knowledge",
          component: () => import("../views/knowledge/index.vue"),
        },
        {
          path: "pins",
          name: "Pins",
          component: () => import("../views/pins/index.vue"),
        },
        {
          path: "write",
          name: "Write",
          component: () => import("../views/write/index.vue"),
        },
        {
          path: "search",
          name: "Search",
          component: () => import("../views/search/index.vue"),
        },
        {
          path: "user/:userId",
          name: "User",
          component: () => import("../views/user/index.vue"),
        },
      ],
    },
    {
      path: "/login",
      name: "Login",
      component: () => import("../views/login/index.vue"),
    },
    {
      path: "/register",
      name: "Register",
      component: () => import("../views/register/index.vue"),
    },
    {
      path: "/dashboard",
      name: "Dashboard",
      component: () => import("../views/dashboard/index.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: () => import("../layouts/NotFoundLayout.vue"),
    },
  ],
});
export default router;
