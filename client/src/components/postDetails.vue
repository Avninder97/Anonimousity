<template>
  <div class="postPage">
    <postCard class="sepForComms pb-3 mb-4">
      <div class="input-group addComments ms-2">
        <input type="text" placeholder="Add a Comment" class="inputControl" v-model="newComment"/>
        <span @click="addComment" class="input-group-text arrow" ref="commentArrow">>></span>
      </div>
    </postCard>
    <!-- Put a v-for loop for comments gathered from database -->
    <commentCard :comment_data="commentObject" />
  </div>
</template>
<script>
import postCard from "./postCard.vue";
import commentCard from "./commentCard.vue";

export default {
  name: "postDetail",
  data() {
    return {
      commentObject: {
        fullName: "Prateek Kumar",
        organization: "Argusoft",
        comment:
          "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of  (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, Lorem ipsum dolor sit amet.., comes from a line in section 1.10.32.The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from  by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
        image_url: "b1.png",
        likeAmount: 1500,
      },
      newComment:'',
    };
  },
  components: {
    commentCard,
    postCard,
  },
  methods: {
    addComment() {
      if(this.newComment)
      {const arrow = this.$refs.commentArrow;
      arrow.style.color = 'green'
      setTimeout(()=>{
        arrow.style.color = 'rgb(240, 234, 234)'
      },500)
      this.newComment = ''}
    },
  },
};
</script>
<style>
.postPage {
  max-width: 1000px;
  margin: 0 auto;
}
/* .sepForComms {
  border: none;
  border-bottom: 1.5px solid rgb(240, 234, 234);
  border-radius: 0px 0px 3% 3%;
} */
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

</style>
