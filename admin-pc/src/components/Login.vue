<template>
  <div style="display:flex;flex-direction:column;height:100%;">
    <div style="padding:10px 30px;background:#000;color:#fff;font-size:22px;font-weight:bold;">
      HelloCardSAAS云平台
    </div>
    <el-row type="flex" justify="end" style="background:url(/static/pc-login-bg-1.jpg);height:100%;">
      <el-col style="display:flex;background:#ffffff80;padding:10px;max-width:500px;">
        <div style="margin:80px 40px; background:#fff;flex:1;">
          <div style="padding:60px;padding-bottom:0;border-bottom:1px solid #eee;">
            <div style="padding:10px 20px;border-bottom:4px solid #000;display:inline-block;font-size:20px;font-weight:bold;">登录</div>
          </div>
          <el-form ref="form" :model="form" style="margin-top:40px;" >
            <el-form-item>
              <el-input prefix-icon="iconfont icon-people" v-model="form.account" placeholder="用户名" @keyup.enter.native="$refs.pwd.focus()"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input ref="pwd" prefix-icon="iconfont icon-lock" v-model="form.password" type="password" placeholder="密码" @keyup.enter.native="submitForm"></el-input>
            </el-form-item>
            <div style="margin:40px 20px;">
              <el-button :loading="formLoading" style="font-size:16px;cursor:pointer;background:#fff;border:2px solid #000;text-align:center;padding:10px;border-radius:3px;width:100%;" @click="submitForm" >登录</el-button>
            </div>
          </el-form>
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {},
      formLoading: false,
    };
  },
  methods: {
    async submitForm() {
      this.formLoading = true;

      try {
        const { ...form } = this.form;
        if (!form.account) throw new Error('用户名不能为空');
        if (!form.password) throw new Error('密码不能为空');
        form.auth_type = 'admin-pc';
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

      this.formLoading = false;
    },
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
