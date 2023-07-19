<template>
  <nav class="navbar navbar-light ourNavbar fixed-top">
    <div class="container-fluid">
      <span class="navbar-brand text-light" @click="openFeeds">Anonymousity</span>

      <div v-if="token" class="btn-group">
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
          <li class="dropdown-item">Log Out</li>
        </ul>
      </div>
      <button v-else class="btn btn-outline-success">Login / Sign Up</button>
    </div>
  </nav>
</template>
<script>
export default {
  name: "navBar",
  data() {
    return {
      token: true,
    };
  },
  methods: {
    openProfile() {
      this.$router.push({ name: "profilePage" });
    },
    openFeeds() {
      this.$router.push({ name: "feedPage" });
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
.navbar-brand{
  cursor: pointer;
}
</style>
