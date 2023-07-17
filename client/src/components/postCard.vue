<template>
  <!-- <div class="postbody"> -->
    <div class="container">
      <div class="row mb-3">
        <div class="col-1">
          <img :src="image(postDetail.image_url)" alt="Hello" />
        </div>

        <div class="col-10 heading">
          <h5>
            <span class="userName">{{ postDetail.postMaker }} </span><br />
            <span class="orgName">{{ postDetail.postOrg }}</span>
          </h5>
        </div>
      </div>
      <hr />
      <div class="row mb-2">
        <div class="col-1"></div>
        <div class="col-10" v-if="editContent">
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
          <!-- <h5> -->
            <span class="postTitle">{{ title }} </span><br />
            <span class="postContent">{{ content }}</span>
          <!-- </h5> -->
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
              src="../assets/liked.png"
              alt=" "
              class="me-2 ms-2"
            />
            <img
              @click="toggleLike()"
              v-else
              src="../assets/like.png"
              alt="like"
              class="me-2 ms-2"
            />
            <span class="me-2">{{ likeAmount }}</span>
          </div>
          <div class="editButton">
            <img
            v-if="editContent"
            @click="enableEdit"
            src="../assets/active_edit.png"
            class="me-2 ms-2"
          />
          <img
            v-else
            @click="enableEdit"
            src="../assets/edit.png"
            class="me-2 ms-2"
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

export default {
  name: "postCard",
  data() {
    return {
      postDetail: {
        image_url: "b2.png",
        postMaker: "Prateek Kumar",
        postOrg: "Argusoft",
        postTitle: "First Post",
        postContent:
          "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, Lorem ipsum dolor sit amet.., comes from a line in section 1.10.32.The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
        likeCount: 505,
        commentCount: 89,
      },
      likeAmount: 0,
      editContent: false,
      content: "",
      title: "",
      liked: false,
    };
  },
  methods: {
    image(url) {
      const path = require(`../assets/${url}`);
      return path;
    },
    toggleLike() {
      if (!this.liked) {
        this.likeAmount++;
      } else {
        this.likeAmount--;
      }
      // update like values in database
      this.liked = !this.liked;
    },

    enableEdit() {
      this.editContent = true;
      setTimeout(() => {
        this.adaptHeight();
        this.$refs.editBox.focus();
      }, 1);
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
    this.likeAmount = this.postDetail.likeCount;
    this.content = this.postDetail.postContent;
    this.title = this.postDetail.postTitle;
  },
};
</script>
<style>
.postbody {
  max-width: 1000px;
  margin: 0 auto;
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
  width: 100%;
  height: 100%;
  border: none;
  padding: 0.5% 2% 0%;
  background-color: rgb(66, 66, 66);
  resize: none;
  font-size: medium;
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
  font-size: large;
  /* color: red; */
  text-align: justify;
}
.actions{
  display: flex-end;
  align-items: flex-end
}
</style>
