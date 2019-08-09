import { AnimationTimer } from "../../../utiljs/animationTimer";
import { mapGetters } from 'vuex';
import { event as currentEvent } from 'd3-selection';
import * as Detector from "../../../utiljs/detection";

const d3 = Object.assign({}, require("d3-scale"), require("d3-selection"), require("d3-array"), require("d3-ease"),
    require("d3-drag"), require("d3-force"), require("d3-timer"), require("d3-transition"));

export const elasticMixin = {
  data() {
    let scaleNum = Object.keys(this.scale).length;
    return {
      baseVal: 0,
      initializeVal: 0,
      dataLinks: [{"source": 0, "target": 1}],
      divots: d3.ticks(0, scaleNum - 1, scaleNum),

      visualLink: null,
      visualNodes: null,
      visualIndicator: null,
      visualController: null,
      visualLinkColor: "red",
      visualIndicatorStyle: "scoreBall",
      visualControllerStyle: "swipeShapeBall",

      simulation: null,
      flag_down: true,
      maxHiddenLinkDis: 1.5,
      string_release_time: 800,
      string_drop_down_time: 0,
      string_stop_time: 150,
      animation_step: 0,
      chart_update_time: 10,
      animation_timer: null,
      isPausing: false,

      isDragging: false,
      detector: null,
      tick_counter: 0,
      start_tick_in: 100,
      string_accurate: 0.075,
      isMounted: false,
      resetDataNodes: false
    }
  },
  computed: {
    ...mapGetters({
      isIOS: 'isIOS'
    }),
    basePoint() {
      return {
        x: this.xScale(this.baseVal),
        y: this.yScale(this.baseVal)
      }
    },
    dataNodes() {
      if (!this.isAnswerPanel) {
        var base_node = {
          x: this.xScale(this.initializeVal),
          y: this.yScale(this.initializeVal)
        }
        return [base_node, Object.assign({}, base_node)];
      }
      return null;
    },
    maxDis() {
      return Math.sqrt(
          Math.pow(this.xScale(this.standardMax) - this.xScale(0), 2)
          + Math.pow(this.yScale(this.standardMax) - this.yScale(0), 2)
      );
    },
    disScale() {
      return d3.scaleLinear()
          .domain([0, this.maxDis])
          .range([0, this.standardMax])
          .clamp(true);
    },
    thickScale() {
      return d3.scaleLinear()
          .domain([0, this.maxDis])
          .range([15, 2])
          .clamp(true)
    },
    controllerRadiusScale() {
      return d3.scaleLinear()
          .domain([0, this.standardMax])
          .range([this.ballRadius.max, this.ballRadius.max * 1.5])
          .clamp(true);
    },
    answerPoint() {
      if (this.isAnswerPanel) {
        return this.getFittingPoint(this.value)
      }
      return null;
    },
  },
  watch: {
    width() {
      this.getSketchpadSize();
      if (this.isAnswerPanel) {
        this.showRotatedDescription = (this.evenDescriptionWidth < this.maxRotationDescriptionWidth)
            || (Math.round(this.maxRotationDescriptionHeight) >= 5);
      }
      this.updateChart(0);
      if (this.value != null) {
        console.log(this.value, "update width nodes");
        this.updateNodesPosition(this.value);
      }
    },
    dataNodes(val) {
      console.log("update data nodes", val, this.id)
      if (this.simulation) {
        if (!this.resetDataNodes) {
          this.setNodesValue(val[0], val[1]);
          this.resetDataNodes = true;
        }

      }
    },
    value(new_val, old_val) {
      if (this.isAnswerPanel) {
        this.updateHistogram(0)
      }
      else {
        if (old_val === null) {
          if (this.tick_counter >= 300) {
            this.onTicking()
            this.value = 0;
          }
        }
        if (new_val == 0 && this.tick_counter >= 300) {
          this.updateChart(0, 0)
        }
        if (!this.isDragging && !this.flag_down) {
          var point = this.getIndicatorPos();
          var value = this.value;
          var fitting_value = Math.round(value * 10) / 10;
          if (fitting_value != value) {
            value = fitting_value;
            point = this.getScoreByPoint(value);
          }
          this.$store.dispatch("updateAnswerById", {
            id: this.id,
            value: {
              isAnimationUpdated: false,
              point: [point.x, point.y],
              value: this.scaleParser.getScaleValue(value),
            }
          })
        }
      }
    },
  },
  methods: {
    onDragStart(d) {
      if (!currentEvent.active)
        this.simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
      this.isDragging = true;
      this.showDescriptionAxis();
      this.detector.startDetect();
      this.$store.dispatch("startDetectById", {
        id: this.id,
        value: this.scaleParser.getScaleValue(this.value)
      });
      this.tick_counter = 0;

    },
    onDragging(d) {
      var touch_score = this.getScoreByPoint(this.getTouchPoint());

      var controller_fitting_point = this.getFittingPoint(touch_score);

      d.fx = controller_fitting_point.x;
      d.fy = controller_fitting_point.y;

      this.flag_down = touch_score - this.getCurrentScore() <= 0
      if (this.flag_down) {
        this.setNodeItemById(0, controller_fitting_point)
        // this.setNodeItemById(1, controller_fitting_point)
        this.animation_step = this.string_drop_down_time;
        if (this.isStandardValue) {
          this.animation_step = this.string_release_time * 0.5;
        }
      }
      else {
        this.animation_step = this.string_release_time;
      }
      this.detector.trackDetect();
    },
    onDragEnd(d) {
      if (!currentEvent.active)
        this.simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
      this.isDragging = false;

      var sketchPad = this;
      this.hideDescriptionAxis();
      this.detector.endDetect();

      // add value update detector in the animation
      if (this.getTargetValue() != this.value) {
        var vm = this;
        d3.timer(function () {
          if (vm.value == 0) return true;
          vm.value = vm.getCurrentScore();
          vm.updateChart(0, vm.chart_update_time);
          return vm.getTargetValue() == vm.value;
        })
      }

      var end_value = this.getScoreByPoint(this.getControllerPos());
      var answer_value = Math.round(this.scaleParser.getScaleValue(end_value) * 10) / 10;
      this.$store.dispatch("updateAnswerById", {
        id: this.id,
        value: {
          isAnimationUpdated: true,
          action: this.flag_down ? "push" : "pull",
          value: answer_value,
          detector: this.detector
        }
      })
          .then(() => {
            sketchPad.detector.reset();
            sketchPad.$store.dispatch("endDetectById", sketchPad.id)
          });
    },
    onTicking() {
      this.tick_counter++;
      var animation_time = !this.flag_down && !this.isDragging ? this.animation_step * 0.2 : 0;
      if (this.value != null) {
        var vm = this;
        if (this.visualLink) {
          this.visualLink
              .attr("x2", function (d) {
                return d.target.x;
              })
              .attr("y2", function (d) {
                return vm.getLinkPointHeight(d, true);
              })
              .style("opacity", function (d) {
                d.distance = vm.getDistanceVisuals();
                return d.distance.toFixed(1) <= vm.maxHiddenLinkDis || vm.flag_down ? 0.0 : 0.8;
              })
              .style("stroke-width", function () {
                var dis = vm.getDistanceVisuals();
                return vm.thickScale(dis);
              });
        }
        if (this.visualController && !this.isPausing) {
          this.controllerTransition(animation_time)
        }
        if (this.visualIndicator && !this.isPausing) {
          if (this.checkMounted()) {
            this.value = this.getCurrentScore();
          }
          this.pausePulling(this.value);
        }
        this.updateChart(0, this.chart_update_time);
      }
    },
    checkMounted() {
      if (!this.isMounted) {
        var pos = this.getIndicatorPos();
        this.isMounted = !(pos.x === "0" && pos.y === "0")
      }
      return this.isMounted;
    },
    getTouchPoint() {
      var point = d3.mouse(this.$refs.svg)[0] ? d3.mouse(this.$refs.svg) : d3.touches(this.$refs.svg)[0];
      if (this.isIOS && window.matchMedia("(orientation: portrait)").matches) {
        var tmp = [-point[1], point[0]];
        point = tmp;
      }
      return {x: point[0], y: point[1]};
    },
    getNodeDistance(node) {
      if ((node.x - this.basePoint.x + this.basePoint.y - node.y) < 0) return 0;
      return Math.sqrt(Math.pow(node.x - this.basePoint.x, 2) + Math.pow(node.y - this.basePoint.y, 2));
    },
    getDistanceVisuals() {
      var dx = this.visualController.attr("cx") - this.visualIndicator.attr("cx");
      var dy = this.visualController.attr("cy") - this.visualIndicator.attr("cy");
      return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    },
    getScoreByPoint(point) {
      var tmp_x = point.x > this.xScale(this.standardMax) ? this.xScale(this.standardMax) : point.x,
          tmp_y = point.y < this.yScale(this.standardMax) ? this.yScale(this.standardMax) : point.y;
      if (tmp_x < this.xScale(this.baseVal)) {
        tmp_x = this.xScale(this.baseVal);
        tmp_y = this.yScale(this.baseVal);
      }
      if (tmp_y > this.yScale(this.baseVal))
        tmp_y = this.yScale(this.baseVal);
      var dis = this.getNodeDistance({x: tmp_x, y: tmp_y});
      return Math.round(this.disScale(dis) * 100) / 100;
    },
    getIndicatorPos() {
      return {
        x: this.visualIndicator.attr("cx"),
        y: this.visualIndicator.attr("cy")
      }
    },
    getControllerPos() {
      return {
        x: this.visualController.attr("cx"),
        y: this.visualController.attr("cy")
      }
    },
    getTargetValue() {
      var target_point = {
        x: this.simulation.nodes()[0].x,
        y: this.simulation.nodes()[0].y
      }
      return this.getScoreByPoint(target_point)
    },
    getCurrentScore() {
      if (this.value !== null) {
        var indicator_pos = this.getIndicatorPos();
        var cur_score = this.getScoreByPoint(indicator_pos);
        return cur_score;
      }
      return this.value
    },
    getFittingPoint(score) {
      return {
        x: this.xScale(score),
        y: this.yScale(score)
      }
    },
    getLinkPointHeight(d, isTarget) {
      if (isTarget) {
        return d.target.y;
      }
      else {
        return d.source.y;
      }
    },
    isPauseValue(score) {
      var tmp_score = Math.round(score * 10) / 10;
      var flag = tmp_score in this.divots && tmp_score != 0;
      if (flag) {
        flag = Math.abs(score - tmp_score).toFixed(3) <= 0.02;
        // stick the indicator to the int value
        if (flag) {
          this.value = tmp_score;
        }
      }
      return flag;
    },

    initializeForce() {
      this.simulation = d3.forceSimulation()
          .force("link", d3.forceLink().distance(0))
          .force("collide", d3.forceCollide(function () {
            return 0;
          }).iterations(16))
          // .force("collide", d3.forceCollide().iterations(16))
          .force("charge", null)
          .force("center", null)

      this.simulation
          .nodes(this.dataNodes)
          .on("tick", this.onTicking);

      this.simulation.force("link")
          .links(this.dataLinks);

      this.detector = new Detector.Drag();
      this.detector.setPositionHandler(() => {
        var point = this.getTouchPoint();
        return [point.x, point.y];
        // return [currentEvent.x, currentEvent.y];
      })
    },
    visualizeElasticSimulation() {
      var force = d3.select(this.$refs.force);
      this.visualLink = force.append("g")
          .attr("class", "links")
          .selectAll("line")
          .data(this.dataLinks)
          .enter()
          .append("line")
          .attr("stroke", this.visualLinkColor);

      this.visualNodes = force.append("g")
          .attr("class", "nodes")
          .selectAll("circle")
          .data(this.dataNodes)
          .enter().append("circle")
          .attr("r", 8)
          .attr("cx", function (d) {
            return d.x;
          })
          .attr("cy", function (d) {
            return d.y;
          })
          .attr("id", function (d) {
            return "node" + d.index;
          })


      this.visualIndicator = force
          .select('#node0')
          .attr("class", this.visualIndicatorStyle)
          .attr('r', this.radiusScale(this.value));

      this.visualController = force
          .select('#node1')
          .attr("class", this.visualControllerStyle)
          .attr('r', this.controllerRadiusScale(this.value))
          .call(d3.drag()
              .on("start", this.onDragStart)
              .on("drag", this.onDragging)
              .on("end", this.onDragEnd));

      this.updateChart(0, 0)

    },

    pullingTransition(time) {
      var vm = this;
      if (this.visualLink) {
        this.visualLink
            .transition().ease(d3.easeLinear).duration(time)
            .attr("x1", function (d) {
              return d.source.x;
            })
            .attr("y1", function (d) {
              return vm.getLinkPointHeight(d, false);
            });
      }
      if (this.visualController) {
        this.visualIndicator
            .transition().ease(d3.easeLinear).duration(time)
            .attr("r", function (d) {
              var point = {x: d.x, y: d.y};
              var value = vm.getScoreByPoint(point);
              vm.setFittingValue(value);
              return vm.radiusScale(value)
            })
            .attr("cx", function (d) {
              return d.x;
            })
            .attr("cy", function (d) {
              return d.y;
            });
      }
    },
    controllerTransition(time) {
      var vm = this;
      this.visualController
          .transition().ease(d3.easeLinear)
          .duration(time)
          .attr("r", function (d) {
            var score = vm.getScoreByPoint({x: d.x, y: d.y});
            return vm.controllerRadiusScale(score);
          })
          .attr("cx", function (d) {
            return d.x;
          })
          .attr("cy", function (d) {
            return d.y;
          });
    },
    setFittingValue(value) {
      if (this.tick_counter > this.start_tick_in) {
        var fitting_value = Math.round(value * 10) / 10;
        if (Math.abs(value - fitting_value) <= this.string_accurate) {
          var fitting_point = this.getFittingPoint(fitting_value);
          var gap = Math.abs(this.value - fitting_value)
          if (gap > 0 && gap <= 0.02) {
            this.value = fitting_value;
          }
          this.setNodesValue(fitting_point, fitting_point);
        }
      }

    },
    setNodeItemById(id, point) {
      this.simulation.nodes()[id].x = point.x;
      this.simulation.nodes()[id].y = point.y;
    },
    setNodesValue(indicator_point, controller_point) {
      this.setNodeItemById(0, indicator_point);
      this.setNodeItemById(1, controller_point);
    },
    pausePulling(score) {
      var vm = this;
      this.isPauseValue(score)
      if (this.isPauseValue(score)) {
        this.isPausing = true;
        this.animation_timer.pausing(function () {
          vm.visualLink.transition().duration(0);
          vm.visualIndicator.transition().duration(0);
        })
        setTimeout(function () {
          vm.animation_timer.resuming(vm.animation_step, function () {
            var time = vm.animation_step * (1 - vm.animation_timer.getTime());
            vm.isPausing = false;
            vm.pullingTransition(time)
          })
        }, this.string_stop_time);
      }
      else {
        this.animation_timer.playing(this.animation_step, function () {
          vm.pullingTransition(vm.animation_step);
          // if (vm.flag_down) {
          // }
        })
      }
    },
    updateChart(animation_time, histogram_time) {
      let visualTransition = d3.transition()
          .duration(animation_time)
          .ease(d3.easeLinear);
      // this.ballTransition(visualTransition);
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
            .attr("y2", fitting_point_c.y);
        this.visualIndicator
            .attr("cx", fitting_point_i.x)
            .attr("cy", fitting_point_i.y);
        this.visualController
            .attr("cx", fitting_point_c.x)
            .attr("cy", fitting_point_c.y);
      }


    }
  },
  mounted() {
    this.getSketchpadSize();
    this.setBasicShapeElements();

    if (!this.isAnswerPanel) {
      var answer_value = this.$store.getters.getAnswerValueById(this.id);
      if (answer_value) {
        this.value = this.scaleParser.getStandardValue(this.$store.getters.getAnswerValueById(this.id));
        this.initializeVal = this.value;
      }
      else {
        if (answer_value === null) {
          this.isTipsShowing = true;
        }
        else {
          this.value = this.scaleParser.getStandardValue(this.$store.getters.getAnswerValueById(this.id));
        }
      }
      this.initializeForce();
      this.visualizeElasticSimulation();
      this.animation_timer = new AnimationTimer(d3.select(this.$refs.svg));
    }
    else {
      this.showDescription = true;
      if (this.answer != null) {
        this.value = this.scaleParser.getStandardValue(this.answer);
      }
    }
  }
}
