<template>
  <!-- <div class="postbody"> -->
    <div class="container postcard">
      <div class="row postHead mb-3 pb-1" style="border-bottom: 1px dotted rgb(240,234,234, 0.5);">
        <div class="col-1">
          <!-- <img :src="image(singlePost.author.profile_pic)" alt="Hello" /> -->
        </div>

        <div class="col-10 heading p-0">
          <h5>
            <span class="userName">{{ singlePost.author.username }} </span><br/>
            <span class="orgName">{{ singlePost.organization ? singlePost.organization.name : "" }}</span>
          </h5>
        </div>
      </div>
      <!-- <hr /> -->
      <div class="row mb-2">
        <div class="col-1"></div>
        <div class="col-10" v-if="editContent && currentUserId === singlePost.author._id">
          <input
            type="text"
            class="editTitle"
            ref="editInput"
            @blur="editCompleted('input')"
            v-model="title"
          />
          <textarea
            v-model="content"
            ref="editBox"
            @blur="editCompleted('textarea')"
            @input="adaptHeight"
            class="editArea"
          />
        </div>
        <div class="col-10" v-else>
          <p style="text-align: justify;">
            <span class="postTitle">{{ singlePost.title }} </span><br />
            <span class="postContent">{{ singlePost.description }}</span>
          </p>
        </div>
      </div>
      <!--  -->
      <div class="row">
        <div class="col-1"></div>
        <div class="col-10 actions">
          <div class="likeButton">
            <img
              @click="toggleLike()"
              v-if="liked"
              src="../assets/liked_design.png"
              alt=" "
              width="24"
              class="mx-2"
            />
            <img
              @click="toggleLike()"
              v-else
              src="../assets/design.png"
              width="24"
              alt="like"
              class="mx-2"
            />
            <span class="me-2">{{ likeAmount }}</span>
          </div>
          <div class="editButton" v-if="currentUserId === singlePost.author._id">
            <img
            v-if="editContent"
            @click="enableEdit"
            src="../assets/editing_design.png"
            width="24"
            class="mx-2"
          />
          <img
            v-else
            @click="enableEdit"
            width="24"
            src="../assets/edit_design.png"
            class="mx-2"
          />
          </div>
          
          <slot></slot>
        </div>
      </div>

      <!--  -->
    </div>
  <!-- </div> -->
</template>
<script>
// import PostDetails from './postDetails.vue';
import axios from 'axios';

export default {
  name: "postCard",
  props: {
    singlePost: Object,
    currentUserId: String,
    uToken: String,
  },
  data() {
    return {
      likeAmount: this.singlePost.likedBy.length,
      editContent: false,
      content: "",
      title: "",
      liked: this.singlePost?.likedBy?.some((id) => id === this.currentUserId),
    };
  },
  methods: {
    image(url) {
      const path = require(`../assets/${url}`);
      return path;
    },
    async toggleLike() {
      // console.log(this.currentUserId === this.singlePost.author._id)
      // console.log(this.currentUserId, this.singlePost.author._id)
      this.liked = !this.liked;
      await axios.post(`http://localhost:5000/api/posts/${this.singlePost?._id}/like`, {}, {
        headers: {
          Authorization: `Bearer ${this.uToken}`
        }
      })
      .then((response) => {
        console.log(response)
        this.liked = response?.data?.newStatus;
        this.likeAmount = response?.data?.likeCount;
      })
      .catch((err) => {
        console.log(err)
        this.liked = !this.liked;
      })
      // if (!this.liked) {
      //   this.likeAmount++;
      // } else {
      //   this.likeAmount--;
      // }
      // // update like values in database
    },

    enableEdit() {
      console.log(this.title, this.content);
      this.editContent = true;
      setTimeout(() => {
        this.adaptHeight();
        this.$refs.editBox.focus();
      }, 0.5);
    },

    editCompleted(fromLoc) {
      setTimeout(() => {
        if (fromLoc == "textarea") {
          if (this.$refs.editInput != document.activeElement) {
            this.editContent = false;
            // api to update the changes to the database
          } 
        } else {
          if (this.$refs.editBox != document.activeElement) {
            this.editContent = false;
            // api to update the changes to the database
          } 
        }
      }, 1);
    },
    adaptHeight() {
      const myTextarea = this.$refs.editBox;
      myTextarea.style.height = "auto";
      myTextarea.style.height = myTextarea.scrollHeight + "px";
    },
  },
  mounted() {
    this.likeAmount = this.singlePost.likedBy.length;
    this.content = this.singlePost.description;
    this.title = this.singlePost.title;
  },
};
</script>
<style>
.postbody {
  max-width: 1000px;
  margin: 0 auto;
}
.postcard {
  border-radius: 25px;
  /* padding: 10px 20px; */
  border: 2px solid red;
  margin: 2rem auto;
}
.postHead {
  padding: 20px 20px 0px;
}
.editTitle {
  padding: 0.5% 2% 0%;
  font-weight: bold;
  background-color: rgb(66, 66, 66);
  color: rgb(240, 234, 234);
  outline: none;
  border: none;
  font-size: large;
}

.editArea {
  color: rgb(240, 234, 234);
  border: none;
  padding: 0px;
  background-color: rgb(66, 66, 66);
  resize: none;
  font-size: medium;
  text-align: justify;
}
.heading h5 {
  margin-bottom: 0;
}
.userName {
  font-weight: bold;
}
.orgName {
  font-size: medium;
  font-weight: normal;
}
.postTitle {
  font-size: large;
  font-weight: bold;
}
.postContent {
  font-size: medium;
  /* color: red; */
  text-align: justify;
}
.actions{
  display: flex-end;
  align-items: flex-end
}
.likeButton{
  display: flex;
  justify-content: baseline;
  font-weight: bold;
  /* align-items: center; */
}
</style>
