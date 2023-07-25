<template>
  <div class="container profile p-3 px-5">
    <div class="row">
      <div class="col text-start">Argusoft</div>
      <div class="col align-items-center text-center">
        <img src="../assets/employee.png" width="28" /> Current Employees()
      </div>
      <div class="col align-items-center text-center">
        <img src="../assets/followers.png" width="28" /> Followers()
      </div>
      <div class="col align-items-center text-center">
        <img src="../assets/verified.png" width="28" /> Verified
      </div>
      <div class="col text-end">
        <button class="btn btn-danger" @click="unfollowOrg">Unfollow</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "followingCompanies",
  props: {
    singleOrganization: Object,
    currentUserId: String,
    uToken: String
  },
  data() {
    return {};
  },
  methods: {
    unfollowOrg(){
        // api to unfollow organization
    }
  },
};
</script>
<style scoped>
.profile {
  justify-content: center;
  min-height: auto;
  border-radius: 40px;
  width: auto;
  font-size: large;
  font-weight: bold;
  margin: auto 5rem;
}
.profile button {
  width: auto;
  margin: 0 auto;
}
</style>
