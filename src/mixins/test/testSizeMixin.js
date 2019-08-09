import {mapGetters} from 'vuex';

export const sizeMixin = {
  data() {
    return {
      width: 0,
      height: 0,

      elementWidth: 0,
      windowWidth: 0,
      bodyWidth: 0,
      elementHeight: 0,
      windowHeight: 0,
      bodyHeight: 0
    }
  },
  computed: {
    ...mapGetters({
      isIOS: 'isIOS',
      appBrowser: 'appBrowser'
    }),
  },
  methods: {
    getWindowSize() {
      var w = window,
          d = document,
          e = d.documentElement,
          g = d.getElementsByTagName('body')[0];
      this.elementWidth = e.clientWidth;
      this.windowWidth = w.innerWidth;
      this.bodyWidth = g.clientWidth;
      this.elementHeight = e.clientHeight;
      this.windowHeight = w.innerHeight;
      this.bodyHeight = g.clientHeight;

      this.width = this.elementWidth || this.windowWidth || this.bodyWidth;
      this.height = (this.width > this.elementHeight && this.width > this.windowHeight) ?
          Math.min(this.elementHeight, this.windowHeight) :
          Math.max(this.elementHeight, this.windowHeight);
      if (!this.isIOS) {
        if (!(this.elementHeight == this.windowHeight == this.bodyHeight)) {
          this.height = this.windowHeight;
        }
      }
      console.log(this.width, this.height)
    }
  },
  mounted() {
    this.getWindowSize();
    window.addEventListener('resize', this.getWindowSize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.getWindowSize);
  }
}