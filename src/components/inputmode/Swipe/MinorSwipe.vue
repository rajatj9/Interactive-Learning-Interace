<template>
  <div class="scale-wrapper swipe-wrapper sketchpad-container" ref="sketchpad">
    <!--initialise: swipe operation tips-->
    <touch-tips v-if="isTipsShowing" :width="sketchpadWidth"
                :top="tipsPositionTop"
                :text="'TOUCH SCREEN TO BEGIN'"
                @touch="handleTouchTips($event)"></touch-tips>
    <!--swipe sketchpad-->
    <div class="sketchpad-container" ref="sketchpad" :style="touchTipsFilterStyle">
      <svg ref="svg" :id="'svg'+id" :width="sketchpadWidth" :height="sketchpadHeight">
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
            <line v-for="(value, index) in standardScale" :key="'line'+index" :x1="xScale(0)"
                  :x2="lineWidth" :y1="yScale(value)" :y2="yScale(value)"
                  :class="{ 'baseGrid': value == 0}"></line>
          </g>
          <!--visual histogram-->
          <g :id="'histogram'+id" class="histogram">
            <rect class="bar-rect" v-for="(value, index) in minorBarsData"
                  :key="'bar-rect'+index" style="display: inline-block;" :x="xScale(value) - minorBarsWidth * 0.5" :y="yScale(0)"
                  :width="minorBarsWidth" height="0"></rect>
            <!--filter="url(#lineShadow)"-->
          </g>
          <line class="axis" :x1="xScale(0)" :y1="yScale(0)" :y2="yScale(0)" :x2="lineWidth"></line>
          <line class="axis" :x1="xScale(0)" :y1="yScale(0)"
                :x2="xScale(0)" :y2="yScale(standardMax)-ballRadius.max*0.5"></line>
          <path class="growth-line shadow" marker-end="url(#arrow)" filter="url(#lineShadow)"
                :d="growthLinePath"></path>

          <g class="visual">
            <!--indicating lines-->
            <g class="baseline" v-if="showBaseline || isStandardValue">
              <line class="marking baseline" :id="'horizontal-baseline'+id"
                    :x1="xScale(0)" :x2="lineWidth" :y1="yScale(value)" :y2="yScale(value)"></line>
              <line class="marking baseline" :id="'vertical-baseline'+id"
                    :x1="xScale(value)" :x2="xScale(value)" :y1="yScale(standardMax)" :y2="yScale(0)"></line>
            </g>
            <line :id="'horizontal'+id" class="marking" :x1="xScale(0)"></line>
            <line :id="'vertical'+id" class="marking" :y1="yScale(0)"></line>
            <!--tooltip-->
            <g v-show="!(value===null)&&value!=0" :id="'tooltip'+id" class="major-tooltip"
               :transform="'translate(' + tooltipTransformX(0) + ',' + tooltipTransformY(0) + ')'">
              <rect :y="-tooltip.offsetY"
                    :rx="tooltip.height*0.5" :ry="tooltip.height*0.5"
                    :width="tooltip.width" :height="tooltip.height"
                    filter="url(#tooltipShadow)"/>
              <text class="tooltipText" :style="{ 'font-size': tooltip.fontSize + 'px'}"
                    letter-spacing="2" :x="tooltip.offsetX" :y="tooltip.offsetY">
                {{ scaleParser.getScaleValue(value).toFixed(1) }}
              </text>
            </g>
            <!--ball-->
            <g v-show="!(value===null)" :id="'ball'+id">
              <circle :id="'shapeBall'+id" class="swipeShapeBall" cx="0" cy="0"
                      filter="url(#lineShadow)"></circle>
              <circle :id="'scoreBall'+id" class="scoreBall" cx="0" cy="0"></circle>
            </g>
          </g>
        </g>
      </svg>
      <!--rotated descriptions in question component-->
      <div v-if="!showRotatedDescription" class="x axis swipe-axis" :style="{ 'opacity': showDescription ? 1: 0}">
        <div class="swipe-descriptor-text" v-for="(value, index) in standardScale"
             :key="'descrption-text'+index" :style="getDescriptionStyle(value)">
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
  import {swipeMixin} from "./swipe";
  import {chartMixin} from "./chart";
  import {minorBarMixin} from "./minorBars";

  export default {
    name: "MinorSwipe",
    mixins: [inputScaleMixin, sketchPadMixin, touchTipsMixin, chartMixin, swipeMixin, minorBarMixin]
  }
</script>

<style scoped>
  @import url("../../../assets/CSS/sketchpad.css");
  @import url("../../../assets/CSS/swipe.css");
</style>