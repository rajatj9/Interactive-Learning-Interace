import axios from 'axios';
import {WRONG_TOKEN} from '../../constants/message_id';

var getBrowserInfo = function () {
  // var u = navigator.userAgent, app = navigator.appVersion;
  var u = navigator.userAgent;
  return {//移动终端浏览器版本信息
    trident: u.indexOf('Trident') > -1, //IE内核
    presto: u.indexOf('Presto') > -1, //opera内核
    webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
    mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
    android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
    iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
    iPad: u.indexOf('iPad') > -1, //是否iPad
    webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
  };
}

const state = {
  isWrongToken: false,
  browser: getBrowserInfo(),
  showingModal: {
    networkError: false,
    rotation: false,
    answerNull: false,
    // invalidUsername: false,
    // failedSubmit: false
  },
  qrCodeURL: ''
}

const getters = {
  appNetworkError: state => state.showingModal.networkError,
  appRotateWarning: state => state.showingModal.rotation,
  appWrongToken: state => state.isWrongToken,
  questionNullWarning: state => state.showingModal.answerNull,
  isMobile: state => state.browser.mobile || state.browser.android || state.browser.ios,
  isIOS: state => state.browser.ios,
  appQRCodeURL: state => state.qrCodeURL,
  appBrowser: state => state.browser,
  isShowingModal: state => {
    return Object.values(state.showingModal).reduce((a, b) => a || b)
  }
}

const mutations = {
  setNetworkError(state) {
    state.showingModal.networkError = true;
    setTimeout(() => {
      if (state.showingModal.networkError) {
        state.showingModal.networkError = false;
      }
    }, 10000);
  },
  removeNetworkError(state) {
    if (state.showingModal.networkError) {
      state.showingModal.networkError = false;
    }
  },
  setRotateWarning(state, flag) {
    state.showingModal.rotation = flag;
  },
  setShowNullWarning(state, flag) {
    state.showingModal.answerNull = flag;
  },
  setWrongToken(state, flag) {
    state.isWrongToken = flag;
  },
  setQRCodeURL(state, url) {
    state.qrCodeURL = url;
  }
}

const actions = {
  setNetworkError({commit}) {
    return new Promise((resovle) => {
      commit('setNetworkError');
      resovle();
    })
  },
  removeNetworkError({commit}) {
    return new Promise((resolve) => {
      commit('removeNetworkError');
      resolve();
    })
  },
  setRotateWarning({commit}, payload) {
    return new Promise((resolve) => {
      commit('setRotateWarning', payload);
      resolve();
    })
  },
  setShowAnswerNullWarning({commit}, payload) {
    return new Promise((resolve) => {
      commit('setShowNullWarning', payload);
      resolve();
    })
  },
  setWrongToken({commit}, payload) {
    return new Promise((resolve) => {
      commit('setWrongToken', payload);
      resolve();
    })
  },
  getQRCodeImg({getters, commit}, token) {
    let request = {survey_token: token}
    return new Promise((resolve) => {
      axios.post("getQrCode", request)
          .then(res => {
            console.log(res);
            if (res.data.message == WRONG_TOKEN) {
              commit('setWrongToken', true);
              resolve();
            }
            else {
              commit('setQRCodeURL', res.data.surveyQRCodeUrl);
              if (getters.appWrongToken) {
                commit('setWrongToken', false);
              }
              resolve();
            }
          })
          .catch(error => {
            console.log(error.message);
          })

    })
  }
}


export default {
  state,
  getters,
  mutations,
  actions
}