<template>
  <div class="container profile p-3 px-5">
    <div class="row">
      <div class="col text-start">{{ organizationName }}</div>
      <div class="col align-items-center text-center">
        <img src="../assets/employee.png" width="28" /> Employees: {{ employeesNumber }}
      </div>
      <div class="col align-items-center text-center">
        <img src="../assets/followers.png" width="28" /> Followers: {{ followers }}
      </div>
      <div class="col align-items-center text-center" v-if="isVerified">
        <img src="../assets/verified.png" width="28" /> Verified
      </div>
      <div v-else>
        <img src="../assets/unverified.png" width="28"/> Unverified
      </div>
      <div class="col text-end">
        <button class="btn btn-danger" @click="unfollowOrg">Unfollow</button>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';

export default {
  name: "followingCompanies",
  props: {
    singleOrganization: Object,
    currentUserId: String,
    uToken: String,
    handleUpdate: Function
  },
  data() {
    return {
      organizationName: this.singleOrganization?.name ? (this.singleOrganization.name).charAt(0).toUpperCase() + (this.singleOrganization.name).slice(1) : "Empty",
      isVerified: this.singleOrganization?.isVerified,
      employeesNumber: this.singleOrganization?.currentEmployees?.length ? this.singleOrganization?.currentEmployees?.length : "-",
      followers: this.singleOrganization?.followers?.length ? this.singleOrganization?.followers?.length : "-"

    };
  },
  methods: {
    unfollowOrg(){
        // api to unfollow organization
        axios.post(`http://localhost:5000/api/organizations/${this.singleOrganization._id}/follow`, {}, {
          headers: {
            Authorization: `Bearer ${this.uToken}`
          }
        })
        .then((response) => {
          console.log(response);
          this.handleUpdate();
        })
        .catch((err) => {
          console.log(err);
        })
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
