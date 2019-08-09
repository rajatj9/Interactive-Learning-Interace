<template>
  <div class="scale-wrapper swipe-wrapper sketchpad-container" ref="sketchpad">
    <!--initialise: swipe operation tips-->
    <touch-tips v-if="isTipsShowing" :width="sketchpadWidth"
                :top="tipsPositionTop"
                :text="'TOUCH SCREEN TO BEGIN'"
                @touch="handleTouchTips($event)"></touch-tips>
    <!--swipe sketchpad-->
    <div class="sketchpad-container" ref="sketchpad" :style="COGsSketchPadStyle">
      <svg ref="svg" :id="'svg'+id" :width="sketchpadWidth" :height="COGsPadHeight">
        <defs-elements></defs-elements>
        <!--axis-->
        <g class="y axis" :transform="yAxisTransform">
          <text v-for="(value, index) in standardScale" dy="0.32em" :y="yScale(value)"
                :key="index">{{ scaleParser.getScaleValue(value) }}
          </text>
        </g>
        <g class="x axis" :transform="xAxisTransform" v-if="!showDescription">
          <text v-for="(value, index) in standardScale" dx="-0.32em" :dy="axisFontHeight"
                :x="xScale(value)" :key="index">{{ scaleParser.getScaleValue(value) }}
          </text>
        </g>
        <g class="ticks">
          <g class="y axis" :transform="yAxisTransform">
            <line class="minor-tick" v-for="(value, index) in yTicksData" :key="'yMinorTick_'+index"
                  :x1="yAxisXRight" :x2="yAxisXRight-chartSetting.axisMinorTickLength"
                  :y1="yScale(value)" :y2="yScale(value)"></line>
            <line class="major-tick" v-for="(value, index) in standardScale" :key="'yMajorTick_'+index"
                  :x1="yAxisXRight" :x2="yAxisXRight-chartSetting.axisMajorTickLength"
                  :y1="yScale(value)" :y2="yScale(value)"></line>
          </g>
          <g class="x axis" :transform="xAxisTransform">
            <line class="minor-tick" v-for="(value, index) in xTicksData" :key="'xMinorTick_'+index"
                  :x1="xScale(value)" :x2="xScale(value)"
                  :y1="xTicksYTop" :y2="xTicksYTop+chartSetting.axisMinorTickLength"></line>
            <line class="major-tick" v-for="(value, index) in standardScale" :key="'xMajorTick_'+index"
                  :x1="xScale(value)" :x2="xScale(value)"
                  :y1="xTicksYTop" :y2="xTicksYTop+chartSetting.axisMajorTickLength"></line>
          </g>
        </g>

        <g class="chart" :transform="chartTransform">
          <!--base lines and grid-->
          <g class="grid">
            <line v-for="(value, index) in standardScale" :key="'rect'+index" :x1="xScale(0)"
                  :x2="lineWidth" :y1="yScale(value)" :y2="yScale(value)"
                  :class="{ 'baseGrid': value == 0}"></line>
          </g>
          <!--visual histogram-->
          <g :id="'histogram'+id" class="histogram">
            <rect class="bar-rect" v-for="(value, index) in minorBarsData" :key="'bar-rect'+index"
                  style="display: inline-block;" :x="xScale(value) - minorBarsWidth * 0.5" :y="yScale(0)"
                  :width="minorBarsWidth" height="0"></rect>
            <!--filter="url(#lineShadow)"-->
          </g>
          <line class="axis" :x1="xScale(0)" :y1="yScale(0)" :y2="yScale(0)" :x2="lineWidth"></line>
          <line class="axis" :x1="xScale(0)" :y1="yScale(0)"
                :x2="xScale(0)" :y2="yScale(standardMax)-ballRadius.max*0.5"></line>
          <path class="growth-line shadow" marker-end="url(#arrow)" filter="url(#lineShadow)"
                :d="growthLinePath"></path>

          <g class="visual">
            <!--tooltip-->
            <g v-show="!(value===null)&&value!=0" :id="'tooltip'+id" class="cogs-major-tooltip"
               :transform="'translate(' + tooltipTransformX(0) + ',' + tooltipTransformY(0) + ')'">
              <rect :y="-tooltip.offsetY"
                    :rx="tooltip.height*0.5" :ry="tooltip.height*0.5"
                    :width="tooltip.width" :height="tooltip.height"
                    filter="url(#tooltipShadow)"/>
              <text class="cogs-tooltipText" :style="{ 'font-size': tooltip.fontSize + 'px'}"
                    letter-spacing="2" :x="tooltip.offsetX" :y="tooltip.offsetY">
                {{ scaleParser.getScaleValue(value).toFixed(1) }}
              </text>
            </g>
            <!-- COGs gear -->
            <g class="gear gear_style"
               v-show="!(value===null)"
               ref="gear" :id="'gear'+id"></g>
          </g>
        </g>
      </svg>
      <!--rotated descriptions in question component-->
      <div v-if="!showRotatedDescription" class="x axis swipe-axis" :style="{ 'opacity': showDescription ? 1: 0}">
        <div class="swipe-descriptor-text" v-for="(value, index) in standardScale"
             :key="'description-text'+index" :style="getDescriptionStyle(value)">
          {{ scaleParser.getDescription(value) }}
        </div>
      </div>
      <!--rotated descriptions in answer component-->
      <div v-if="isAnswerPanel" class="x axis swipe-axis rotation-axis" :style="rotationDescriptionStyle">
        <div class="rotation-descriptor-text" v-for="(value, index) in standardScale"
             :key="'description'+index" :style="getRotatedDescriptionStyle(value)" ref="rotationTick">
          {{ scaleParser.getDescription(value) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {inputScaleMixin} from "@/mixins/inputScale";
  import {sketchPadMixin} from "@/mixins/sketchPad";
  import {touchTipsMixin} from "@/mixins/touchTips";
  import {chartMixin} from "./chart";
  import {swipeMixin} from "./swipe";
  import {minorBarMixin} from "./minorBars";
  import {cogsMixin} from "./cogs";

  export default {
    name: "COGsSwipe",
    mixins: [inputScaleMixin, sketchPadMixin, touchTipsMixin, chartMixin, swipeMixin, minorBarMixin, cogsMixin],
    methods: {
      ballTransition() {
        if (this.gear && this.value !== null) {
          // this.gearTransition(transition);
          this.gearTransition();
        }
      }
    },
    mounted() {
      this.getSketchpadSize();
      this.initializeGear(this.$refs.gear);
      this.ballTransition();
    }
  }
</script>

<style scoped>
  @import url("../../../assets/CSS/sketchpad.css");
  @import url("../../../assets/CSS/swipe.css");
  @import url("../../../assets/CSS/gear.css");

  .gear path {
    /*fill: #800026;*/
    fill: #7f2704;
  }

  .cogs-major-tooltip rect {
    stroke: black;
    stroke-width: 1px;
    fill: #fff;
  }

  .cogs-major-tooltip text {
    stroke: #424242;
    fill: #424242;
  }
</style>