import { createRouter, createWebHistory } from "vue-router"
import profilePage from './components/profilePage'
import feedPage from './components/feedPage'
import postDetails from './components/postDetails'
import loginPage from "./components/loginPage";
import accountActivation from './components/accountActivation'
import addPost from './components/addPost.vue'
import orgProfile from './components/orgProfile.vue'


const routes = [
    {
        name: "profilePage",
        path: '/profile',
        component: profilePage
    },
    {
        name: "feedPage",
        path: '/',
        component: feedPage
    },
    {
        name: "postDetails",
        path: '/post/:postId',
        component: postDetails
    },
    {   name: "loginPage",
        path: "/login",
        component: loginPage
    },
    {
        name: "accountActivation",
        path: '/account/activation/:slug',
        component: accountActivation,
        props: true
    },
    {
        name: "addPost",
        path: "/addPost",
        component: addPost
    },
    {
        name: "orgProfile",
        path: "/orgProfile/:orgId",
        component: orgProfile
    }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
