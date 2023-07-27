<template>
  <div class="container changeAvatars">
    <div class="selected">
      <img :src="image(profile_pic)" alt="" />
      <img
        v-if="profile_pic !== 'default.png'"
        :src="image('delete.png')"
        @click="changeAvatar('default.png')"
      />
    </div>
    <div class="options">
      <div class="row">
        <img :src="image('b1.png')" @click="changeAvatar('b1.png')" />
        <img :src="image('b2.png')" @click="changeAvatar('b2.png')" />
        <img :src="image('b3.png')" @click="changeAvatar('b3.png')" />
        <img :src="image('b4.png')" @click="changeAvatar('b4.png')" />
      </div>
      <div class="row">
        <img :src="image('g1.png')" @click="changeAvatar('g1.png')" />
        <img :src="image('g2.png')" @click="changeAvatar('g2.png')" />
        <img :src="image('g3.png')" @click="changeAvatar('g3.png')" />
        <img :src="image('g4.png')" @click="changeAvatar('g4.png')" />
      </div>
    </div>
    <div class="select">
      <button
        class="mx-2"
        style="border: 1px solid rgb(255, 255, 255, 0.5)"
        @click="goBack()"
      >
        My Info
      </button>
      <button
        class="mx-2"
        style="border: 1px solid rgb(255, 255, 255, 0.5)"
        @click="updateChange()"
      >
        Update
      </button>
      <div class="message">
        <p>{{ message }}</p>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
export default {
  name: "changeAvatar",
  data() {
    return {
      profile_pic: "",
      prev_pic: "",
      showMsg: false,
      message: ""
    };
  },
  emits: ["back"],
  beforeMount(){
    if(this.$store.state.user){
      this.profile_pic = this.$store.state.user?.profile_pic ? this.$store.state.user.profile_pic : "default.png";
      this.prev_pic = this.$store.state.user?.profile_pic ? this.$store.state.user.profile_pic : "default.png";
    }
  },
  methods: {
    image(url) {
      const path = require(`../assets/${url}`);
      return path;
    },
    changeAvatar(url) {
      this.profile_pic = url;
    },
    goBack() {
      this.$emit("back");
    },
    updateChange() {
      // api to update avatar in database
      this.showMsg = false;
      axios.post('http://localhost:5000/api/users/profile/updateAvatar', {
        profile_pic: this.profile_pic
      }, {
        headers: {
          Authorization: `Bearer ${this.$store.state.userToken}`
        }
      })
      .then((response) => {
        // console.log(response);
        this.prev_pic = this.profile_pic;
        this.message = "Avatar Updated Successfully"
        // console.log({ ...this.$store.state.user, profile_pic: this.profile_pic });
        this.$store.commit('updateUser', { ...this.$store.state.user, profile_pic: this.profile_pic });
        document.cookie = `token=${response.data.token}`
      })
      .catch((err) => {
        console.log(err);
        this.profile_pic = this.prev_pic;
        this.message = "An Error Occured"
      })
      this.showMsg = true;
      // send user back to my-info page after succesful updation using this.$emit('back')
    },
  },
};
</script>
<style>
@import url("https://fonts.googleapis.com/css?family=Montserrat:400,800");

.changeAvatars button {
  border-radius: 20px;
  border: 1px solid rgb(255, 255, 255, 0.5);
  background-color: rgb(58, 66, 109);
  color: #ffffff;
  font-size: 12px;
  font-weight: bold;
  padding: 12px 45px;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: transform 80ms ease-in;
}
.changeAvatars button:active {
  transform: scale(0.95);
}

.changeAvatars button:focus {
  outline: none;
}

.changeAvatars {
  border-radius: 10px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  position: relative;
  overflow: hidden;
  width: 768px;
  margin-top: 11vh;
  max-width: 100%;
  min-height: 600px;
  background: linear-gradient(to right, rgb(66, 66, 66), rgb(78, 91, 107));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
}
.changeAvatars .row {
  width: 100%;
  align-items: center;
}
.changeAvatars .col-3 {
  color: white;
  font-weight: bold;
  font-size: large;
  text-align: right;
}

.changeAvatars .selected {
  display: flex;
  align-items: baseline;
}
.changeAvatars .selected img {
  max-width: 150px;
}
.changeAvatars .options {
  width: 100%;
}
.changeAvatars .options .row {
  display: flex;
  align-items: center;
  justify-content: center;
}
.changeAvatars .options img {
  max-width: 125px;
}
.message {
  position: absolute;
  bottom: 0px;
  right: 290px;
}
</style>
