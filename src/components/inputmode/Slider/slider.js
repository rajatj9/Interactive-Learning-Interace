const d3 = Object.assign({}, require("d3-selection"), require("d3-scale"), require("d3-drag"),
    require("d3-interpolate"), require("d3-shape"), require("d3-ease"), require("d3-transition"));
import Defs from '../../util/Defs.vue';

export const sliderMixin = {
  components: {
    DefsElements: Defs,
  },
  data() {
    return {
      detector: null,
      svg: null,
      sketchpad: null,
      slider: null,
      handler: null,
      bottomAxis: null,

      isUpdated: false,
      chartSetting: {
        paddingWidth: 10,
        axisMargin: 5,
        axisDescriptionFontSize: 14,
        sliderStrokeWidth: 20,
        tooltipMarginBottom: 5,
      }
    }
  },
  computed: {
    sliderTranslateX() {
      return this.chartSetting.paddingWidth * this.sketchpadWidth * 0.008;
    },
    sliderTranslateY() {
      return this.sketchpadHeight * 0.5;
    },
    sliderWidth() {
      if (this.sketchpadWidth > 0) {
        return this.sketchpadWidth - this.sliderTranslateX * 2;
      }
      return 0;
    },
    sliderStrokeOffset() {
      return this.chartSetting.sliderStrokeWidth * 0.5;
    },
    descriptionLength() {
      return this.sliderWidth / (this.standardMax + 1) * 0.8;
    },
    xScale() {
      return d3.scaleLinear()
          .domain([0, this.standardMax])
          .range([0, this.sliderWidth])
          .clamp(true);
    },
    opacityScale() {
      return d3.scaleLinear()
          .domain([0, this.standardMax])
          // .range([0.25, 0.75])
          .range([0.7, 0.75])
          .clamp(true);
    },
    trackColorScale() {
      return d3.scaleLinear()
          .domain([0, this.standardMax])
          // .range(["#A66EDF", "#4A90E2"]);
          .range(["#424242", "#404040"]);
    },
    rotationDescriptionStyle() {
      return {
        'margin-left': this.sliderTranslateX + 'px',
        'margin-top': (-this.sliderTranslateY - this.chartSetting.axisMargin
            + this.axisFontHeight - this.chartSetting.axisMargin) + "px",
        'height': this.showRotatedDescription ?
            (this.scaleDescriptionSize.length * this.axisFontWidth * 0.36) + 'px' : 0 + 'px',
        'opacity': this.showRotatedDescription ? 1 : 0
      }
    }
  },
  methods: {
    getTopAxisStyle(value) {
      return Object.assign(this.getAxisPositionStyle(value), {
        top: (this.sliderTranslateY - this.chartSetting.axisMargin
            - this.axisFontHeight - this.chartSetting.sliderStrokeWidth) + "px",
      })
    },
    toPrecision(val, place) {
      return parseFloat(val.toFixed(place))
    },
    getAxisPositionStyle(value) {
      return {
        width: this.descriptionLength + "px",
        left: (this.sliderTranslateX + this.xScale(value)
            - this.descriptionLength * 0.5 - this.descriptionLength * value) + 'px'
      }
    },
    getBottomAxisStyle(value) {
      return Object.assign(this.getAxisPositionStyle(value), {
//                top: (-offsetY + this.chartSetting.axisMargin * 2 + this.axisFontHeight ) + "px",
        top: (-this.sliderTranslateY + this.chartSetting.axisMargin * 2 + this.axisFontHeight) + "px",
      })
    },
    getEventValue() {
      return this.xScale.invert(this.detector.positionHandler()[0]);
    },
    getPreviousVisualValue() {
      let handler = this.handler; // d3.select("#handler" + this.id);
      if (handler) {
        if (!handler.empty()) {
          let transform = handler.attr("transform");
          if (transform) {
            // let translate = transform.replace(/[translate|\(|\)]/g, "").split(",");
            let translate = transform.replace(/[translate|\\(|\\)]/g, "").split(",");
            return this.xScale.invert(parseFloat(translate[0]));
          }
        }
      }
      return 0;
    },
    getRotatedDescriptionStyle(value) {
      if (this.$refs.rotationTick) {
        if (!this.rotationTickElems) {
          this.rotationTickElems = this.$refs.rotationTick.map(x => x.clientWidth)
        }
        let result = 0;
        for (var i = 0; i < value; i++) {
          result += this.rotationTickElems[i]
        }
        return {
          top: (this.maxRotationDescriptionWidth < this.rotationTickElems[i]) ? '-0.9rem' : '-0.3rem',
          left: (this.xScale(value) - result) + 'px',
          width: (this.maxRotationDescriptionWidth < this.rotationTickElems[i]) ?
              this.maxRotationDescriptionWidth + 'px' : 'max-content'

        }
      }
      return {
        top: '-0.3rem',
        left: 0 + 'px'
      }
    },
    clickEvent(sketchPad) {
      console.log("click");
      this.sketchpad.selectAll("*").interrupt();
      let position = d3.mouse(sketchPad.$refs.overlay);
      // Click get position adjust to IOS portrait
      if (sketchPad.isIOS && window.matchMedia("(orientation: portrait)").matches) {
        position = [-position[1] - sketchPad.sliderTranslateX - sketchPad.sliderTranslateY,
          position[0] + sketchPad.sliderTranslateX - sketchPad.sliderTranslateY];
      }
      sketchPad.value = sketchPad.toPrecision(sketchPad.xScale.invert(position[0]), 1);
      if (!sketchPad.isUpdated) {
        sketchPad.isUpdated = true;
      }
      sketchPad.$store.dispatch("updateAnswerById", {
        id: sketchPad.id,
        value: {
          value: sketchPad.scaleParser.getScaleValue(sketchPad.value),
          position: sketchPad.positionHandler(position)
        }
      })
      sketchPad.updateChart(sketchPad.clickAnimationTime, sketchPad.value, true);
    },
    handleTouchTips(val) {
      this.isTipsShowing = val;
    },
  },
}