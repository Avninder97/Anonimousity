<template>
  <div class="feedBody">
    <postCard class="card py-2">
      <div class="input-group addComments ms-2">
        <input type="text" placeholder="Add a Comment" class="inputControl" v-model="newComment"/>
        <span @click="addComment" class="input-group-text arrow" ref="commentArrow">>></span>
      </div>
    </postCard>
    <postCard class="card my-2 py-2"></postCard>
    <postCard class="card my-2 py-2"></postCard>
    <postCard class="card my-2 py-2"></postCard>
    <postCard class="card my-2 py-2"></postCard>
  </div>
</template>
<script>
import postCard from './postCard.vue';
export default {
  data(){
    return{
      newComment: ''
    }
  },
  components:{
    postCard,
  },
  methods:{
    addComment() {
      if(this.newComment)
      {const arrow = this.$refs.commentArrow;
      arrow.style.color = 'green'
      setTimeout(()=>{
        arrow.style.color = 'rgb(240, 234, 234)'
      },500)
      this.newComment = ''}
    },
  }
};
</script>
<style>
.feedBody {
  max-width: 1000px;
  margin: 0 auto;
  margin-top: 2px;
}
.card{
  border: 1px solid rgb(240, 234,234,0.3);
  border-radius: 0px;
  /* border-bottom: none; */
  
}
</style>
