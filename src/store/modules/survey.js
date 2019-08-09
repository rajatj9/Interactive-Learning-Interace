import axios from 'axios';
import {router} from '../../routes';

const state = {
  surveyToken: '', //'eZybOoYwun5sFE34uQ6w',
  username: '',
  surveyName: '',
  surveyGroup: ''
}

const getters = {
  appSurveyToken: state => state.surveyToken,
  appUsername: state => state.username,
  appSurveyName: state => state.surveyName,
  appSurveyGroup: state => state.surveyGroup
}

const mutations = {
  setUsername(state, payload) {
    state.username = payload;
  },

  setSurveyToken(state, payload) {
    state.surveyToken = payload;
    localStorage.setItem('TOKEN', payload)
  },

  setSurveyName(state, payload) {
    state.surveyName = payload;
  },

  setSurveyGroup(state, payload) {
    state.surveyGroup = payload;
    localStorage.setItem('SURVEY_GROUP', payload)
  },

  clearSurveyGroup(state) {
    state.surveyGroup = '';
    localStorage.removeItem('SURVEY_GROUP');
  }
}

const saveQuestionsInLocalStorage = (username, response_data) => {
  localStorage.setItem('USERNAME', username);
  localStorage.setItem('SURVEY', JSON.stringify(response_data))
}

const configureSurveyQuestionsByResponse = ({commit, state}, response_data) => {
  commit('setSurveyName', response_data.survey_name);
  commit('setSurveyQuestions', response_data.questions);
  let currentSurveyTime = new Date();
  commit('setSurveyStartTime', currentSurveyTime.toISOString());
  saveQuestionsInLocalStorage(state.username, Object.assign({
    survey_startTime: currentSurveyTime.toISOString()
  }, response_data));
}

const actions = {
  defaultAuth({commit, getters, state}, payload) {
    commit('setUsername', payload.username);
    if (!getters.appSurveyToken) {
      commit('setSurveyToken', localStorage.getItem('TOKEN'));
    }
    let authParams = "username=" + state.username + "&survey_token=" + getters.appSurveyToken;
    if (getters.appSurveyGroup) {
      authParams += "&survey_group_id=" + getters.appSurveyGroup;
    }
    let targetURL = payload.login ? '/signIn' : '/signUp';

    return new Promise((resolve, reject) => {
      axios.post(targetURL, authParams)
          .then(res => {
            if (res.data.questions) {
              // console.log(res.data);
              configureSurveyQuestionsByResponse({commit, state}, res.data);
              var query_queries = {survey_token: getters.appSurveyToken}
              if (state.surveyGroup) {
                query_queries.survey_group = state.surveyGroup;
              }
              router.push({name: 'survey', query: query_queries})
            }
            // TODO: length of question is zero
            else if (res.data.message) {
              // console.log(res.data)
              resolve(res.data.message);
            }
            else {
              // TODO: to deal with the error
              console.log(res.data);
            }
          })
          .catch(error => {
            // TODO: deal with token is empty
            console.log(authParams);
            console.log(error.response);
            reject(error);
          })
    })
  },

  setSurveyToken({commit}, token) {
    commit('setSurveyToken', token)
  },

  setSurveyGroup({commit}, group_id) {
    return new Promise((resolve) => {
      if (group_id) {
        commit('setSurveyGroup', group_id);
      }
      else {
        commit('clearSurveyGroup');
      }
      resolve
    })

  }

}

export default {
  state,
  getters,
  mutations,
  actions
}