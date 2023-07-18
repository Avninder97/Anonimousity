import { createRouter, createWebHistory } from "vue-router";
import profilePage from "./components/profilePage";
import feedPage from "./components/feedPage";
import postDetails from "./components/postDetails";
import loginPage from "./components/loginPage";

const routes = [
  {
    name: "profilePage",
    path: "/profile",
    component: profilePage,
  },
  {
    name: "feedPage",
    path: "/",
    component: feedPage,
  },
  {
    name: "postDetails",
    path: "/post",
    component: postDetails,
  },
  { name: "loginPage", path: "/login", component: loginPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
