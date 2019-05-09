<template>
  <div>
    <div style="font-size:0;">
      <a v-if="!loanApplyTopImageHide" :href="`/join?referee=${ referee ? referee.id : info.id}`">
        <img src="/static/banner-01.jpg" style="width:100%;" />
      </a>
    </div>

    <div>
      <vux-x-input title="姓　名" v-model="form.name" placeholder="请输入姓名"></vux-x-input>

      <vux-x-input title="身份证" v-model="form.idno" placeholder="请输入身份证"></vux-x-input>

      <vux-x-input title="手机号" v-model="form.mobile" placeholder="请输入手机号码" keyboard="number" is-type="china-mobile"></vux-x-input>


      <div style="display:flex;text-align:center;color:#fff;">
        <!-- <div v-if="item.is_recommend && !loanDistributionDisable" style="flex:1;padding:10px;background:#333e5f;margin:5px;border-radius:5px;" @click="goShare">立即推广</div> -->
        <div style="flex:1;padding:10px;background:#333e5f;margin:5px;border-radius:5px;" @click="submitForm">立即申请</div>
      </div>

      <div style="display:flex;text-align:center;color:red;">
        <!-- <div style="flex:1" v-if="item.is_recommend && !loanDistributionDisable">佣金最高 {{item.max_level_money}} {{item.money_unit}}</div> -->
        <div style="flex:1">{{item.got_count}}人已申请</div>
      </div>
    </div>

    <div style="font-size:0;">
      <img v-if="item.apply_bg" :src="item.apply_bg" style="width:100%;" />
    </div>

    <div v-transfer-dom v-if="referee">
      <vux-x-dialog v-model="showJoin" hide-on-blur="true">
        <a :href="`share_link_join?referee=${referee.id}`">
          <img src="/static/share-join.png" style="width:100%;" />
        </a>
      </vux-x-dialog>
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
      item: {},
      form: {},
      referee: null,
      showJoin: false,
    };
  },
  computed: {
    ...mapState({
      info: state => state.info,
      token: state => state.token,
      loanApplyTopImageHide: state => state.merchant.extendImage.loan_apply_top_image_hide,
      loanDistributionDisable: state => state.merchant.extendImage.loan_distribution_disable,
    }),
  },
  methods: {
    async submitForm() {
      const { ...form } = this.form;

      const [errno, errmsg] = (!form.name && [1, '请输入姓名'])
                            || (!form.idno && [2, '请输入身份证号'])
                            || (!/^\d{17}(\d|X|x)$/.test(form.idno) && [3, '身份证格式有误'])
                            || (!form.mobile && [3, '请输入手机号'])
                            || (!/^1\d{10}$/.test(form.mobile) && [4, '手机号格式有误'])
                            || [0, ''];
      if (errno) {
        this.$vux.toast.text(errmsg);
        return;
      }

      form.loan_id = this.item.id;
      if (this.referee) {
        form.creator_id = this.referee.id;
      }
      try {
        this.$vux.loading.show({ text: '提交中...' });
        let { href } = (await this.$http.post('/api/product_loan_order', form)).body;
        this.$vux.loading.hide();
        href = href || this.item.merchant_href || this.item.href;
        if (href) location.href = href;
      } catch (e) {
        this.$vux.loading.hide();
        const message = e.bodyText || e.message;
        this.$vux.toast.text(message);
      }
    },

    goShare() {
      const { id } = this.$route.query;
      if (this.token) {
        if (this.info.user.level_disable_recommend) {
          this.$vux.confirm.show({
            title: '升级后即可推广',
            content: '确定升级加薪吗？',
            onConfirm: async () => {
              this.$router.push('/level_up?sidx=3');
            },
          });
        } else {
          this.$router.push(`/product_loan_qr?id=${id}`);
        }
      } else {
        this.showJoin = true;
      }
    },
  },
  async mounted() {
    document.title = '贷款立即申请';
    const { id, referee } = this.$route.query;
    if (referee) {
      this.referee = (await this.$http.get(`/api/user/${referee}`)).body;
    }

    const item = (await this.$http.get(`/api/m/product_loan/${id}`)).body;
    this.item = item;
    if (!item.is_enabled) {
      this.$vux.toast.text('产品已下架');
      this.$router.push('/product_loan');
    }
  },
};
</script>

<style scoped lang="less">
</style>
