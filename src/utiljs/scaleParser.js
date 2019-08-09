const d3 = require("d3-scale");

export const ScaleParser = function (scale) {
  this.descriptions = scale.map(x => x.title);
  this.scaleList = scale.map(x => x.value);

  let indexList = scale.map((val, index) => index);
  this.indexScale = d3.scaleLinear()
      .domain(indexList)
      .range(this.scaleList)
      .clamp(true);
  // console.log(this.scaleList)
  this.getScaleValue = (val) => {
    // return this.scaleList[val];
    return this.indexScale(val);
  };
  this.getDescription = (val) => {
    return this.descriptions[val];
  };
  this.getStandardValue = (val) => {
    // return this.scaleList.indexOf(val);
    return this.indexScale.invert(val)
  }
}