<template>
  <div v-if="loading" id="spinnerHolder">
    <div class="spinner-border postLoader" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
  <div v-else-if="error" class="postError">
    <h1>404 - Post Not Found</h1>
  </div>
  <div v-else class="postPage">
    <postCard
      :singlePost="singlePost"
      class="sepForComms pb-3 mb-4"
      :uToken="token"
    >
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
    <div v-if="!commentLoading">
      <div class="commentArea py-2" v-if="singlePost.comments && singlePost.comments.length > 0">
        <commentCard
          v-for="(comment, index) in singlePost.comments"
          :key="index"
          :comment_data="comment"
          :token="token"
          :loggedInUserId="loggedInUserId"
          @commentDeleted="(id) => commentDeleted(id)"
        />
      </div>
      <div v-else class="postError">
        <h1>No Comments</h1>
      </div>
    </div>
    <div v-else id="spinnerHolder">
      <div class="spinner-border postLoader" role="status">
        <span class="visually-hidden">Loading Comments...</span>
      </div>
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
      loading: false,
      error: false,
      commentLoading: false
    };
  },
  components: {
    commentCard,
    postCard,
  },
  beforeMount() {
    this.loading = true;
    this.error = false;
    try {
      const cookiesArray = document.cookie.split(";");
      let ourToken = "";
      cookiesArray.map((cString) => {
        if (cString.split("=")[0] === "token") {
          ourToken = cString.split("=")[1];
          ourToken.trim();
        }
      });
      this.token = ourToken;
      let payload = ourToken.split(".")[1];
      payload = payload.replace(/-/g, "+").replace(/_/g, "/");
      payload = decodeURIComponent(
        window
          .atob(payload)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
      payload = JSON.parse(payload);
      this.loggedInUserId = payload.userId;
    } catch (err) {
      console.log(err);
    }

    // get post id from parameter using this.$route.params.postId
    console.log("Before Mount");
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
          this.loading = false;
        })
        .catch((err) => {
          console.log("Error \n", err);
          this.loading = false;
          this.error = true;
        });
    } else {
      this.loading = false;
      this.error = true;
    }
  },
  methods: {
    addComment() {
      if (this.newComment) {
        const arrow = this.$refs.commentArrow;
        arrow.style.color = "green";

        axios
          .post(
            `http://localhost:5000/api/posts/${this.postId}/comment/new`,
            {
              description: this.newComment.trim(),
            },
            {
              headers: {
                Authorization: `Bearer ${this.token}`,
              },
            }
          )
          .then((response) => {
            console.log(response);
            this.singlePost.comments.push(response?.data?.newComment);
          })
          .catch((err) => {
            console.log(err);
            if(err?.response?.data?.message === "Account Not Verified"){
              this.$router.push('/notice')
            }
          });

        setTimeout(() => {
          arrow.style.color = "rgb(240, 234, 234)";
        }, 500);

        this.newComment = "";
      }
    },
    async commentDeleted(id){
      this.commentLoading = true;
      this.singlePost.comments = await this.singlePost.comments.filter(t => t._id !== id)
      this.commentLoading = false;
    }
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
  /* width: 100%; */
  border: none;
  border-bottom: 1px solid rgb(240, 234, 234);
  outline: none;
  border-radius: 0;
  color: rgb(240, 234, 234);
  background-color: rgb(66, 66, 66);
}
.inputControl{
  width: 92%;
}
.inputControl::placeholder {
  color: rgb(240, 234, 234);
}

.arrow {
  font-weight: bold;
  user-select: none;
  cursor: pointer;
}

#spinnerHolder {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-content: center;
  height: 60vh;
}

.postLoader {
  width: 100px;
  height: 100px;
  align-self: center;
}

.postError {
  width: 100%;
  height: 60vh;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.postPage .commentArea{
  background-color: rgb(66,66,66);
  border-radius: 13px;
  overflow: hidden;
}
</style>
