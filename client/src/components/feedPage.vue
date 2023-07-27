<template>
  <div class="feedBody pt-1">
    <div class="filter_sorts">
      <div class="filter">
        <p>Filter by organization:</p>
        <select class="form-select">
          <option value="No Filter" selected>Default</option>
          <option value="argusoft">Argusoft</option>
        </select>
      </div>
      <div class="sort">
        <p>Sort:</p>
        <select class="form-select">
          <option value="" selected>Default</option>
          <option value="">Like Count</option>
          <option value="">Date Created</option>
        </select>
      </div>
    </div>
    <div v-if="loading" id="spinnerHolder">
      <div class="spinner-border postLoader" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-else-if="error" class="postError">
      <h1>404 - Posts Not Found</h1>
    </div>
    <div v-else>
      <postCard
        v-for="(post, index) in posts"
        :key="index"
        :singlePost="post"
        class="pb-3 pt-2 my-4"
      />
    </div>
  </div>
</template>
<script>
import postCard from "./postCard.vue";
import axios from "axios";
export default {
  data() {
    return {
      posts: [],
      loading: false,
      error: false,
      organization: [],
    };
  },
  components: {
    postCard,
  },
  beforeMount() {
    this.loading = true;
    this.error = false;
    axios
      .get("http://localhost:5000/api/posts/")
      .then((response) => {
        console.log(response.data.posts);
        this.posts = response?.data?.posts ? response.data.posts : [];
        this.loading = false;
      })
      .catch((err) => {
        console.log(err);
        this.posts = [];
        this.loading = false;
        this.error = true;
      });
  },
  methods: {
    addComment() {
      if (this.newComment) {
        const arrow = this.$refs.commentArrow;
        arrow.style.color = "green";
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
.feedBody {
  max-width: 1000px;
  margin: 0 auto;
  margin-top: 2px;
}
.card {
  border: 1px solid rgb(240, 234, 234, 0.3);
  border-radius: 0px;
}
.filter_sorts {
  color: rgb(240, 234, 234);
  position: fixed;
  right: 2rem;
  top: 5.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  justify-content: space-between;
  width: 21rem;
  min-height: 13rem;
  background-color: rgb(66, 66, 66);
  border-radius: 5px;
  border: 1px solid rgb(240, 234, 234, 0.1);
}
.filter_sorts .filter, .filter_sorts .sort{
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-weight: bold;
  width: 100%;
}
.filter_sorts p{
  margin-bottom: 0.2rem;
}
</style>
