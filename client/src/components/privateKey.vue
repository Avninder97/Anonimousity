<template>
  <div class="container profile">
    <div class="row"> 
      <div class="col">
        <input
          type="text"
          v-if="!revealKey"
          disabled
          v-model="asterikPrivateKey"
        />
        <input
          type="text"
          v-else
          disabled
          v-model="privateKey"
        />
      </div>
      <div class="reveal">
        <input type="checkbox" name="showKey" id="showKey" v-model="revealKey" class="mx-2"/>
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
  </div>
</template>
<script>
export default {
  name: "myInfoProfile",
  data() {
    return {
      asterikPrivateKey: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      privateKey: "f28e70ca-99ae-4534-9a08-930a2d9d102c",
      revealKey: false,
      password: "",
    };
  },
  props: {
    confirmationBox: Boolean
  },
  emits: ['showBox'],
  methods: {
    updatePassword() {
      // api to update password
      // send data through this.passChangeData
      // after successful updation set this.current_body = ""
    },
    regenerateKey(){
        if(!this.confirmationBox){
            this.$emit('showBox')
        }
        else{
            // api to regenerate key
            // data to be sent this.password, username to be used through jwt token
            // set this.confirmationBox = false
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
.col input{
    height: auto;
    font-weight: bold;
    font-size: large;
}
.reveal span{
    user-select: none;
}
</style>
