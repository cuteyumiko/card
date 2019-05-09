// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuex from 'vuex';
import Resource from 'vue-resource';
import ElementUI from 'element-ui';
import _ from 'lodash';
import moment from 'moment';
import VueQuillEditor from 'vue-quill-editor';
import tinymce from 'vue-tinymce-editor';
import 'vue-tinymce-editor/docs/dist/static/langs/zh_CN';

import 'element-ui/lib/theme-chalk/index.css';
import 'normalize.css';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';

import App from './App';
import router from './router';

Vue.config.productionTip = false;

Vue.use(Vuex);
Vue.use(Resource);
Vue.use(ElementUI, { size: 'small' });
moment.locale('zh-cn');
Vue.use(VueQuillEditor);
Vue.component('tinymce', tinymce);

const tokenKey = 'bank-admin-token';
const store = new Vuex.Store({
  state() {
    const token = localStorage.getItem(tokenKey);
    if (token) Vue.http.headers.common['X-Token'] = token;
    return {
      token,
      info: {},
    };
  },
  mutations: {
    setToken(state, { token, info }) {
      localStorage.setItem(tokenKey, token);
      Vue.http.headers.common['X-Token'] = token;
      state.token = token;
      state.info = info;
    },
    setTokenInfo(state, info) {
      state.info = info;
    },
    clearToken(state) {
      localStorage.removeItem(tokenKey);
      Vue.http.headers.common['X-Token'] = undefined;
      state.token = null;
      state.info = {};
    },
  },
});

Vue.filter('mobieFormat', value => (value ? value.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : ''));
Vue.filter('dateFormat', (value, format = 'YYYY-MM-DD HH:mm:ss') => ((value && value !== '0000-00-00 00:00:00') ? moment(value).format(format) : ''));
Vue.filter('dateFromNow', value => ((value && value !== '0000-00-00 00:00:00') ? moment(value).fromNow() : ''));
Vue.filter('currencyFormat', value => (_.isNumber(value) ? value.toFixed(2) : ''));


const whiteList = ['/login', '/join'];
router.beforeEach(async (to, from, next) => {
  if (store.state.token || whiteList.indexOf(to.path) !== -1) {
    next();
  } else {
    next({ path: '/login', redirect: to.fullPath });
  }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
});
