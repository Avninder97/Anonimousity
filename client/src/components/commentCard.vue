<template>
  <div>
    <div class="container">
      <div class="row mb-3">
        <div class="col-1">
          <img :src="image(comment_data.image_url)" alt="Hello" />
        </div>
        <div class="col-10 heading">
          <h5>
            <span class="userName">{{ comment_data.fullName }} </span><br />
            <span class="orgName">{{ comment_data.organization }}</span>
          </h5>
        </div>
        <div class="col-1"></div>
      </div>
      <div class="row mb-2">
        <div class="col-1"></div>
        <div class="col-10" v-if="editContent">
          <textarea
            ref="editBox"
            @blur="editCompleted"
            @input="adaptHeight"
            class="editArea"
            v-model="content"
          />
        </div>
        <div class="col-10 comment" v-else>{{ content }}</div>
        <div class="col-1"></div>
      </div>
      <div class="row">
        <div class="col-1"></div>
        <div class="col-11 actions">
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
          <div class="editButton">
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
        </div>
      </div>
    </div>
    <hr style="color: rgb(240, 234, 234)" />
  </div>
</template>
<script>
export default {
  data() {
    return {
      // Ask for liked status in props object
      liked: false,
      editContent: false,
      content: this.comment_data.comment,
      likeAmount: this.comment_data.likeAmount,
    };
  },
  props: {
    comment_data: Object,
  },
  
  methods: {
    image(url) {
      const path = require(`../assets/${url}`);
      // console.log(path);
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
    editCompleted() {
      this.editContent = false;
      // api to update comment in database
    },
    adaptHeight() {
      const myTextarea = this.$refs.editBox;
      // console.log(myTextarea);
      myTextarea.style.height = "auto";
      myTextarea.style.height = myTextarea.scrollHeight + "px";
    },
  },
};
</script>
<style>
/* .commentBody {
  max-width: 1000px;
  margin: 0 auto;
} */
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
