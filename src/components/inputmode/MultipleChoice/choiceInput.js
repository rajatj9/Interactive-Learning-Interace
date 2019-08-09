import {mapGetters} from 'vuex';

export const choiceInputMixin = {
  data() {
    return {
      value: ''
    }
  },
  computed: {
    ...mapGetters({
      isShowingModal: 'isShowingModal',
      isIOS: 'isIOS'
    }),
    optionsContainerStyle() {
      if (this.isShowingModal) {
        return {
          '-webkit-overflow-scrolling': 'auto'
        };
      }
      else {
        return {
          '-webkit-overflow-scrolling': 'touch'
        };
      }
    }
  },
  methods: {
    update() {
      this.$store.dispatch('updateAnswerById', {
        id: this.id,
        value: this.value
      })
    },
    getRadioId(seq) {
      return 'radio_' + this.id + '_' + seq;
    },
    enableScroll(event) {
      event.stopPropagation();
    }
  },
}