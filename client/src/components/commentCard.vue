<template>
  <div>
    <div class="container commentContainer py-2 mb-4">
      <div class="row mb-2 header">
        <div class="col-1 imageDiv">
          <img :src="image(comment_data.author.profile_pic)" alt="Hello" />
        </div>
        <div class="col-10 heading">
          <h5>
            <span class="userName">{{ authorName }} </span><br />
            <span class="orgName" @click="openOrg()">{{
              authorOrganization
            }}</span>
          </h5>
        </div>
        <div class="col-1"></div>
      </div>
      <div class="row mb-2">
        <div class="col-1"></div>
        <div class="col-10" v-if="editDescription">
          <textarea
            ref="editBox"
            @blur="editCompleted"
            @input="adaptHeight"
            class="editArea"
            v-model="newDescription"
          />
        </div>
        <div class="col-10 comment" v-else>{{ description }}</div>
        <div class="col-1"></div>
      </div>
      <div class="row">
        <div class="col-1"></div>
        <div class="col-9 actions">
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
        </div>
        <div class="col-1">
          <div
            class="editButton"
            v-if="loggedInUserId === comment_data.author._id"
          >
            <img
              v-if="editDescription"
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
            <img
              src="../assets/delete.png"
              class="mx-2"
              @click="deleteComment()"
            />
          </div>
        </div>
      </div>
    </div>
    <!-- <hr style="color: rgb(240, 234, 234)" /> -->
  </div>
</template>
<script>
import axios from "axios";

export default {
  data() {
    return {
      // Ask for liked status in props object
      liked: this.comment_data.likedBy.some((id) => id === this.loggedInUserId),
      editDescription: false,
      description: this.comment_data.description,
      newDescription: this.comment_data.description,
      authorName: this.comment_data?.author?.username
        ? this.comment_data.author.username
        : "None",
      authorOrganization: this.comment_data?.author?.currentEmployeer?.name
        ? this.comment_data.author.currentEmployeer.name
        : "None",
      likeAmount: this.comment_data?.likedBy?.length
        ? this.comment_data.likedBy.length
        : 0,
    };
  },
  props: {
    comment_data: Object,
    token: String,
    loggedInUserId: String,
  },
  emits: ["commentDeleted"],

  methods: {
    image(url) {
      const path = require(`../assets/${url}`);
      return path;
    },
    toggleLike() {
      this.liked = !this.liked;

      axios
        .post(
          `http://localhost:5000/api/posts/${this.comment_data.linkedToWhichPost}/comment/${this.comment_data._id}/like`,
          {},
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          }
        )
        .then((response) => {
          console.log(response);
          this.liked = response?.data?.newStatus;
          this.likeAmount = response?.data?.likeCount;
        })
        .catch((err) => {
          console.log(err);
          this.liked = !this.liked;
        });
      // update like values in database
    },

    enableEdit() {
      this.editDescription = true;
      setTimeout(() => {
        this.adaptHeight();
        this.$refs.editBox.focus();
      }, 1);
    },
    editCompleted() {
      this.editDescription = false;
      if (this.newDescription.trim() === "") {
        this.newDescription = this.description;
        return;
      }
      axios
        .post(
          `http://localhost:5000/api/posts/${this.comment_data.linkedToWhichPost}/comment/${this.comment_data._id}/edit`,
          {
            ownerId: this.comment_data.author._id,
            description: this.newDescription.trim(),
          },
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          }
        )
        .then((response) => {
          console.log(response);
          this.description = this.newDescription;
        })
        .catch((err) => {
          console.log(err);
          this.liked = !this.liked;
        });
      // api to update comment in database
    },
    adaptHeight() {
      const myTextarea = this.$refs.editBox;
      myTextarea.style.height = "auto";
      myTextarea.style.height = myTextarea.scrollHeight + "px";
    },
    deleteComment() {
      // api call for deleting a comment
      const commId = this.comment_data._id;
      const postId = this.$route.params.postId;
      const url = `http://localhost:5000/api/posts/${postId}/comment/${this.comment_data._id}/delete`;
      const ourToken = this.$store.state.userToken;
      axios
        .post(
          url,
          {
            ownerId: this.comment_data.author._id,
          },
          {
            headers: {
              Authorization: `Bearer ${ourToken}`,
            },
          }
        )
        .then(() => {
          console.log("Comment deleted successfully");
          // emit the id back to the parent component to remove it from the array
          this.$emit("commentDeleted", commId);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    openOrg() {
      this.$router.push({
        name: "orgProfile",
        params: { orgId: this.comment_data.author.currentEmployeer._id },
      });
    },
  },
};
</script>
<style>
.container {
  background-color: rgb(66, 66, 66);
  color: rgb(240, 234, 234);
}
.editArea {
  color: rgb(240, 234, 234);
  width: 100%;
  height: 100%;
  border: none;
  padding: 0.5% 2% 0%;
  background-color: rgb(66, 66, 66);
  resize: none;
}
.editArea:focus {
  outline: none;
}

.row .col-1 img {
  width: inherit;
  min-width: 50px;
}
.commentContainer .imageDiv {
  display: flex;
  justify-content: flex-end;
  padding-right: inherit;
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

.comment {
  text-align: justify;
}

.actions {
  display: flex;
}
</style>
