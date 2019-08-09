import {mapGetters} from "vuex";
import {ScaleParser} from "../utiljs/scaleParser";

export const sketchPadMixin = {
  props: {
    height: {
      type: Number,
      required: true
    },
    width: {
      type: Number,
      required: true
    },
    top: {
      type: Number,
      required: false,
      default: 0
    },
    isAnswerPanel: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    var max = Object.keys(this.scale).length - 1;
    return {
      value: null,
      sketchpadWidth: 0,
      sketchpadHeight: 0,
      standardMin: 0,
      standardMax: max,
      scaleParser: new ScaleParser(this.scale),
      standardScale: Array.from(new Array(max + 1), (val, index) => index),
      showRotatedDescription: false,
      rotationTickElems: null
    }
  },
  computed: {
    ...mapGetters({
      axisFontHeight: "axisFontHeight",
      axisFontWidth: "axisFontWidth",
      isIOS: 'isIOS'
    }),
    evenDescriptionWidth() {
      return this.sketchpadWidth / (this.standardMax + 1)
    },
    scaleDescriptionSize() {
      let descriptionLength = this.scale.map(x => x.title.length);
      return {
        length: descriptionLength.reduce((a, b) => a + b) / descriptionLength.length,
        line: descriptionLength.map(x => x * this.axisFontWidth / this.descriptionLength)
      }
    },
    maxRotationDescriptionWidth() {
      return this.scaleDescriptionSize.length * this.axisFontWidth * 0.4;
    },
    maxRotationDescriptionHeight() {
      return this.scaleDescriptionSize.line.reduce((a, b) => a > b ? a : b)
    }
  },
  methods: {
    getSketchpadSize() {
      this.sketchpadWidth = this.$refs.sketchpad.clientWidth;
      this.sketchpadHeight = this.$refs.sketchpad.clientHeight;
      if (this.detector && this.detector.updateSrcElementSize) {
        this.detector.updateSrcElementSize(this.sketchpadWidth, this.sketchpadHeight)
      }
    }
  },
  watch: {
    width() {
      this.getSketchpadSize();
      if (this.isAnswerPanel) {
        this.showRotatedDescription = (this.evenDescriptionWidth < this.maxRotationDescriptionWidth)
            || (Math.round(this.maxRotationDescriptionHeight) >= 5);
      }
      this.updateChart(0);
    },
    height() {
      this.getSketchpadSize();
      this.updateChart(0);
    }
  }
}
