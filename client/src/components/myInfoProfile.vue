<template>
  <div v-if="current_body === 'passChange'" class="container profile editable">
    <div class="form">
      <h2 class="my-3">Change Password</h2>
      <input
        type="text"
        placeholder="Private Key"
        v-model="passChangeData.private_key"
      />
      <input
        type="password"
        placeholder="New Password"
        v-model="passChangeData.password"
      />
      <input
        type="password"
        ref="passChangeRetype"
        placeholder="Confirm new Password"
        v-model="passChangeData.confirmPassword"
      />
      <div class="select">
        <button class="m-2 button-2" @click="current_body = ''">Go Back</button>
        <button class="m-2 button-2" @click="updatePassword()">Update</button>
      </div>
    </div>
    <div v-if="resetMsg">
      <p>{{ resetMsg }}</p>
    </div>
  </div>
  <div v-else class="container profile">
    <div class="row">
      <div class="col-3">Username</div>
      <div class="col-9"><input type="text" disabled v-model="userData.username" /></div>
    </div>
    <div class="row">
      <div class="col-3">Current Organization</div>
      <div class="col-9"><input type="text" disabled v-model="userData.organization"/></div>
    </div>
    <div class="row">
      <div class="col-3">Gender</div>
      <div class="col-9"><input type="text" disabled v-model="userData.gender"/></div>
    </div>
    <div class="row">
      <div class="col-3">Verification Status</div>
      <div class="col-9"><input type="text" disabled v-model="userData.is_verified"/></div>
    </div>
    <div class="row">
      <div class="col-3">Password</div>
      <div class="col-6"><input type="password" disabled  v-model="userData.password"/></div>
      <div class="col-3 btn btn-success" @click="current_body = 'passChange'">
        Change Password
      </div>
    </div>
  </div>
</template>
<script>

import axios from 'axios';

export default {
  name: "myInfoProfile",
  props: {
    user: Object
  },
  data() {
    return {
      current_body: "",
      userData: {
        username: this?.user?.username,
        organization: this.user?.currentEmployeer?.name ? this.user.currentEmployeer.name : "None",
        gender: this.user.gender,
        is_verified: this.user.isVerified,
        password: 'dummyPasswordHolder'
      },

      passChangeData: {
        username: this.user.username,
        private_key: '',
        password: '',
        confirmPassword: ''
      },
      resetMsg: ''
    };
  },
  methods: {
    async updatePassword(){
        // api to update password
        // send data through this.passChangeData
        // after successful updation set this.current_body = ""
      this.resetMsg = '';
      if(this.passChangeData.private_key && this.passChangeData.password.trim() && this.passChangeData.password === this.passChangeData.confirmPassword){
        await axios.post('http://localhost:5000/api/auth/resetPassword', {
          username: this.passChangeData.username,
          private_key: this.passChangeData.private_key,
          newPassword: this.passChangeData.password
        })
        .then((response) => {
          console.log(response)
          this.resetMsg = "Password reset successful";
        })
        .catch((err) => {
          console.log(err);
          this.resetMsg = err.response && err.response.data && err.response.data.message ? err.response.data.message : "Error please try again";
        })
      }else{
        this.resetMsg = 'Please fill all the fields';
      }
      // console.log(this.passChangeData);
    }
  }
};
</script>
<style>
@import url("https://fonts.googleapis.com/css?family=Montserrat:400,800");

.profile h2 {
  color: rgb(123, 123, 150);
  font-weight: bold;
  margin: 0;
}
.profile input {
  /* background-color: #eee; */
  background-color: transparent;
  border: none;
  border-bottom: 1px solid white;
  /* padding: 12px 15px; */
  height: 2rem;
  color: white;
  font-size: large;
  margin: 8px 0;
  width: 100%;
  outline: none;
}
.editable{
    font-family: "Montserrat", sans-serif;
}

.editable input{
    background-color: #eee;
    height: auto;
    color: black;
    padding: 12px 15px;
    width: 100%;
    margin: 8px 0;
}
.profile button {
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
.profile button:active {
  transform: scale(0.95);
}

.profile button:focus {
  outline: none;
}

.profile .form {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 50px;
  height: 100%;
  text-align: center;
}

.profile {
  /* background-color: #fff; */
  border-radius: 10px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  position: relative;
  overflow: hidden;
  width: 768px;
  margin-top: 11vh;
  max-width: 100%;
  min-height: 480px;
  /* min-height: 600px; */
  background: linear-gradient(to right, rgb(66, 66, 66), rgb(78, 91, 107));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
}
.profile .row {
  /* display: flex; */
  width: 100%;
  align-items: center;
}
.profile .col-3 {
  color: white;
  font-weight: bold;
  font-size: large;
  text-align: right;
}
</style>
