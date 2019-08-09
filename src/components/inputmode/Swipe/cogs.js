const d3 = Object.assign({}, require("d3-selection"), require("d3-scale"), require("d3-interpolate"),
    require("d3-ease"), require("d3-transition"));
import {gearPath} from "../../../utiljs/gear";

export const cogsMixin = {
  data() {
    return {
      tooltip: {
        marginRight: 2
      },
      gear: null,
      gear_setting: {
        min_radius: 12,
        max_radius: 32,
        min_gear: 4,
        max_gear: 12,

        holeRadius: 0.4,
        addendum: 3.5,
        dedendum: 4.2,
        thickness: 0.4,
        profileSlope: 0.1
      }
    }
  },
  watch: {
    chartHeight() {
      if (this.value === null) {
        this.gear
            .attr("transform", this.gearTransform(0));
      }
    }
  },
  computed: {
    ballRadius() {
      return {
        min: this.gearRadiusScale(this.standardMin),
        max: this.gearRadiusScale(this.standardMax) * 2
      }
    },
    normLength() {
      if (this.isAnswerPanel) {
        return 0.7 * this.sketchpadHeight * 0.005
      }
      var result = 500 / Math.sqrt(this.width * this.width + this.height * this.height);
      return isFinite(result) ? result : 0.75;
    },
    gearAngleScale() {
      return d3.scaleLinear()
          .domain([0, this.standardMax])
          .range([0, 360 * this.standardMax])
          .clamp(true);
    },
    gearRadiusScale() {
      return d3.scaleLinear()
          .domain([0, this.standardMax])
          .range([this.gear_setting.min_radius * this.normLength,
            this.gear_setting.max_radius * this.normLength])
          .clamp(true);
    },
    gearTeethScale() {
      return d3.scaleLinear()
          .domain([0, this.standardMax])
          .range([this.gear_setting.min_gear,
            this.gear_setting.max_gear])
          .clamp(true);
    },
    COGsPadHeight() {
      return this.sketchpadHeight + this.gearRadiusScale(this.standardMax)
    },
    chartHeight() {
      if (this.sketchpadHeight > 0) {
        return this.sketchpadHeight - this.chartSetting.paddingHeight * 2
            - this.axisFontHeight - this.chartSetting.axisMarginTop
            - this.gearRadiusScale(this.standardMax) - 5;
      }
      return 0;
    },
    COGsSketchPadStyle() {
      return Object.assign(this.touchTipsFilterStyle, {
        "margin-top": -this.gearRadiusScale(this.standardMax) + "px"
      })
    },
    tipsPositionTop() {
      return this.top + this.sketchpadHeight * 0.34 - this.chartSetting.paddingHeight
          - this.chartSetting.maxBallRadius * 0.00236 * this.sketchpadHeight * 2;
    }
  },
  methods: {
    tooltipTransformX(value) {
      let posX = this.xScale(value),
          elementsWidth = this.tooltip.width + this.gearRadiusScale(value)
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
      return this.yScale(value) - this.tooltip.offsetY * 0.5 - this.gearRadiusScale(value)
    },
    gearTransform(value) {
      return "translate(" + this.xScale(value) + ","
          + (this.yScale(value) - this.gearRadiusScale(value)) + ")" + "  rotate("
          + this.gearAngleScale(value) + ")";
    },
    getGearDatum(value) {
      var radius = this.gearRadiusScale(value);
      var teeth = this.gearTeethScale(value); //radius / 4;
      var innerRadius = radius - (this.gear_setting.addendum + this.gear_setting.dedendum) * this.normLength;
      var holeRadius = radius > 48 ? innerRadius * 0.5 +
          innerRadius * 0.5 * this.gear_setting.holeRadius : innerRadius * this.gear_setting.holeRadius;

      var datum = {
        radius: radius,
        teeth: Math.round(teeth),
        speed: 0.0,
        power: 0.0,
        angle: 0.0,
        addendum: this.gear_setting.addendum * this.normLength,
        dedendum: this.gear_setting.dedendum * this.normLength,
        thickness: this.gear_setting.thickness,
        profileSlope: this.gear_setting.profileSlope,
        holeRadius: holeRadius,
      };
      datum.rootRadius = datum.radius - datum.dedendum;
      datum.outsideRadius = datum.radius + datum.addendum;
      datum.circularPitch = (1 - datum.thickness) * 2 * Math.PI / datum.teeth;
      datum.pitchAngle = datum.thickness * 2 * Math.PI / datum.teeth;
      datum.slopeAngle = datum.pitchAngle * datum.profileSlope * 0.5;
      datum.addendumAngle = datum.pitchAngle * (1 - datum.profileSlope);

      return datum;
    },
    initializeGear(element) {
      if (!this.gear) {
        var datum = this.getGearDatum(0)
        this.gear = d3.select(element)
            .datum(datum)
            .append('path')
            .attr('class', 'gear-path')
            .attr('d', gearPath)
      }
    },
    // gearTransition(transition) {
    gearTransition() {
      this.gear
      // .transition(transition)
          .attr("d", gearPath(this.getGearDatum(this.value)))
          .attr("transform", this.gearTransform(this.value));
    }
  },
}