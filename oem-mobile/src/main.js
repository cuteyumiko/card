// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuex from 'vuex';
import Resource from 'vue-resource';
import _ from 'lodash';
import VueQr from 'vue-qr';
import moment from 'moment';

import {
  XInput, XButton, Group, XTextarea,
  Tabbar, TabbarItem, Checklist, PopupRadio,
  ButtonTab, ButtonTabItem,
  PopupPicker, Actionsheet,
  Grid, GridItem, Scroller,
  Marquee, MarqueeItem,
  Tab, TabItem, Swiper, SwiperItem,
  XDialog,
  ToastPlugin, LoadingPlugin, ConfirmPlugin,
} from 'vux';
import VueAwesomeSwiper from 'vue-awesome-swiper';

import 'lib-flexible/flexible';
import 'swiper/dist/css/swiper.css';
import 'normalize.css';
import 'quill/dist/quill.core.css';
// import 'quill/dist/quill.snow.css';
// import 'quill/dist/quill.bubble.css';

import App from './App';
import router from './router';

Vue.use(Vuex);
Vue.use(Resource);

_.forEach([
  XInput, XButton, Group, XTextarea,
  Tabbar, TabbarItem, Checklist, PopupRadio,
  ButtonTab, ButtonTabItem,
  PopupPicker, Actionsheet,
  Grid, GridItem, Scroller,
  Marquee, MarqueeItem,
  Tab, TabItem, Swiper, SwiperItem,
  XDialog,
], o => Vue.component(`vux-${o.name}`, o));

_.forEach([
  VueQr,
], o => Vue.component(o.name, o));

_.forEach([
  ToastPlugin, LoadingPlugin, ConfirmPlugin,
], o => Vue.use(o));

Vue.use(VueAwesomeSwiper, {});

moment.locale('zh-cn');

Vue.config.productionTip = false;

const tokenKey = 'bank-oem-token';
const store = new Vuex.Store({
  state() {
    const token = localStorage.getItem(tokenKey);
    const wxOpenId = localStorage.getItem('bank-wx-openid');
    if (token) Vue.http.headers.common['X-Token'] = token;
    return {
      token,
      info: {},
      merchant: {},
      bankCardId: null,
      wxOpenId,
      loginSuccessRedirect: '',
      authVisible: false,
      clearAuthVisible: false,
    };
  },
  mutations: {
    setToken(state, { token, info }) {
      localStorage.setItem(tokenKey, token);
      Vue.http.headers.common['X-Token'] = token;
      state.token = token;
      state.info = info;
      state.authVisible = (info.user.status === 1);
      state.clearAuthVisible = false;
    },
    setTokenInfo(state, info) {
      state.info = info;
      state.authVisible = (info.user.status === 1);
      state.clearAuthVisible = false;
    },
    clearToken(state) {
      localStorage.removeItem(tokenKey);
      Vue.http.headers.common['X-Token'] = undefined;
      state.token = null;
      state.info = {};
      state.authVisible = false;
      state.clearAuthVisible = false;
      state.bankCardId = null;
    },

    setMerchant(state, merchant) {
      state.merchant = merchant;
    },

    selectBankCard(state, id) {
      state.bankCardId = id;
    },

    setWxOpenId(state, wxOpenId) {
      localStorage.setItem('bank-wx-openid', wxOpenId);
      state.wxOpenId = wxOpenId;
    },

    setLoginSuccessRedirect(state, loginSuccessRedirect) {
      state.loginSuccessRedirect = loginSuccessRedirect;
    },

    clearAuthVisible(state) {
      state.clearAuthVisible = true;
    },
  },
});

const whiteList = ['/login', '/join', '/forgot', '/license', '/product_card_apply', '/product_loan_apply', '/product_shop', '/share_link_join', '/wx_auth', '/course', '/course_detial', '/app_download', '/app_download2'];
router.beforeEach(async (to, from, next) => {
  const ua = window.navigator.userAgent;
  if (ua.match(/MicroMessenger/i) && !store.state.wxOpenId && to.path !== '/wx_auth') {
    next({ path: '/wx_auth', query: { redirect: to.fullPath } });
  } else if (store.state.token || whiteList.indexOf(to.path) !== -1) {
    next();
  } else {
    console.log('未登录，跳转到登陆页');
    next({ path: '/login', redirect: to.fullPath });
  }
});

router.afterEach((to) => {
  if (window.originalPostMessage) {
    window.postMessage(to.fullPath);
  }
});

Vue.filter('mobieFormat', value => (value ? value.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : ''));
Vue.filter('dateFormat', (value, format = 'YYYY-MM-DD HH:mm:ss') => ((value && value !== '0000-00-00 00:00:00') ? moment(value).format(format) : ''));
Vue.filter('dateFromNow', value => ((value && value !== '0000-00-00 00:00:00') ? moment(value).fromNow() : ''));

(async function () {
  const merchant = (await Vue.http.get('/api/m/info')).body[0];
  const extendImageList = (await Vue.http.get('/api/m/extend?type_id=3')).body;
  const extendTextList = (await Vue.http.get('/api/m/extend?type_id=1')).body;
  const extendBooleanList = (await Vue.http.get('/api/m/extend?type_id=5')).body;
  document.title = merchant.name;
  merchant.extendImage = _([...extendImageList, ...extendTextList, ...extendBooleanList]).mapKeys('code').mapValues('value').value();
  store.commit('setMerchant', merchant);

  if (store.state.token) {
    try {
      const info = (await Vue.http.get('/api/token_info')).body;
      store.commit('setTokenInfo', info);
    } catch (e) {
      console.log(e);
    }
  }

  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>',
  });
}());
