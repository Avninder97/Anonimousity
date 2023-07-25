<template>
  <div class="row g-0 profile-page">
    <div class="col-2 profile-navigation">
      <div class="profile_image">
        <img
          :src="image('b2.png')"
          alt=""
          data-bs-toggle="dropdown"
          aria-expanded=""
        />
        <ul class="dropdown-menu">
          <li class="dropdown-item" @click="optionChange('a')">
            Change Avatar
          </li>
        </ul>
      </div>
      <div class="profile_options">
        <div
          class="profilePageOptions"
          :class="myInfoClass"
          @click="optionChange('i')"
        >
          My Info
        </div>
        <div
          class="profilePageOptions"
          :class="postsClass"
          @click="optionChange('p')"
        >
          Posts
        </div>
        <div
          class="profilePageOptions"
          :class="likedClass"
          @click="optionChange('l')"
        >
          Liked
        </div>
        <div
          class="profilePageOptions"
          :class="followingClass"
          @click="optionChange('f')"
        >
          Following
        </div>
        <div
          class="profilePageOptions"
          :class="privateKeyClass"
          @click="optionChange('k')"
        >
          Private Key
        </div>
      </div>
    </div>
    <!-- Check-Mode -->
    <div class="col-10 selected_data">
      <!-- Loader -->
      <div id="spinnerHolder" v-if="show === 'loading'">
        <div class="spinner-border profileLoader">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <!-- Error page -->
      <div v-if="show === 'error'">
        <h1>An Error Occured :(</h1>
      </div>

      <!-- Change Avatar -->
      <changeAvatar
        v-if="show === 'changeAvatar'"
        @back="() => this.optionChange('i')"
      />

      <!-- Profile info page -->
      <myInfoProfile v-if="show === 'myInfo'" :user="userData" />

      <!-- While using privateKey component, keep props and emits being used in mind -->
      <privateKey
        :confirmationBox="ConfirmationBox"
        :userData="userData"
        @showBox="() => (this.ConfirmationBox = true)"
        v-if="show === 'privateKey'"
      />

      <!-- Following page -->
      <div v-if="show === 'following'">
        <followingComp
          v-for="(organization, index) in userFollowing"
          :key="index"
          :singleOrganization="organization"
          :currentUserId="loggedInUserId"
          :uToken="token"
        />
      </div>

      <!-- Created Posts -->
      <div v-if="show === 'createdPosts'">
        <postCard
          v-for="(post, index) in userCreatedPosts"
          :key="index"
          :singlePost="post"
          class="pb-4"
          :currentUserId="loggedInUserId"
          :uToken="token"
          :handleUpdate="fetchCreatedPosts"
          @postDeleted="(id) => postDeleted(id)"
        />
      </div>

      <!-- Liked Posts -->
      <div v-if="show === 'likedPosts'">
        <postCard
          v-for="(post, index) in userLikedPosts"
          :key="index"
          :singlePost="post"
          class="pb-4"
          :currentUserId="loggedInUserId"
          :uToken="token"
          :handleUpdate="fetchLikedPosts"
          @postDeleted="(id) => postDeleted(id)"
        />
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import myInfoProfile from "./myInfoProfile.vue";
import postCard from "./postCard.vue";
import changeAvatar from "./changeAvatar.vue";
import privateKey from "./privateKey.vue";
import followingComp from "./followingComp";

export default {
  name: "profilePage",
  data() {
    return {
      userData: null,
      myInfoClass: "selectedOption",
      postsClass: "profilePageOptions",
      likedClass: "profilePageOptions",
      followingClass: "profilePageOptions",
      privateKeyClass: "profilePageOptions",
      show: "loading",
      ConfirmationBox: false,
      loggedInUserId: "",
      token: "",
      userLikedPosts: [],
      userCreatedPosts: [],
      userFollowing: [],
    };
  },

  components: {
    postCard,
    myInfoProfile,
    changeAvatar,
    privateKey,
    followingComp,
  },
  beforeMount() {
    // this.loading = true;
    this.show = "loading";
    if (document.cookie.indexOf("token") === -1) {
      console.log("Cookie not found.");
      this.$store.commit("changeLoginStatus", false);
      this.$store.commit("updateToken", null);
      this.loading = false;
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
    console.log(payload.userId);
    this.loggedInUserId = payload.userId;

    console.log("userToken => ", this.$store.state.userToken);
    axios
      .get(`http://localhost:5000/api/users/anythingWorkHere/profile`, {
        headers: {
          Authorization: `Bearer ${ourToken}`,
        },
      })
      .then((response) => {
        // console.log(response.data.user);
        this.userData = response.data.user;
        this.show = "myInfo";
      })
      .catch((err) => {
        console.log(err);
        this.show = "error";
      });
  },
  methods: {
    image(url) {
      const path = require(`../assets/${url}`);
      return path;
    },
    fetchCreatedPosts() {
      this.show = "loading";
      console.log(this.token);
      axios
        .get("http://localhost:5000/api/users/profile/createdPosts", {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        })
        .then((response) => {
          console.log(response);
          this.userCreatedPosts = response?.data?.createdPosts
            ? response?.data?.createdPosts
            : [];
          this.show = "createdPosts";
        })
        .catch((err) => {
          console.log(err);
          this.userCreatedPosts = [];
          this.show = "error";
        });
    },
    fetchLikedPosts() {
      this.show = "loading";
      axios
        .get("http://localhost:5000/api/users/profile/likedPosts", {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        })
        .then((response) => {
          console.log(response);
          this.userLikedPosts = response?.data?.likedPosts
            ? response?.data?.likedPosts
            : [];
          this.show = "likedPosts";
        })
        .catch((err) => {
          console.log(err);
          this.userLikedPosts = [];
          this.show = "error";
        });
    },
    fetchFollowing() {
      this.show = "loading";
      axios
        .get("http://localhost:5000/api/users/profile/following", {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        })
        .then((response) => {
          console.log(response);
          this.userFollowing = response?.data?.following
            ? response?.data?.following
            : [];
          this.show = "following";
        })
        .catch((err) => {
          console.log(err);
          this.userFollowing = [];
          this.show = "error";
        });
    },
    optionChange(option) {
      this.myInfoClass = "";
      this.postsClass = "";
      this.likedClass = "";
      this.followingClass = "";
      this.privateKeyClass = "";
      this.ConfirmationBox = false;
      switch (option) {
        case "i":
          this.myInfoClass = "selectedOption";
          this.show = "myInfo";
          break;
        case "p":
          this.postsClass = "selectedOption";
          this.fetchCreatedPosts();
          break;
        case "l":
          this.likedClass = "selectedOption";
          this.fetchLikedPosts();
          break;
        case "f":
          this.fetchFollowing();
          this.followingClass = "selectedOption";
          break;
        case "k":
          this.privateKeyClass = "selectedOption";
          this.show = "privateKey";
          break;
        case "a":
          this.show = "changeAvatar";
          break;
        default:
          this.myInfoClass = "selectedOption";
          this.show = "myInfo";
          break;
      }
    },
    postDeleted(id) {
      console.log("Profile page changing userCreatedpost", id);
      this.userCreatedPosts = this.userCreatedPosts.filter((t) => t._id !== id);
      this.userLikedPosts = this.userLikedPosts.filter((t) => t._id !== id);
      console.log(this.userCreatedPosts);
    },
  },
};
</script>
<style>
.profile-page {
  min-height: 890px;
}
.profile-navigation {
  border-right: 1px solid rgb(240, 234, 234);
  display: grid;
  grid-template-areas: "image" "option" "option" "option" "option" "option";
}
.profile_image {
  grid-area: image;
  display: flex;
  align-items: center;
  justify-content: center;
}
.profile_image img {
  max-width: 200px;
}

.profile_options {
  grid-area: option;
  display: flex;
  flex-direction: column;
  margin-bottom: 5rem;
  justify-content: space-evenly;
}
.profilePageOptions {
  user-select: none;
  text-align: center;
  background-color: #424242;
  color: rgb(240, 234, 234);
  font-size: x-large;
  border-radius: 30px;
  margin-left: 2rem;
  margin-right: 2rem;
  font-weight: bold;
  padding: 0.75rem;
  cursor: pointer;
  transition: 0.3s ease-in;
}
.selectedOption {
  cursor: auto;
  color: inherit;
  color: #424242;
  background-color: rgb(240, 232, 232);
  border-radius: 30px 0px 0px 30px;
  margin-right: 0;
  transition: 0.3s ease-out;
}
.profile-page .selected_data {
  overflow: auto;
  height: 890px;
}
.selected_data {
  padding: 2rem;
  transition: 10s ease-in;
}

::-webkit-scrollbar {
  width: 0.5rem;
}

::-webkit-scrollbar-thumb {
  background: #818a8f;
  border-radius: 17px;
}

.profile_image ul {
  text-align: center;
  border-radius: 30px;
  box-sizing: border-box;
  width: 13rem;
}
.profile_image li {
  width: 100%;
  border-radius: 25px;
}

.profileLoader {
  width: 100px;
  height: 100px;
  align-self: center;
  /* margin: auto; */
}

#spinnerHolder {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-content: center;
  height: 80%;
  /* border: 2px white solid; */
  /* height: 100%; */
}
</style>
