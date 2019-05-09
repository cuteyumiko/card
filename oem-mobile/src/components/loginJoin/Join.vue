<template>
  <div>
    <div :style="{minHeight}" style="display:flex;flex-direction:column;">
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

      <vux-x-input :readonly="referee" v-model="form.referee_0_mobile" placeholder="请输入推荐人手机号码" keyboard="number">
        <i class="iconfont icon-iconfonttuijianren" slot="label" style="margin-right:10px;color:#59a2d5;" />
      </vux-x-input>


      <div style="text-align:center;padding:10px;background:#59a2d5;color:#fff;margin:10px;border-radius:50px;" @click="submitForm">免费注册</div>
      <router-link tag="div" :to="{path:'/login', query: {referee:$route.query.referee}}" style="text-align:center;padding:10px;background:#ddd;color:#aaa;margin:10px;border-radius:50px;">使用已有账号登陆</router-link>
      <a v-if="appUrl" :href="appUrl" style="text-decoration:none;text-align:center;padding:10px;background:#59a2d5;color:#fff;margin:10px;border-radius:50px;">APP下载（先注册后下载）</a>

      <div style="flex:1;"></div>

      <div style="text-align:center;"><label><input type="checkbox" v-model="agree" style="margin-right:5px;" />阅读并同意条款<router-link to="/license">《平台服务协议》</router-link></label></div>

      <div style="text-align:center;margin:20px 0;"><i class="iconfont icon-down" />下滑查看产品信息</div>
    </div>

    <img v-if="joinImage" :src="joinImage" style="width:100%;" />
  </div>
</template>

<script>
import {
  mapState,
} from 'vuex';

export default {
  data() {
    return {
      minHeight: '0',
      form: {},
      agree: true,

      smsCountDown: 0,
      smsCountDownInterval: null,
    };
  },
  computed: {
    ...mapState({
      merchant: state => state.merchant,
      loginSuccessRedirect: state => state.loginSuccessRedirect,
      joinImage: state => state.merchant.extendImage.join,
      appUrl: state => state.merchant.extendImage['app.url'],
    }),
  },
  methods: {
    async fetchSmsCode() {
      const { mobile } = this.form;

      const [errno, errmsg] = (!mobile && [1, '请输入手机号'])
                            || [0, ''];

      if (errno) {
        this.$vux.toast.text(errmsg);
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
      } catch (e) {
        this.smsCountDown = 0;
        const message = e.bodyText || e.message;
        this.$vux.toast.text(message);
      }
    },
    async submitForm() {
      const { ...form } = this.form;

      const [errno, errmsg] = (!form.mobile && [1, '请输入手机号'])
                            || (!form.sms_code_id && [2, '请获取验证码'])
                            || (!form.sms_code && [2, '请输入验证码'])
                            || (!form.password && [3, '密码不能为空'])
                            || (!form.referee_0_mobile && [3, '推荐人不能为空'])
                            || [0, ''];

      if (errno) {
        this.$vux.toast.text(errmsg);
        return;
      }

      if (this.referee) form.referee_id = this.referee.id;
      try {
        this.$vux.loading.show({ text: '提交中...' });
        await this.$http.post('/api/register', form);
        form.auth_type = 'oem-mobile';
        const { info, token } = (await this.$http.post('/api/authorize', form)).body;
        this.$vux.loading.hide();
        await this.$store.commit('setToken', { token, info });
        this.$vux.toast.text(`注册成功，${info.display_name}`);
        this.$router.push(this.loginSuccessRedirect || '/');
      } catch (e) {
        const message = e.bodyText || e.message;
        this.$vux.toast.text(message);
      }
    },
  },
  async mounted() {
    document.title = `${this.merchant.name} - 登陆`;

    this.minHeight = `${document.documentElement.clientHeight - 180}px`;
    const { referee } = this.$route.query;

    if (referee) {
      const refereeItem = (await this.$http.get(`/api/user/${referee}`)).body;

      this.form = {
        referee_0_mobile: refereeItem.mobile,
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
