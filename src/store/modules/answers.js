import axios from 'axios';

import * as Answer from '../../utiljs/answer';
import InputMode from '../../constants/input_mode_id';

const state = {
  answersList: [],
}

const getters = {
  getFirstNotFinishedID: (state) => {
    let firstID = (state.answersList.find(answer => answer.value == null || answer.value === ''))
    return firstID ? firstID.question_id : null;
  },

  getAnswersListLength: (state) => Object.keys(state.answersList).length,

  getAnswers: (state) => state.answersList,

  getAnswerById: (state) => (id) => {
    return state.answersList.find(answer => answer.question_id === id)
  },

  getAnswerValueById: (state) => (id) => {
    let answer = state.answersList.find(answer => answer.question_id === id)
    return answer ? answer.value : "";
  },

  answerResultsList: (state) => {
    return state.answersList.map(answer => {
      return answer.getAnswer();
    });
  },

  isCompleted: (state) => {
    return state.answersList.reduce((result, x) => {
      return result && (x.value != null);
    }, true);
  }
}

const mutations = {
  pushNewAnswerById(state, question) {
    let ansString = getAnswerInLocalStorage(question.question_id);
    let ans = ansString ? stringToAnswerObject(question.input_mode, ansString)
        : createAnswerByInputMode(question.input_mode, question.question_id);
    state.answersList.push(ans);
  },

  startAnswerById(state, id) {
    state.answersList.find(answer => answer.question_id === id).start();
  },

  stopAnswerById(state, id) {
    let answer = state.answersList.find(answer => answer.question_id === id);
    answer.end();
    saveAnswerInLocalStorage(id, answer);
  },

  resetAnswerById(state, id) {
    let answer = state.answersList.find(answer => answer.question_id === id);
    let localStoreObj = JSON.parse(getAnswerInLocalStorage(id))
    let preAnswerValue = localStoreObj ? localStoreObj.value : null;
    answer.resetValue(preAnswerValue);
    answer.end();
    saveAnswerInLocalStorage(id, answer);
  },

  initializeAnswerById(state, {id, value}) {
    let answer = state.answersList.find(answer => answer.question_id === id);
    answer.initialize(value);
  },

  updateAnswerValueById(state, {id, value}) {
    let answer = state.answersList.find(answer => answer.question_id === id);
    answer.updateValue(value);
  },

  startDetectSwipeById(state, {id, value}) {
    let answer = state.answersList.find(answer => answer.question_id === id);
    answer.startDetect(value);
  },

  stopDetectSwipeById(state, id) {
    let answer = state.answersList.find(answer => answer.question_id === id);
    answer.endDetect();
  },

  resetAnswers(state) {
    state.answersList = [];
  }
}

const actions = {
  initializeAnswers({commit, getters}) {
    let questions = getters.getQuestions;
    questions.forEach(function (q) {
      commit('pushNewAnswerById', q);
    })
  },

  updateAnswerById({commit}, payload) {
    return new Promise((resolve) => {
      commit('updateAnswerValueById', {id: payload.id, value: payload.value});
      resolve();
    });
  },

  initializeAnswerById({commit}, payload) {
    commit('initializeAnswerById', {id: payload.id, value: payload.value})
  },

  startTimingById({commit}, id) {
    commit('startAnswerById', id);
  },

  stopTimingById({commit}, id) {
    commit('stopAnswerById', id);
  },

  startDetectById({commit}, {id, value}) {
    commit("startDetectSwipeById", {id: id, value: value});
  },

  endDetectById({commit}, id) {
    commit("stopDetectSwipeById", id)
  },

  resetAnswerById({commit}, id) {
    commit('resetAnswerById', id)
  },

  submitAnswer({rootState, commit, getters}) {
    commit('setSurveyEndTime');
    let result = {
      username: rootState.username ? rootState.username : localStorage.getItem('USERNAME'),
      survey_token: localStorage.getItem('TOKEN'),
      survey_start_time: rootState.questions.surveyStartTime,
      survey_end_time: rootState.questions.surveyEndTime,
      answers: getters.answerResultsList
    }
    if (rootState.survey.surveyGroup) {
      result.survey_group_id = rootState.survey.surveyGroup
    }
    console.log("result:", JSON.parse(JSON.stringify(result)))
    return new Promise((resolve, reject) => {
      axios.post("/submitAnswer", result)
          .then(res => {
            console.log(res.data);
            resolve(res.data);
          })
          .catch(error => {
            console.log(error.message);
            reject(error);
          })
    })
  },

  clearLocalStorage({rootState, commit}) {
    var username = rootState.username ? rootState.username : localStorage.getItem('USERNAME');
    localStorage.clear();
    localStorage.setItem('USERNAME', username);
    commit('resetQuestions');
    commit('resetAnswers');
  }
}

function getAnswerInLocalStorage(question_id) {
  return localStorage.getItem('ANSWER_' + question_id)
}

function saveAnswerInLocalStorage(question_id, answer_obj) {
  localStorage.setItem('ANSWER_' + question_id, JSON.stringify(answer_obj))
}

function createAnswerByInputMode(input_mode, question_id) {
  switch (input_mode) {
    case InputMode.MULTIPLE_CHOICE_INPUT_MODE:
      return new Answer.MultipleChoiceAnswer(question_id);
    case InputMode.LIKERT_INPUT_MODE:
      return new Answer.MultipleChoiceAnswer(question_id);
    case InputMode.SWIPE_INPUT_MODE:
      return new Answer.SwipeAnswer(question_id);
    case InputMode.MINOR_SWIPE_INPUT_MODE:
      return new Answer.SwipeAnswer(question_id);
    case InputMode.COGS_SWIPE_INPUT_MODE:
      return new Answer.SwipeAnswer(question_id);
    case InputMode.SLIDER_INPUT_MODE:
      return new Answer.SliderAnswer(question_id);
    case InputMode.VAS_INPUT_MODE:
      return new Answer.SliderAnswer(question_id);
    case InputMode.TEXT_BOX_INPUT_MODE:
      return new Answer.TextBoxAnswer(question_id);
    case InputMode.ELASTIC_PULL_INPUT_MODE:
      return new Answer.ElasticPullAnswer(question_id);
    case InputMode.COGS_ELASTIC_PULL_INPUT_MODE:
      return new Answer.ElasticPullAnswer(question_id);
    default:
      return new Answer.MultipleChoiceAnswer(question_id);
  }
}

function stringToAnswerObject(input_mode, objSting) {
  let object = JSON.parse(objSting),
      result = createAnswerByInputMode(input_mode, object.question_id);
  if (result) {
    result.setAttributes(object);
  }
  return result;
}

export default {
  state,
  getters,
  mutations,
  actions
}