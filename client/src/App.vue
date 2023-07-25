<template>
  <div>
    <navBar />
    
    <div id="body-wrapper">
      <router-view/>  
    </div>
  </div>
</template>

<script>
import navBar from "./components/navBar.vue";
import axios from "axios";

export default {
  name: "App",
  components: {
    navBar,
  },
  async beforeMount(){
    // first find the token from cookies
    // then extract it, after that send it to backend via api call
    // if valid then refresh it in backend
    // else delete it from frontend

    if (document.cookie.indexOf('token') === -1) {
      // console.log('Cookie not found.');
      this.$store.commit('changeLoginStatus', false);
      this.$store.commit('updateToken', null);
      return;
    }

    const cookiesArray = document.cookie.split(';');
    let ourToken = "";
    cookiesArray.map((cString) => {
      if(cString.split('=')[0] === 'token'){
        ourToken = cString.split('=')[1];
        ourToken.trim();
      }
    });

    await axios.post('http://localhost:5000/api/auth/isLoggedIn', {}, {
      headers: {
        Authorization: `Bearer ${ourToken}`
      }
    })
    .then(() => {
      // console.log(response);
      // console.log("Already Logged In");
      this.$store.commit('changeLoginStatus', true);
      this.$store.commit('updateToken', ourToken);

    })
    .catch(() => {
      // Set the expiration date to a date in the past (to delete the cookie)
      let expirationDate = new Date();
      expirationDate.setFullYear(expirationDate.getFullYear() - 1);
      
      // Set the cookie with the updated expiration date
      document.cookie = "token=; expires=" + expirationDate.toUTCString() + "; path=/";
      // console.log("cookie deleted");
      this.$store.commit('changeLoginStatus', false);
      this.$store.commit('updateToken', null);
    })
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
}
#body-wrapper {
  margin-top: 56px;
}
img{
  user-select: none;
}
input::placeholder{
  user-select: none;
}
</style>
