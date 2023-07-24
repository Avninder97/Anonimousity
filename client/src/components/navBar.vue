<template>
  <nav class="navbar navbar-light ourNavbar fixed-top">
    <div class="container-fluid">
      <span class="navbar-brand text-light" @click="openFeeds">Anonymousity</span>
      <div>
        <div v-if="this.$store.state.loggedIn" class="mx-2 userOptions">
          <div class="addPost mx-3" @click="this.$router.push({name: 'addPost'})">+</div>
        <img
          src="../assets/b1.png"
          class="navbar-logo"
          width="38"
          data-bs-toggle="dropdown"
          aria-expanded=""
          alt="Avatar"
        />
        <ul class="dropdown-menu dropdown-menu-end">
          <li class="dropdown-item" @click="openProfile">Profile</li>
          <li><hr class="dropdown-divider" /></li>
          <li class="dropdown-item" @click="logoutUser">Log Out</li>
        </ul>
      </div>
      <div v-else>
        <button class="btn btn-outline-success mx-2" @click="changeLog">
          Login/ SignUp
        </button>
      </div>
      </div>
      
    </div>
  </nav>
</template>
<script>
export default {
  name: "navBar",
  data() {
    return {};
  },
  methods: {
    openProfile() {
      this.$router.push({ name: "profilePage" });
    },
    openFeeds() {
      this.$router.push({ name: "feedPage" });
    },
    logoutUser() {
      let expirationDate = new Date();
      expirationDate.setFullYear(expirationDate.getFullYear() - 1);
      document.cookie = "token=; expires=" + expirationDate.toUTCString() + "; path=/";
      console.log("cookie deleted");
      this.$store.commit('changeLoginStatus', false);
      this.$store.commit('updateToken', null);
      this.$router.push({name: 'loginPage'})
    },
    changeLog() {
      this.$router.push({name: 'loginPage'})
    },
  },
};
</script>
<style>
.ourNavbar {
  background-color: rgb(47, 17, 98);
}
.dropdown-item {
  cursor: pointer;
}
.navbar-brand {
  cursor: pointer;
}
.ourNav{
  background-color: white;
}
.userOptions{
  display: flex;
  align-items: center;
}
.addPost{
  user-select: none;
  cursor: pointer;
  font-size: xx-large;
  color: white;
  display: flex;
  font-weight: 800;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  border: 2px solid white;
  width: 35px;
  height: 35px;
}
.addPost:hover{
  color: inherit;
  font-weight: 1000;
  background-color: white;
}
</style>
