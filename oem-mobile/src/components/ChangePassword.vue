<template>
  <div>
    <vux-x-input title="旧密码" type="password" v-model="form.old_password" placeholder="请输入旧密码"></vux-x-input>
    <vux-x-input title="新密码" type="password" v-model="form.new_password" placeholder="请输入您要修改密码，至少6个字符"></vux-x-input>
    <vux-x-input title="再次输入" type="password" v-model="form.new_password2" placeholder="请确认密码"></vux-x-input>

    <div style="display:flex;text-align:center;color:#fff;">
      <div style="flex:1;padding:10px;background:#82a5d6;margin:5px;border-radius:5px;" @click="submitForm">确认修改</div>
    </div>

  </div>

</template>

<script>
export default {
  data() {
    return {
      form: {},
    };
  },
  methods: {
    async submitForm() {
      const { new_password2, ...form } = this.form;

      const { old_password, new_password } = form;
      const [errno, errmsg] = (!old_password && [1, '请输入旧密码'])
                            || (!new_password && [2, '请输入新密码'])
                            || (!new_password2 && [2, '请再次输入新密码'])
                            || (new_password2 !== new_password && [3, '两次密码不一致'])
                            || [0, ''];

      if (errno) {
        this.$vux.toast.text(errmsg);
        return;
      }

      try {
        await this.$http.post('/api/i/password', form);
        this.$vux.toast.text('密码修改成功');
        this.$router.push('/my_info');
      } catch (e) {
        const message = e.bodyText || e.message;
        this.$vux.toast.text(message);
      }
    },
  },
  mounted() {
    document.title = '修改密码';
  },
};
</script>

<style scoped lang="less">
</style>
