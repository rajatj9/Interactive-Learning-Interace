<template>
  <div class="answer-wrapper" :class="answerContainerWrapper">
    <div class="answer-container">
      <div class="question-container content-container" ref="question">
        <span class="sequence sequence-text">{{ question.sequence }} </span>
        <span class="total-length-text"> / {{ length }}  </span>
        <span class="question-title">{{ question.title }}</span>
      </div>
      <component :is="questionInputMode" :id="question.question_id" :scale="question.scale"
                 :width="answerPanelWidth" :height="answerPanelHeight"
                 :isAnswerPanel="true" :image="questionTitleImage"
                 :answer="answer" :style="answerPanelHeightStyle"></component>
      <!--<div>Answer: {{ answer }}, {{ typeof answer }}</div>-->
      <div class="answer-btn-wrapper">
        <a class="btn btn-edit" @click="editAnswer()">
          Edit
          <span><img width="12px" class="triangle-marker-image"
                     src="../assets/img/triangle_marker.png"/></span>
        </a>
      </div>

    </div>
  </div>
</template>

<script>
  import {questionTextMixin} from '@/mixins/questionText';
  import DisplayMultipleChoice from './inputmode/MultipleChoice/DisplayMultipleChoice.vue';
  import DisplayTextBox from './inputmode/TextBox/DisplayTextBox.vue';

  export default {
    mixins: [questionTextMixin],
    props: {
      answer: {
        required: false
      }
    },
    computed: {
      answerContainerWrapper() {
        return {
          "highlight-empty-answer-style": (this.answer === '' || this.answer == null) //!this.answer
        }
      },
      answerPanelHeightStyle() {
        if (this.isPanelInputMode) {
          return {
            height: "auto"
          };
        }
        else {
          var hasGear = this.questionInputMode === "COGsSwipeView" ||
              this.questionInputMode === "COGsElasticPullView"
          var marginStyle = hasGear ? {
            "margin-bottom": "18px"
          } : {};
          return Object.assign({
            height: this.answerPanelHeight + 'px'
          }, marginStyle);
        }
      },
      isPanelInputMode() {
        return this.questionInputMode == "MultipleChoiceView" ||
            this.questionInputMode == "TextBoxView";
      }
    },
    components: {
      MultipleChoiceView: DisplayMultipleChoice,
      LikertView: DisplayMultipleChoice,
      TextBoxView: DisplayTextBox
    },
    methods: {
      editAnswer() {
        this.$router.push({
          'name': 'survey',
          query: {survey_token: this.$store.getters.appSurveyToken},
          params: {sequence: this.question.sequence}
        })
      },
      adjustSliderPanelHeight() {
        if (this.answerPanelWidth <= 320) {
          this.answerPanelHeight = this.answerPanelWidth * 0.4;
        }
        else {
          this.answerPanelHeight = this.answerPanelWidth / 9 * 2;
        }
      },
      calculateAnswerPanelSize() {
        this.answerPanelWidth = this.$refs.question.getBoundingClientRect().width;
        switch (this.questionInputMode) {
          case "SliderView":
            this.adjustSliderPanelHeight();
            break;
          case "VASView":
            this.adjustSliderPanelHeight();
            break;
          default:
            this.answerPanelHeight = this.answerPanelWidth / 25 * 9;
            break;
        }
      }
    },
    mounted() {
      if (!this.isPanelInputMode) {
        this.calculateAnswerPanelSize();
        window.addEventListener('resize', this.calculateAnswerPanelSize);
      }
    },
    beforeDestroy() {
      if (!this.isPanelInputMode) {
        window.removeEventListener('resize', this.calculateAnswerPanelSize);
      }
    }
  }
</script>

<style scoped>
  @import url("../assets/CSS/question-text.css");

  .answer-wrapper {
    margin: 0rem 0.5rem 2rem;
    padding: 2px;
    background-image: none;
    border-radius: 1.6rem;
  }

  .answer-container {
    padding: 1rem 2rem;
    background: #FAFAFA;
    border-radius: 1.6rem;
  }

  .highlight-empty-answer-style {
    background-image: linear-gradient(to right, #a66cdf 0%, #4e8fdf 100%);
  }

  .answer-btn-wrapper {
    width: 100%;
    text-align: right;
    height: 1rem;
    display: inline-block;
  }

  .btn-edit {
    text-align: right;
    width: 18%;
    margin-top: -1.6rem;
    margin-right: -1rem;
    /*background: lightsteelblue;*/
    color: #4A90E2;
    font-weight: 500;
    font-size: 18px;
    padding-top: 0;
    padding-bottom: 0;
    margin-bottom: -1.5rem;
  }

  .triangle-marker-image {
    margin-top: -0.5rem;
    margin-left: 0.6rem;
  }

  .btn.active, .btn:active {
    background-image: none;
    -webkit-box-shadow: none;
    box-shadow: none;
  }

  @media (max-width: 600px) {
    .btn-edit {
      margin-right: 1rem;
    }
  }
</style>