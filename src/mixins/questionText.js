import {mapGetters} from 'vuex';
import InputMode from '../constants/input_mode_id'
import Swipe from '../components/inputmode/Swipe/Swipe.vue';
import MinorSwipe from '../components/inputmode/Swipe/MinorSwipe.vue';
import COGsSwipe from '../components/inputmode/Swipe/COGsSwipe.vue';
import ElasticPull from '../components/inputmode/Swipe/ElasticPull.vue';
import COGsElasticPull from '../components/inputmode/Swipe/COGsElasticPull.vue';
import Slider from '../components/inputmode/Slider/Slider.vue';
import VAS from '../components/inputmode/Slider/VAS.vue';

export const questionTextMixin = {
  props: {
    question: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      answerPanelHeight: 0,
      answerPanelWidth: 0,
      answerPanelTop: 0
    }
  },
  computed: {
    ...mapGetters({
      length: 'surveyQuestionLength'
    }),
    questionInputMode() {
      switch (this.question.input_mode) {
        case InputMode.MULTIPLE_CHOICE_INPUT_MODE:
          return "MultipleChoiceView";
        case InputMode.LIKERT_INPUT_MODE:
          return "LikertView";
        case InputMode.SWIPE_INPUT_MODE:
          return "SwipeView";
        case InputMode.MINOR_SWIPE_INPUT_MODE:
          return "MinorSwipeView";
        case InputMode.COGS_SWIPE_INPUT_MODE:
          return "COGsSwipeView";
        case InputMode.SLIDER_INPUT_MODE:
          return "SliderView";
        case InputMode.VAS_INPUT_MODE:
          return "VASView";
        case InputMode.TEXT_BOX_INPUT_MODE:
          return "TextBoxView";
        case InputMode.ELASTIC_PULL_INPUT_MODE:
          return "ElasticPullView";
        case  InputMode.COGS_ELASTIC_PULL_INPUT_MODE:
          return "COGsElasticPullView";
        default:
          return "MultipleChoiceView";
      }
    },
    questionTitleImage() {
      if (this.questionInputMode == "MultipleChoiceView") { // TODO: Image Choice
        return this.question.title_image ? this.question.title_image : null;
      }
      else {
        return null;
      }
    }

  },
  components: {
    SwipeView: Swipe,
    MinorSwipeView: MinorSwipe,
    COGsSwipeView: COGsSwipe,
    ElasticPullView: ElasticPull,
    COGsElasticPullView: COGsElasticPull,
    SliderView: Slider,
    VASView: VAS,
  }
}