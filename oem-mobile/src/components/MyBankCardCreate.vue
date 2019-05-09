<template>
  <div>
    <div class="input-list" >
      <vux-x-input v-model="form.bank_card_name" readonly class="input-item">
        <template slot="label">
          <i class="iconfont icon-people" />户　　名
        </template>
      </vux-x-input>
      <vux-popup-radio class="input-bank" title="开户银行" :options="popupRadioBankList" v-model="form.bank_id">
        <template slot="icon">
          <i class="iconfont icon-icon-test1" style="margin-right: 10px;" />
        </template>
      </vux-popup-radio>
      <vux-x-input v-model="form.bank_card_no" class="input-item">
        <template slot="label">
          <i class="iconfont icon-yinxingqia" />银行卡号
        </template>
      </vux-x-input>
      <vux-x-input v-model="form.mobile" class="input-item">
        <template slot="label">
          <i class="iconfont icon-shouji" />手机号码
        </template>
      </vux-x-input>
      <vux-x-input v-model="form.idno" class="input-item">
        <template slot="label">
          <i class="iconfont icon-yinxingqia" />身份证号
        </template>
      </vux-x-input>
    </div>

    <div @click="submitForm" style="background:#82a5d6;color:#fff;text-align:center;padding:10px;margin:10px;border-radius:5px;">确认添加</div>
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
      bankList: [],
    };
  },
  computed: {
    ...mapState({
      info: state => state.info,
    }),
    popupRadioBankList() {
      return _.map(this.bankList, o => ({
        key: o.id, icon: o.icon, value: o.name,
      }));
    },
  },
  methods: {
    async submitForm() {
      const { ...form } = this.form;

      try {
        await this.$http.post('/api/user_bank_card', form);
        this.$router.back();
      } catch (e) {
        const message = e.bodyText || e.message;
        this.$vux.toast.text(message || '绑卡失败，请检查填写信息是否有误');
      }
    },
  },
  async mounted() {
    document.title = '结算卡信息';
    this.form.bank_card_name = this.info.user.name;
    this.bankList = (await this.$http.get('/api/bank')).body;
  },
};
</script>

<style scoped lang="less">
.input-list {
  margin: 5px;
  border: 1px solid #D9D9D9;
  box-shadow: 0px 0px 10px #eee;
  border-radius: 10px;

  .input-item {
    i.iconfont {
      margin-right: 10px;
    }
  }
}
</style>
<style scoped>
.input-item >>> .weui-cell__hd {
  margin-right: 10px;
}

.input-bank >>> .vux-cell-bd > p {
  margin: 0;
}

</style>

<style>
.vux-popup-dialog .weui-cells_radio .weui-cell_radio .weui-cell__bd > p {
  margin: 0;
}
</style>
