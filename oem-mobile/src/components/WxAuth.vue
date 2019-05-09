<template>
  <div style="text-align:center;">
    <h2>微信登陆中</h2>
  </div>
</template>

<script>

export default {
  data() {
    return {
      form: {},
    };
  },
  async created() {
    const { code, redirect } = this.$route.query;

    const ua = window.navigator.userAgent;
    if (code) {
      // await this.$store.commit('setWxOpenId', `code:${}`);
      try {
        // 使用code换取openid
        const wxOpenId = (await this.$http.post('/api/exchange_wxopenid', { code })).body;
        await this.$store.commit('setWxOpenId', wxOpenId);
        this.$router.push(localStorage.getItem('redirect') || '/');
      } catch (e) {
        location.href = '/';
        // this.$router.push('/');
        // const message = e.bodyText || e.message;
        // this.$vux.toast.text(message);
      }
    } else if (ua.match(/MicroMessenger/i)) {
      localStorage.setItem('redirect', redirect);
      const wx_app_id = 'wx665c06ee53103fbb';
      const redirectUri = `http://oem.hello.com/wx_auth/${location.host}`;
      location.href = `http://open.weixin.qq.com/connect/oauth2/authorize?appid=${wx_app_id}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect`;
    } else {
      this.$router.push(redirect || '/');
    }
  },
  mounted() {
    document.title = '微信登陆中';
  },
};
</script>

<style scoped lang="less">
</style>
