<template>
  <div>
    <form ref="payForm" :action="payFormAction" method="post" hidden="hidden">
      <input type="text" :name="k" :value="v" v-for="(v, k) in payForm" :key="k" />
    </form>
    <div v-if="levelList.length">
      <swiper ref="swiper" :options="swiperOption" v-if="levelList.length" @slide-change="handleSlideChange">
        <swiper-slide v-for="o in levelList" :key="o.id">
          <div style="width:8rem;height:3rem;background-size:100% 100%;color:#fff;display:flex;align-items:center;" :style="{backgroundImage:`url('${o.card_bg}')`}">
            <div style="display:flex;flex-direction:column;margin-top:1rem;">
              <div style="flex:1;padding-left:80px;font-size:0.6rem;">
                {{info.user.nickname}}
              </div>
              <div style="margin-top:20px;margin-left:10px;font-size:0.3rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">{{o.level_up_info}}</div>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div>

    <div style="padding:10px;" v-if="currentLevel">
      <p>权益说明：</p>
      <div v-html="currentLevel.info"></div>
    </div>

    <div style="display:flex;text-align:center;color:#fff;">
      <router-link to="/share" tag="div" style="flex:1;background-color:#5ba2d5;border-radius:5px;padding:10px;margin:10px;">立即邀请</router-link>
      <div v-if="currentLevel" class="btn-levelup" :class="{disabled: currentLevel.msg }" style="flex:1;border-radius:5px;padding:10px;margin:10px;" @click="selectPayment">{{currentLevel.msg || '立即升级'}}</div>
    </div>

    <img v-if="incomeImage" :src="incomeImage" style="width:100%;" />

    <div v-transfer-dom>
      <vux-x-dialog v-model="showPayment" hide-on-blur="true">

        <vux-checklist v-model="payment_id" :options="selectPaymentList" :min="1" :max="1" label-position="left" style="text-align:left;" />

        <div style="display:flex;text-align:center;color:#fff;">
          <div style="flex:1;padding:10px;background:#333e5f;margin:5px;border-radius:5px;" @click="submitForm">确认支付</div>
        </div>

      </vux-x-dialog>
    </div>


  </div>
</template>

<script>
import _ from 'lodash';
import {
  mapState,
} from 'vuex';

// import wx from 'weixin-js-sdk';
//
// const wx_config = params => new Promise((resolve) => {
//   wx.ready(() => resolve());
//   wx.config(params);
// });
//
// const wx_chooseWXPay = params => new Promise((resolve) => {
//   wx.chooseWXPay({
//     ...params,
//     success: res => resolve(res),
//   });
// });

export default {
  data() {
    return {
      swiperOption: {
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        loop: false,
      },
      levelList: [],

      levelIndex: 0,
      paymentList: [],
      showPayment: false,
      payment_id: [],


      payForm: {},
      payFormAction: '',
    };
  },
  computed: {
    ...mapState({
      info: state => state.info,
      wxOpenId: state => state.wxOpenId,
      incomeImage: state => state.merchant.extendImage['levelup.home'],
    }),
    currentLevel() {
      return this.levelList[this.levelIndex];
    },
    selectPaymentList() {
      return _.map(this.paymentList, o => ({
        key: o.id, value: o.name,
      }));
    },
  },

  methods: {
    handleSlideChange() {
      this.levelIndex = this.$refs.swiper.swiper.realIndex;
    },

    selectPayment() {
      // console.log(wx);
      // wx.chooseWXPay()
      // return;
      if (this.currentLevel.msg) return;
      this.showPayment = true;
    },

    async submitForm() {
      const [payment_id] = this.payment_id;

      const form = {
        to_level_id: this.currentLevel.id,
      };
      try {
        if (!payment_id) throw new Error('请选择支付方式');

        this.$vux.loading.show('正在处理');
        const { id } = (await this.$http.post('/api/user_level_order', form)).body;
        const { payInfo } = (await this.$http.put(`/api/user_level_order/${id}/payment`, {
          payment_id,
          wx_open_id: this.wxOpenId,
          referer_url: 'http://oem.hello.com/wx_pay',
          notify_url: `http://oem.hello.com/webhook/payment/${payment_id}`,
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
    },
  },
  async mounted() {
    document.title = '代理级别';
    const { sidx = 0 } = this.$route.query;
    if (sidx) {
      this.swiperOption.initialSlide = sidx;
    }


    if (this.wxOpenId) {
      this.paymentList = (await this.$http.get('/api/payment?used_weixin=1')).body;
    } else {
      this.paymentList = (await this.$http.get('/api/payment?used_mobile_browser=1')).body;
    }

    const levelList = (await this.$http.get('/api/m/user_level?order=value')).body;
    let levelIndex = _.findIndex(levelList, { id: this.info.user.level_id });
    levelIndex = levelIndex > 0 ? levelIndex - 1 : levelIndex;
    this.levelIndex = levelIndex;
    this.swiperOption = {
      ...this.swiperOption,
      initialSlide: levelIndex,
    };
    // wx.config({appId: 'wx665c06ee53103fbb'})

    let isLowLevel = false;
    this.levelList = _.map(levelList, (o) => {
      let msg = '';
      if (isLowLevel) msg = '已超过该等级';
      if (o.id === this.info.user.level_id) { msg = '当前等级'; isLowLevel = true; }
      if (!o.money && !msg) msg = '升级请联系客服';
      return { ...o, msg };
    });
  },
};
</script>

<style scoped lang="less">
.swiper-inner {
  width: 100%;
  height: 4.5rem;
  padding-top: 50px;
  padding-bottom: 50px;
}
.swiper-slide {
  background-position: center;
  background-size: cover;
  width: 8rem;

  img {
    width: 100%;
    height: 100%;
  }
}

.btn-levelup {
  background-color: #5ba2d5;
}

.btn-levelup.disabled {
  background-color: #ddd;
  color: #21323a;
}
</style>
