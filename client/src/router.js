import { createRouter, createWebHistory } from "vue-router"
import profilePage from './components/profilePage'
import feedPage from './components/feedPage'
import postDetails from './components/postDetails'

const routes = [
    {
        name: "profilePage",
        path: '/myprofile',
        component: profilePage
    },
    {
        name: "feedPage",
        path: '/',
        component: feedPage
    },
    {
        name: "postDetails",
        path: '/post',
        component: postDetails
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router