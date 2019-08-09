const d3 = Object.assign({}, require("d3-selection"), require("d3-scale"), require("d3-array"),
    require("d3-shape"), require("d3-ease"), require("d3-transition"), require("d3-scale-chromatic"));
import Defs from '../../util/Defs.vue';

export const chartMixin = {
  components: {
    DefsElements: Defs
  },
  data() {
    return {
      svg: null,
      ball: null,
      histogram: null,
      horizontalMarking: null,
      verticalMarking: null,
      tooltipElem: null,

      chartSetting: {
        paddingHeight: 5,
        paddingWidth: 10,
        axisMarginTop: 2,
        axisMarginLeft: 4,
        maxBallRadius: 32,
        minBarWidthRadio: 0.3,
        maxBarWidthRadio: 0.7,
        axisMinorTickLength: 3,
        axisMajorTickLength: 5
      },
      tooltip: {
        fontSize: 12,
        width: 40,
        height: 20,
        offsetX: 10,
        offsetY: 7,
        marginRight: 16
      },
      animationTime: 15,
      showBaseline: false,
      showDescription: false,
      xTicksData: d3.ticks(0, Object.keys(this.scale).length - 1, Object.keys(this.scale).length * 10),
      yTicksData: d3.ticks(0, Object.keys(this.scale).length - 1, Object.keys(this.scale).length * 5),
    }
  },
  computed: {
    ballRadius() {
      return {
        min: this.chartSetting.maxBallRadius / this.standardMax * 0.002 * this.sketchpadHeight,
        max: this.chartSetting.maxBallRadius * 0.00236 * this.sketchpadHeight
      }
    },
    chartHeight() {
      if (this.sketchpadHeight > 0) {
        return this.sketchpadHeight - this.chartSetting.paddingHeight * 2
            - this.axisFontHeight - this.chartSetting.axisMarginTop
            - this.ballRadius.max - 5;
      }
      return 0;
    },
    chartTransform() {
      return "translate(" + (this.chartSetting.paddingWidth + this.axisFontWidth + this.chartSetting.axisMarginLeft)
          + "," + (this.chartSetting.paddingHeight + this.ballRadius.max) + ")"
    },
    xAxisTransform() {
      return "translate(" + (this.chartSetting.paddingWidth + this.axisFontWidth + this.chartSetting.axisMarginLeft)
          + "," + (this.chartSetting.paddingHeight + this.ballRadius.max + this.yScale(0)) + ")"
    },
    yAxisTransform() {
      return "translate(" + (this.chartSetting.paddingWidth + this.chartSetting.axisMarginLeft * 0.68)
          + "," + (this.chartSetting.paddingHeight + this.ballRadius.max) + ")"
    },
    yScale() {
      return d3.scaleLinear()
          .domain([0, this.standardMax])
          .range([this.chartHeight, 0])
          .clamp(true);
    },
    colorScale() {
      return d3.scaleLinear()
          .domain([0, this.standardMax])
          // .range(["#C3DAF5", "#4A90E2"])
          // .range(["#F8CFD5", "#E24A5E"]); //#F3B1BA
          .range(["#F8CFD5", "#FF0000"]);

      // var t_mapping = d3.scaleLinear()
      //     .domain([0, this.standardMax])
      //     .range([0, 0.7])
      //     .clamp(true);
      // return (x) => {
      //     return d3.interpolateReds(t_mapping(x));
      // }
    },
    opacityScale() {
      return d3.scaleLinear()
          .domain([0, this.standardMax])
          // .range([0.25, 0.6])
          .range([0.3, 0.85])
          .clamp(true);
    },
    radiusScale() {
      return d3.scaleLinear()
          .domain([0, this.standardMax])
          .range([this.ballRadius.min, this.ballRadius.max])
          .clamp(true);
    },
    ballOpacity() {
      return d3.scaleLinear()
          .domain([0, this.standardMax])
          .range([0.5, 0.82])
          .clamp(true);
    },
    growthLinePath() {
      var vm = this;
      var lineData = [
        {x: 0, y: 0},
        {x: vm.standardMax, y: vm.standardMax}
      ];
      var valueLine = d3.line()
          .x(function (d) {
            return vm.xScale(d.x);
          })
          .y(function (d) {
            return vm.yScale(d.y);
          });
      return valueLine(lineData);
    },
    isStandardValue() {
      return this.standardScale.includes(this.value) && (this.value != 0);
    },
    descriptionLength() {
      return this.chartWidth / (this.standardMax + 1) * 0.8;
    },
    xTicksYTop() {
      return this.axisFontHeight * 0.25 - this.chartSetting.axisMarginTop
    },
    yAxisXRight() {
      return this.axisFontWidth - this.chartSetting.axisMarginLeft * 0.98;
    },
    tipsPositionTop() {
      return this.top + this.sketchpadHeight * 0.34
          - this.chartSetting.paddingHeight - this.ballRadius.max * 2;
    }
  },
  methods: {
    getDescriptionStyle(value) {
      return {
        width: this.descriptionLength + "px",
        top: (-this.axisFontHeight + this.chartSetting.paddingHeight) + "px",
        left: (this.chartSetting.paddingWidth + this.axisFontWidth + this.chartSetting.axisMarginLeft
            + this.xScale(value) - this.descriptionLength * 0.5 - this.descriptionLength * value) + 'px',
      }
    },
    tooltipTransformX(value) {
      let posX = this.xScale(value),
          elementsWidth = this.tooltip.width + this.radiusScale(value) + 5;
      if (posX < elementsWidth) {
        return posX - elementsWidth;
      } else if (posX >= elementsWidth && posX < (elementsWidth + this.tooltip.marginRight * 2)) {
        var tmp = (posX - elementsWidth) / 2;
        return posX - elementsWidth - tmp;
      } else if (posX >= (elementsWidth + this.tooltip.marginRight * 2)) {
        return posX - elementsWidth - this.tooltip.marginRight;
      }
    },
    tooltipTransformY(value) {
      return this.yScale(value) - this.tooltip.offsetY * 0.5
    },
    showDescriptionAxis() {
      this.showDescription = true;
      this.toggleDescription();
    },
    hideDescriptionAxis() {
      this.showDescription = false;
      this.toggleDescription();
    },
    toggleDescription() {
      d3.selectAll(".survey-btn-wrapper")
          .style("opacity", this.showDescription ? 0 : 1);
    },
    setBasicShapeElements() {
      this.svg = d3.select(this.$refs.svg);
      this.ball = this.svg.select("#ball" + this.id);
      this.histogram = this.svg.select("#histogram" + this.id);
      this.horizontalMarking = this.svg.select("#horizontal" + this.id);
      this.verticalMarking = this.svg.select("#vertical" + this.id);
      this.tooltipElem = this.svg.select("#tooltip" + this.id);
    },
    tooltipTransition(transition) {
      if (this.horizontalMarking) {
        this.horizontalMarking
            .transition(transition)
            .attr("x2", this.xScale(this.value))
            .attr("y1", this.yScale(this.value))
            .attr("y2", this.yScale(this.value));
      }
      if (this.verticalMarking) {
        this.verticalMarking
            .transition(transition)
            .attr("x1", this.xScale(this.value))
            .attr("x2", this.xScale(this.value))
            .attr("y2", this.yScale(this.value));
      }
      // tooltip
      if (this.tooltipElem) {
        this.tooltipElem
            .transition(transition)
            .attr("transform", "translate(" + this.tooltipTransformX(this.value) + ","
                + this.tooltipTransformY(this.value) + ")");
      }
    }
  }
}