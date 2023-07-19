<template>
  <nav class="navbar ourNav">
    <div class="container-fluid">
      <span class="navbar-brand" @click="openFeeds">Anonymousity</span>

      <div v-if="this.$store.state.loggedIn" class="mx-2">
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
          <li class="dropdown-item" @click="changeLog">Log Out</li>
        </ul>
      </div>
      <div v-else>
        <button class="btn btn-outline-success mx-2" @click="changeLog">
          Login/ SignUp
        </button>
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
    changeLog() {
      // this.$store.commit("changeLog");
      this.$router.push({name: 'loginPage'})
    },
  },
};
</script>
<style>
.dropdown-item {
  cursor: pointer;
}
.navbar-brand {
  cursor: pointer;
}
.ourNav{
  background-color: white;
}
</style>
