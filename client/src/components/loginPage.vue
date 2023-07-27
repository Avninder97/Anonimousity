<template>


  <!-- Select avatar page -->
  <div class="container login avatars" v-if="current_body === 'avatar'">
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
        @click="backFromAvatarPage"
      >
        Back
      </button>
      <button class="mx-2" style="border: 1px solid rgb(255, 255, 255, 0.5)" @click="signUpSubmit">
        Sign Up
      </button>
    </div>
    <div class="registrationMsgHolder">
      <p v-if="verificationMsg">{{ verificationMsgContent }}</p>
      <p v-else-if="registerError">{{ registerErrorMessage }}</p>
    </div>
  </div>


  <!-- Forgot Password Page -->
  <div
    class="container login avatars"
    v-else-if="current_body === 'changePass'"
  >
    <div class="form bg-transparent">
      <h2 class="my-3">Forgot Password</h2>
      <input
        type="text"
        placeholder="Please enter your username"
        v-model="passForgotData.username"
      />
      <input type="text" placeholder="Enter your private key" v-model="passForgotData.privateKey" />
      <input type="password" placeholder="New Password" v-model="passForgotData.password" />
      <input type="password" ref="passChangeRetype" placeholder="Confirm new Password" v-model="passForgotData.confirmPassword"/>
      <div class="select">
        <button class="m-2 button-2" @click="backfromForgetPage()">Go Back</button>
        <button class="m-2 button-2" @click="forgotPassword()">Update</button>
      </div>

      <div v-if="passwordResetRes > 0" class="forgotMsgHolder">
        <p :style="[passwordResetRes === 1 ? {'color': 'green'} : {'color' : 'red'}]">
          {{ passwordResetMsg }}
        </p>
      </div>
    </div>
  </div>


  <!-- Login & Register Page -->
  <div v-else class="container login" ref="container">

    <!-- SignUp component -->
    <div class="form-container sign-up-container">
      <div class="form">
        <h2>Create Account</h2>
        <input
          type="text"
          placeholder="Username"
          v-model.lazy="signUpData.username"
          ref="registerUsername"
        />
        <div v-if="showUsernameMsg" class="rUsernameErrorMsgHolder">
          <p v-if="duplicateUsername" style="color: red" class="m-0">
            Username is not avaliable
          </p>
          <p v-else style="color: green" class="m-0">
            Username is avaliable
          </p>
        </div>
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
        <div class="genderClass">
          <div class="genOne">
            <input
              type="radio"
              name="gender"
              value="male"
              v-model="signUpData.gender"
            />
            <span class="ms-2">Male</span>
          </div>
          <div class="genOne">
            <input
              type="radio"
              name="gender"
              value="female"
              v-model="signUpData.gender"
            />
            <span class="ms-2">Female</span>
          </div>
        </div>

        <button @click="selectAvatar">Next</button>
        <div v-if="showSignUpMsg" class="signUpMsgHolder">
          <p style="color: red, word-wrap: normal">
            Please Fill all the required fields properly
          </p>
        </div>
      </div>
    </div>

    <!-- SignIn Component -->
    <div class="form-container sign-in-container">
      <div class="form">
        <h2>Sign in</h2>
        <input type="text" placeholder="Username" v-model="username" />
        <input type="password" placeholder="Password" v-model="password" />
        <a @click="current_body = 'changePass'">Forgot your password?</a>
        <button @click="signInSubmit">Sign In</button>
        <div v-if="loginError" class="mt-2 signInErrorMsgHolder">
          <p class="mt-4 mb-0 text-danger" >
            {{ loginErrorMessage }}
          </p>
        </div>
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
import axios from 'axios';
export default {
  name: "loginPage",
  data() {
    return {
      current_body: "",

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
      showSignUpMsg: false,

      passForgotData: {
        username: '',
        privateKey: '',
        password: '',
        confirmPassword: ''
      },
      // 0 => don't show, 1 => success, 2 => error
      passwordResetRes: 0,
      passwordResetMsg: "",


      avatar_page: false,

      duplicateUsername: false,
      showUsernameMsg: false,
      registerError: false,
      registerErrorMessage: "",
      verificationMsg: false,
      verificationMsgContent: "",

      loginError: false,
      loginErrorMessage: ""
    };
  },
  methods: {
    signUpForm() {
      console.log(this.$refs.container.classList)
      this.$refs.container.classList.add("right-panel-active");
    },
    signInForm() {
      console.log(this.$refs.container.classList)
      this.$refs.container.classList.remove("right-panel-active");
    },
    selectAvatar() {
      // forward to avatar selection page
      this.showSignUpMsg = false;
      if((this.signUpData.username && this.signUpData.password && (this.signUpData.password === this.retyped_password) && this.signUpData.email)){
        this.current_body = "avatar";
      }else{
        this.showSignUpMsg = true;
      }
    },
    backFromAvatarPage(){
      this.verificationMsg = false;
      this.registerError = false;
      this.verificationMsgContent = "";
      this.registerErrorMessage = "";
      this.current_body = "";
      // this.$refs.container.classList.add("right-panel-active");
    },
    image(url) {
      const path = require(`../assets/${url}`);
      return path;
    },
    changeAvatar(url) {
      this.signUpData.profile_pic = url;
    },
    async signInSubmit() {
      // api for sign in using this.username this.password
      await axios.post('http://localhost:5000/api/auth/login', {
        username: this.username,
        password: this.password
      })
      .then(async (data) => {
        let token = data.data.token;
        // console.log(token);
        // console.log(data.data)
        document.cookie = `token=${token}`;
        this.username = "";
        this.password = "";
        this.loginError = false;
        this.loginErrorMessage = "";

        this.$store.commit('changeLoginStatus', true);
        this.$store.commit('updateToken', token);

        
        // jwt payload extraction
        let payload = token.split('.')[1];
        payload = payload.replace(/-/g, '+').replace(/_/g, '/');
        payload = decodeURIComponent(window.atob(payload).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        payload = JSON.parse(payload);
        
        this.$store.commit('updateUser', payload);
        
        this.$router.push('/');
      })
      .catch((err) => {
        console.log(err);
        this.username = "";
        this.password = "";
        this.loginError = true;
        this.loginErrorMessage = err.response ? err.response.data.message : "Unknown Error Occured"
        this.$store.commit('changeLoginStatus', false);
        this.$store.commit('updateToken', null);

      })
    },
    async forgotPassword(){
      // api to update password using this.passForgotData
      // check if username is correct or not
      // if updated successfully show message

      this.passwordResetRes = 0;
      this.passwordResetMsg = "";
      if(this.passForgotData.password.trim() === ""){
        this.passwordResetRes = 2;
        this.passwordResetMsg = "Password fields cannot be empty";

      }
      else if(this.passForgotData.password !== this.passForgotData.confirmPassword){
        this.passwordResetRes = 2;
        this.passwordResetMsg = "Password & Confirm Password should match";
      }
      else{
        await axios.post('http://localhost:5000/api/auth/resetPassword', {
          username: this.passForgotData.username,
          private_key: this.passForgotData.privateKey,
          newPassword: this.passForgotData.password
        })
        .then((response) => {
          console.log(response)
          this.passwordResetRes = 1;
          this.passwordResetMsg = "Password reset successful";
        })
        .catch((err) => {
          console.log(err);
          this.passwordResetRes = 2;
          this.passwordResetMsg = err.response && err.response.data && err.response.data.message ? err.response.data.message : "Error please try again";
        })
      }
    },
    async signUpSubmit() {
      // Calls api for user registration
      const { username, email, password, gender, profile_pic } = this.signUpData;

      // required fields
      if(username && email && password){
        await axios.post('http://localhost:5000/api/auth/register', {
          username,
          password,
          email,
          profile_pic,
          gender
        })
        .then((response) => {
          console.log(response);
          this.verificationMsg = true;
          this.verificationMsgContent = "Verification Email has been sent to your email address";
        })
        .catch((err) => {
          console.log(err);
          this.registerError = true;
          this.registerErrorMessage = "Unknown error occured";
        })
      }
      else{
        this.registerError = true;
        this.registerErrorMessage = "Invalid Credentails";
      }
    }
  },
  watch: {
    async "signUpData.username"() {
      // api call for checking username
      if(!this.signUpData.username){
        this.$refs.registerUsername.style.outline = "1px solid yellow";
        this.showUsernameMsg = false;
      }else{
        await axios.post('http://localhost:5000/api/auth/usernameCheck', {
          username: this.signUpData.username
        }).then((response) => {
          console.log(response);
          this.$refs.registerUsername.style.outline = "1px solid green";
          this.duplicateUsername = false;
          this.showUsernameMsg = true;
        }).catch((err) => {
          console.log(err);
          this.$refs.registerUsername.style.outline = "1px solid red";
          this.duplicateUsername = true;
          this.showUsernameMsg = true;
        })
      }
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
    "passForgotData.confirmPassword"(newValue){
      if(newValue !== this.passForgotData.password){
        this.$refs.passChangeRetype.style.outline = "1px solid red"
      }
      else{
        this.$refs.passChangeRetype.style.outline = "none"
      }
    }
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
  cursor: pointer;
  color: #333;
  font-size: 14px;
  text-decoration: none;
  margin: 15px 0;
}

.login a:hover{
  color: #333;
  font-weight: bold;
  text-decoration: underline;
  transform: scale(1.01);
  transition: transform 100ms ease-out;
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

.login .button-2 {
  border: 1px solid rgb(255, 255, 255, 0.5);
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
  /* min-height: 480px; */
  min-height: 600px;
}

.signInErrorMsgHolder {
  position: absolute;
  bottom: 125px;
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

.registrationMsgHolder {
  height: 20px;
}

.registrationMsgHolder > p {
  margin-top: 0px;
}

.signUpMsgHolder {
  color: red;
  position: absolute;
  bottom: 10px;
}

.signUpMsgHolder > p {
  word-wrap: break-word;
}

.forgotMsgHolder {
  position: absolute;
  bottom: 25px;
}
</style>
