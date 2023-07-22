<template>
  <div class="orgProfile">
    <div class="container profile p-3 px-5">
      <div class="row">
        <div class="col text-left align-items-center">
          <img src="../assets/partners.png" width="28" class="mx-2" />Argusoft
        </div>
        <div class="col text-end me-2 align-items-center">
          <img src="../assets/verified.png" width="28" class="mx-2" />Verified
        </div>
      </div>
    </div>
    <div class="details">
      <h3 class="m-4 fw-bold">Current Employees on Platform: {{ employees }}</h3>
      <h3 class="m-4 fw-bold">Posts Related to the Organization: {{ posts }}</h3>
      <button class="goBack px-4" @click="this.$router.back()">Back</button>
      <button v-if="isFollowing" class="unfollow" @click="changeFollow">Unfollow</button>
      <button v-else @click="changeFollow">Follow</button>
      
    </div>
  </div>
</template>
<script>
export default {
  name: "orgProfile",
  data() {
    return {
      employees: 10,
      posts: 23,
      isFollowing: true,
    };
  },
  methods:{
    changeFollow(){
        this.isFollowing = !this.isFollowing
        // api to change following status in database
        // get id of the organization from url parameter
    }
  }
};
</script>
<style scoped>
.orgProfile .profile {
  justify-content: center;
  min-height: auto;
  border-radius: 40px;
  width: auto;
  font-size: x-large;
  font-weight: bold;
  /* margin-top: auto; */
  margin: 8rem auto;
}
.orgProfile {
  max-width: 1240px;
  margin: 0 auto;
}
.orgProfile .details {
  margin-left: 5rem;
  margin-right: 5rem;
  /* margin-top: 8rem; */
  color: white;
  text-align: center;
}
.orgProfile button {
  border-radius: 20px;
  border: 1px solid green;
  background-color: green;
  color: #ffffff;
  font-weight: bold;
  padding: 12px 45px;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: transform 80ms ease-in;
  margin: 1rem;
}

.orgProfile button:active {
  transform: scale(0.95);
}

.orgProfile button:focus {
  outline: none;
}
.orgProfile .unfollow{
    border: 1px solid red;
    background-color: red   ;
}
.orgProfile .goBack{
    background-color: rgb(66,66,66);
    border: 1px solid rgb(66,66,66);
}
</style>
