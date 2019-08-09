import Vue from 'vue';
import Vuelidate from 'vuelidate';
import App from './App.vue';
import axios from 'axios';
import {router} from './routes';
import {store} from './store/index';

Vue.use(Vuelidate);
console.log(process.env.VUE_APP_API_HOST)
axios.defaults.baseURL = process.env.VUE_APP_API_HOST;

// axios.defaults.headers.common = {
//     "Content-type": "application/x-www-form-urlencoded",
//     'X-PINGOTHER':'pingpong'
// };
// console.log("env config", process.env.VUE_APP_API_HOST)

// intercept requests or responses before they are handled by then or catch

// const reqInterceptor =
// axios.interceptors.request.use(config => {
//     console.log("Request Interceptors", config);
// return config;
// // return Promise.reject(error)
// })

// const resInterceptor =
axios.interceptors.response.use(res => {
  // console.log("Response Interceptors", res)
  return res;
}, error => {
  // TODO: deal with the error
  // error => Promise.resolve(error.response)
  // console.log(error, error.response.status)
  if (error.message == "Network Error") {
    store.dispatch("setNetworkError");
  }
  return error;
})
// need to remove an interceptor later you
// axios.interceptors.request.eject(reqInterceptor); // eject sth
// axios.interceptors.response.eject(resInterceptor);


router.beforeEach((to, from, next) => {
  // all views are able to scroll except for survey view
  if (to.name == 'survey') {
    document.body.parentNode.style.overflow = "hidden";
    if (store.getters.isIOS) {
      document.body.setAttribute("ontouchmove", "event.preventDefault()");
      document.body.style.overflow = "hidden";
      document.body.style.position = "relative";
    }
  }
  else {
    // console.log(to.name)
    document.body.parentNode.style.overflow = "scroll";
    if (store.getters.isIOS) {
      document.body.setAttribute("ontouchmove", null);
      document.body.style.overflow = "scroll";
      document.body.style.position = "initial";
    }
  }
  next();
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
