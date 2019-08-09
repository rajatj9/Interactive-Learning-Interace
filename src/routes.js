import Vue from 'vue';
import VueRouter from 'vue-router';

import Auth from './views/Auth.vue';
import Survey from './views/Survey.vue';
import Overview from './views/Overview.vue';
import Error from './views/Error.vue';
import Thanks from './views/ThankYou.vue';

import SignUp from './components/auth/SignUp.vue';
import SignIn from './components/auth/SignIn.vue';

import Home from './views/Home.vue'

const routes = [
  {path: '', component: Home},
  {
    path: '/auth', name: "auth", component: Auth, children: [
      // { path: '', component: SignUp},
      {path: 'SignUp', component: SignUp, name: "signUp"},
      {path: 'SignIn', component: SignIn, name: "signIn"},
      // { path: 'error', component: Error, name: "authError" },
    ]
  },
  {
    path: '/survey', component: Survey, name: 'survey',
    beforeEnter: (to, from, next) => {
      // protect: insure that survey_token should be passed to the component
      if (to.query.survey_token) {
        next();
      }
      else { // TODO: missing token
        next({name: 'error'});
      }
    }
  },
  {path: '/overview', component: Overview, name: 'overview'},
  {path: '/thanks', component: Thanks, name: 'thanks'},
  {path: '/error', component: Error, name: 'error'},

  {path: '/signup', redirect: {name: "signUp"}},
  {path: '/signin', redirect: {name: "signIn"}},


  {path: '*', redirect: {name: "error"}}
];


Vue.use(VueRouter);
export const router = new VueRouter({
  routes: routes,
  // mode: 'history'
});