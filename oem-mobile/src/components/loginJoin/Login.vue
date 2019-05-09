<template>
  <div :style="{minHeight}" style="display:flex;flex-direction:column;">
    <vux-x-input v-model="form.mobile" placeholder="请输入手机号码" keyboard="number">
      <i slot="label" class="iconfont icon-shouji" style="margin-right:10px;color:#59a2d5;" />
    </vux-x-input>

    <vux-x-input v-model="form.password" type="password" placeholder="请输入密码">
      <i slot="label" class="iconfont icon-mima" style="margin-right:10px;color:#59a2d5;" />
    </vux-x-input>

    <div style="text-align:center;padding:10px;background:#59a2d5;color:#fff;margin:10px;border-radius:50px;" @click="submitForm">登陆</div>

    <router-link tag="div" :to="{path:'/join', query: {referee:$route.query.referee}}" style="text-align:center;padding:10px;background:#ddd;color:#aaa;margin:10px;border-radius:50px;">立即注册新账号</router-link>

    <a v-if="appUrl" :href="appUrl" style="text-decoration:none;text-align:center;padding:10px;background:#59a2d5;color:#fff;margin:10px;border-radius:50px;">APP下载（先注册后下载）</a>

    <router-link style="text-align:center;margin:10px;" to="/forgot" tag="div">忘记密码</router-link>
    <div style="flex:1;"></div>
    <!-- <div style="display:flex;align-items:center;">
      <div style="flex:1;border-top:1px solid #eee;"></div>
      <div style="margin:10px;color:#aaa;">其他方式登陆</div>
      <div style="flex:1;border-top:1px solid #eee;"></div>
    </div> -->

    <div style="text-align:center;">
      <div style="margin-top: 10px;">{{merchant.company_name}}</div>
      <div style="margin-top: 10px;">{{merchant.company_telephone}}</div>
    </div>
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
    };
  },
  computed: {
    ...mapState({
      merchant: state => state.merchant,
      loginSuccessRedirect: state => state.loginSuccessRedirect,
      appUrl: state => state.merchant.extendImage['app.url'],
    }),
  },
  methods: {
    async submitForm() {
      const { ...form } = this.form;
      form.auth_type = 'oem-mobile';
      try {
        const { info, token } = (await this.$http.post('/api/authorize', form)).body;
        await this.$store.commit('setToken', { token, info });

        this.$vux.toast.text(`欢迎回来，${info.display_name}`);
        this.$router.push(this.loginSuccessRedirect || '/');
      } catch (e) {
        const message = e.bodyText || e.message;
        this.$vux.toast.text(message);
      }
    },
  },
  mounted() {
    document.title = `${this.merchant.name} - 登陆`;
    this.minHeight = `${document.documentElement.clientHeight - 180}px`;
  },
};
</script>

<style scoped lang="less">
</style>
