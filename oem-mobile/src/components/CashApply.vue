<template>
  <div>
    <router-link v-if="currentBankCard" tag="div" to="/select_bank_card" style="display:flex;border-bottom:1px solid #eee;padding: 5px;align-items:center;">
      <div style="width:60px;height:60px;background-size:contain;background-repeat:no-repeat;background-position:center;" :style="{backgroundImage:`url('${currentBankCard.bank_icon}')`}"></div>
      <div style="flex:1;margin-left:5px;">
        <div>{{currentBankCard.bank_name}}</div>
        <div style="margin-top:5px;">尾号{{currentBankCard.bank_card_no.slice(-4)}}储蓄卡</div>
      </div>
      <div style="display:flex;align-items:center;font-size:0.3rem;">
        <i class="iconfont icon-enter" />
      </div>
    </router-link>
    <router-link tag="div" v-else to="/my_bank_card/create" style="display:flex;text-align:center;color:#fff;">
      <div style="flex:1;padding:10px;background:#82a5d6;margin:5px;border-radius:5px;">添加结算卡</div>
    </router-link>

    <div style="height:5px;background:#eee;"></div>

    <div style="padding:5px 10px;">
      <div>提现金额</div>
      <vux-x-input class="input-money" v-model="form.money" placeholder="请输入提现金额">
        <i class="iconfont icon-renminbi1688" style="margin-right:10px;" slot="label" />
      </vux-x-input>
      <div style="margin-top:10px;">可提现金额 {{current_value}} <span @click="inputAll" style="float:right;">全部提现</span> </div>
    </div>

    <div style="padding:5px 10px;font-size:0.3rem;">提现说明：每日18点前提现当天到账，18点后提现次日到账，手续费每笔2元</div>
    <div v-if="user.is_cash_disabled">
      <div style="flex:1;padding:10px;background:#888;margin:5px;border-radius:5px;color:#fff;text-align:center;">账户暂时无法提现</div>
    </div>
    <div v-else-if="currentBankCard" style="display:flex;text-align:center;color:#fff;">
      <div style="flex:1;padding:10px;background:#82a5d6;margin:5px;border-radius:5px;" @click="submitForm">提现申请</div>
    </div>

  </div>

</template>

<script>
import {
  mapState,
} from 'vuex';
import _ from 'lodash';

export default {
  data() {
    return {
      current_value: '',
      form: {},
      list: [],
    };
  },
  computed: {
    ...mapState({
      info: state => state.info,
      token: state => state.token,
      bankCardId: state => state.bankCardId,
      user: state => ((state.info && state.info.user) ? state.info.user : {}),
    }),
    currentBankCard() {
      return this.bankCardId ? (_.find(this.list, { id: this.bankCardId }) || null) : null;
    },
  },
  methods: {
    async submitForm() {
      const { ...form } = this.form;
      const { mobile, bank_card_name, bank_name, bank_card_no } = this.currentBankCard;
      form.mobile = mobile;
      form.bank_card_name = bank_card_name;
      form.bank_name = bank_name;
      form.bank_card_no = bank_card_no;

      try {
        this.$vux.loading.show({ text: '提交中...' });
        await this.$http.post('/api/cash_order', form);
        this.$vux.loading.hide();
        this.$vux.toast.text('申请已提交成功');
        const info = (await this.$http.get('/api/token_info')).body;
        await this.$store.commit('setTokenInfo', info);
        this.$router.push('/income');
      } catch (e) {
        this.$vux.loading.hide();
        const message = e.bodyText || e.message;
        this.$vux.toast.text(message);
      }
    },
    inputAll() {
      this.form = {
        ...this.form,
        money: this.current_value,
      };
    },
  },
  async mounted() {
    document.title = '提现';
    this.list = (await this.$http.get('/api/my/user_bank_card?status=2')).body;
    let card = _.find(this.list, { id: this.bankCardId });
    if (!card) card = this.list[0];
    if (card) {
      await this.$store.commit('selectBankCard', card.id);
    }
    this.current_value = this.info.user.balance;
  },
};
</script>

<style scoped lang="less">
.input-money::before {
  border: 0;
}
.input-money {
  border-bottom: 1px solid #ddd;
}
</style>
