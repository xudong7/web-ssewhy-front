// src/router/index.js
import {createRouter, createWebHistory} from "vue-router";

const router = new createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: () => import("../views/hall/index.vue"),
      children: [
        {
          path: "hall",
          component: () => import("../views/hall/index.vue")
        }
      ]
    },
    {
      path: "/login",
      name: "Login",
      component: () => import("../views/login/index.vue"),
    },
    {
      path: "/dashboard",
      name: "Dashboard",
      component: () => import("../views/dashboard/index.vue"),
    },
  ],
});
export default router;
