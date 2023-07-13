<template>
  <nav class="navbar navbar-light bg-light">
    <div class="container-fluid">
      <a class="navbar-brand">Anonymousity</a>
      
        <div v-if="token" class="btn-group">
          <img
            src="../assets/b1.png"
            class="navbar-logo"
            width="38"
            data-bs-toggle="dropdown"
            aria-expanded=""
            alt="..."
          />
          <ul class="dropdown-menu dropdown-menu-end">
            <li class="dropdown-item">Profile</li>
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
      token: false,
    };
  },
};
</script>
<style>
.dropdown-item{
  cursor: pointer;
}

</style>
