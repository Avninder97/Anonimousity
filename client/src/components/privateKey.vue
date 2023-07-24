<template>
  <div class="container profile">
    <div class="row">
      <div class="col">
        <input type="text" v-if="!revealKey" disabled v-model="asterikPrivateKey" />
        <input type="text" v-else disabled v-model="privateKey" />
      </div>
      <div class="reveal">
        <input type="checkbox" name="showKey" id="showKey" v-model="revealKey" class="mx-2" />
        <span>Show Private Key</span>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <input type="password" v-show="confirmationBox" v-model="password" placeholder="Confirm your password">
      </div>
    </div>
    <div class="row">
      <button @click="regenerateKey()">Regenerate Private Key</button>
    </div>
    <div v-if="showMessage" id="messageHolder">
      {{ message }}
    </div>
  </div>
</template>
<script>
import axios from 'axios';

export default {
  name: "privateKeyComponent",
  data() {
    return {
      asterikPrivateKey: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
      privateKey: this.userData?.private_key ? this.userData?.private_key : "",
      revealKey: false,
      password: "",
      message: "",
      showMessage: false,
    };
  },
  props: {
    confirmationBox: Boolean,
    userData: Object
  },
  emits: ['showBox'],
  methods: {
    async regenerateKey() {
      if (!this.confirmationBox) {
        this.$emit('showBox')
      }
      else {
        // api to regenerate key
        // data to be sent this.password, username to be used through jwt token
        // set this.confirmationBox = false
        
        let ourToken = this?.$store?.state?.userToken;
        if(!(this?.$store?.state?.userToken)){
          if (document.cookie.indexOf('token') === -1) {
            console.log('Cookie not found.');
            this.$store.commit('changeLoginStatus', false);
            this.$store.commit('updateToken', null);
            this.loading = false;
            this.$router.push({ name: 'loginPage' });
          }
  
          const cookiesArray = document.cookie.split(';');
          cookiesArray.map((cString) => {
            if (cString.split('=')[0] === 'token') {
              ourToken = cString.split('=')[1];
              ourToken.trim();
            }
          });
        }
        this.showMessage = false;
        await axios.post('http://localhost:5000/api/users/profile/regenerateKey', {
          password: this.password
        }, {
          headers: {
            Authorization: `Bearer ${ourToken}`
          }
        })
        .then((response) => {
          console.log(response);
          this.privateKey = response.data.private_key;
          this.showMessage = true;
          this.message = "Private Key has been updated successfully";
        })
        .catch((err) => {
          console.log(err);
          this.password = "";
          this.showMessage = true;
          this.message = "An Error Occured, Please Try Again";
        })
      }
    }
  },
};
</script>
<style scoped>
.profile {
  justify-content: center;
}

.profile button {
  width: auto;
  margin: 0 auto;
}

#showKey {
  width: auto;
}

.profile .reveal {
  display: flex;
  align-items: center;
}

.col input {
  height: auto;
  font-weight: bold;
  font-size: large;
}

.reveal span {
  user-select: none;
}

#messageHolder {
  position: absolute;
  bottom: 90px;
}

</style>
