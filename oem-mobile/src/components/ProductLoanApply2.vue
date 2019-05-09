<template>
  <div>

    <div style="position:fixed; bottom:0;left:0; right:0;background:#fff;">

      <div style="display:flex;text-align:center;color:#fff;">
        <!-- <div v-if="item.is_recommend && !loanDistributionDisable" style="flex:1;padding:10px;background:#333e5f;margin:5px;border-radius:5px;" @click="goShare">立即推广</div> -->
        <div style="flex:1;padding:10px;background:#4959B8;margin:5px;border-radius:5px;" @click="formVisible=true">立即申请</div>
      </div>

      <div style="display:flex;text-align:center;color:red;">
        <!-- <div style="flex:1" v-if="item.is_recommend && !loanDistributionDisable">佣金最高 {{item.max_level_money}} {{item.money_unit}}</div> -->
        <!-- <div style="flex:1">{{item.got_count}}人已申请</div> -->
      </div>
    </div>

    <div style="background:#4959B8;">
      <div style="display:flex;padding:20px;">
        <img :src="item.icon" style="width:60px; height:60px;" />
        <div style="margin-left:20px;">
          <div style="font-size:16px;color:#fff;">{{item.name}}</div>
          <div style="background:background:rgba(255, 225, 255, 0.5); margin-top:10px; border-radius:10px; padding: 2px 10px;color:#ED471C;font-size:14px;">{{item.got_count}}人已申请</div>
        </div>
      </div>

      <div style="display:flex;color:#fff;border-top:1px dashed #fff;">
        <div style="flex:1;padding:10px;font-size:14px">
          <div>月利率: {{item.property.rate}}</div>
          <div style="margin-top:10px;">还款方式: {{item.property.repay_method}}</div>
        </div>
        <div style="width:1px;background:#fff;margin:10px 0;"></div>
        <div style="flex:1;padding:10px;">
          <div>最高额度: {{item.property.max_amount}}</div>
          <div style="margin-top:10px;">期限范围: {{item.property.time_range}}</div>
        </div>
      </div>
    </div>

    <div v-if="item.property.introduce" style="background:#fff; padding:10px;">
      <div style="display:flex;">
        <div style="border:2px solid #4959B8"></div>
        <div style="margin-left:6px; font-size:0.4rem; color:#3B3B3B">详情介绍</div>
      </div>

      <div style="margin-top:5px;">
        <div v-for="(o,i) in item.property.introduce.split('\n')" :key="i" style="font-size:0.4rem;color:#9C9C9C">{{o}}</div>
      </div>
    </div>

    <div v-if="item.property.notice" style="background:#fff; padding:10px;">
      <div style="display:flex;">
        <div style="border:2px solid #4959B8"></div>
        <div style="margin-left:6px; font-size:0.4rem; color:#3B3B3B">贷款须知</div>
      </div>

      <div style="margin-top:5px;">
        <div v-for="(o,i) in item.property.notice.split('\n')" :key="i" style="font-size:0.4rem;color:#9C9C9C">{{o}}</div>
      </div>
    </div>

    <div v-if="item.property.feature" style="background:#fff; padding:10px;">
      <div style="display:flex;">
        <div style="border:2px solid #4959B8"></div>
        <div style="margin-left:6px; font-size:0.4rem; color:#3B3B3B">特点</div>
      </div>

      <div style="margin-top:5px;">
        <div v-for="(o,i) in item.property.feature.split('\n')" :key="i" style="font-size:0.4rem;color:#9C9C9C">{{o}}</div>
      </div>
    </div>

    <div v-if="item.property.condition" style="background:#fff; padding:10px;">
      <div style="display:flex;">
        <div style="border:2px solid #4959B8"></div>
        <div style="margin-left:6px; font-size:0.4rem; color:#3B3B3B">申请条件</div>
      </div>

      <div style="margin-top:5px;">
        <div v-for="(o,i) in item.property.condition.split('\n')" :key="i" style="font-size:0.4rem;color:#9C9C9C">{{o}}</div>
      </div>
    </div>

    <div v-if="item.property.requested" style="background:#fff; padding:10px;">
      <div style="display:flex;">
        <div style="border:2px solid #4959B8"></div>
        <div style="margin-left:6px; font-size:0.4rem; color:#3B3B3B">所需材料</div>
      </div>

      <div style="margin-top:5px;">
        <div v-for="(o,i) in item.property.requested.split('\n')" :key="i" style="font-size:0.4rem;color:#9C9C9C">{{o}}</div>
      </div>
    </div>

    <div style="height:100px;"></div>

    <div v-if="formVisible"  style="position:fixed;top:0;bottom:0;left:0;right:0;background:rgba(0,0,0,0.7);display:flex;flex-direction:column;justify-content:center;">

      <div @click="formVisible=false" style="text-align:center;">
        <img src="../assets/close.png" style="width:32px; height:32px;" />
      </div>
      <div style="background:#fff;position:relative;padding:20px 15px;margin:10px 10%;border-radius:15px;">
        <vux-x-input v-model="form.name" placeholder="请输入姓名" style="border:1px solid #CCCCCC;">
          <img slot="label" style="padding-right:10px;display:block;" src="../assets/apply-name.png" width="20">
        </vux-x-input>
        <vux-x-input title="手机号" v-model="form.mobile" placeholder="请输入手机号码" style="border:1px solid #CCCCCC;margin-top:5px;" keyboard="number" is-type="china-mobile">
          <img slot="label" style="padding-right:10px;display:block;" src="../assets/apply-mobile.png" width="20">
        </vux-x-input>
        <vux-x-input title="身份证" v-model="form.idno" placeholder="请输入身份证" style="border:1px solid #CCCCCC;margin-top:5px;">
          <img slot="label" style="padding-right:10px;display:block;" src="../assets/apply-idno.png" width="20">
        </vux-x-input>

        <div style="display:flex;align-items:center;margin-top:20px;font-size:12px;">
          <div>
            <div style="padding:2px;border:1px solid #4959B8;border-radius:20px;">
              <div @click="isAgree = !isAgree" style="width:6px;height:6px; background:#4959B8;border-radius:20px;" :style="{background:isAgree ? '#4959B8' : '#fff'}"></div>
            </div>
          </div>

          <div @click="isAgree = !isAgree" style=";margin-left:5px;">我已阅读并同意</div><router-link to="/license">《HelloCard平台服务协议》</router-link>

        </div>
        <div style="color:#D2D2D2;font-size:14px;margin-left:15px;font-size:12px;">
          领取100万意外险。本人同意保险公司后续致电确认投保状态及相关事宜。查看<router-link to="/baoxian_license">《活动规则及重要告知与申明》</router-link>
        </div>
        <div style="height:20px;"></div>
        <div style="position:absolute;bottom:-22px;left:0;right:0;text-align:center;">
          <div style="margin:0 20px;padding:10px 40px;background:#4959B8;border-radius:50px;color:#fff;" @click="submitForm">提交申请</div>
        </div>

      </div>
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
import _ from 'lodash';

import {
  mapState,
} from 'vuex';

export default {
  data() {
    return {
      item: {},
      form: {},
      formVisible: false,
      referee: null,
      showJoin: false,

      isAgree: true,
    };
  },
  computed: {
    ...mapState({
      info: state => state.info,
      token: state => state.token,
      loanApplyTopImageHide: state => state.merchant.extendImage.loan_apply_top_image_hide,
      loanDistributionDisable: state => state.merchant.extendImage.loan_distribution_disable,
      merchant: state => state.merchant,
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

    const item = (await this.$http.get('/api/v2/product_loan_with_merchant', { params: {
      id,
      merchant_id: this.merchant.id,
      prop: 'property',
      limit: 1,
    } })).data[0];

    item.property = _(item.property).mapKeys('property_code').mapValues('value').value();

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
