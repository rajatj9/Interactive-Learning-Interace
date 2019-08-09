// An api for empty class (object) to deal with the base operation for all kinds of input mode

function getCurrentTime() {
  var cur_time = new Date();
  return cur_time.toLocaleTimeString(); //.toISOString()
}

function toPrecision(val, place) {
  return parseFloat(val.toFixed(place))
}

function Answer(question_id) {
  this.question_id = question_id;
  this.value = null;
  this.answer_time = [];
  this.operations = [];
  this.tmp_timestamp = null;
}

Answer.prototype.getAnswer = function () {
  return {
    question_id: this.question_id,
    value: this.value,
    answer_time: this.answer_time
  }
}
Answer.prototype.start = function () {
  this.tmp_timestamp = getCurrentTime();
}
Answer.prototype.end = function () {
  this.answer_time.push({
    // start time is not checked, it will be null if start function isn't called before calling end function
    start_time: this.tmp_timestamp,
    end_time: getCurrentTime()
  });
  this.tmp_timestamp = null;
}
Answer.prototype.setAttributes = function (payload) {
  for (var i in payload) {
    this[i] = payload[i]
  }
}
Answer.prototype.initialize = function (value) {
  if (this.operations.length == 0) {
    this.value = value;
    this.operations.push({
      time: getCurrentTime(),
      initial: value
    });
  }
}
Answer.prototype.resetValue = function (value) {
  this.value = value;
  this.operations.push({
    time: getCurrentTime(),
    reset: value
  });
}

export const MultipleChoiceAnswer = function (question_id) {
  Answer.call(this, question_id);
}
MultipleChoiceAnswer.prototype = Object.create(Answer.prototype, {
  updateValue: {
    value: function (value) {
      this.value = value;
      this.operations.push({
        time: getCurrentTime(),
        value: value
      });
    },
    enumerable: true,
    configurable: true,
    writable: true
  },

  getAnswer: {
    value: function () {
      var answerObj = Answer.prototype.getAnswer.apply(this, arguments);
      answerObj.operations = this.operations;
      return answerObj;
    },
    enumerable: true,
    configurable: true,
    writable: true
  }
})
// MultipleChoiceAnswer.prototype.constructor = MultipleChoiceAnswer;


export const SwipeAnswer = function (question_id) {
  Answer.call(this, question_id);
  this.start_value = null;
  this.start_time = null;
}
SwipeAnswer.prototype = Object.create(Answer.prototype, {
  startDetect: {
    value: function (value) {
      this.start_value = value;
      this.start_time = getCurrentTime();
    },
    enumerable: true,
    configurable: true,
    writable: true
  },

  endDetect: {
    value: function () {
      this.start_value = null;
      this.start_time = null;
    },
    enumerable: true,
    configurable: true,
    writable: true
  },

  updateValue: {
    value: function (payload) {
      this.value = payload.value;
      this.operations.push({
        start_value: toPrecision(this.start_value, 3),
        start_time: this.start_time,
        end_value: toPrecision(payload.value, 3),
        end_time: getCurrentTime(),
        start_position: payload.detector.startPoint,
        end_position: payload.detector.endPoint,
        track: payload.detector.track
      });
      // console.log(this)
      // this.endDetect();
    },
    enumerable: true,
    configurable: true,
    writable: true
  },

  getAnswer: {
    value: function () {
      var answerObj = Answer.prototype.getAnswer.apply(this, arguments);
      // let operations = {};
      // this.operations.map( x => {
      //     Object.keys(x).map(item => {
      //         operations[item] ? operations[item].push(x[item])
      //             : operations[item] = [x[item]];
      //     })
      // });
      // answerObj.operations = operations;
      answerObj.operations = this.operations;
      return answerObj;
    },
    enumerable: true,
    configurable: true,
    writable: true
  }
})


export const SliderAnswer = function (question_id) {
  SwipeAnswer.call(this, question_id);
}
SliderAnswer.prototype = Object.create(SwipeAnswer.prototype, {
  updateValue: {
    value: function (payload) {
      this.value = payload.value;
      if (this.start_time) {
        this.operations.push({
          type: "drag",
          start_value: toPrecision(this.start_value, 1),
          start_time: this.start_time,
          end_value: payload.value, //toPrecision(payload.value, 3),
          end_time: getCurrentTime(),
          start_position: payload.detector.startPoint,
          end_position: payload.detector.endPoint,
          track: payload.detector.track
        });
      }
      else {
        this.operations.push({
          type: "click",
          time: getCurrentTime(),
          value: payload.value, //toPrecision(payload.value, 3),
          position: payload.position

        });
      }
      // console.log(this)
    },
    enumerable: true,
    configurable: true,
    writable: true
  },
  getAnswer: {
    value: function () {
      var answerObj = Answer.prototype.getAnswer.apply(this, arguments);
      answerObj.operations = this.operations;
      return answerObj;
    },
    enumerable: true,
    configurable: true,
    writable: true
  }
})


export const TextBoxAnswer = function (question_id) {
  Answer.call(this, question_id);
  this.operations = "Null";
}
TextBoxAnswer.prototype = Object.create(Answer.prototype, {
  updateValue: {
    value: function (value) {
      this.value = value;
    },
    enumerable: true,
    configurable: true,
    writable: true
  },
  resetValue: {
    value: function (value) {
      this.value = value;
    },
    enumerable: true,
    configurable: true,
    writable: true
  }
})


export const ElasticPullAnswer = function (question_id) {
  SwipeAnswer.call(this, question_id);
}
ElasticPullAnswer.prototype = Object.create(SwipeAnswer.prototype, {
  updateValue: {
    value: function (payload) {
      // console.log("check update value", payload)
      if (payload.isAnimationUpdated) {
        this.value = payload.value;
        this.operations.push({
          action: payload.action,
          start_value: toPrecision(this.start_value, 3),
          start_time: this.start_time,
          start_position: payload.detector.startPoint,
          end_value: toPrecision(payload.value, 3),
          end_time: getCurrentTime(),
          end_position: payload.detector.endPoint,
          stop_value: toPrecision(payload.value, 3),
          stop_time: getCurrentTime(),
          stop_position: payload.detector.endPoint,
          track: payload.detector.track
        });
      }
      else {
        if (this.operations.length) {
          var current = this.operations.length - 1;
          // console.log(this.operations[current])
          this.value = payload.value;
          this.operations[current] = Object.assign(this.operations[current], {
            stop_value: toPrecision(payload.value, 3),
            stop_time: getCurrentTime(),
            stop_position: payload.point,
          })
        }
      }
    },
    enumerable: true,
    configurable: true,
    writable: true
  }
})
