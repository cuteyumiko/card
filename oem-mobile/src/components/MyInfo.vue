<template>
  <div>

    <div style="display:flex;background-color:#82a5d6;padding:20px;color:#fff;align-items:center;">
      <div>
        <img :src="(info.user && info.user.head_image) || headImage" style="width:48px;height:48px;border-radius:24px;" />
      </div>
      <label style="flex:1;margin-left:10px;">
        <input type="file" style="display:none;" @change="uploadHeadImage" />
        <div>点击上传头像</div>
      </label>
      <div>
        <router-link tag="div" to="/change_password"> <i class="iconfont icon-xiugai-copy" /> 修改密码</router-link>
      </div>
    </div>

    <div style="margin:10px;">提交个人资料</div>
    <div>
      <vux-x-input title="昵　称" v-model="form.nickname" placeholder="请输入昵称"></vux-x-input>
      <vux-x-input title="姓　名" v-model="form.name" placeholder="请输入姓名"></vux-x-input>
      <vux-x-input title="手机号" readonly v-model="form.mobile" placeholder="请输入手机号码" keyboard="number" is-type="china-mobile"></vux-x-input>
      <vux-x-input title="微信号" v-model="form.weixin" placeholder="请输入微信号"></vux-x-input>

      <div>
        <label style="width:5rem;height:5rem;margin:0 auto;overflow:hidden;border:1px solid #D9D9D9;text-align:center;font-size:0.6rem;display:flex;flex-direction:column;justify-content:center;">
          <img v-if="form.weixin_qr" :src="form.weixin_qr" style="width:100%;" />
          <template v-else>
            <i class="iconfont icon-addition_fill" style="font-size:1rem;" />
            <div style="margin-top:5px;">微信二维码</div>
            <div style="margin-top:5px;">点击上传</div>
          </template>
          <input type="file" style="display:none;" @change="uploadFile" />
        </label>
      </div>
    </div>

    <div style="display:flex;text-align:center;color:#fff;margin-top:10px;">
      <div style="flex:1;padding:10px;background:#82a5d6;margin:5px;border-radius:5px;" @click="submitForm">提交资料</div>
    </div>
  </div>
</template>

<script>
import {
  mapState,
} from 'vuex';
import lrz from 'lrz';

export default {
  data() {
    return {
      form: {},
    };
  },
  computed: {
    ...mapState({
      info: state => state.info,
      headImage: state => state.merchant.extendImage.default_head_image,
    }),
  },
  methods: {
    async submitForm() {
      const { ...form } = this.form;
      const [errno, errmsg] = (!form.nickname && [1, '请填写昵称'])
                              || (!form.name && [2, '请填写姓名'])
                              || (!form.weixin && [3, '请填写微信号'])
                              || ((!/^[a-zA-Z][a-zA-Z0-9_-]{5,19}$/.test(form.weixin) && !/^\d{11}$/.test(form.weixin)) && [4, '微信号格式不正确'])
                              || [0, ''];
      if (errno) {
        this.$vux.toast.text(errmsg);
        return;
      }

      try {
        await this.$http.post('/api/i/info', form);
        this.$vux.toast.text('保存成功');

        const info = (await this.$http.get('/api/token_info')).body;
        await this.$store.commit('setTokenInfo', info);

        this.$router.push('/personal');
      } catch (e) {
        const message = e.bodyText || e.message;
        this.$vux.toast.text(message);
      }
    },

    async uploadFile({ target }) {
      const { files } = target;

      const $loading = this.$vux.loading;

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: e => $loading.show({
          text: `上传中 ${(e.loaded / (e.total * 100)).toFixed(0)} %`,
        }),
      };

      const { formData } = await lrz(files[0]);
      $loading.show({ text: '开始上传图片' });
      const [file] = (await this.$http.post('/api/upload', formData, config)).body;
      $loading.hide();
      this.$vux.toast.text('图片上传成功');

      this.form = {
        ...this.form,
        weixin_qr: file.url,
      };
    },

    async uploadHeadImage({ target }) {
      const { files } = target;

      const $loading = this.$vux.loading;

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: e => $loading.show({
          text: `上传中 ${(e.loaded / (e.total * 100)).toFixed(0)} %`,
        }),
      };

      console.log(files[0]);

      const { formData } = await lrz(files[0]);
      $loading.show({ text: '开始上传头像' });
      const [file] = (await this.$http.post('/api/upload', formData, config)).body;
      const head_image = file.url;
      await this.$http.post('/api/i/info', { head_image });
      $loading.hide();
      this.$vux.toast.text('头像更新成功');

      const info = (await this.$http.get('/api/token_info')).body;
      await this.$store.commit('setTokenInfo', info);
    },
  },
  async mounted() {
    await this.$store.commit('clearAuthVisible');
    document.title = '个人信息';
    this.form = (await this.$http.get('/api/i/info')).body;
  },
};
</script>

<style scoped lang="less">

</style>
