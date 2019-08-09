import {router} from '../../routes';

const state = {
  questionsList: [],
  surveyStartTime: '',
  surveyEndTime: ''
}

const getters = {
  getQuestions: (state) => {
    return state.questionsList.map((question) => {
      return {
        title: question.title,
        sequence: question.sequence,
        input_mode: question.input_mode_id,
        scale: question.scale_unit,
        question_id: question.question_id,
        title_image: question.title_image
      }
    })
  },

  getFirstNotFinishedSequence: (state, getters) => () => {
    let q = state.questionsList.find(
        question => question.question_id === getters.getFirstNotFinishedID);
    return q ? q.sequence : null;
  },

  isQuestionsListEmpty: state => {
    return state.questionsList.length <= 0 ? true : false;
  },

  surveyQuestionLength: state => state.questionsList.length
}

const mutations = {
  setSurveyQuestions(state, questions) {
    state.questionsList = questions;
  },

  setSurveyStartTime(state, time) {
    state.surveyStartTime = time;
  },

  setSurveyEndTime(state) {
    let currentSurveyTime = new Date();
    state.surveyEndTime = currentSurveyTime.toISOString();
  },

  resetQuestions(state) {
    state.questionsList = [];
  }
}

const actions = {
  checkQuestionsInLocalStorage({commit, getters}) {
    let localString = localStorage.getItem('SURVEY');
    if (localString) {
      let surveyObj = JSON.parse(localString);
      if (!getters.appSurveyToken) {
        commit('setSurveyToken', localStorage.getItem('TOKEN'));
        // survey group
        if (localStorage.getItem('SURVEY_GROUP')) {
          commit('setSurveyGroup', localStorage.getItem('SURVEY_GROUP'));
        }
      }
      if (surveyObj['survey_token'] == getters.appSurveyToken) {
        commit('setSurveyQuestions', surveyObj['questions']);
        commit('setSurveyStartTime', surveyObj['survey_startTime']);
        commit('setSurveyName', surveyObj['survey_name']);
      }
      else {
        console.log("not same token ")
        router.push({name: 'auth'});
      }
    }
    else {
      console.log("no local string ")
      router.push({name: 'auth'});
    }
  }

}

export default {
  state,
  getters,
  mutations,
  actions
}