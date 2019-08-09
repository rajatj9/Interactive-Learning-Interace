import Vue from 'vue'
import Vuex from 'vuex'

import survey from './modules/survey';
import questions from './modules/questions';
import answers from './modules/answers';
import messages from './modules/messages';

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    survey,
    questions,
    answers,
    messages
  },
  state: {
    fontHeight: 20, // For normal mobile
    fontWeight: 20,
    // carouselWidth: 0,
    // carouselHeight: 0
  },
  getters: {
    axisFontHeight: state => state.fontHeight,
    axisFontWidth: state => state.fontWeight
    // appCarouselWidth: state => state.carouselWidth,
    // appCarouselHeight: state => state.carouselHeight
  },
  // mutations: {
  //     setCarouselSize: (state, payload) => {
  //         state.carouselWidth = payload.width;
  //         state.carouselHeight = payload.height;
  //     }
  // },
  // actions: {
  //     setCarouselSize: ({ commit }, payload ) => {
  //         return new Promise((resolve) => {
  //             commit('setCarouselSize', payload);
  //             resolve();
  //         })
  //     }
  // }
});

