import { createRouter, createWebHistory } from "vue-router"
import profilePage from './components/profilePage'
import feedPage from './components/feedPage'
import postDetails from './components/postDetails'
import loginPage from "./components/loginPage";
import accountActivation from './components/accountActivation'

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
        path: '/posts',
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
    }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
