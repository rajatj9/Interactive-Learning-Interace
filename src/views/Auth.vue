<template>
  <div class="bg-wrapper text-center">
    <!--<canvas-background-item></canvas-background-item>-->
    <auth-terms-modal v-if="!termAccepted" @accept="accept"></auth-terms-modal>
    <loading-spinner v-if="isLoading"></loading-spinner>
    <transition name="slide" mode="out-in" v-if="!isLoading">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  // import CanvasBackground from '@/components/util/CanvasBackgroud.vue';
  // import SignUp from '@/components/auth/SignUp.vue';
  // import SighIn from '@/components/auth/SignIn.vue';
  import TermsModal from '@/components/auth/Terms.vue';
  import LoadingSpinner from '../components/util/LoadingSpinner.vue';

  import * as MSG from '@/constants/message_id';

  export default {
    data() {
      return {
        termAccepted: false,
        isLoading: true
      }
    },
    components: {
      // CanvasBackgroundItem: CanvasBackground,
      // AuthSignUpForm: SignUp,
      // AuthSignInForm: SighIn,
      AuthTermsModal: TermsModal,
      LoadingSpinner: LoadingSpinner
    },
    methods: {
      accept() {
        this.termAccepted = true;
        this.isLoading = false;
        this.$router.push({name: 'signUp'})
//            this.termAccepted = true;
//            let username = localStorage.getItem('USERNAME');
//            if(username){ // auto login
//                this.autoLogin(username);
//            }
//            else {
//                this.isLoading = false;
//                this.$router.push({name: 'signUp'})
//            }
      },
      autoLogin(username) {
        this.$store.dispatch('defaultAuth', {
          username: username,
          login: true
        }).then((msg) => {
          console.log(msg)
          if (msg == MSG.NOT_REGISTERED_USERNAME) {
            //  not registered ->  sign up page
            this.isLoading = false;
            this.$router.push({name: 'signUp'})
          } else if (msg == MSG.SURVEY_COMPLETED) {
            //  all answers is finished -> thanks
            this.$router.push({name: 'thanks'})
          }
          else if (msg == MSG.WRONG_TOKEN) {
            //  invalid token
//                    let vm = this
            console.log("wrong ")
            this.$store.dispatch('setWrongToken', true)
                .then(() => this.$store.dispatch('clearLocalStorage'))
            this.$router.push({'name': 'survey', query: {survey_token: this.$store.getters.appSurveyToken}});
          }
          else {
            // TODO: other message
            console.log("more:", msg);
          }
        }).catch(error => console.log(error))
      }
    },
    mounted() {
      let username = localStorage.getItem('USERNAME');
      if (username) { // auto login
        this.termAccepted = true;
        this.autoLogin(username);
      }
    }
  }
</script>

<style>
  @import url("../assets/CSS/form.css");

  div.bg-wrapper {
    width: 100%;
    height: 100%;
    /*z-index: -10;*/
  }

  /*transition*/
  .slide-enter {
    opacity: 0;
    /*transform: translateY(20px);*/
  }

  .slide-enter-active {
    animation: slide-in .3s ease-out forwards;
    transition: opacity .3s;
  }

  .slide-leave {

  }

  .slide-leave-active {
    animation: slide-out 0.3s ease-out forwards;
    transition: opacity .2s;
    opacity: 0;
    position: absolute;
  }

  .slide-move {
    transition: transform .3s;
  }

  @keyframes slide-in {
    from {
      transform: translateY(20px);
    }
    to {
      transform: translateY(0);
    }
  }

  @keyframes slide-out {
    from {
      transform: translateY(0);
    }
    to {
      transform: translateY(20px);
    }
  }
</style>