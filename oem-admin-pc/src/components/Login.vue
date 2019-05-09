<template>
  <div style="display:flex;flex-direction:column;">
    <div style="background:#05002a;height:64px;display:flex;align-items:center;padding:0 10px;">
      <div style="flex:1;color:#fff;font-size:24px;">{{merchant.name}}后台管理系统</div>
    </div>
    <el-row type="flex" justify="end" style="background:url(/admin/static/pc-login-bg-1.jpg);" :style="{minHeight}">
      <el-col style="display:flex;background:#ffffff80;padding:10px;max-width:500px;">
        <div style="margin:80px 40px; background:#fff;flex:1;">
          <div style="padding:60px;padding-bottom:0;border-bottom:1px solid #eee;">
            <div style="padding:10px 20px;border-bottom:4px solid #000;display:inline-block;font-size:20px;font-weight:bold;">登录</div>
          </div>
          <el-form ref="form" :model="form" style="margin-top:40px;" >
            <el-form-item>
              <el-input prefix-icon="lt lt-my" v-model="form.account" placeholder="用户名" @keyup.enter.native="$refs.pwd.focus()"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input ref="pwd" prefix-icon="lt lt-lock" v-model="form.password" type="password" placeholder="密码" @keyup.enter.native="submitForm"></el-input>
            </el-form-item>
            <div style="cursor:pointer;background:#fff;border:2px solid #000;margin:40px 20px;text-align:center;padding:10px;border-radius:3px;" @click="submitForm" >登录</div>
            <div></div>
          </el-form>
        </div>
      </el-col>
    </el-row>

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
    }),
  },
  methods: {
    async submitForm() {
      try {
        const { ...form } = this.form;
        if (!form.account) throw new Error('用户名不能为空');
        if (!form.password) throw new Error('密码不能为空');
        form.auth_type = 'oem-admin-pc';
        const { info, token } = (await this.$http.post('/api/authorize', form)).body;
        await this.$store.commit('setToken', { token, info });
        this.$message.success({
          message: `欢迎回来，${info.display_name}`,
        });
        this.$router.push('/');
      } catch (e) {
        const message = e.bodyText || e.message;
        this.$message.error(message);
      }
    },
  },
  mounted() {
    this.minHeight = `${document.documentElement.clientHeight - 64}px`;
  },
};
</script>

<style scoped>
>>> .el-form .el-form-item {
  margin-bottom: 2px;
}
>>> .el-form .el-input {
  background: #eee;
  padding: 10px;
  box-sizing: border-box;
}
>>> .el-form .el-input .el-input__prefix {
  color: #000;
  margin-left: 30px;
}
>>> .el-form .el-input .el-input__icon {
  font-size: 20px;
}

>>> .el-form input.el-input__inner {
  border: 0;
  background: #eee;
  padding-left: 60px;
  font-size: 20px;
  height: 44px;
}
</style>
