const d3 = Object.assign({}, require("d3-selection"), require("d3-transition"));
import * as Detector from "../../../utiljs/detection";
import * as Calculator from "../../../utiljs/calculation";

export const swipeMixin = {
  data() {
    return {
      test_color: '',
      calculator: new Calculator.Swipe(Object.keys(this.scale).length - 1),
      detector: null,
    }
  },
  methods: {
    getCurrentValue() {
      return this.calculator.mapDistanceToStandardScale(this.detector.sumDistance)
    },
    ballTransition(transition) {
      this.ball.transition(transition)
          .attr("transform", "translate(" + this.xScale(this.value) + ","
              + this.yScale(this.value) + ")");
      this.ball.select("#shapeBall" + this.id)
          .transition(transition)
          .style("opacity", this.ballOpacity(this.value))
          .attr("r", this.radiusScale(this.value * 0.75) + 2);
      this.ball.select("#scoreBall" + this.id)
          .transition(transition)
          .style("opacity", this.ballOpacity(this.value * 1.25))
          .attr("r", this.radiusScale(this.value * 0.5));
    },
  },
  mounted() {
    // console.log("Swipe mount", Date.now())
    this.getSketchpadSize();
    let sketchPad = this;
    this.setBasicShapeElements();
    // when answer value is not null, set chart & detect distance
    if (!this.isAnswerPanel) {
      if (this.$store.getters.getAnswerValueById(this.id)) {
        this.value = this.scaleParser.getStandardValue(this.$store.getters.getAnswerValueById(this.id));
        this.detector = new Detector.Swipe(this.sketchpadWidth, this.sketchpadHeight,
            this.calculator.mapStandardScaleToDistance(this.value))
      }
      else {
        if (this.$store.getters.getAnswerValueById(this.id) === null) {
          this.isTipsShowing = true;
        }
        else {
          this.value = this.scaleParser.getStandardValue(this.$store.getters.getAnswerValueById(this.id));
        }
        this.detector = new Detector.Swipe(this.sketchpadWidth, this.sketchpadHeight, 0);
        // var vm = this;
        // this.$store.dispatch("initializeAnswerById", {
        //         id: vm.id,
        //         value: vm.scaleParser.getScaleValue(0)
        //     })
      }

      if (!this.isIOS) {
        this.detector.setPositionHandler(() => {
          var position = d3.mouse(sketchPad.$refs.svg);
          return position;
        });
      }
      else {
        this.detector.setPositionHandler(() => {
          var position = d3.mouse(sketchPad.$refs.svg);
          if (window.matchMedia("(orientation: portrait)").matches) {
            position = [-position[1], position[0]]
          }
          return position;
        });
      }

      this.detector.setThreshold((dis) => {
        return dis > 0 && sketchPad.calculator
            .mapDistanceToStandardScale(dis) <= sketchPad.standardMax;
      });
      this.calculator.setShowPauseVisual(() => {
        sketchPad.showBaseline = true;
      });
      this.calculator.setHidePauseVisual(() => {
        sketchPad.showBaseline = false;
      });

      this.svg.on("touchstart", () => {
        // console.log("touch start")
        // sketchPad.toggleDescription();
        sketchPad.test_color = {background: 'yellow'};
        sketchPad.showDescriptionAxis();
        sketchPad.detector.startDetect();
        sketchPad.$store.dispatch("startDetectById", {
          id: sketchPad.id,
          value: sketchPad.scaleParser.getScaleValue(sketchPad.value)
        });
      })
      this.svg.on("touchmove", () => {
        // d3.selectAll("*").interrupt();
        // console.log("touch move")
        sketchPad.detector.trackDetect();
        sketchPad.value = sketchPad.getCurrentValue();
        sketchPad.updateChart(sketchPad.animationTime);
      })
      let endSwipe = () => {
        // sketchPad.toggleDescription();
        sketchPad.test_color = {background: 'orange'};
        sketchPad.hideDescriptionAxis();
        sketchPad.detector.endDetect();
        sketchPad.$store.dispatch("updateAnswerById", {
          id: sketchPad.id,
          value: {
            value: sketchPad.scaleParser.getScaleValue(sketchPad.value),
            detector: sketchPad.detector
          }
        })
            .then(() => {
              sketchPad.detector.reset();
              sketchPad.$store.dispatch("endDetectById", sketchPad.id)
            });
      };
      this.svg.on("touchend", endSwipe);
      this.svg.on("touchcancel", endSwipe);
    }
    else {
      this.showDescription = true;
      if (this.answer) {
        this.value = this.scaleParser.getStandardValue(this.answer);
      }
    }
    this.updateChart(0);
    // console.log("end swipe mount", Date.now())
  },
  beforeDestroy() {
    if (!this.isAnswerPanel) {
      // let svg = d3.select("svg");
      this.svg.on("touchstart", null);
      this.svg.on("touchmove", null);
      this.svg.on("touchend", null);
      this.svg.on("touchcancel", null);
    }
  }
}