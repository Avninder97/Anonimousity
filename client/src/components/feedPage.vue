<template>
  <div class="feedBody pt-1">
    <feedDropdown
      @toBeFilteredBy="(orgName) => filterPosts(orgName)"
      @toBeSortedBy="(orderBy) => sortPosts(orderBy)"
    />

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
        v-for="(post, index) in filteredAndSortedPosts"
        :key="index"
        :singlePost="post"
        class="pb-3 pt-2 my-4"
      />
    </div>
  </div>
</template>
<script>
import postCard from "./postCard.vue";
import feedDropdown from "./feedDropdowns.vue";
import axios from "axios";
export default {
  data() {
    return {
      posts: [],
      loading: false,
      error: false,
      organization: [],
      filteredAndSortedPosts: [],
    };
  },
  components: {
    postCard,
    feedDropdown,
  },
  beforeMount() {
    this.loading = true;
    this.error = false;
    axios
      .get("http://localhost:5000/api/posts/")
      .then((response) => {
        console.log(response.data.posts);
        this.posts = response?.data?.posts ? response.data.posts : [];
        this.filteredAndSortedPosts = response?.data?.posts
          ? response.data.posts
          : [];
        this.loading = false;
      })
      .catch((err) => {
        console.log(err);
        this.posts = [];
        this.filteredAndSortedPosts = [];
        this.loading = false;
        this.error = true;
      });
  },
  methods: {
    async filterPosts(orgName) {
      this.loading = true;
      this.error = false;
      try {
        if (orgName) {
          const temp = await axios.get(
            `http://localhost:5000/api/posts?organization=${orgName}`
          );
          if (temp?.data?.posts?.length) {
            this.filteredAndSortedPosts = temp?.data?.posts;
          } else {
            throw "post error";
          }
        } else {
          this.filteredAndSortedPosts = this.posts;
        }
      } catch (err) {
        this.error = true;
        this.filteredAndSortedPosts = this.posts;
      }
      this.loading = false;
    },
    async sortPosts(orderBy) {
      this.loading = true;
      this.error = false;
      try {
        if (orderBy === "mostLikes" || orderBy === "leastLikes") {
          await this.filteredAndSortedPosts.sort((a, b) => {
            return a.likedBy?.length - b.likedBy?.length;
          });
          if (orderBy === "mostLikes") {
            await this.filteredAndSortedPosts.reverse();
          }
        } else {
          await this.filteredAndSortedPosts.sort((a, b) => {
            console.log("time -> ", a.updatedAt);
            let aTime = new Date(a.updatedAt).getTime(),
              bTime = new Date(b.updatedAt).getTime();
            return aTime - bTime;
          });
          if (orderBy === "latest") {
            await this.filteredAndSortedPosts.reverse();
          }
        }
      } catch (err) {
        console.log(err);
        this.filteredAndSortedPosts = this.posts;
      }
      this.loading = false;
      this.error = false;
    },
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
.filter_sorts .filter,
.filter_sorts .sort {
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-weight: bold;
  width: 100%;
}
.filter_sorts p {
  margin-bottom: 0.2rem;
}
</style>
