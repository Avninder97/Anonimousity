import { createStore } from 'vuex'

const store = createStore({
    state(){
        return{
            userToken: "",
            user: null
        }
    },
    mutations: {
        changeLoginStatus(state){
            state.loggedIn = !state.loggedIn
        },
        updateToken(state, token){
            state.userToken = token;
        },
        updateUser(state, data){
            state.user = data;
        }
    }
})

export default store