<template>
  <div class="row g-0 profile-page">
    <div class="col-2 profile-navigation">
      <div class="profile_image">
        <img :src="image('b2.png')" alt="" />
      </div>
      <div class="profile_options">
        <div class="profilePageOptions" :class="myInfoClass" @click="optionChange('i')">My Info</div>
        <div class="profilePageOptions" :class="postsClass" @click="optionChange('p')">Posts</div>
        <div class="profilePageOptions" :class="likedClass" @click="optionChange('l')">Liked</div>
        <div class="profilePageOptions" :class="followingClass" @click="optionChange('f')">Following</div>
        <div class="profilePageOptions" :class="privateKeyClass" @click="optionChange('k')">
          Private Key
        </div>
      </div>
    </div>
    <!-- Check-Mode -->
    <div class="col-10 selected_data">
      <myInfoProfile v-show="show === 'myInfo'"/>
      <postCard v-show="show === 'posts'" class="card py-2"/>
      <postCard v-show="show === 'posts'" class="card py-2"/>
      <postCard v-show="show === 'posts'" class="card py-2"/>
      <postCard v-show="show === 'posts'" class="card py-2"/>
      <postCard v-show="show === 'posts'" class="card py-2"/>
    </div>
  </div>
</template>
<script>
import myInfoProfile from './myInfoProfile.vue';
import postCard from './postCard.vue';
export default {
  name: "profilePage",
  data() {
    return {
      myInfoClass: "selectedOption",
      postsClass: "profilePageOptions",
      likedClass: "profilePageOptions",
      followingClass: "profilePageOptions",
      privateKeyClass: "profilePageOptions",
      show: 'myInfo'
    };
  },
  components:{
    postCard,
    myInfoProfile
  },
  methods: {
    image(url) {
      const path = require(`../assets/${url}`);
      return path;
    },
    optionChange(option) {
      this.myInfoClass = ""
      this.postsClass = ""
      this.likedClass = ""
      this.followingClass =""
      this.privateKeyClass = ""
      switch (option) {
        case "p":
          this.postsClass = "selectedOption";
          this.show = 'posts'
          break;
        case "l":
          this.likedClass = "selectedOption";
          this.show = 'liked'
          break;
        case "f":
          this.followingClass = "selectedOption";
          this.show = 'following'
          break;
        case "k":
          this.privateKeyClass = "selectedOption";
          this.show = 'privateKey'
          break;
        default:
        this.myInfoClass = "selectedOption";
        this.show = 'myInfo'
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
  /* text-align: right; */
  background-color: #818A8F;
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
  background-color: rgb(240,232,232);
  border-radius: 30px 0px 0px 30px;
  margin-right: 0;
  transition: 0.3s ease-out;
}
.profile-page .selected_data {
  overflow: auto;
  height: 890px;
  /* scrollbar-width: 20px;
  scrollbar-base-color: red;
  scrollbar-color: red; */
}
.selected_data{
  padding: 2rem;
  transition: 10s ease-in;
}

::-webkit-scrollbar {
  width: 0.5rem;
  /* border-radius: 50%; */
}

/* ::-webkit-scrollbar-track {
  background: none
} */
::-webkit-scrollbar-thumb {
  /* background: #888; */
  background: #818A8F;
  border-radius: 17px;
}
/* .selected_data .card{
  border-bottom: 1px solid rgb(240, 234,234,0.3);
} */

</style>
