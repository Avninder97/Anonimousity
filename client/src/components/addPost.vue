<template>
  <div class="container newPost">
    <div class="form">
      <h2 class="my-3">Add new Post</h2>
      <h6 v-if="showWarning" class="warning">*All fields are necessary</h6>
      <input
        type="text"
        placeholder="Add title of your post"
        v-model="newPost.title"
        class="p-2 mt-2 mb-1"
      />
      <textarea
        rows="15"
        placeholder="Write your post..."
        v-model="newPost.description"
        class="p-2 mb-2"
      ></textarea>
      <div>
        <button class="mx-2" @click="this.$router.back()">Back</button>
        <button class="m-2" @click="addPost()">Add</button>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: "addPost",
  data() {
    return {
      newPost: {
        title: "",
        description: "",
      },
      showWarning: false
    };
  },
  methods: {
    addPost() {
      if(!this.newPost.title || !this.newPost.description){
        this.showWarning = true
        console.log("All fields are necessary")
        return
      }
      const url = `http://localhost:5000/api/posts/new`;
      const ourToken = this.$store.state.userToken;
      axios
        .post(url, this.newPost, {
          headers: {
            Authorization: `Bearer ${ourToken}`,
          },
        })
        .then((response) => {
          console.log("message:", response.data.message);
          if (response.data.message === "Post created successfully"){
            this.$router.push({ path: `/post/${response.data.data._id}` });
          }
          
        })
        .catch((err) => {
          console.log("Error \n",err);
        });
    },
  },
};
</script>
<style>
@import url("https://fonts.googleapis.com/css?family=Montserrat:400,800");
.newPost {
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
  font-family: "Montserrat", sans-serif;
}
.newPost .form {
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: column;
  padding: 0 50px;
  width: 100%;
  text-align: center;
}
.newPost h2 {
  color: rgb(123, 123, 150);
  font-weight: bold;
}
.newPost input {
  width: 100%;
  outline: none;
  background-color: ivory;
}
.newPost textarea {
  width: 100%;
  background-color: ivory;
  resize: none;
  outline: none;
}

.newPost button {
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
.newPost button:active {
  transform: scale(0.95);
}

.newPost button:focus {
  outline: none;
}

.warning{
  position: absolute;
  top: 4.5rem;
  color: red;
  letter-spacing: 1px;
  font-weight: bold;
}
</style>
