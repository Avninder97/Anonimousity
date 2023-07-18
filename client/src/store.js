import { createStore } from 'vuex'

const store = createStore({
    state(){
        return{
            loggedIn: false
        }
    },
    mutations: {
        changeLog(state){
            state.loggedIn = !state.loggedIn
        }
    }
})

export default store