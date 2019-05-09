<template>
  <div>
    <template v-if="item.code == 'huayou.88'">
      <div style="font-size:0;">
        <img src="../assets/huayou-top.jpg" style="width:100%;" />

        <div class="tab" >
          <div class="tab-item" :class="{active: tab==='1'}" @click="tab = '1'">
            <div><i class="iconfont icon-jieshao" style="font-size:0.5rem;color:#4194a3;" /> 项目介绍</div>
          </div>
          <div class="tab-item" :class="{active: tab==='2'}" @click="tab = '2'">
            <div><i class="iconfont icon-shenpi" style="font-size:0.5rem;color:#e78e00;" /> 申请步骤</div>
          </div>
        </div>

      </div>

      <div>
        <vux-x-input title="姓　名" v-model="form.name" placeholder="请输入姓名" disabled></vux-x-input>

        <vux-x-input title="身份证" v-model="form.idno" placeholder="请输入身份证"></vux-x-input>

        <vux-x-input title="手机号" v-model="form.mobile" placeholder="请输入手机号码" keyboard="number" is-type="china-mobile" disabled></vux-x-input>

        <div style="display:flex;text-align:center;color:#fff;">
          <div style="flex:1;padding:10px;background:#333e5f;margin:5px;border-radius:5px;" @click="submitForm">立即申请</div>
        </div>

        <div style="display:flex;text-align:center;color:red;">
          <!-- <div v-if="item.is_recommend" style="flex:1">佣金最高 {{item.max_level_money}} 元</div> -->
          <div style="flex:1">{{item.got_count}} 人已申请</div>
        </div>
      </div>

      <div style="font-size:0;">
        <img v-if="(item.merchant_apply_bg || item.apply_bg) && tab === '1'" :src="(item.merchant_apply_bg || item.apply_bg)" style="width:100%;" />
        <img v-if="item.icon2 && tab === '2'" :src="item.icon2" style="width:100%;" />
      </div>
    </template>
    <template v-else>

      <div style="position:fixed; bottom:0;left:0; right:0;background:#fff;">

        <div style="display:flex;text-align:center;color:#fff;">
          <div style="flex:1;padding:10px;background:#4959B8;margin:5px;border-radius:5px;" @click="formVisible = true">立即申请</div>
        </div>

        <div style="display:flex;text-align:center;color:red;">
          <!-- <div v-if="item.is_recommend && !cardDistributionDisable" style="flex:1">佣金最高 {{item.max_level_money}} 元</div> -->
          <div style="flex:1">{{item.got_count}} 人已申请</div>
        </div>
      </div>

      <div style="font-size:0;">
        <img v-if="(item.merchant_apply_bg || item.apply_bg)" :src="(item.merchant_apply_bg || item.apply_bg)" style="width:100%;" />
      </div>

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
    </template>


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
      formVisible: false,
      referee: null,
      showJoin: false,

      tab: '1',
      isAgree: true,
    };
  },
  computed: {
    ...mapState({
      user: state => state.info.user,
      info: state => state.info,
      token: state => state.token,
      cardApplyTopImageHide: state => state.merchant.extendImage.card_apply_top_image_hide,
      cardDistributionDisable: state => state.merchant.extendImage.card_distribution_disable,
    }),
  },
  watch: {
    user(v) {
      alert(JSON.stringify(v));
    },
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
      form.card_id = this.item.id;

      if (this.referee) {
        form.creator_id = this.referee.id;
      }
      try {
        this.$vux.loading.show({ text: '提交中...' });
        let { href } = (await this.$http.post('/api/product_card_order', form)).body;
        this.$vux.loading.hide();
        href = href || this.item.merchant_href || this.item.href;
        if (href) location.href = href;
      } catch (e) {
        this.$vux.loading.hide();
        const message = e.bodyText || e.message;
        this.$vux.toast.text(message);
      }
    },
  },
  async mounted() {
    document.title = '信用卡立即申请';
    const { id, code, referee } = this.$route.query;
    if (referee) {
      this.referee = (await this.$http.get(`/api/user/${referee}`)).body;
    }

    let item;
    if (id) {
      item = (await this.$http.get(`/api/m/product_card/${id}`)).body;
    } else if (code) {
      item = (await this.$http.get(`/api/m/product_card?code=${code}`)).body[0];
    }

    this.item = item;
    if (!item.is_enabled) {
      this.$vux.toast.text('系统维护中');
      this.$router.push('/product_card');
    }

    if (this.user) {
      if (this.item.code === 'huayou.88') {
        this.form = {
          ...this.form,
          name: this.user.name,
          mobile: this.user.mobile,
        };
      }
    }
  },
};
</script>

<style scoped lang="less">
.tab {
  display:flex;
  font-size:0.4rem;
  text-align:center;

  .tab-item {
    flex:1;
    margin:10px;
  }

  .tab-item div {
    display:inline-block;
  }
  .tab-item.active div {
    border-bottom:1px solid #e78e00;
  }
}
</style>
