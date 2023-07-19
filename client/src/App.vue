<template>
  <div>
    <navBar />
    <div id="body-wrapper">
      <router-view />
    </div>
  </div>
</template>

<script>
import navBar from "./components/navBar.vue";

export default {
  name: "App",
  components: {
    navBar,
  },
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
  padding: 30px;
}
img{
  user-select: none;
}
</style>
