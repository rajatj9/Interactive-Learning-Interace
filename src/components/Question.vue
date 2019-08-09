<template>
  <div>
    <div class="question-wrapper content-container">
      <div class="question-container" ref="question" :id="'question_' + question.question_id">
        <span class="sequence sequence-text">{{ question.sequence }} </span>
        <span class="total-length-text"> / {{ length }}  </span>
        <span class="question-title" :style="questionTextStyle">{{ question.title }}</span>
        <!--<router-link tag="a" to="/answer"> {{ questionInputMode }}: Answer </router-link>-->

      </div>
      <!--v-if="isActivated"-->
      <component v-if="isActivated || isIOS" :is="questionInputMode" :scale="question.scale"
                 :width="answerPanelWidth" :height="answerPanelHeight" :top="answerPanelTop"
                 :image="questionTitleImage" @resize="resize()"
                 :id="question.question_id" :style="answerPanelHeightStyle"></component>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import {questionTextMixin} from '@/mixins/questionText';
  import MultipleChoice from './inputmode/MultipleChoice/MultipleChoice.vue';
  import Likert from './inputmode/MultipleChoice/Likert.vue';
  import TextBox from './inputmode/TextBox/TextBox.vue';
  import InputMode from '@/constants/input_mode_id';

  export default {
    mixins: [questionTextMixin],
    props: {
      orientation: {
        type: [String, null],
        required: false
      },
      isActivated: {
        type: Boolean,
        required: false,
        default: false
      },
      width: {
        type: Number,
        required: false
      }
    },
    computed: {
      ...mapGetters({
        isIOS: 'isIOS'
      }),
      answerPanelHeightStyle() {
        return {
          height: this.answerPanelHeight + 'px'
        };
      },
      questionTextStyle() {
        return (this.questionInputMode == "MultipleChoiceView"
            && this.question.title >= 250
            && this.answerPanelWidth <= 562) ? {'font-size': '12px'} : null;
      }
    },
    methods: {
      needAdjustOrientation() {
        if (this.question.input_mode == InputMode.TEXT_BOX_INPUT_MODE) {
          return false;
        }
        if (this.question.input_mode != InputMode.TAP_INPUT_MODE) {
          // Non tap=> always landscape
          return window.matchMedia("(orientation: portrait)").matches;
        }
        else {
          // Non tap=> always portrait
          return window.matchMedia("(orientation: landscape)").matches;
        }
      },
      calculateAnswerPanelHeight() {
        // TODO: need to check the size after fit the window size
        var btnWrapper = document.getElementById('order-btn-wrapper') ?
            document.getElementById('order-btn-wrapper') : document.getElementById('edit-btn-wrapper'),
            buttonStyle = btnWrapper.currentStyle || window.getComputedStyle(btnWrapper),
            questionWrapper = this.$refs.question,
            questionStyle = questionWrapper.currentStyle || window.getComputedStyle(questionWrapper);

        if (this.needAdjustOrientation()) {
          this.answerPanelTop = questionWrapper.getBoundingClientRect().right +
              parseInt(questionStyle.marginBottom) * 1.25;
          this.answerPanelHeight = Math.abs(btnWrapper.getBoundingClientRect().left
              - this.answerPanelTop);
//               this.answerPanelHeight = Math.abs(window.innerHeight - btnWrapper.getBoundingClientRect().height
//                   - parseInt(buttonStyle.bottom) - parseInt(questionStyle.marginBottom) * 1.25
//                   - questionWrapper.getBoundingClientRect().right);
          this.answerPanelWidth = this.width ? this.width - parseInt(questionStyle.marginBottom) * 1.25
              : questionWrapper.getBoundingClientRect().height;
        }
        else {
          this.answerPanelTop = parseInt(questionStyle.marginBottom) * 1.25
              + questionWrapper.getBoundingClientRect().bottom;
          this.answerPanelHeight = Math.abs(window.innerHeight
              - btnWrapper.getBoundingClientRect().height
              - parseInt(buttonStyle.bottom) - this.answerPanelTop);
          this.answerPanelWidth = this.width ? this.width - parseInt(questionStyle.marginBottom) * 1.25
              : questionWrapper.getBoundingClientRect().width;
        }
//           console.log("Question resize:", "panelWidth: " + this.answerPanelWidth, "panelHeight: " + this.answerPanelHeight)
      },
      resize() {
        this.calculateAnswerPanelHeight();
        let carouselContainer = document.getElementById('carousel-container'),
            carouselContainerStyle = carouselContainer.currentStyle || window.getComputedStyle(carouselContainer);
        if (this.answerPanelHeight >= parseFloat(carouselContainerStyle.height)) {
          let vm = this;
          setTimeout(() => {
            vm.$emit('sketchResize', true);
          }, 100);
        }
      }
    },
    components: {
      MultipleChoiceView: MultipleChoice,
      LikertView: Likert,
      TextBoxView: TextBox
    },
    watch: {
      orientation() {
        this.calculateAnswerPanelHeight();
      },
      width(val) {
        this.answerPanelWidth = val;
      }
    },
    mounted() {
      this.calculateAnswerPanelHeight();
      window.addEventListener('resize', this.calculateAnswerPanelHeight);
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.calculateAnswerPanelHeight)
    }
  }
</script>

<style>
  @import url("../assets/CSS/question-text.css");

  .question-wrapper {
    margin: 2.2rem 2.8rem;
  }
</style>