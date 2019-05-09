<template>
  <div>

    <vux-x-input title="手机号码" v-model="form.mobile" placeholder="请输入手机号码" keyboard="number">
      <i class="iconfont icon-shouji" slot="label" style="margin-right:10px;color:#59a2d5;" />
    </vux-x-input>

    <vux-x-input title="验证码" v-model="form.sms_code" placeholder="请输入验证码" keyboard="number">
      <i class="iconfont icon-securityCode-b" slot="label" style="margin-right:10px;color:#59a2d5;" />
      <vux-x-button style="border-radius:50px;background:#fff;border:1px solid #59a2d5;color:#59a2d5;" :disabled="smsCountDown > 0" @click.native="fetchSmsCode" slot="right" mini>{{smsCountDown > 0 ? `${smsCountDown}秒后重新获取` : '发送验证码'}}</vux-x-button>
    </vux-x-input>

    <vux-x-input title="密码" v-model="form.password" placeholder="请输入密码">
      <i class="iconfont icon-mima" slot="label" style="margin-right:10px;color:#59a2d5;" />
    </vux-x-input>

    <vux-x-input :readonly="referee" title="推荐人手机号" v-model="form.referee_0_mobile" placeholder="请输入手机号码" keyboard="number">
      <i class="iconfont icon-iconfonttuijianren" slot="label" style="margin-right:10px;color:#59a2d5;" />
    </vux-x-input>


    <div style="text-align:center;padding:10px;background:#59a2d5;color:#fff;margin:10px;border-radius:50px;" @click="submitForm">注册</div>

    <div style="text-align:center;"><label><input type="checkbox" v-model="agree" style="margin-right:5px;" />阅读并同意条款<router-link to="/license">《平台服务协议》</router-link></label></div>

  </div>
</template>

<script>
import {
  mapState,
} from 'vuex';

export default {
  data() {
    return {
      form: {},
      referee: null,
      agree: true,

      smsCountDown: 0,
      smsCountDownInterval: null,
    };
  },
  computed: {
    ...mapState({
      info: state => state.info,
    }),
  },
  methods: {
    async fetchSmsCode() {
      const { mobile } = this.form;

      if (!/^1\d{10}$/.test(mobile)) {
        this.$vux.toast.text('请输入正确的手机号');
        return;
      }
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
        this.$vux.toast.text('短信码已成功发出');
      } catch (e) {
        this.nextFetchSecond = 0;
        const message = e.bodyText || e.message;
        this.$vux.toast.text(message);
      }
    },
    async submitForm() {
      const { ...form } = this.form;
      form.referee_id = this.info.id;
      try {
        await this.$http.post('/api/register', form);
        this.$vux.toast.text(`注册成功，${form.mobile}`);
        this.$router.push('/');
      } catch (e) {
        const message = e.bodyText || e.message;
        this.$vux.toast.text(message);
      }
    },
  },
  async mounted() {
    document.title = '面对面开账号';
    if (this.info) {
      this.referee = (await this.$http.get(`/api/user/${this.info.id}`)).body;
      this.form.referee_0_mobile = this.referee.mobile;
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
