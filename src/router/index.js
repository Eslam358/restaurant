import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  // {
  //   path: "/about",
  //   name: "about",
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  // },
  {
    path: "/signup",
    name: "signup",
    component: () => import("../views/signUp.vue"),
  },
  {
    path: "/signin",
    name: "signin",
    component: () => import("../views/signIn.vue"),
  },
  {
    path: "/location/:location",
    name: "restaurant",
    component: () => import("../views/restaurantLocation.vue"),
  },
  {
    path: "/:location/:restaurant/mene",
    name: "mene",
    component: () => import("../views/restMenue.vue"),
  },
  {
    path: "/:location/:restaurant/:mene/items",
    name: "items",
    component: () => import("../views/setItems.vue"),
  },
  {
    path: "/signin",
    name: "signin",
    component: () => import("../views/signIn.vue"),
  },
  {
    path: "/express",
    name: "express",
    component: () => import("../views/exPress.vue"),
  },
  // will match everything and put it under `$route.params.pathMatch`
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("../views/notFound.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});
router.beforeEach((to, form, next) => {
  // console.log(to);
  document.title = to.name;
  // console.log(form);
  next();
});

export default router;
// const routes = [
//   // will match everything and put it under `$route.params.pathMatch`
//   { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
//   // will match anything starting with `/user-` and put it under `$route.params.afterUser`
//   { path: '/user-:afterUser(.*)', component: UserGeneric },
// ]
