export const Swipe = function (max, a, b, c, d) {
  this.maxValue = max;
  this.param_a = a ? a : 20;
  this.param_b = b ? b : 1.0;
  this.param_c = c ? c : 0.35;
  this.param_d = d ? d : "0.1";

  this.divot = [];
  this.showPauseVisual = () => {
  };
  this.hidePauseVisual = () => {
  }

  var setAdjustFunctions = (value_d) => {
    switch (value_d) {
      case "0":
        return (val) => {
          return parseFloat(val.toFixed(1))
        };
      case "0.1":
        return (val) => {
          return Math.round(val * 10) / 10
        };
      case "0.2":
        return (val) => {
          return Math.round(val * 5) / 5
        };
      case "0.5":
        return (val) => {
          return Math.round(val * 2) / 2
        };
      default:
        return (val) => {
          return parseFloat(val.toFixed(1))
        };
    }
  }
  this.adjuster = setAdjustFunctions(this.param_d);

  var distanceToScale = (distance) => {
    if (distance < 0) return 0;
    if (distance > this.param_a) this.maxValue;
    var scaleValue = -(this.maxValue / Math.pow(this.param_a, this.param_b))
        * Math.pow(this.param_a - distance, this.param_b) + this.maxValue;
    return this.adjuster(scaleValue)
  };
  var scaleToDistance = (scale) => {
    if (scale < 0) return 0;
    if (scale >= this.maxValue) return this.param_a;
    var distance = this.param_a * (1 - Math.pow(1 - scale / this.maxValue, 1 / this.param_b));
    return distance;
  };
  this.setShowPauseVisual = (func) => {
    this.showPauseVisual = func;
  }
  this.setHidePauseVisual = (func) => {
    this.hidePauseVisual = func;
  }
  this.updateDivot = (divot) => {
    this.divot = divot;
  };
  this.mapDistanceToStandardScale = (distance) => {
    if (this.divot.length == 0) {
      this.updateDivot(Array.from(new Array(this.maxValue + 1),
          (val, index) => index).map(x => scaleToDistance(x)));
    }

    if (distance <= this.divot[1] + this.param_c) {
      if (distance < this.divot[1] - this.param_c) {
        this.hidePauseVisual();
        let factor = this.divot[1] / (this.divot[1] - this.param_c);
        return distanceToScale(factor * distance);
      }
      else {
        this.showPauseVisual();
        return 1.0;
      }
    }

    for (let i = 2; i < this.divot.length; i++) {
      let point_start = this.divot[i - 1] + this.param_c,
          point_mid = this.divot[i] - this.param_c,
          point_end = this.divot[i] + this.param_c;
      if (distance >= point_start && distance < point_mid) {
        this.hidePauseVisual();
        let factor = (this.divot[i] - this.divot[i - 1]) /
            (this.divot[i] - this.divot[i - 1] - 2 * this.param_c);
        let tmp_dis = factor * (distance - (this.divot[i - 1] + this.param_c)) + this.divot[i - 1];
        return distanceToScale(tmp_dis);
      }
      else if (distance >= point_mid && distance < point_end) {
        this.showPauseVisual();
        return parseFloat(i.toFixed(1));
      }
    }

    return distanceToScale(distance)
  };
  this.mapStandardScaleToDistance = (value) => {
    return scaleToDistance(value)
  };

  /*********************/
  /* For Test parameter */
  /*********************/
  this.updateParameter = (a, b, c, d) => {
    this.param_a = a;
    this.param_b = b;
    this.param_c = c;
    if (d) {
      this.param_d = d;
      this.adjuster = setAdjustFunctions(this.param_d);
    }
    this.divot = [];
  }
}
