<template>
  <div style="padding: 5px;">

    <div style="background-color:#25263d;color:#fff;display:inline-block;padding:5px;margin-left:5px;margin-top:5px;">产品类别</div>

    <div style="margin-top:5px;">
      <div @click="ticket_id = o.id" class="product-item" v-for="o in itemList" :key="o.id" :class="{active: o.id == ticket_id}"> {{o.name}} </div>
    </div>

    <div style="background-color:#25263d;color:#fff;display:inline-block;padding:5px;margin-left:5px;margin-top:15px;">兑换码</div>

    <div style="padding:5px;display:flex;flex-direction:column;">
      <template v-if="!isJD">
        <vux-x-input v-model="form.ticket_number" :placeholder="ticket.ticket_number_title" style="border: 1px solid #b5b5b5;"></vux-x-input>
      </template>
      <vux-x-input v-model="form.ticket_password" :placeholder="ticket.ticket_password_title" style="border: 1px solid #b5b5b5;margin-top:10px;"></vux-x-input>
      <template v-if="isJD">例如：ABCD-1234-EFGH-5678</template>
      <template v-if="isReactNativeAndroid && isStarbucks">
        <div style="margin-top:10px;padding:10px;border: 1px solid #b5b5b5;display:block;">
          <label style="width:5rem;height:5rem;margin:0 auto;text-align:center;font-size:0.6rem;display:flex;flex-direction:column;justify-content:center;">
              <div style="margin-top:5px;">请到"HellCard"公众号登陆HelloCard进行星巴克券兑换</div>
          </label>
        </div>
      </template>
      <template v-else-if="!isJD">
        <div style="margin-top:10px;padding:10px;border: 1px solid #b5b5b5;display:block;">
          <label style="width:5rem;height:5rem;margin:0 auto;text-align:center;font-size:0.6rem;display:flex;flex-direction:column;justify-content:center;">
            <img v-if="form.image" :src="form.image" style="width:100%;height:100%;" />
            <template v-else>
              <i class="iconfont icon-addition_fill" style="font-size:1rem;" />
              <div style="margin-top:5px;">上传卡密截图</div>
            </template>
            <input type="file" style="display:none;" @change="uploadFile" />
          </label>
        </div>
      </template>
    </div>

    <div style="text-align:center;padding:10px;background:#333e5f;color:#fff;margin:5px;border-radius:10px;" @click="submitForm">提交</div>
  </div>
</template>

<script>
import _ from 'lodash';
import lrz from 'lrz';

export default {
  data() {
    return {
      item: {},
      form: {},

      ticket_id: null,

      itemList: [],

      isReactNativeAndroid: window.isReactNativeAndroid || false,
      isReactNativeIOS: window.isReactNativeIOS,
    };
  },
  computed: {
    ticket() {
      return _.find(this.itemList, { id: this.ticket_id }) || {};
    },

    isJD() {
      return this.ticket && this.ticket.process_name && this.ticket.process_name.indexOf('京东') !== -1;
    },
    isStarbucks() {
      return this.ticket && this.ticket.name && this.ticket.name.indexOf('星巴克') !== -1;
    },
  },
  methods: {
    async submitForm() {
      const { ...form } = this.form;
      form.ticket_id = this.ticket_id;

      const [errno, errmsg] = ((!this.isJD && !form.ticket_number) && [1, '请填写卡号'])
                            || (!form.ticket_password && [2, '请填写密码'])
                            || (!this.isJD && !form.image && !window.isReactNativeAndroid && [3, '请上传图片'])
                            || [0, '1'];
      if (errno) {
        this.$vux.toast.text(errmsg);
        return;
      }
      try {
        this.$vux.loading.show({ text: '提交中...' });
        await this.$http.post('/api/product_ticket_order', form);
        this.$vux.loading.hide();
        this.$vux.toast.text('提交成功');
        this.$router.push('/');
      } catch (e) {
        this.$vux.loading.hide();
        const message = e.bodyText || e.message;
        this.$vux.toast.text(message);
      }
    },

    async uploadFile(evt) {
      const files = evt.target.files || evt.dataTransfer.files;
      if (!files.length) return;

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

      // evt.target.value = ''
      this.form = {
        ...this.form,
        image: file.url,
      };
    },
  },
  async mounted() {
    document.title = '积分兑换';
    const { source_id } = this.$route.query;

    const itemList = (await this.$http.get(`/api/product_ticket?source_id=${source_id}`)).body;
    this.itemList = itemList;
    this.ticket_id = _.get(itemList, '[0].id');
  },
};
</script>

<style scoped lang="less">

.product-item {
  border: 1px solid #b5b5b5;
  color: #b5b5b5;
  display: inline-block;
  padding: 5px;
  margin-top: 5px;
  margin-left: 5px;
}
.product-item.active {
  background: #082475;
}
</style>
