<template>
  <div class="activationPageWrapper">

    <p class="display-3" v-if="error">
        Invalid Account Activation Link
    </p>
    <p class="display-3" v-else-if="loading">
        Loading...
    </p>
    <div v-else class="d-flex flex-column">
        <p class="display-3 text-center">
            Account Verified Successfully
        </p>
        <br>
        <RouterLink to="/login" class="align-self-center mt-3">
            <div class="btn btn-success text-center loginAgainText">
                Please Click here to login again
            </div>
        </RouterLink>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
    name: "accountActivation",
    props: [
        'slug'
    ],
    data() {
        return {
            loading: true,
            error: false,
            errorMessage: ""
        }
    },
    beforeMount(){
        this.requestActivation();
    },
    methods: {
        async requestActivation() {
            try {
                await axios.get(`http://localhost:5000/api/auth/${this.$route.params.slug}`)
                .then((response) => {
                    console.log(response);
                    this.loading = false;
                })
                .catch((err) => {
                    if(err.response){
                        this.errorMessage = err.response.data.message;
                    }
                    else if(err.name && err.name == 'AxiosError'){
                        this.errorMessage = "Connection Error Occured, Please try again later"
                    }
                    else{
                        this.errorMessage = "An Error Occured, Please try again later"
                    }
                    this.error = true;
                })
            } catch(err){
                console.log(err)
                this.error = true;
                this.errorMessage = "Something went wrong";
            }
        }
    },
}
</script>

<style>
.activationPageWrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 50vh;
    color: antiquewhite;
}
.loginAgainText {
    font-size: 1.3rem;
}

</style>