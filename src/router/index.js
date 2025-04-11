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
          path: "upload",
          name: "Upload",
          component: () => import("../views/upload/index.vue"),
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
        {
          path: "code",
          name: "Code",
          component: () => import("../views/code/index.vue"),
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
