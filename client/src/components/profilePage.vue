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
      <changeAvatar
        v-show="show === 'changeAvatar'"
        @back="() => this.optionChange('i')"
      />
      <myInfoProfile v-show="show === 'myInfo'" />
      <!-- While using privateKey component, keep props and emits being used in mind -->
      <privateKey
        :confirmationBox="ConfirmationBox"
        @showBox="() => (this.ConfirmationBox = true)"
        v-show="show === 'privateKey'"
      />
      <postCard v-show="show === 'posts'" class="card py-2" />
      <postCard v-show="show === 'posts'" class="card py-2" />
      <postCard v-show="show === 'posts'" class="card py-2" />
      <postCard v-show="show === 'posts'" class="card py-2" />
      <postCard v-show="show === 'posts'" class="card py-2" />
    </div>
  </div>
</template>
<script>
import myInfoProfile from "./myInfoProfile.vue";
import postCard from "./postCard.vue";
import changeAvatar from "./changeAvatar.vue";
import privateKey from "./privateKey.vue";

export default {
  name: "profilePage",
  data() {
    return {
      myInfoClass: "selectedOption",
      postsClass: "profilePageOptions",
      likedClass: "profilePageOptions",
      followingClass: "profilePageOptions",
      privateKeyClass: "profilePageOptions",
      show: "myInfo",
      ConfirmationBox: false,
    };
  },
  components: {
    postCard,
    myInfoProfile,
    changeAvatar,
    privateKey,
  },
  methods: {
    image(url) {
      const path = require(`../assets/${url}`);
      return path;
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
          this.show = "posts";
          break;
        case "l":
          this.likedClass = "selectedOption";
          this.show = "liked";
          break;
        case "f":
          this.followingClass = "selectedOption";
          this.show = "following";
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
</style>
