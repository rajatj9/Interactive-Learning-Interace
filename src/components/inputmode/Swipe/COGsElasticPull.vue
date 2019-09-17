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
            <line v-for="(value, index) in standardScale" :key="'line'+index" :x1="xScale(0)"
                  :x2="lineWidth" :y1="yScale(value)" :y2="yScale(value)"
                  :class="{ 'baseGrid': value == 0}"></line>
          </g>
          <!--visual histogram-->
          <g :id="'histogram'+id" class="histogram">
            <rect class="bar-rect" v-for="(value, index) in minorBarsData" :key="'rect'+index"
                  style="display: inline-block;" :x="xScale(value) - minorBarsWidth * 0.5"
                  :y="yScale(0)" :width="minorBarsWidth" height="0"></rect>
            <!--filter="url(#lineShadow)"-->
          </g>
          <line class="axis" :x1="xScale(0)" :y1="yScale(0)" :y2="yScale(0)" :x2="lineWidth"></line>
          <line class="axis" :x1="xScale(0)" :y1="yScale(0)"
                :x2="xScale(0)" :y2="yScale(standardMax)-ballRadius.max*0.5"></line>
          <path class="growth-line shadow" marker-end="url(#arrow)" filter="url(#lineShadow)"
                :d="growthLinePath"></path>

          <g class="visual">
            <!--indicating lines-->
            <g class="baseline" v-show="showBaseline || isStandardValue">
              <line class="marking baseline elastic-cog-line"
                    :id="'horizontal-baseline'+id"
                    :x1="xScale(0)" :x2="xScale(value)"
                    :y1="yScale(value) - gearRadiusScale(value)"
                    :y2="yScale(value) - gearRadiusScale(value)"></line>
              <line class="marking baseline elastic-cog-line"
                    :id="'vertical-baseline'+id"
                    :x1="xScale(Math.round(value))"
                    :x2="xScale(Math.round(value))"
                    :y1="yScale(standardMax)"
                    :y2="yScale(0)"></line>
              <!--:y2="yScale(value) - gearRadiusScale(value)"></line>-->
            </g>
            <line v-show="false" :id="'horizontal'+id" class="marking" :x1="xScale(0)"></line>
            <line v-if="false" :id="'vertical'+id" class="marking" :y1="yScale(0)"></line>

            <!--ball-->
            <!--gear-->
            <g class="gear gear_style"
               v-show="!(value===null)"
               ref="gear" :id="'gear'+id"></g>
            <g v-show="!(value===null)" :id="'force'+id" ref="force"></g>
            <!--answer ball visualization-->
            <g v-if="isAnswerPanel&&(value!=null)" :id="'ball'+id">
              <circle :id="'shapeBall'+id" class="elastic-cog-swipeShapeBall"
                      :cx="answerPoint.x" :cy="answerPoint.y - controllerRadiusScale(value*1.5)"
                      :r="controllerRadiusScale(value*1.5)"
                      filter="url(#lineShadow)"></circle>
            </g>
            <!--tooltip-->
            <g v-show="!(value===null)&&value!=0" :id="'tooltip'+id" class="cogs-major-tooltip"
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

          </g>
        </g>
      </svg>
      <!--rotated descriptions in question component-->
      <div v-if="!showRotatedDescription" class="x axis swipe-axis" :style="{ 'opacity': showDescription ? 1: 0}">
        <div class="swipe-descriptor-text" v-for="(value, index) in standardScale"
             :key="'description-text-'+index" :style="getDescriptionStyle(value)">
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
  import { inputScaleMixin } from "@/mixins/inputScale";
  import { sketchPadMixin } from "@/mixins/sketchPad";
  import { touchTipsMixin } from "@/mixins/touchTips";
  import { chartMixin } from "./chart";
  import { minorBarMixin } from "./minorBars";
  import { elasticMixin } from "./elastic";
  import { cogsMixin } from "./cogs";

  const d3 = Object.assign({}, require("d3-selection"), require("d3-scale"), require("d3-ease"), require("d3-transition"));
  export default {
    name: "COGsElasticPull",
    mixins: [inputScaleMixin, sketchPadMixin, touchTipsMixin, chartMixin, minorBarMixin, elasticMixin, cogsMixin],
    data() {
      return {
        baseMaxHiddenLinkDis: 1.5,
        visualLinkColor: "#424242",
        visualIndicatorStyle: "elastic-cog-scoreBall",
        visualControllerStyle: "elastic-cog-swipeShapeBall",
      }
    },
    computed: {
      controllerRadiusScale() {
        var max_r = this.chartSetting.maxBallRadius * 0.00236 * this.sketchpadHeight;
        return d3.scaleLinear()
            .domain([0, this.standardMax])
            .range([max_r, max_r * 1.5])
            .clamp(true);
      },
      radiusScale() {
        var max_r = this.chartSetting.maxBallRadius * 0.00236 * this.sketchpadHeight;
        var min_r = this.chartSetting.maxBallRadius / this.standardMax * 0.002 * this.sketchpadHeight;
        return d3.scaleLinear()
            .domain([0, this.standardMax])
            .range([min_r, max_r])
            .clamp(true);
      },
    },
    methods: {
      handleTouchTips(val) {
        var vm = this;
        this.isTipsShowing = val;
        this.value = 0;
        this.$store.dispatch("initializeAnswerById", {
          id: vm.id,
          value: vm.scaleParser.getScaleValue(0)
        });
        if (this.value != null) {
          console.log(this.value, "update width nodes");
          this.updateNodesPosition(this.value);
        }
      },
      getLinkPointHeight(d, isTarget) {
        var score;
        if (isTarget) {
          score = this.getScoreByPoint({
            x: d.target.x,
            y: d.target.y
          });
          return d.target.y - this.controllerRadiusScale(score);
        }
        else {
          score = this.getScoreByPoint({
            x: d.source.x,
            y: d.source.y
          });
          return d.source.y - this.gearRadiusScale(score);
        }
      },
      getDistanceVisuals() {
        var dx = this.visualController.attr("cx") - this.visualIndicator.attr("cx");
        var dy = this.visualController.attr("cy") - this.visualIndicator.attr("cy");
        this.maxHiddenLinkDis = Number(this.visualController.attr("r")) + this.baseMaxHiddenLinkDis;
        return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
      },
      controllerTransition(time) {
        var vm = this;
        this.visualController
            .transition().ease(d3.easeLinear)
            .duration(time)
            .attr("r", function (d) {
              var score = vm.getScoreByPoint({x: d.x, y: d.y});
              d.r = vm.controllerRadiusScale(score);
              return d.r;
            })
            .attr("cx", function (d) {
              return d.x;
            })
            .attr("cy", function (d) {
              return d.y - d.r;
            });
      },
      updateChart(animation_time, histogram_time) {
        let visualTransition = d3.transition()
            .duration(animation_time)
            .ease(d3.easeLinear);
        // this.ballTransition(visualTransition);
        if (this.gear && this.value !== null) {
          // this.gearTransition(transition);
          this.gearTransition();
        }
        this.tooltipTransition(visualTransition);

        // Bars
        this.updateHistogram(histogram_time ? histogram_time : animation_time);
      },
      updateNodesPosition(value) {
        if (!this.isAnswerPanel) {
          // cancel scheduled transition in d3
          this.visualLink.transition().duration(0);
          this.visualController.transition().duration(0);
          this.visualIndicator.transition().duration(0);

          // update contorller and controller position
          var fitting_point_i = this.getFittingPoint(value);
          var fitting_point_c = this.getFittingPoint(value);
          // set force simulation nodes
          this.setNodesValue(fitting_point_i, fitting_point_c);
          this.visualLink
              .attr("x1", fitting_point_i.x)
              .attr("y1", fitting_point_i.y)
              .attr("x2", fitting_point_c.x)
              .attr("y2", fitting_point_c.y - this.controllerRadiusScale(value));
          this.visualIndicator
              .attr("cx", fitting_point_i.x)
              .attr("cy", fitting_point_i.y);
          this.visualController
              .attr("cx", fitting_point_c.x)
              .attr("cy", fitting_point_c.y - this.controllerRadiusScale(value));
        }

      }
    },
    mounted() {
      this.initializeGear(this.$refs.gear);
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

  .visual line.marking.elastic-cog-line {
    stroke: rgba(42, 42, 42, 1);
  }

</style>