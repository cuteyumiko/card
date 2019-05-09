<template>
  <div>
    <div style="font-size:0;">
      <img :src="bannerImage" style="width:100%" />
    </div>

    <vux-x-input v-model="form.mobile" placeholder="请输入手机号码" keyboard="number">
      <i class="iconfont icon-shouji" slot="label" style="margin-right:10px;color:#59a2d5;" />
    </vux-x-input>

    <vux-x-input v-model="form.sms_code" placeholder="请输入验证码" keyboard="number">
      <i class="iconfont icon-securityCode-b" slot="label" style="margin-right:10px;color:#59a2d5;" />
      <vux-x-button style="border-radius:50px;background:#fff;border:1px solid #59a2d5;color:#59a2d5;" :disabled="smsCountDown > 0" @click.native="fetchSmsCode" slot="right" mini>{{smsCountDown > 0 ? `${smsCountDown}秒后重新获取` : '发送验证码'}}</vux-x-button>
    </vux-x-input>

    <vux-x-input v-model="form.password" placeholder="请输入密码">
      <i class="iconfont icon-mima" slot="label" style="margin-right:10px;color:#59a2d5;" />
    </vux-x-input>
    <vux-x-input v-model="form.password2" placeholder="请确认密码">
      <i class="iconfont icon-mima" slot="label" style="margin-right:10px;color:#59a2d5;" />
    </vux-x-input>

    <div style="text-align:center;padding:10px;background:#59a2d5;color:#fff;margin:10px;border-radius:50px;" @click="submitForm">确认</div>

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

      smsCountDown: 0,
      smsCountDownInterval: null,
    };
  },
  computed: {
    ...mapState({
      bannerImage: state => state.merchant.extendImage['login.banner'],
    }),
  },

  methods: {
    async fetchSmsCode() {
      const { mobile } = this.form;
      this.smsCountDown = 30;
      try {
        this.form.sms_code_id = (await this.$http.post('/api/sms_code', { mobile, code: 'reset.code' })).body.id;
        this.smsCountDownInterval = setInterval(() => {
          this.smsCountDown -= 1;

          if (this.smsCountDown <= 0) {
            clearInterval(this.smsCountDownInterval);
            this.smsCountDownInterval = null;
          }
        }, 1000);
      } catch (e) {
        this.smsCountDown = 0;
        const message = e.bodyText || e.message;
        this.$vux.toast.text(message);
      }
    },

    async submitForm() {
      const { password2, ...form } = this.form;
      if (password2 !== form.password) {
        this.$vux.toast.text('两次密码不一致');
        return;
      }

      try {
        await this.$http.post('/api/reset_password', form);
        form.auth_type = 'oem-mobile';
        const { info, token } = (await this.$http.post('/api/authorize', form)).body;
        await this.$store.commit('setToken', { token, info });
        this.$vux.toast.text(`密码重置成功，${info.display_name}`);
        this.$router.push('/');
      } catch (e) {
        const message = e.bodyText || e.message;
        this.$vux.toast.text(message);
      }
    },
  },
  mounted() {
    document.title = '找回密码';
  },
};
</script>

<style scoped lang="less">
.active {
  color: #fff;
  background: #333e5f;
}
</style>
