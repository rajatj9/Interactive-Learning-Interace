<template>
  <div class="survey-wrapper" :class="currentOrientationStyle" ref="survey"
       :ontouchmove="ontouchmove">
    <error-message v-if="isErrorToken && !isLoading"></error-message>
    <qr-code-page v-if="displayQRCode && !isLoading"></qr-code-page>
    <loading-spinner v-if="isLoading"></loading-spinner>
    <div class="carousel-container" v-if="!isErrorToken && !displayQRCode && !isLoading" id="carousel-container">
      <warning-modal v-if="displayWarning" :style="carouselStyle"
                     @input="translateCarousel($event)"></warning-modal>
      <div class="carousel my-carousel carousel-translate" :style="carouselStyle">
        <div class="carousel-inputs">
          <input v-for="(question, index) in questions" type="radio" :key="'input'+index"
                 class="carousel-activator" name="carousel" :value="question.sequence"
                 :id="getInputIdBySequence(question.sequence)" v-model="currentSequence">
        </div>

        <div class="carousel-track" :style="carouselTrackTransform">
          <question-view v-for="question in questions" class="carousel-slide" :width="carouselWidth"
                         :isActivated="currentQuestionId == question.question_id"
                         :key="question.sequence" :orientation="currentOrientationStyle"
                         :question="question" :class="{ 'carousel-slide-transition': true }"
                         @sketchResize="calculateCarouselSize()"
                         :style="getSlideTransformBySequence(question.sequence)"></question-view>
        </div>

        <div class="survey-btn-wrapper" v-if="!this.$route.params.sequence" id="order-btn-wrapper">
          <div class="carousel-indicators" v-if="showCarouselIndicators">
            <label v-for="(question, index) in questions" class="carousel-indicator" :key="'q'+index"
                   :class="{ 'carousel-indicator-display': (question.sequence == currentSequence) }"
                   @click="setCurrentSequence(question.sequence)"></label>
          </div>

          <button class="btn btn-primary btn-radius-controller btn-back"
                  v-if="currentSequence>1" @click="back()">
            <div class="btn-back-icon"></div>
          </button>
          <button class="btn btn-primary btn-radius-controller btn-forward"
                  @click="forward()">
            <div class="btn-forward-icon"></div>
          </button>
        </div>

        <div class="survey-btn-wrapper" v-if="this.$route.params.sequence" id="edit-btn-wrapper">
          <button class="btn btn-survey btn-survey-cancel"
                  @click="cancel()">Cancel
          </button>
          <button class="btn btn-survey btn-survey-save"
                  @click="save()">Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import configIOS from '@/utiljs/disable-iOS-default';
  import Question from '@/components/Question.vue';
  import InputMode from '@/constants/input_mode_id'
  import WarningModal from '@/components/modal/WarningNullModal.vue';
  import LoadingSpinner from '@/components/util/LoadingSpinner.vue';
  import QRCode from './QRcode.vue';
  import Error from './Error.vue';

  require('babel-polyfill');

  export default {
    name: 'Survey',
    data() {
      return {
        carouselWidth: 0,
        carouselHeight: 0,
        currentSequence: null,
        isLoading: true,
        displayQRCode: false,
        toMove: false,
        lastTouchEnd: 0
      }
    },
    computed: {
      ...mapGetters({
        questions: 'getQuestions',
        displayWarning: 'questionNullWarning',
        isErrorToken: 'appWrongToken',
        isMobile: 'isMobile',
        isIOS: 'isIOS'
      }),
      ontouchmove() {
        return this.isIOS ? "event.preventDefault()" : null;
      },
      showCarouselIndicators() {
        return false;
        // return this.questions.length <= 6
//            return this.questions.length < 10 || !(this.carouselWidth <= 568 && this.questions.length > 5)
      },
      currentQuestionId() {
        return this.currentSequence ? this.getQuestionIdBySequence(this.currentSequence) : null;
      },
      carouselTrackTransform() {
        let position = this.currentSequence - 1;
        return {
          '-webkit-transform': 'translateX(' + (position * -100) + '%)',
          'transform': 'translateX(' + (position * -100) + '%)'
        }
      },
      currentOrientationStyle() {
        let currentInputMode = this.currentSequence ?
            this.questions.find(question => question.sequence == this.currentSequence).input_mode : null;
        if (this.isErrorToken) return "";
        if (currentInputMode) {
          if (currentInputMode == InputMode.TAP_INPUT_MODE) {
            return "portrait-orientation";
          } else if (currentInputMode == InputMode.TEXT_BOX_INPUT_MODE) {
            return "auto-orientation";
          }
          else {
            return "landscape-orientation";
          }

        }
        return "";
      },
      carouselStyle() {
        if (!this.currentOrientationStyle) return {};
        if (this.currentOrientationStyle == "landscape-orientation") {
          let isLandscape = this.carouselWidth >= this.carouselHeight;
          return {
            width: (isLandscape ? this.carouselWidth : this.carouselHeight) + "px !important",
            height: (isLandscape ? this.carouselHeight : this.carouselWidth) + "px !important"
          }
        }
        else if (this.currentOrientationStyle == "portrait-orientation") {
          let isPortrait = this.carouselWidth < this.carouselHeight;
          return {
            width: (isPortrait ? this.carouselWidth : this.carouselHeight) + "px !important",
            height: (isPortrait ? this.carouselHeight : this.carouselWidth) + "px !important",
            float: isPortrait ? "none" : "right"
          }
        }
        else if (this.currentOrientationStyle == "auto-orientation") {
          return {
            width: this.carouselWidth + "px !important",
            height: this.carouselHeight + "px !important"
          }
        }
        return {};
      }
    },
    watch: {
      currentSequence: function (new_value, old_value) {
        if (old_value) {
          this.$store.dispatch('stopTimingById', this.getQuestionIdBySequence(old_value));
          this.$store.dispatch('startTimingById', this.currentQuestionId);
        }
      },
      currentOrientationStyle: function () {
        this.setRotateWarning();
      },
    },
    components: {
      QuestionView: Question,
      LoadingSpinner: LoadingSpinner,
      ErrorMessage: Error,
      QrCodePage: QRCode,
      WarningModal,
    },
    methods: {
      getQuestionIdBySequence(sequence) {
        return this.questions.find(question => question.sequence == sequence).question_id;
      },
      getInputIdBySequence(sequence) {
        return 'question-view-' + sequence;
      },
      getSlideTransformBySequence(sequence) {
        let position = sequence - 1;
        return {
          '-webkit-transform': 'translateX(' + (position * 100) + '%)',
          'transform': 'translateX(' + (position * 100) + '%)'
        }
      },
      translateCarousel(move) {
        this.toMove = move;
        this.$store.dispatch('setShowAnswerNullWarning', false);
      },

      checkCurrentAnswer() {
        let getDisplayWarning = () => this.displayWarning;
        let getToMoveMessage = () => this.toMove;

        async function checkDisplayWarning(display, resolve) {
          if (display()) {
            await setTimeout(() => checkDisplayWarning(display, resolve), 100)
          }
          else {
            resolve();
          }
          return true;
        }

        return new Promise((resolve) => {
//                var currentValue =  this.$store.getters.getAnswerValueById(this.currentQuestionId);
          var answer = this.$store.getters.getAnswerById(this.currentQuestionId);
//                console.log(answer, answer.operations.length)
          if (!answer.operations.length || answer.value == null || answer.value === '') {
            this.$store.dispatch('setShowAnswerNullWarning', true);
            this.toMove = false;
            checkDisplayWarning(getDisplayWarning, () => {
              resolve(getToMoveMessage())
            });
          }
          else {
            resolve(true);
          }
        })
      },

      setCurrentSequence(sequence) {
        this.checkCurrentAnswer().then((move) => {
          if (move) {
            this.currentSequence = sequence;
          }
        });
      },

      forward() {
        this.checkCurrentAnswer().then((move) => {
          if (move) {
            if (this.currentSequence < Object.keys(this.questions).length) {
              this.currentSequence++;
            }
            else {
              this.save();
            }
          }
        });
      },
      back() {
        this.checkCurrentAnswer().then((move) => {
          if (move) {
            if (this.currentSequence > 1) {
              this.currentSequence--;
            }
          }
        });
      },
      save() {
        this.$store.dispatch('stopTimingById', this.currentQuestionId);
        this.$router.push({name: 'overview'});
      },
      cancel() {
        this.$store.dispatch('resetAnswerById', this.currentQuestionId);
        this.$router.push({name: 'overview'});
      },

      setRotateWarning() {
        let ori = this.currentOrientationStyle.split("-")[0];
        if (ori) {
          if (ori == 'auto') {
            return;
          }
          else if (!window.matchMedia("(orientation: " + ori + ")").matches) {
            this.$store.dispatch('setRotateWarning', true);
          }
          else {
            if (this.$store.getters.appRotateWarning) {
              this.$store.dispatch('setRotateWarning', false);
            }
          }
        }
      },

      calculateCarouselSize() {
        var w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0];

        if (this.isIOS && window.matchMedia("(orientation: landscape)").matches) {
          window.scrollTo(0, 1);
        }
        this.carouselWidth = (e.clientWidth || w.innerWidth || g.clientWidth);
        this.carouselHeight = (e.clientHeight || w.innerHeight || g.clientHeight);
        if (!(e.clientHeight == w.innerHeight == g.clientHeight)) {
          this.carouselHeight = (this.carouselWidth > e.clientHeight && this.carouselWidth > w.innerHeight) ?
              Math.min(e.clientHeight, w.innerHeight) : Math.max(e.clientHeight, w.innerHeight);
          if (!this.isIOS) {
            this.carouselHeight = w.innerHeight;
          }
        }

      },

      surveyConfig() {
        let vm = this;
        return new Promise((resolve) => {
          this.$store.dispatch('setSurveyGroup', this.$route.query.survey_group);
          if (vm.$store.getters.appSurveyToken != vm.$route.query.survey_token) {
            vm.$store.dispatch('setSurveyToken', vm.$route.query.survey_token);
          }
          if (vm.$store.getters.isQuestionsListEmpty) {
            vm.$store.dispatch('checkQuestionsInLocalStorage')
          }
          // TODO: no questions -> redirect to error
          // wrong token -> set isErrorToken to true

          // initial answers & check state in local storage
          if (vm.$store.getters.getAnswersListLength == 0) {
            vm.$store.dispatch('initializeAnswers')
          }
          resolve();
        })
      }
    },
    beforeRouteEnter(to, from, next) {
      // TODO: token is different from the vuex store
      // but the component is mounted
      // config the survey again
      if (to.params.sequence) {
        next(vm => {
          vm.currentSequence = to.params.sequence;
          vm.$store.dispatch('startTimingById', vm.getQuestionIdBySequence(to.params.sequence));
        })
      }
      else {
        next(vm => {
          let startSequence = vm.$store.getters.getFirstNotFinishedSequence();
          if (!vm.isErrorToken && vm.isMobile) {
            if (startSequence) {
              vm.currentSequence = startSequence;
              // start timing of the question
              vm.$store.dispatch('startTimingById', vm.currentQuestionId);
            }
            else {
              vm.$router.push({name: 'overview'});
            }
          }
        });
      }
    },
    mounted() {
      let vm = this;
      if (!this.isMobile) {
        this.$store.dispatch('getQRCodeImg', this.$route.query.survey_token)
            .then(() => {
              vm.displayQRCode = true;
              vm.isLoading = false;
            });
      }
      else {
        if (!this.isErrorToken) {
          this.surveyConfig().then(() => {
            vm.isLoading = false;
          });
          if (this.currentOrientationStyle) {
            this.setRotateWarning();
          }

          if (this.isIOS) {
            configIOS.disableScrolling();
            document.documentElement.addEventListener('touchstart', configIOS.stopPinchZoom, false);
            document.documentElement.addEventListener('touchend', configIOS.disableDoubleTapZoom, false);
//                    configIOS.disableBodyTouchMove(this.$refs.survey, 'scrollable')
          }
          this.calculateCarouselSize();
          window.addEventListener('resize', this.calculateCarouselSize);
        }
        else {
          vm.isLoading = false;
        }
      }
      // console.log("survey mounted", Date.now())
    },
    beforeDestroy() {
      if (this.isMobile && !this.isErrorToken) {
        window.removeEventListener('resize', this.calculateCarouselSize)
        if (this.isIOS) {
          configIOS.enableScrolling();
          document.documentElement.removeEventListener('touchstart', configIOS.stopPinchZoom);
          document.documentElement.removeEventListener('touchend', configIOS.disableDoubleTapZoom);
//                configIOS.disableBodyTouchMove(this.$refs.survey);
        }
      }
    }
  }
</script>


<style scoped>
  @import url("../assets/CSS/orientation.css");

  .survey-wrapper {
    height: 100%;
    width: 100%;
    overflow: hidden;
  }

  .carousel-container {
    display: inline-block;
    overflow: hidden;
    position: fixed;
    left: 0;
    top: 0;
  }

  .carousel {
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    text-align: center;
    position: relative;
    padding: 0;
    list-style: none;
  }

  .carousel-activator {
    display: none;
  }

  .my-carousel {

  }

  .carousel-slide {
    overflow: hidden;
  }

  /* indicators */
  .carousel-indicators {
    position: absolute;
    text-align: center;
    z-index: -15 !important;
  }

  .carousel-indicator {
    background-color: #4E8FDF;
  }

  .carousel-indicator {
    height: 1rem;
    width: 1rem;
    border-radius: 100%;
    display: inline-block;
    z-index: 2;
    cursor: pointer;
    opacity: 0.4;
    margin: 0 1rem
  }

  .carousel-indicator:hover {
    opacity: 0.75;
  }

  /* track: content */
  .carousel-track {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    padding: 0;
    margin: 0;
    transition: -webkit-transform 0.5s ease 0s;
    transition: transform 0.5s ease 0s;
    transition: transform 0.5s ease 0s, -webkit-transform 0.5s ease 0s;
  }

  .carousel-track .carousel-slide {
    display: block;
    top: 0;
    left: 0;
    right: 0;
    opacity: 1;
  }

  .carousel--scale .carousel-slide {
    -webkit-transform: scale(0);
    transform: scale(0);
  }

  .carousel-slide {
    height: 100%;
    position: absolute;
    overflow-y: auto;
    opacity: 0;
    background-size: cover;
    background-position: center;
  }

  /* Selected Slide */
  .carousel-slide-transition {
    transition: opacity 0.5s, -webkit-transform 0.5s;
    transition: opacity 0.5s, transform 0.5s;
    transition: opacity 0.5s, transform 0.5s, -webkit-transform 0.5s;
    top: 0;
    left: 0;
    right: 0;
    opacity: 1;
    -webkit-transform: scale(1);
    transform: scale(1);
  }

  .carousel-indicator-display {
    /*opacity: 1;*/
    opacity: 0.9;
    height: 1.5rem;
    width: 1.5rem;
    margin: -0.225rem 0.5rem;
  }

  .survey-btn-wrapper {
    position: absolute;
    bottom: 1.5rem;
    z-index: 32;
    width: 100%;
    padding: 0 6.5rem
  }

  .btn-back {
    float: left;
  }

  .btn-forward {
    float: right;
  }

  .btn-survey-cancel {
    border: 1px solid #A66EDF;
    background: rgba(166, 110, 223, 0.05);
    color: #A66EDF;
    float: left;
  }

  .btn-survey-save {
    border: 1px solid #4A90E2;
    background: rgba(74, 144, 226, 0.05);
    color: #4A90E2;
    float: right;
  }

  .portrait-orientation .btn-survey {
    width: 45% !important;
  }

  @media screen and (orientation: portrait) {
    .auto-orientation .btn-survey {
      width: 45% !important;
    }
  }
</style>