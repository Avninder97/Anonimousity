<template>
  <div class="about" @click="getData">
    <h1>This is an about page</h1>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  
  data(){
        return {
            users: []
        }
    },
    methods: {
        getData(){
            console.log('clicked')
            let data = axios.get('http://localhost:5000/api/users/all')
            .then((res) => {
                console.log(res.data.data);
            })
            .catch((err) => {
                console.log(err);
            })
        }
    }
}
</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
