<template>
  <div style="background:#efefef;flex:1;">
    <div>

      <img src="/static/mobile-share-join.png"  style="width:100%;"/>


      <vux-x-input title="手机号码" v-model="form.mobile" placeholder="请输入手机号码" keyboard="number"></vux-x-input>

      <vux-x-input title="验证码" v-model="form.sms_code" placeholder="请输入验证码" keyboard="number">
        <vux-x-button :disabled="smsCountDown > 0" @click.native="fetchSmsCode" slot="right" mini>{{smsCountDown > 0 ? `${smsCountDown}秒后重新获取` : '发送验证码'}}</vux-x-button>
      </vux-x-input>

      <vux-x-input title="密码" v-model="form.password" placeholder="请输入密码"></vux-x-input>

      <vux-x-input :readonly="referee" title="推荐人手机号" v-model="form.referee_0_mobile" placeholder="请输入手机号码" keyboard="number">
        <i class="iconfont icon-iconfonttuijianren" slot="label" style="margin-right:10px;" />
      </vux-x-input>

      <div style="text-align:center;padding:10px;background:#333e5f;color:#fff;" @click="submitForm">注册</div>

      <div>阅读并同意条款《平台服务协议》</div>

      <div style="height:500px;"></div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      form: {},
      referee: null,

      smsCountDown: 0,
      smsCountDownInterval: null,
    };
  },
  methods: {
    async fetchSmsCode() {
      const { mobile } = this.form;
      this.smsCountDown = 30;
      try {
        this.form.sms_code_id = (await this.$http.post('/api/sms_code', { mobile, code: 'join.code' })).body.id;
        this.smsCountDownInterval = setInterval(() => {
          this.smsCountDown -= 1;

          if (this.smsCountDown <= 0) {
            clearInterval(this.smsCountDownInterval);
            this.smsCountDownInterval = null;
          }
        }, 1000);
      } catch (e) {
        this.nextFetchSecond = 0;
        const message = e.bodyText || e.message;
        this.$vux.toast.text(message);
      }
    },
    async submitForm() {
      const { ...form } = this.form;
      if (this.referee) form.referee_id = this.referee.id;
      try {
        await this.$http.post('/api/register', form);
        form.auth_type = 'oem-mobile';
        const { info, token } = (await this.$http.post('/api/authorize', form)).body;
        await this.$store.commit('setToken', { token, info });
        this.$vux.toast.text(`注册成功，${info.display_name}`);
        this.$router.push('/');
      } catch (e) {
        const message = e.bodyText || e.message;
        this.$vux.toast.text(message);
      }
    },
  },
  async mounted() {
    const { referee } = this.$route.query;
    if (referee) {
      this.referee = (await this.$http.get(`/api/user/${referee}`)).body;
      this.form = {
        referee_0_mobile: this.referee.mobile,
      };
    }
  },
  destroyed() {
    if (this.smsCountDownInterval) {
      clearInterval(this.smsCountDownInterval);
    }
  },
};
</script>

<style scoped lang="less">
</style>
