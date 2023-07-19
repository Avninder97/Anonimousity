<template>
  <div class="container login avatars" v-if="avatar_page">
    <div class="selected">
      <img :src="image(signUpData.profile_pic)" alt="" />
      <img
        v-show="signUpData.profile_pic !== 'default.png'"
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
        @click="this.$router.back()"
      >
        Skip
      </button>
      <button class="mx-2" style="border: 1px solid rgb(255, 255, 255, 0.5)">
        Update
      </button>
    </div>
  </div>
  <div v-else class="container login" ref="container">
    <div class="form-container sign-up-container">
      <div class="form">
        <h2>Create Account</h2>
        <input
          type="text"
          placeholder="Username"
          v-model.lazy="signUpData.username"
        />
        <input type="email" placeholder="Email" v-model="signUpData.email" />
        <input
          type="password"
          placeholder="Password"
          v-model="signUpData.password"
        />
        <input
          type="text"
          placeholder="Retype Password"
          v-model="retyped_password"
          ref="retype_password"
        />
        <input
          type="text"
          placeholder="Organization"
          v-model="signUpData.organization"
        />
        <!-- <input type="text" placeholder="Gender" v-model="signUpData.gender" />
         -->
        <div class="genderClass">
          <div class="genOne">
            <input type="radio" name="gender" value="male" />
            <span class="ms-2">Male</span>
          </div>
          <div class="genOne">
            <input type="radio" name="gender" value="female" />
            <span class="ms-2">Female</span>
          </div>
        </div>

        <button @click="selectAvatar">Sign Up</button>
      </div>
    </div>
    <div class="form-container sign-in-container">
      <div class="form">
        <h2>Sign in</h2>
        <input type="email" placeholder="Email" v-model="username"/>
        <input type="password" placeholder="Password" v-model="password"/>
        <a href="#">Forgot your password?</a>
        <button @click="changeLog">Sign In</button>
      </div>
    </div>
    <div class="overlay-container">
      <div class="overlay">
        <div class="overlay-panel overlay-left">
          <h2>Welcome Back!</h2>
          <p>To keep connected with us please login with your personal info</p>
          <button class="ghost" @click="signInForm">Sign In</button>
        </div>
        <div class="overlay-panel overlay-right">
          <h2>Hello, Friend!</h2>
          <p>Enter your details and start journey with us</p>
          <button class="ghost" @click="signUpForm">Sign Up</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "loginPage",
  data() {
    return {
      username: "",
      password: "",
      messageClass: "hide",
      signUpData: {
        username: "",
        email: "",
        password: "",
        organization: "",
        gender: "",
        profile_pic: "default.png",
      },
      retyped_password: "",
      avatar_page: false,
    };
  },
  methods: {
    signUpForm() {
      this.$refs.container.classList.add("right-panel-active");
    },
    signInForm() {
      this.$refs.container.classList.remove("right-panel-active");
    },
    selectAvatar() {
      // forward to avatar selection page
      this.avatar_page = true;
    },
    image(url) {
      const path = require(`../assets/${url}`);
      return path;
    },
    changeAvatar(url) {
      this.signUpData.profile_pic = url;
    },
    changeLog() {
      // api for sign in using this.username this.password
      this.$store.commit("changeLog");
      this.$router.back();
    },
  },
  watch: {
    "signUpData.username"() {
      // api call for checking username
      console.log("check username");
      console.log(this.signUpData.username);
    },
    retyped_password(newValue) {
      if (newValue !== this.signUpData.password) {
        // Password unmatched
        console.log(this.$refs.retype_password);
        this.$refs.retype_password.style.outline = "1px solid red";
      } else {
        //Password Matched
        this.$refs.retype_password.style.outline = "none";
      }
    },
  },
};
</script>
<style scoped>
@import url("https://fonts.googleapis.com/css?family=Montserrat:400,800");

.login * {
  box-sizing: border-box;
  font-family: "Montserrat", sans-serif;
}

.login h2 {
  color: rgb(123, 123, 150);
  font-weight: bold;
  margin: 0;
}

.login p {
  font-size: 14px;
  font-weight: 100;
  line-height: 20px;
  letter-spacing: 0.5px;
  margin: 20px 0 30px;
}

.login span {
  font-size: 12px;
}

.login a {
  color: #333;
  font-size: 14px;
  text-decoration: none;
  margin: 15px 0;
}

.login button {
  border-radius: 20px;
  border: 1px solid rgb(58, 66, 109);
  background-color: rgb(58, 66, 109);
  color: #ffffff;
  font-size: 12px;
  font-weight: bold;
  padding: 12px 45px;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: transform 80ms ease-in;
}

.login button:active {
  transform: scale(0.95);
}

.login button:focus {
  outline: none;
}

.login button.ghost {
  background-color: transparent;
  border-color: #ffffff;
}

.login .form {
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 50px;
  height: 100%;
  text-align: center;
}

.login input {
  background-color: #eee;
  border: none;
  padding: 12px 15px;
  margin: 8px 0;
  width: 100%;
  outline: none;
}

.login {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  position: relative;
  overflow: hidden;
  width: 768px;
  margin-top: 11vh;
  max-width: 100%;
  min-height: 480px;
  min-height: 600px;
}

.form-container {
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
}

.sign-in-container {
  left: 0;
  width: 50%;
  z-index: 2;
}

.container.right-panel-active .sign-in-container {
  transform: translateX(100%);
}

.sign-up-container {
  left: 0;
  width: 50%;
  opacity: 0;
  z-index: 1;
}

.container.right-panel-active .sign-up-container {
  transform: translateX(100%);
  opacity: 1;
  z-index: 5;
  animation: show 0.6s;
}

@keyframes show {
  0%,
  49.99% {
    opacity: 0;
    z-index: 1;
  }

  50%,
  100% {
    opacity: 1;
    z-index: 5;
  }
}

.overlay-container {
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: transform 0.6s ease-in-out;
  z-index: 100;
}

.container.right-panel-active .overlay-container {
  transform: translateX(-100%);
}

.overlay {
  background: rgb(66, 66, 66);
  background: linear-gradient(to right, rgb(66, 66, 66), rgb(78, 91, 107));
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 0 0;
  color: #ffffff;
  position: relative;
  left: -100%;
  height: 100%;
  width: 200%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
}

.container.right-panel-active .overlay {
  transform: translateX(50%);
}

.overlay-panel {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 40px;
  text-align: center;
  top: 0;
  height: 100%;
  width: 50%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
}

.overlay-left {
  transform: translateX(-20%);
}

.container.right-panel-active .overlay-left {
  transform: translateX(0);
}

.overlay-right {
  right: 0;
  transform: translateX(0);
}

.container.right-panel-active .overlay-right {
  transform: translateX(20%);
}

.social-container {
  margin: 20px 0;
}

.social-container a {
  border: 1px solid #dddddd;
  border-radius: 50%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin: 0 5px;
  height: 40px;
  width: 40px;
}
.avatars {
  background: linear-gradient(to right, rgb(66, 66, 66), rgb(78, 91, 107));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
}
.avatars .selected {
  display: flex;
  align-items: baseline;
}
.avatars .selected img {
  /* width: inherit; */
  max-width: 150px;
}
.avatars .options img {
  max-width: 125px;
}
.genderClass {
  display: flex;
  color: black;
  width: 100%;
  align-items: center;
  justify-content: space-around;
}
.genOne {
  display: flex;
  align-items: center;
  font-size: xx-large;
  font-weight: bold;
}
</style>