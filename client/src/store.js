import { createStore } from 'vuex'

const store = createStore({
    state(){
        return{
            loggedIn: true,
            userToken: "",
            user: null,
        }
    },
    mutations: {
        changeLoginStatus(state, newVal){
            state.loggedIn = newVal;
        },
        updateToken(state, newToken){
            state.userToken = newToken;
        },
        updateUser(state, data){
            state.user = data;
        },
    }
})

export default store