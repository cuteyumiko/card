// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuex from 'vuex';
import Resource from 'vue-resource';
import ElementUI from 'element-ui';
import moment from 'moment';
import tinymce from 'vue-tinymce-editor';

import 'element-ui/lib/theme-chalk/index.css';
import 'normalize.css';
import 'quill/dist/quill.core.css';
import 'vue-tinymce-editor/docs/dist/static/langs/zh_CN';

import App from './App';
import router from './router';

Vue.config.productionTip = false;

Vue.use(Vuex);
Vue.use(Resource);
Vue.use(ElementUI, { size: 'small' });
moment.locale('zh-cn');
Vue.component('tinymce', tinymce);

const tokenKey = 'bank-oem-admin-token';
const store = new Vuex.Store({
  state() {
    const token = localStorage.getItem(tokenKey);
    if (token) Vue.http.headers.common['X-Token'] = token;
    return {
      token,
      info: {},
      merchant: {},
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

    setMerchant(state, merchant) {
      state.merchant = merchant;
    },
  },
});

const whiteList = ['/login', '/join'];
router.beforeEach(async (to, from, next) => {
  console.log(to);
  if (store.state.token || whiteList.indexOf(to.path) !== -1) {
    next();
  } else {
    next({ path: '/login', redirect: to.fullPath });
  }
});

(async function () {
  const merchant = (await Vue.http.get('/api/m/info')).body[0];
  document.title = `${merchant.name}后台管理系统`;
  store.commit('setMerchant', merchant);
  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>',
  });
}());
