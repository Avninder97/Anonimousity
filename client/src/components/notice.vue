<template>
  <div class="noticePageWrapper">
    <p class="display-4">
      You are not authorized to do the requested action
    </p>
    <div class="d-flex flex-column">
      <p class="noticeText text-center">
        Kindly Create an Account with a work email address to get verified.
      </p>
      <br>
      <div class="btn-holder">
        <div class="align-self-center mt-3 btn btn-danger text-center noticeText me-3 py-2 px-4" @click="this.$router.back()">
          Go Back
        </div>
        <div class="align-self-center mt-3 btn btn-success text-center noticeText ms-3 py-2 px-4" @click="this.$router.push('/login')">
          Login
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
// import axios from 'axios';
export default {
  name: "noticeComponent",
}
</script>
  
<style>
.noticePageWrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 50vh;
  color: antiquewhite;
}

.noticeText {
  font-size: 1.3rem;
}

.btn-holder {
  display: flex;
  flex-direction: row;
  justify-content: center;

}
</style>