const d3 = require("d3-ease");

export const AnimationTimer = function (svg) {
  // It seems that the timer is not used.
  var timer = svg.append("svg:text")
      .attr("x", 0)
      .attr("y", 0)
      .attr("T", 0)
      .text("");

  this.getTime = function () {
    return parseFloat(timer.attr("T"));
  }

  this.playing = function (duration, func) {
    timer.attr("T", 0);
    timer.transition()
        .duration(duration)
        .ease(d3.easeLinear)
        .attr("T", 1);
    func();
  }

  this.pausing = function (func) {
    timer.transition().duration(0);
    func();
  }

  this.resuming = function (duration, func) {
    var e = this.getTime();
    timer.transition()
        .duration(duration * (1 - e))
        .ease(d3.easeLinear)
        .attr("T", 1);
    func();
  }
}