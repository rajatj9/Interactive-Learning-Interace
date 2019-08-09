<template>
  <div class="form-wrapper">
    <form class="form-auth" @submit.prevent="signUp">
      <div class="logo-container">
        <img src="@/assets/img/logo_GI.png" class="mb-4 logo" height="80">
      </div>
      <div class="auth-title">
        <h3 class="h3 mb-3 font-weight-normal title-text">Create an account</h3>
      </div>

      <div class="form-group">
        <div class="input-wrapper">
          <input type="text" id="username"
                 @blur="$v.username.$touch()" v-model="username"
                 class="input pass error-offset"
                 :class="{ invalid: ($v.username.$error || isDuplicated) }"
                 placeholder="Username">
          <p v-if="$v.username.$error && !$v.username.required" class="warning-message">
            This field must not be empty.</p>
          <p v-if="$v.username.$error && !$v.username.minLen" class="warning-message">
            Length should be not less than 5.</p>
          <p v-if="isDuplicated" class="warning-message">This username has been taken. </p>
        </div>

        <div class="input-wrapper">
          <input type="text" id="confirm-username"
                 @input="$v.confirmUsername.$touch()" v-model="confirmUsername"
                 class="input pass error-offset"
                 :class="{ invalid: $v.confirmUsername.$error && (confirmUsername !== '') }"
                 placeholder="Confirm Username">
          <p v-if="$v.confirmUsername.$error && !$v.confirmUsername.sameAs && (confirmUsername !== '')"
             class="warning-message">
            Username Don't Match.
          </p>
        </div>


        <div class="auth-btn-wrapper">
          <button type="submit" class="btn btn-lg btn-primary btn-block btn-confirm btn-loader"
                  :class="{'btn-loading':isClickedButton}"
                  :disabled="isButtonDisable">Sign Up
          </button>
        </div>
      </div>

      <div class="footer-text text-muted">
        Have an account? &nbsp;
        <router-link
            tag="a" :to="{ name: 'signIn'}"
            class="mt-5 mb-3 text-link">Log in
        </router-link>
      </div>
    </form>


  </div>
</template>

<script>
  import {authFormMixin} from '@/mixins/authForm';
  import * as MSG from '@/constants/message_id';

  export default {
    mixins: [authFormMixin],
    computed: {
      isDuplicated() {
        let flag = this.nameList.indexOf(this.username)
        return flag == -1 ? false : true;
      }
    },
    methods: {
      signUp() {
        this.isClickedButton = true;
        this.$store.dispatch('defaultAuth', {
          username: this.username,
          login: false
        }).then((msg) => {
          if (msg == MSG.TAKEN_USERNAME) {
            this.nameList.push(this.username);
            this.resetConfirmInput();
          } else if (msg == MSG.SURVEY_COMPLETED) {
            //  all answers is finished -> thanks
            this.$router.push({name: 'thanks'})
          }
          else if (msg == MSG.WRONG_TOKEN) {
            //  invalid token
            this.$store.dispatch('setWrongToken', true)
                .then(() => this.$store.dispatch('clearLocalStorage'))
            this.$router.push({
              'name': 'survey',
              query: {survey_token: this.$store.getters.appSurveyToken}
            });
          } else {
            console.log(msg)
            this.resetConfirmInput();
          }
        }).catch(error => {
          console.log(error);
          this.isClickedButton = false;
        })
      }
    }
  }
</script>

<style scoped>
  @import url("../../assets/CSS/auth.css");
</style>