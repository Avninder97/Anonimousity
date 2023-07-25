<template>
  <div class="postPage">
    <postCard :singlePost="singlePost" class="sepForComms pb-3 mb-4">
      <div class="input-group addComments ms-2">
        <input
          type="text"
          placeholder="Add a Comment"
          class="inputControl"
          v-model="newComment"
        />
        <span
          @click="addComment"
          class="input-group-text arrow"
          ref="commentArrow"
          >>></span
        >
      </div>
    </postCard>
    <!-- Put a v-for loop for comments gathered from database -->
    <div class="commentArea">
      <commentCard v-for="(comment, index) in singlePost.comments" :key="index" :comment_data="comment" :token="token" :loggedInUserId="loggedInUserId"/>
    </div>
  </div>
</template>
<script>
import postCard from "./postCard.vue";
import commentCard from "./commentCard.vue";
import axios from "axios";

export default {
  name: "postDetails",
  data() {
    return {
      postId: "",
      singlePost: null,
      newComment: "",
      token: "",
      loggedInUserId: "",
    };
  },
  components: {
    commentCard,
    postCard,
  },
  beforeMount() {

    try{
      const cookiesArray = document.cookie.split(';');
      let ourToken = "";
      cookiesArray.map((cString) => {
        if(cString.split('=')[0] === 'token'){
          ourToken = cString.split('=')[1];
          ourToken.trim();
        }
      });
      this.token = ourToken;
      let payload = ourToken.split('.')[1];
      payload = payload.replace(/-/g, '+').replace(/_/g, '/');
      payload = decodeURIComponent(window.atob(payload).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      payload = JSON.parse(payload);
      this.loggedInUserId = payload.userId;
    } catch(err) {
      console.log(err);
    }


    // get post id from parameter using this.$route.params.postId
    console.log("Before Mount")
    console.log(this.$route.params.postId);
    if (this.$route.params.postId) {
      this.postId = this.$route.params.postId;
      const url = `http://localhost:5000/api/posts/${this.postId}`;
      axios
        .get(url)
        .then((response) => {
          // console.log("message:", response.data.message);
          console.log(response.data.post);
          this.singlePost = response.data.post;
        })
        .catch((err) => {
          console.log("Error \n", err);
        });
    }
  },
  methods: {
    addComment() {
      if (this.newComment) {
        const arrow = this.$refs.commentArrow;
        arrow.style.color = "green";

        axios.post(`http://localhost:5000/api/posts/${this.postId}/comment/new`, {
          description: this.newComment.trim()
        }, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        })
        .then((response) => {
          console.log(response);
          this.singlePost.comments.push(response?.data?.newComment);
        })
        .catch((err) => {
          console.log(err);
        })

        setTimeout(() => {
          arrow.style.color = "rgb(240, 234, 234)";
        }, 500);

        this.newComment = "";
      }
    },
  },
};
</script>
<style>
.postPage {
  max-width: 1000px;
  margin: 0 auto;
}
.sepForComms {
  margin-top: 4rem;
}
.addComments {
  display: flex;
  align-items: center;
  width: inherit;
}
.inputControl {
  width: inherit;
}
.inputControl,
.input-group-text {
  height: 30px;
  border: none;
  border-bottom: 1px solid rgb(240, 234, 234);
  outline: none;
  border-radius: 0;
  color: rgb(240, 234, 234);
  background-color: rgb(66, 66, 66);
}
.inputControl::placeholder {
  color: rgb(240, 234, 234);
}

.arrow {
  font-weight: bold;
  user-select: none;
  cursor: pointer;
}
/* .postPage .commentArea{
  overflow: auto;
  height: 400px;
} */
</style>
