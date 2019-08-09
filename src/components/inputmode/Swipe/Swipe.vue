<template>
  <div class="scale-wrapper swipe-wrapper sketchpad-container" ref="sketchpad">
    <!--<div class="sketchpad-container" ref="sketchpad">-->
    <svg ref="svg" :id="'svg'+id" :width="sketchpadWidth" :height="sketchpadHeight">
      <defs-elements></defs-elements>
      <g class="y axis" :transform="yAxisTransform">
        <text v-for="(value, index) in standardScale" dy="0.32em" :y="yScale(value)"
              :key="index">{{ scaleParser.getScaleValue(value) }}
        </text>
      </g>
      <g class="x axis" :transform="xAxisTransform" v-if="!showDescription">
        <text v-for="(value, index) in standardScale" dx="-0.25em" :dy="axisFontHeight"
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
        <g class="grid">
          <line v-for="(value, index) in standardScale" :key="'line'+index" :x1="xScale(0)"
                :x2="lineWidth" :y1="yScale(value)" :y2="yScale(value)"
                :class="{ 'baseGrid': value == 0}"></line>
        </g>
        <g :id="'histogram'+id" class="histogram">
          <rect class="bar-rect" v-for="(value, index) in standardScale"
                :key="'rect'+index" style="display: inline-block;" filter="url(#rectShadow)"
                :x="xScale(value) - barWidthScale(value) * 0.5"
                :width="barWidthScale(value)"></rect>
        </g>
        <line class="axis" :x1="xScale(0)" :y1="yScale(0)" :y2="yScale(0)" :x2="lineWidth"></line>
        <line class="axis" :x1="xScale(0)" :y1="yScale(0)"
              :x2="xScale(0)" :y2="yScale(standardMax)-ballRadius.max*0.5"></line>
        <path class="growth-line shadow" marker-end="url(#arrow)" filter="url(#lineShadow)"
              :d="growthLinePath"></path>
        <g class="visual">
          <g class="baseline" v-if="showBaseline || isStandardValue">
            <line class="marking baseline" :id="'horizontal-baseline'+id"
                  :x1="xScale(0)" :x2="lineWidth" :y1="yScale(value)" :y2="yScale(value)"></line>
            <line class="marking baseline" :id="'vertical-baseline'+id"
                  :x1="xScale(value)" :x2="xScale(value)" :y1="yScale(standardMax)" :y2="yScale(0)"></line>
          </g>
          <line :id="'horizontal'+id" class="marking" :x1="xScale(0)"></line>
          <line :id="'vertical'+id" class="marking" :y1="yScale(0)"></line>
          <g :id="'tooltip'+id" class="major-tooltip" :transform="'translate(' + tooltipTransformX(0) + ','
                        + tooltipTransformY(0) + ')'" v-show="value!=0">
            <rect :y="-tooltip.offsetY"
                  :rx="tooltip.height*0.5" :ry="tooltip.height*0.5"
                  :width="tooltip.width" :height="tooltip.height"
                  filter="url(#tooltipShadow)"/>
            <text class="tooltipText" :style="{ 'font-size': tooltip.fontSize + 'px'}"
                  letter-spacing="2" :x="tooltip.offsetX" :y="tooltip.offsetY">
              {{ scaleParser.getScaleValue(value).toFixed(1) }}
            </text>
          </g>
          <g :id="'ball'+id">
            <circle :id="'shapeBall'+id" class="shapeBall" cx="0" cy="0" filter="url(#lineShadow)"></circle>
            <circle :id="'scoreBall'+id" class="scoreBall" cx="0" cy="0" filter="url(#insetShadow)"></circle>
          </g>
        </g>
      </g>
    </svg>
    <div v-if="!showRotatedDescription" class="x axis swipe-axis" :style="{ 'opacity': showDescription ? 1: 0}">
      <div class="swipe-descriptor-text" v-for="(value, index) in standardScale" style="width: max-content"
           :key="'description-text'+index" :style="getDescriptionStyle(value)"><!--ref="descriptionTick">-->
        {{ scaleParser.getDescription(value) }}
      </div>
    </div>
    <div v-if="isAnswerPanel" class="x axis swipe-axis rotation-axis" :style="rotationDescriptionStyle">
      <div class="rotation-descriptor-text" v-for="(value, index) in standardScale"
           :key="'description'+index" :style="getRotatedDescriptionStyle(value)" ref="rotationTick">
        {{ scaleParser.getDescription(value) }}
      </div>
    </div>
    <!--</div>-->
  </div>
</template>

<script>
  const d3 = Object.assign({}, require("d3-selection"), require("d3-scale"), //, require("d3-interpolate")
      require("d3-shape"), require("d3-ease"), require("d3-transition"));
  import {inputScaleMixin} from "../../../mixins/inputScale";
  import {sketchPadMixin} from "../../../mixins/sketchPad";
  import {swipeMixin} from "./swipe";
  import {chartMixin} from "./chart";

  export default {
    name: "Swipe",
    mixins: [inputScaleMixin, sketchPadMixin, chartMixin, swipeMixin],
    computed: {
      chartWidth() {
        if (this.sketchpadWidth > 0) {
          return this.sketchpadWidth - this.chartSetting.paddingWidth * 2
              - this.axisFontWidth - this.chartSetting.axisMarginLeft
              - this.sketchpadWidth / this.standardMax * this.chartSetting.maxBarWidthRadio * 0.5;
        }
        return 0;
      },
      xScale() {
        return d3.scaleLinear()
            .domain([0, this.standardMax])
            //                .domain([0, this.standardMax + this.chartSetting.maxBarWidthRadio * 0.5])
            .range([0, this.chartWidth])
            .clamp(true);
      },
      lineWidth() {
        return this.xScale(this.standardMax) + this.sketchpadWidth /
            this.standardMax * this.chartSetting.maxBarWidthRadio * 0.5;
//            return this.xScale(this.standardMax + this.chartSetting.maxBarWidthRadio * 0.5)
      },
      barWidthScale() {
        let widthUnit = this.chartWidth / this.standardMax;
        return d3.scaleLinear()
            .domain([0, this.standardMax])
            .range([widthUnit * this.chartSetting.minBarWidthRadio,
              widthUnit * this.chartSetting.maxBarWidthRadio])
            .clamp(true);
      },
      normalBarsHeight() {
        return this.standardScale.map(x => {
          return (this.value > x) ? x :
              ((x - this.value) <= 1 ? (this.value + 1 - x) * x : 0);
        })
      },
      rotationDescriptionStyle() {
        return {
          'margin-left': (this.chartSetting.paddingWidth + this.axisFontWidth + this.chartSetting.axisMarginLeft) + 'px',
          'margin-top': -(this.axisFontHeight + this.chartSetting.paddingHeight
              + this.chartSetting.axisMarginTop + this.xTicksYTop) + 'px',
          'height': this.showRotatedDescription ?
              (this.scaleDescriptionSize.length * this.axisFontWidth * 0.36) + 'px' : 0 + 'px',
          'opacity': this.showRotatedDescription ? 1 : 0
        }
      }
    },
    methods: {
      updateChart(time) {
        let visualTransition = d3.transition()
            .duration(time)
            .ease(d3.easeLinear);
        this.ballTransition(visualTransition);
        this.tooltipTransition(visualTransition);

        // Bars
        let timeSlice = time / this.standardMax;
        let sketchPad = this;
        this.histogram
            .selectAll(".bar-rect")
            .data(this.normalBarsHeight)
            .transition()
            .delay(function (d, i) {
              return i * timeSlice;
            })
            .duration(timeSlice)
            .ease(d3.easeLinear)
            .attr("y", function (d, i) {
              d = sketchPad.normalBarsHeight[i];
              return sketchPad.yScale(d);
            })
            .attr("height", function (d, i) {
              d = sketchPad.normalBarsHeight[i];
              return sketchPad.chartHeight - sketchPad.yScale(d);
            })
            .style("fill", function (d, i) {
              d = sketchPad.normalBarsHeight[i];
              if (d == 0) {
                return "white";
              }
              else if (d == i) {
                return sketchPad.colorScale(i);
              }
              else {
                return sketchPad.colorScale(sketchPad.value);
              }
            })
            .style("opacity", function (d, i) {
              d = sketchPad.normalBarsHeight[i];
              if (d == 0) {
                return 0;
              }
              else if (d == i) {
                return sketchPad.opacityScale(i);
              }
              else {
                return sketchPad.opacityScale(sketchPad.value);
              }
            });

      },
      getRotatedDescriptionStyle(value) {
        if (this.$refs.rotationTick) {
          if (!this.rotationTickElems) {
            this.rotationTickElems = this.$refs.rotationTick.map(x => {
              // return x.getBoundingClientRect().height;
              return x.clientWidth
            })
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
    }
  }
</script>

<style scoped>
  @import url("../../../assets/CSS/sketchpad.css");
  @import url("../../../assets/CSS/swipe.css");
</style>