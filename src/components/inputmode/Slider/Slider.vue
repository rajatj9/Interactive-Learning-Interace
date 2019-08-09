<template>
  <div class="scale-wrapper slider-wrapper sketchpad-container slider-container"
       ref="sketchpad" :id="'sketchpad'+id">
    <!--initialise: slider operation tips-->
    <touch-tips v-if="isTipsShowing" :width="sketchpadWidth"
                :top="top+sliderTranslateY-chartSetting.sliderStrokeWidth*1.2"
                :text="'TOUCH SLIDER TO BEGIN'"
                @touch="handleTouchTips($event)"></touch-tips>
    <!--slider sketchpad-->
    <div class="sketchpad-container" ref="sketchpad" :style="touchTipsFilterStyle">
      <div :id="'top-axis-'+id" class="axis top-axis">
        <div class="descriptor-container slider-descriptor-text"
             v-for="(value, index) in standardScale"
             :style="getTopAxisStyle(value)" :key="index">
          {{ scaleParser.getScaleValue(value) }}
        </div>
      </div>
      <svg ref="svg" :id="'svg'+id" :width="sketchpadWidth" :height="sketchpadHeight">
        <defs-elements :slider="true"></defs-elements>
        <!--slider tooltip-->
        <g class="slider-tooltip" :transform="tooltipTranslate">
          <text class="slider-tooltip" :id="'tooltip'+id"
                :style="{'opacity': tooltipOpacityScale(getPreviousVisualValue())}">
            {{ scaleParser.getScaleValue(value).toFixed(1) }}
          </text>
        </g>

        <!--slider-->
        <g :id="'slider'+id" class="slider chart"
           :transform="'translate(' + sliderTranslateX + ',' + sliderTranslateY +')'">
          <!--slider tray-->
          <rect :id="'tray'+id" :x="-sliderStrokeOffset" :y="-sliderStrokeOffset"
                :rx="sliderStrokeOffset" :ry="sliderStrokeOffset"
                :height="chartSetting.sliderStrokeWidth"
                :width="sliderWidth+chartSetting.sliderStrokeWidth"
                fill="url(#gradientSlider)"></rect><!--filter="url(#sliderShadow)"></rect>-->
          <line :id="'trough'+id" class="slider-trough" :x2="sliderWidth"
                :style="{'stroke-width': (chartSetting.sliderStrokeWidth+1)+'px'}"></line>
          <!--slider handler-->
          <g v-show="!(value===null)" :id="'handler'+id">
            <circle class="slider-track" cx="0" cy="0" :r="sliderStrokeOffset+1"></circle>
            <circle class="slider-shapeBall" cx="0" cy="0"
                    :r="sliderStrokeOffset*1.5" filter="url(#lineShadow)"></circle>
            <circle class="slider-scoreBall" cx="0" cy="0"
                    :r="sliderStrokeOffset*0.85" filter="url(#insetShadow)"></circle>
          </g>
          <!--slider touch overlay-->
          <line :id="'overlay'+id" class="slider-overlay" x1="0" :x2="sliderWidth" ref="overlay"
                :style="{'stroke-width': (chartSetting.sliderStrokeWidth*2.7)+'px'}"></line>
        </g>
      </svg>
      <!--rotated descriptions in question component-->
      <div v-if="!showRotatedDescription" :id="'bottom-axis-'+id" class="axis bottom-axis">
        <div class="slider-descriptor-text descriptor-container"
             v-for="(value, index) in standardScale"
             :style="getBottomAxisStyle(value)" :key="'d'+index">
          {{ scaleParser.getDescription(value) }}
        </div>
      </div>
      <!--rotated descriptions in answer component-->
      <div v-if="isAnswerPanel" class="x axis slider-rotation-axis" :style="rotationDescriptionStyle">
        <div class="slider-rotation-descriptor-text" v-for="(value, index) in standardScale"
             :key="'description'+index" :style="getRotatedDescriptionStyle(value)" ref="rotationTick">
          {{ scaleParser.getDescription(value) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  const d3 = Object.assign({}, require("d3-selection"), require("d3-scale"), require("d3-drag"),
      require("d3-interpolate"), require("d3-shape"), require("d3-ease"), require("d3-transition"));
  import {event as currentEvent} from 'd3-selection';
  import {inputScaleMixin} from "@/mixins/inputScale";
  import {sketchPadMixin} from "@/mixins/sketchPad";
  import {touchTipsMixin} from "@/mixins/touchTips";
  import {sliderMixin} from "./slider";
  import * as Detector from "@/utiljs/detection";

  export default {
    name: "Slider",
    mixins: [inputScaleMixin, sketchPadMixin, touchTipsMixin, sliderMixin],
    data() {
      return {
        tooltipElem: null,
        topAxis: null,

        isDragging: false,
        clickAnimationTime: 80
      }
    },
    watch: {
      value(new_val, old_val) {
        if (!old_val) {
          this.clickAnimationTime = 360;
        }
      }
    },
    computed: {
      tooltipOpacityScale() {
        let tOpacityScale = d3.scaleLinear()
            .domain([0, 0.2, 0.8, 1])
            .range([0, 1, 1, 0]);
        return (value) => {
          let decimal = value % 1;
          return tOpacityScale(decimal);
        }
      },
      tooltipTranslate() {
        return 'translate(' + (this.sliderTranslateX - this.axisFontWidth * 0.5) + ','
            + (this.sliderTranslateY - this.chartSetting.tooltipMarginBottom - this.axisFontHeight * 1.15) + ')';
      },
    },
    methods: {
      positionHandler() {
        return this.detector.positionHandler();
      },
      setSliderElements() {
        this.svg = d3.select(this.$refs.svg);
        this.slider = this.svg.select('#slider' + this.id);
        this.handler = this.slider.select('#handler' + this.id);
        this.tooltipElem = this.svg.select("#tooltip" + this.id);
        this.topAxis = d3.select(this.$refs.sketchpad).select("#top-axis-" + this.id)
            .selectAll(".slider-descriptor-text");
        this.bottomAxis = d3.select(this.$refs.sketchpad).select("#bottom-axis-" + this.id)
            .selectAll(".slider-descriptor-text");
        this.sketchpad = d3.select(this.$refs.sketchpad);
      },
      updateAxisStyle(elements, transition, value) {
        let slider = this;
        elements.data(this.standardScale)
            .transition(transition)
            .style("color", function (d) {
              return d == value && slider.isUpdated ? slider.trackColorScale(value) : "#C1BFD0";
            })
            .style("font-weight", function (d) {
              return d == value && slider.isUpdated ? "bold" : 500;
            })
            .style("opacity", function (d) {
              return d == value && slider.isUpdated ? slider.opacityScale(value) + 0.25 : 1;
            });
      },
      updateTooltipText(element, time, value, isClicked) {
        let transition = d3.transition()
            .duration(time)
            .ease(d3.easeLinear);
        if (isClicked) {
          var sketchPad = this;
          element.transition(transition)
              .attr("dx", this.xScale(value))
              .style("fill", this.trackColorScale(value))
              .on("start", function () {
                if (isClicked) {
                  d3.active(this)
                      .tween("text", function () {
                        var that = d3.select(this),
                            i = d3.interpolateNumber(that.text(),
                                sketchPad.scaleParser.getScaleValue(value));
                        return function (t) {
                          that.text((i(t)).toFixed(1));
                        };
                      })
                }
              });

          let updateOpacity = setInterval(function () {
            element.style("opacity", sketchPad.tooltipOpacityScale(
                sketchPad.getPreviousVisualValue()));
          }, 10);
          setTimeout(function () {
            clearInterval(updateOpacity);
            element.style("opacity", sketchPad.tooltipOpacityScale(sketchPad.value));
          }, time);
        }
        else {
          element.transition(transition)
              .attr("dx", this.xScale(value))
              .style("fill", this.trackColorScale(value))
              .style("opacity", this.tooltipOpacityScale(value))
              .text(this.scaleParser.getScaleValue(value).toFixed(1))
        }
      },
      updateChart(time, value, isClicked) {
        if (!value) {
          value = this.value;
        }
        return new Promise((resolve) => {
          let visualTransition = d3.transition()
              .duration(time)
              .ease(d3.easeLinear);

          // slider
          this.slider.select("#tray" + this.id)
              .transition(visualTransition)
              .style("opacity", this.opacityScale(value));
          this.slider.select("#trough" + this.id)
              .transition(visualTransition)
              .attr("x1", this.xScale(value));
          this.handler.transition(visualTransition)
              .attr("transform", "translate(" + this.xScale(value) + ", 0)");
          this.handler.select(".slider-track")
              .transition(visualTransition)
              .style("fill", this.trackColorScale(value))
              .style("opacity", this.opacityScale(value));

          // tooltip
          this.updateTooltipText(this.tooltipElem, time, value, isClicked)

          // axis
          this.updateAxisStyle(this.topAxis, visualTransition, value);
          this.updateAxisStyle(this.bottomAxis, visualTransition, value);
          resolve();
        })
      },
    },
    mounted() {
//        console.log("Slider mount", Date.now())
      this.getSketchpadSize();
      let sketchPad = this;
      this.setSliderElements();

      if (!this.isAnswerPanel) {
        if (this.$store.getters.getAnswerValueById(this.id) !== null) {
          this.value = this.scaleParser.getStandardValue(this.$store.getters.getAnswerValueById(this.id));
        }
        else if (this.$store.getters.getAnswerValueById(this.id) === null) {
          this.isTipsShowing = true;
        }
        this.detector = new Detector.Drag();
        this.detector.setPositionHandler(this.isIOS ? () => {
          // Drag get position adjust to IOS portrait
          if (window.matchMedia("(orientation: portrait)").matches) {
            return [-currentEvent.y - sketchPad.sliderTranslateX - sketchPad.sliderTranslateY,
              currentEvent.x + sketchPad.sliderTranslateX - sketchPad.sliderTranslateY];
          }
          else {
            return [currentEvent.x, currentEvent.y]
          }
        } : () => {
          return [currentEvent.x, currentEvent.y];
        });

        let sliderOverlay = this.slider.select("#overlay" + this.id);
        sliderOverlay.call(d3.drag()
            .on("start", () => {
//                    console.log("dragstarted");
              this.sketchpad.selectAll("*").interrupt();
//                    console.log("visual",sketchPad.getPreviousVisualValue(), sketchPad.value)
              let visualValue = sketchPad.getPreviousVisualValue();
              if (sketchPad.value != visualValue && visualValue) {
                sketchPad.value = visualValue;
              }
              if (Math.abs(sketchPad.getEventValue() - sketchPad.value) <= 0.2) { // 0.15
                sketchPad.isDragging = true;
                sketchPad.detector.startDetect();
                sketchPad.$store.dispatch("startDetectById", {
                  id: sketchPad.id,
                  value: sketchPad.scaleParser.getScaleValue(sketchPad.value)
                });
              }
            })
            .on("drag", () => {
//                    console.log("dragged");
              if (sketchPad.isDragging) {
                sketchPad.detector.trackDetect();
                sketchPad.value = sketchPad.getEventValue();
                sketchPad.updateChart(10);
              }
            })
            .on("end", () => {
//                    console.log("dragended");
              if (sketchPad.isDragging) {
                let roundValue = sketchPad.toPrecision(sketchPad.value, 1);
                if (!sketchPad.isUpdated) {
                  sketchPad.isUpdated = true;
                }
                sketchPad.detector.endDetect();
                sketchPad.$store.dispatch("updateAnswerById", {
                  id: sketchPad.id,
                  value: {
                    value: sketchPad.scaleParser.getScaleValue(roundValue),
                    detector: sketchPad.detector
                  }
                })
                    .then(() => {
                      sketchPad.detector.reset();
                      sketchPad.$store.dispatch("endDetectById", sketchPad.id)
                    });
                let transitionTime = Math.abs(sketchPad.value - roundValue) * 1000;
                sketchPad.value = roundValue;
                sketchPad.updateChart(transitionTime, sketchPad.value, true)
              }
              sketchPad.isDragging = false;
            }));
        sliderOverlay.on("click", () => {
          sketchPad.clickEvent(sketchPad);
        });
      }
      else {
        if (this.answer !== null) {
          this.value = this.scaleParser.getStandardValue(this.answer);
          this.isUpdated = true;
        }
      }
      this.updateChart(0)
//        console.log("end swipe mount", Date.now())
    },
  }
</script>

<style scoped>
  @import url("../../../assets/CSS/sketchpad.css");
  @import url("../../../assets/CSS/slider.css");
</style>