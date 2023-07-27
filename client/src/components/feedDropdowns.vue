<template>
  <div class="filter_sorts">
    <div class="filter">
      <p>Filter by organization:</p>
      <select class="form-select" names="filterOptions" v-model="selectedOrg" @change="filterBy">
        <option value="" selected>Default</option>
        <option v-for="(organizationName, index) in organizationsNames" :key="index" :value="organizationName">{{ organizationName }}</option>
      </select>
    </div>
    <div class="sort">
      <p>Sort:</p>
      <select class="form-select" name="sortOptions" v-model="sortedBy" @change="sortBy">
        <option value="" selected>Default</option>
        <option value="mostLikes">Most Likes</option>
        <option value="leastLikes">Least Likes</option>
        <option value="latest">Latest</option>
        <option value="oldest">Oldest</option>
      </select>
    </div>
  </div>
</template>
  
<script>
import axios from 'axios';
export default {
  name: "feedDropdown",
  props: [

  ],
  emits: [
    'toBeFilteredBy',
    'toBeSortedBy'
  ],
  data() {
    return {
      organizationsNames: [],
      selectedOrg: "",
      sortedBy: ""
    }
  },
  beforeMount() {
    axios.get('http://localhost:5000/api/organizations/names')
      .then((response) => {
        console.log("res ->", response.data.names);
        this.organizationsNames = response?.data?.names ? response.data.names : [];
      })
      .catch((err) => {
        console.log(err);
      })
  },
  methods: {
    filterBy(){
      this.$emit('toBeFilteredBy', this.selectedOrg);
    },
    sortBy(){
      this.$emit('toBeSortedBy', this.sortedBy);
    }
  },
}
</script>
  
<style>

</style>