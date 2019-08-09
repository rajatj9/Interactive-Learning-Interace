<template>
  <div class="overview-wrapper">
    <loading-spinner class="overview-loading-spinner" v-if="isLoading"></loading-spinner>
    <invalid-username v-if="isInvalidUsername"></invalid-username>
    <failed-submit v-if="isFailedSubmit" @response="reSubmit()"></failed-submit>
    <error-message v-if="isWrongToken && !isLoading" :title="'Error'"
                   :subTitle="'Oops, we cannot find this survey. Please check the survey url again.'"></error-message>
    <div class="overview-container" v-if="!isWrongToken">
      <div class="overview-content-wrapper">
        <div class="survey-name-wrapper">
          <h3 class="survey-name-container">
            {{ surveyName }}
          </h3>
        </div>

        <div class="display-answers-wrapper">
          <answer-view v-for="question in questions"
                       :question="question" :key="question.sequence"
                       :answer="getAnswerValueById(question.question_id)"></answer-view>
        </div>
      </div>

      <div class="bottom-holder"></div>
      <div class="submit-wrapper fixed-bottom-wrapper">
        <div class="warning-text" v-if="!isCompleted">
          Please complete all questions.
        </div>
        <div class="submit-btn-container">
          <button class="btn btn-lg btn-primary btn-block btn-confirm btn-loader"
                  :class="{'btn-loading':isPending}"
                  :disabled="!isCompleted || isPending" @click="submit()">
            {{ submitBtnText }}
            <span v-if="isPending"> ... </span>
          </button>
        </div>

      </div>

    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import Answer from '@/components/Answer.vue';
  import InvalidUsername from '@/components/modal/InvalidUsername.vue';
  import FailedSubmit from '@/components/modal/FailedSubmit.vue';
  import Message from '@/components/message/Message.vue';
  import LoadingSpinner from '@/components/util/LoadingSpinner.vue';

  export default {
    name: "Overview",
    data() {
      return {
        isLoading: true,
        isPending: false,
        isInvalidUsername: false,
        isFailedSubmit: false,
        isWrongToken: false
      }
    },
    computed: {
      ...mapGetters({
        surveyName: 'appSurveyName',
        questions: 'getQuestions',
        answers: 'getAnswers',
        getAnswerValueById: 'getAnswerValueById',
        isCompleted: 'isCompleted',
        isMobile: 'isMobile'
      }),
      submitBtnText() {
        return this.isPending ? "Submitting" : "Submit";
      }
    },
    components: {
      AnswerView: Answer,
      InvalidUsername: InvalidUsername,
      FailedSubmit: FailedSubmit,
      ErrorMessage: Message,
      LoadingSpinner: LoadingSpinner
    },
    methods: {
      submit() {
        this.isPending = true;
        var vm = this;
        this.$store.dispatch('submitAnswer')
            .then((res) => {
              vm.isPending = false;
              vm.responseMessage(res)
            }).catch((error) => {
          console.log(error)
          vm.isPending = false;
        });
      },
      responseMessage(res) {
//            console.log(res)
        switch (res.message_id) {
          case "1" : // Answer successfully submitted
            this.redirectToThanks();
            this.$store.dispatch('clearLocalStorage');
            break;
          case "2": // Answer failed to be submitted
            this.isFailedSubmit = true;
            break;
          case "3": // Invalid survey token
            // it usually it won't occur, it seems sth silly
            this.isWrongToken = true;
            break;
          case "4": // Invalid username
            this.isInvalidUsername = true;
            break;
          default:
            console.log(res);
        }
        console.log(res.message)
      },
      redirectToThanks() {
        this.$router.push({name: "thanks"});
      },
      reSubmit() {
        this.isFailedSubmit = false;
        this.submit();
      }
    },
    mounted() {
      if (!this.isMobile) {
        this.$router.push({
          'name': 'survey',
          query: {survey_token: localStorage.getItem('TOKEN')}
        })
      } else {
        if (this.$store.getters.isQuestionsListEmpty) {
          this.$store.dispatch('checkQuestionsInLocalStorage')
        }
        if (this.$store.getters.getAnswersListLength == 0) {
          this.$store.dispatch('initializeAnswers')
        }
      }

      let vm = this;
      setTimeout(() => {
        vm.isLoading = false;
      }, 200)
    }
  }
</script>

<style scoped>
  .warning-text {
    color: red;
    margin-bottom: -0.9rem;
  }

  .overview-loading-spinner {
    position: fixed;
    background: #fff;
  }

  .overview-wrapper {
    height: 100%;
    overflow-x: hidden;
  }

  .overview-container {
    padding: 0 2rem;
  }

  .survey-name-wrapper {
    font-size: 20px;
    font-family: Poppins;
    color: #4A90E2;
    font-weight: 600;
    text-align: center;
    padding: 1rem;
  }

  .survey-name-wrapper::after,
  .survey-name-wrapper::before {
    content: ' ';
    display: inline-block;
    background: linear-gradient(to right, #a66cdf 0%, #4e8fdf 100%);
    position: relative;
    z-index: 2;
    width: 1.2rem;
    height: 1.2rem;
    border-radius: 100%;
    top: -2px;
  }

  .survey-name-wrapper::after {
    background: linear-gradient(to right, #4e8fdf 0%, #a66cdf 100%);
  }

  .survey-name-container {
    display: inline;
    margin: auto 1rem;
  }

  .submit-wrapper {
    padding: 1.5rem 1rem;
    text-align: center;
  }

  .submit-btn-container {
    text-align: center;
    margin: 0 auto;
    width: 80%;
  }

  .btn-confirm[disabled] {
    /*border: none;*/
    opacity: 0.6;
    filter: none;
    border: none;
  }

  .overview-content-wrapper {
    margin-bottom: 7.5rem;
  }

  .fixed-bottom-wrapper {
    position: fixed;
    bottom: 0;
    width: 100%;
    /*background: white;*/
    background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.9) 15%, rgba(255, 255, 255, 1) 20%, rgba(255, 255, 255, 1) 100%);

    margin-left: -2rem;
    margin-bottom: -1.2rem;
  }

  .bottom-holder {
    width: 100%;
    height: 2em;
  }
</style>