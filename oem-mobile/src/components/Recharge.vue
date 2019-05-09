<template>
  <div>
    <form ref="payForm" :action="payFormAction" method="post" hidden="hidden">
      <input type="text" :name="k" :value="v" v-for="(v, k) in payForm" :key="k" />
    </form>

    <vux-group>
      <vux-x-input title="支付金额" v-model="form.money" text-align="right" placeholder="请输入充值金额">
      </vux-x-input>
      <vux-popup-radio title="支付通道" :options="optionPaymentList" v-model="form.payment_id">
        <p slot="popup-header" style="text-align:center;">请选择支付通道</p>
      </vux-popup-radio>
    </vux-group>

    <vux-x-button type="primary" @click.native="submitForm" :show-loading="false">提交</vux-x-button>

  </div>
</template>

<script>
import _ from 'lodash';
import {
  mapState,
} from 'vuex';

export default {
  data() {
    return {
      form: {},
      paymentList: [],

      payForm: '',
      payFormAction: '',
    };
  },
  computed: {
    ...mapState({
      wxOpenId: state => state.wxOpenId,
    }),
    optionPaymentList() {
      return _.map(this.paymentList, o => ({
        key: o.id, value: o.name,
      }));
    },
  },
  methods: {
    async submitForm() {
      this.formLoading = true;

      try {
        const { payment_id, ...form } = this.form;
        this.$vux.loading.show('正在处理');
        const { id } = (await this.$http.post('/api/recharge_order', form)).body;
        const { payInfo } = (await this.$http.post(`/api/recharge_order/${id}/payment`, {
          payment_id,
          wx_open_id: this.wxOpenId,
          referer_url: 'http://oem.hello.com/wx_pay',
          notify_url: `http://oem.hello.com/webhook/pay/recharge_order/${payment_id}`,
        })).body;
        this.$vux.loading.hide();

        if (payInfo.postForm) {
          this.payForm = payInfo.postForm.form;
          this.payFormAction = payInfo.postForm.action;
          await this.$nextTick();
          this.$refs.payForm.submit();
        } else if (payInfo.wxpay && payInfo.config) {
          const wxpay_jsapi = {
            appId: payInfo.wxpay.appId,
            timestamp: payInfo.wxpay.timestamp,
            nonceStr: payInfo.wxpay.nonceStr,
            package: encodeURIComponent(payInfo.wxpay.package),
            signType: payInfo.wxpay.signType,
            paySign: payInfo.wxpay.paySign,
            signature: payInfo.config.signature,
            return_url: location.origin,
          };

          location.href = `http://oem.hello.com/wx_pay?wxpay_jsapi=${JSON.stringify(wxpay_jsapi)}`;
        } else if (payInfo.paymentLink) {
          location.href = payInfo.paymentLink;
        } else {
          throw new Error('未知的支付信息');
        }
      } catch (e) {
        const message = e.bodyText || e.message;
        this.$vux.toast.text(message);
      }
      this.formLoading = false;
    },
  },

  async mounted() {
    document.title = '充值';

    if (this.wxOpenId) {
      this.paymentList = (await this.$http.get('/api/payment?used_weixin=1')).body;
    } else {
      this.paymentList = (await this.$http.get('/api/payment?used_mobile_browser=1')).body;
    }
  },
};
</script>

<style scoped lang="less">
</style>
