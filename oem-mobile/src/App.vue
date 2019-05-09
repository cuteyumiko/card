<template>
  <div id="app">
    <router-link v-if="!homeButtonHide && !homeHide" tag="div" to="/" style="position:fixed;right:0;z-index:999;top:35px;height:50px;width:50px;border-radius:25px;background:rgba(219, 225, 230, 0.733);display:flex;align-items:center;justify-content:center;color:#0074ac;">
      <i class="iconfont icon-shouye" style="font-size:30px;" />
    </router-link>
    <router-view />

    <div v-transfer-dom>
      <vux-x-dialog :show="showAuthVisible" hide-on-blur="true" :dialog-style="{'background-color': 'transparent'}">
        <div style="text-align:center;" @click="goAuth"><img src="/static/alert-auth.png" style="width:80%;" /></div>
      </vux-x-dialog>
    </div>
  </div>
</template>

<script>
import {
  mapState,
} from 'vuex';
import wx from 'weixin-js-sdk';

const wx_config = params => new Promise((resolve) => {
  wx.ready(() => resolve());
  wx.error(res => alert(res.errMsg));
  wx.config(params);
});

export default {
  data() {
    return {
    };
  },
  computed: {
    ...mapState({
      token: state => state.token,
      wxOpenId: state => state.wxOpenId,
      info: state => state.info,
      showAuthVisible: state => state.authVisible && !state.clearAuthVisible,
      homeButtonHide: state => state.merchant.extendImage.home_button_hide,
    }),

    homeHide() {
      return ['/product_shop'].indexOf(this.$route.path) >= 0;
    },
  },
  methods: {
    async goAuth() {
      this.$router.push('/my_info');
    },
  },
  async mounted() {
    // if (this.token) {
    //   try {
    //     const info = (await this.$http.get('/api/token_info')).body;
    //     this.$store.commit('setTokenInfo', info);
    //   } catch (e) {
    //     await this.$store.commit('clearToken');
    //     this.$router.push('/login');
    //   }
    // }


    if (this.wxOpenId) {
      try {
        const config = (await this.$http.post('/api/wx_config', { url: location.href })).body;
        await wx_config({
          ...config,
          jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'],
        });
      } catch (e) {
        // const message = e.bodyText || e.message;
        // this.$vux.toast.text(message);
      }
    }
  },
};
</script>

<style>
@import url(//at.alicdn.com/t/font_601006_dva50fb6kvnuq5mi.css);

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  font-size: 0.4rem;
  height: 100%;
}

body, html {
  height: 100%;
}

body {
  padding-top: constant(safe-area-inset-top);
}

.ql-editor {
  white-space:normal !important;
}
</style>

<style lang="less">
@import '~vux/src/styles/reset.less';
</style>
