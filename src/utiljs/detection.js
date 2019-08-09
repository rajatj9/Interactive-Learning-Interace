// norm = Math.sqrt( width ** 2 + height ** 2)
function calculateSwipeDistance(node, norm) {
  var dx = node.x - node.px;
  var dy = (node.y - node.py) * (-1);
  // update: normalize
  return ((dx / norm) + (dy / norm)) * 10;
}

// Reserved decimal place
function toPrecision(val, place) {
  return val.map(x => parseFloat(x.toFixed(place)))
}

export const Swipe = function (width, height, distance) {
  this.srcElementSizeNorm = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2))
  this.sumDistance = distance;
  this.startPoint = null;
  this.endPoint = null;
  this.isTouch = false;
  this.previousPoint = null;
  this.positionHandler = (e) => {
    return [e.clientX, e.clientY];
  }
  this.threshold = (dis) => {
    return !!dis;
  }
  this.track = [];
  this.markerTimestamp = 0;

  this.updateSrcElementSize = (width, height) => {
    this.srcElementSizeNorm = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2))
  };
  this.setPositionHandler = (func) => {
    this.positionHandler = func;
    // console.log(this.sumDistance)
  };
  this.setThreshold = (func) => {
    this.threshold = func;
  };

  this.startDetect = () => {
    this.isTouch = true;
    this.startPoint = toPrecision(this.positionHandler(), 2);
    this.endPoint = null;
    this.markerTimestamp = Date.now();
    this.track.push(toPrecision(this.positionHandler(), 2).concat(0))
  };

  this.trackDetect = () => {
    // console.log("st",this.sumDistance, this)
    if (!this.isTouch) return;
    var point = this.positionHandler(),
        node = {
          x: point[0],
          y: point[1],
          px: this.previousPoint ? this.previousPoint[0] : point[0],
          py: this.previousPoint ? this.previousPoint[1] : point[1]
        };
    var local_distance = calculateSwipeDistance(node, this.srcElementSizeNorm);
    if (this.threshold(this.sumDistance + local_distance)) {
      this.sumDistance += local_distance;
    }
    this.previousPoint = point;
    // console.log(point, this.sumDistance)
    let currentTime = Date.now();
    if (currentTime - this.markerTimestamp > 100) {
      this.track.push(toPrecision(this.positionHandler(), 2)
          .concat(currentTime - this.markerTimestamp));
      this.markerTimestamp = currentTime;
    }
    // console.log(JSON.stringify(this.track))
    return this.sumDistance;
  };

  this.endDetect = () => {
    this.endPoint = toPrecision(this.positionHandler(), 2);
  };
  this.reset = () => {
    this.isTouch = false;
    this.startPoint = null;
    this.endPoint = null;
    this.previousPoint = null;
    this.markerTimestamp = 0;
    this.track = [];
  };
}

export const Drag = function () {
  this.startPoint = null;
  this.endPoint = null;
  this.isDrag = false;
  this.track = [];
  this.markerTimestamp = 0;

  this.positionHandler = (e) => {
    return [e.clientX, e.clientY];
  };
  this.setPositionHandler = (func) => {
    this.positionHandler = func;
  };

  this.startDetect = () => {
    this.isDrag = true;
    this.startPoint = toPrecision(this.positionHandler(), 2);
    this.endPoint = null;
    this.markerTimestamp = Date.now();
    this.track.push(toPrecision(this.positionHandler(), 2).concat(0))
  };

  this.trackDetect = () => {
    if (!this.isDrag) return;
    let currentTime = Date.now();
    if (currentTime - this.markerTimestamp > 100) {
      this.track.push(toPrecision(this.positionHandler(), 2)
          .concat(currentTime - this.markerTimestamp));
      this.markerTimestamp = currentTime;
    }
  };

  this.endDetect = () => {
    this.endPoint = toPrecision(this.positionHandler(), 2);
  };
  this.reset = () => {
    this.isDrag = false;
    this.startPoint = null;
    this.endPoint = null;
    this.markerTimestamp = 0;
    this.track = [];
  };
}
