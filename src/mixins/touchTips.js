import TouchTips from '../components/util/WarningTouchTips';

export const touchTipsMixin = {
  components: {
    TouchTips
  },
  data() {
    return {
      isTipsShowing: false
    }
  },
  methods: {
    handleTouchTips(val) {
      var vm = this;
      this.isTipsShowing = val;
      this.value = 0;
      this.$store.dispatch("initializeAnswerById", {
        id: vm.id,
        value: vm.scaleParser.getScaleValue(0)
      })
    }
  },
  computed: {
    touchTipsFilterStyle() {
      return this.isTipsShowing ? {
        filter: 'blur(2px)'
      } : {}
    }
  }
}