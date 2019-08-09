const d3 = Object.assign({}, require("d3-scale"), require("d3-array"), require("d3-ease"), require("d3-transition"));

export const minorBarMixin = {
  data() {
    let scaleNum = Object.keys(this.scale).length;
    return {
      minorBarsNum: scaleNum * 10,
      minorBarsData: d3.ticks(0, scaleNum - 1, scaleNum * 10),
    }
  },
  computed: {
    chartWidth() {
      if (this.sketchpadWidth > 0) {
        let width = this.sketchpadWidth - this.chartSetting.paddingWidth * 2
            - this.axisFontWidth - this.chartSetting.axisMarginLeft,
            offsetEvenWidth = width / this.minorBarsNum * 0.5;
        return offsetEvenWidth > this.ballRadius.max ? width - offsetEvenWidth : width - this.ballRadius.max;
      }
      return 0;
    },
    xScale() {
      return d3.scaleLinear()
          .domain([0, this.standardMax])
          .range([0, this.chartWidth])
          .clamp(true);
    },
    lineWidth() {
      return this.xScale(this.standardMax) + this.ballRadius.max;
    },
    minorBarsWidth() {
      return this.chartWidth / this.minorBarsNum * 0.9;
//            return this.xScale(this.standardMax) / this.minorBarsNum * 0.9;
    },
    minorBarsHeight() {
      return this.minorBarsData.map(x => {
        return (this.value > x) ? x :
            ((x - this.value) <= 0.1 ? (this.value + 0.1 - x) / 0.1 * x : 0);
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
      this.updateHistogram(time);
    },
    updateHistogram(time) {
      let timeSlice = time / this.minorBarsNum;
      let sketchPad = this;
      if (this.histogram) {
        this.histogram
            .selectAll(".bar-rect")
            .data(this.minorBarsHeight)
            .transition()
            .delay(function (d, i) {
              return i * timeSlice;
            })
            .duration(time * 0.1)
            .ease(d3.easeLinear)
            .attr("y", function (d, i) {
              d = sketchPad.minorBarsHeight[i];
              return sketchPad.yScale(d);
            })
            .attr("height", function (d, i) {
              d = sketchPad.minorBarsHeight[i];
              return sketchPad.chartHeight - sketchPad.yScale(d);
            })
            .style("fill", function (d, i) {
              d = sketchPad.minorBarsHeight[i];
              return sketchPad.colorScale(d)
            })
            .style("opacity", function (d, i) {
              d = sketchPad.minorBarsHeight[i];
              if (d == 0) {
                return 0;
              }
              else if (d == i / 10) {
                return sketchPad.opacityScale(d);
              }
              else {
                return sketchPad.opacityScale(sketchPad.value);
              }
            });
      }
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
    }
  }
}