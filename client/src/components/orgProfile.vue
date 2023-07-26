<template>
  <div v-if="loading" id="spinnerHolder">
    <div class="spinner-border orgLoader" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
  <div v-else-if="error" class="orgError">
    <h1>404 - Organization Not Found</h1>
  </div>
  <div v-else class="orgProfile">
    <div class="container profile p-3 px-5">
      <div class="row">
        <div class="col text-left align-items-center">
          <img src="../assets/partners.png" width="28" class="mx-2" />{{ organizationName }}
        </div>
        <div class="col text-end me-2 align-items-center" v-if="isVerified">
          <img src="../assets/verified.png" width="28" class="mx-2" />Verified
        </div>
        <div class="col text-end me-2 align-items-center" v-else>
          <img src="../assets/unverified.png" width="18" /> Unverified
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
import axios from 'axios';
export default {
  name: "orgProfile",
  data() {
    return {
      organizationData: null,
      organizationName: "Not Found",
      employees: '-',
      posts: '-',
      isVerified: false,
      isFollowing: true,
      loading: false,
      error: false,
      loggedInUserId: '',
      token: ''
    };
  },
  async beforeMount() {

    this.loading = true;
    this.error = false;

    if (document.cookie.indexOf("token") === -1) {
      console.log("Cookie not found.");
      this.$router.push({ name: "loginPage" });
    }

    const cookiesArray = document.cookie.split(";");
    let ourToken = "";
    cookiesArray.map((cString) => {
      if (cString.split("=")[0] === "token") {
        ourToken = cString.split("=")[1];
        ourToken.trim();
      }
    });
    this.token = ourToken;
    let payload = ourToken.split(".")[1];
    payload = payload.replace(/-/g, "+").replace(/_/g, "/");
    payload = decodeURIComponent(
      window
        .atob(payload)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    payload = JSON.parse(payload);
    this.loggedInUserId = payload.userId;

    const oId = this.$route.params.orgId;

    // To avoid nesting used try catch instead of .then .catch
    try {
      const organizationResponse = await axios.get(`http://localhost:5000/api/organizations/${oId}`);
      if (!organizationResponse) {
        throw "Organization not found";
      }

      const postResponse = await axios.get(`http://localhost:5000/api/posts?organization=${organizationResponse.data.data.name}`);
      if (!postResponse) {
        throw "Post not found";
      }

      this.organizationName = organizationResponse.data?.data?.name ? organizationResponse.data.data.name.charAt(0).toUpperCase() + organizationResponse.data.data.name.slice(1) : "Not Found";
      this.employees = organizationResponse.data?.data?.currentEmployees?.length ? organizationResponse.data?.data?.currentEmployees?.length : "-";
      this.posts = postResponse.data?.posts?.length ? postResponse.data?.posts?.length : "-";
      this.isVerified = organizationResponse?.data?.data?.isVerified ? organizationResponse.data.data.isVerified : false;
      this.isFollowing = organizationResponse.data.data.followers.some((id) => id === this.loggedInUserId);
      this.loading = false;

    } catch (err) {
      console.log(err);
      this.loading = false;
      this.error = true;
    }
  },
  methods: {
    changeFollow() {
      this.isFollowing = !this.isFollowing;
      const oId = this.$route.params.orgId;
      axios.post(`http://localhost:5000/api/organizations/${oId}/follow`, {}, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      })
        .then((response) => {
          console.log(response);
        })
        .catch((err) => {
          console.log(err);
          this.isFollowing = !this.isFollowing;
        })
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

.orgProfile .unfollow {
  border: 1px solid red;
  background-color: red;
}

.orgProfile .goBack {
  background-color: rgb(66, 66, 66);
  border: 1px solid rgb(66, 66, 66);
}

#spinnerHolder {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-content: center;
  height: 60vh;
}

.orgLoader {
  width: 100px;
  height: 100px;
  align-self: center;
}

.orgError {
  width: 100%;
  height: 60vh;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}</style>
