<template>
  <div class="scale-wrapper slider-wrapper sketchpad-container slider-container"
       ref="sketchpad" :id="'sketchpad'+id">
    <!--initialise: VAS operation tips-->
    <touch-tips v-if="isTipsShowing" :width="sketchpadWidth"
                :top="top+sliderTranslateY-chartSetting.sliderStrokeWidth*1.2"
                :text="'TAP ON THE SCALE TO BEGIN'"
                @touch="handleTouchTips($event)"></touch-tips>
    <!--VAS sketchpad-->
    <div class="sketchpad-container" ref="sketchpad" :style="touchTipsFilterStyle">
      <div :id="'top-axis-'+id" class="axis top-axis">
        <div class="descriptor-container slider-descriptor-text"
             v-for="(value, index) in standardScale"
             :style="getTopAxisStyle(value)" :key="index">
          {{ scaleParser.getScaleValue(value) }}
        </div>
      </div>
      <!--VAS track-->
      <svg ref="svg" :id="'svg'+id" :width="sketchpadWidth" :height="sketchpadHeight">
        <defs-elements :slider="true"></defs-elements>

        <!--slider (VAS)-->
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

      <!--TODO-->
      <!--rotated descriptions in question component-->
      <div v-if="!showRotatedDescription" :id="'bottom-axis-'+id" class="axis bottom-axis">
        <div class="slider-descriptor-text descriptor-container vas-description"
             v-for="(value, index) in standardScale"
             :style="getBottomAxisStyle(value)" :key="'d'+index">
          {{ scaleParser.getDescription(value) }}
        </div>
      </div>
      <!--rotated descriptions in answer component-->
      <div v-if="isAnswerPanel" class="x axis slider-rotation-axis" :style="rotationDescriptionStyle">
        <div class="slider-rotation-descriptor-text vas-description" v-for="(value, index) in standardScale"
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
  import {inputScaleMixin} from "@/mixins/inputScale";
  import {sketchPadMixin} from "@/mixins/sketchPad";
  import {touchTipsMixin} from "@/mixins/touchTips";
  import {sliderMixin} from "./slider";

  export default {
    name: 'VAS',
    mixins: [inputScaleMixin, sketchPadMixin, touchTipsMixin, sliderMixin],
    data() {
      return {
        clickAnimationTime: 50
      }
    },
    computed: {
      tapPositionOffsetY() {
        return this.$refs.sketchpad.getBoundingClientRect().y + this.sliderTranslateY;
      },
      tapPositionOffsetX() {
        var offsetX = this.$refs.sketchpad.getBoundingClientRect().x;
        if (offsetX > 0) {
          while (offsetX > window.innerWidth) {
            offsetX -= window.innerWidth
          }
        }
        else {
          while (offsetX < 0) {
            offsetX += window.innerWidth
          }
        }
        return offsetX + this.sliderTranslateX;
      }
    },
    methods: {
      positionHandler(val) {
        return [val[0] + this.tapPositionOffsetX, val[1] + this.tapPositionOffsetY]
      },
      setSliderElements() {
        this.svg = d3.select(this.$refs.svg);
        this.slider = this.svg.select('#slider' + this.id);
        this.handler = this.slider.select('#handler' + this.id);
        this.bottomAxis = d3.select(this.$refs.sketchpad).select("#bottom-axis-" + this.id)
            .selectAll(".slider-descriptor-text");
        this.sketchpad = d3.select(this.$refs.sketchpad);
      },
      updateChart(time, value) {
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
          resolve();
        })
      },
    },
    mounted() {
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
        let sliderOverlay = this.slider.select("#overlay" + this.id);
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
    },
  }
</script>

<style>
  @import url("../../../assets/CSS/sketchpad.css");
  @import url("../../../assets/CSS/slider.css");

  .vas-description {
    font-weight: 600;
  }
</style>