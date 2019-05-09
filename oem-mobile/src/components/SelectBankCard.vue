<template>
  <div>
    <div class="bank-list">
      <div @click="selectBankCard(o)" v-for="o in list" :key="o.id" :class="{selected:o.id===bankCardId}" class="bank-item">
        <div style="width:60px;height:60px;background-size:contain;background-repeat:no-repeat;background-position:center;" :style="{backgroundImage:`url('${o.bank_icon}')`}"></div>
        <div style="flex:1;margin-left:5px;">
          <div>{{o.bank_name}}</div>
          <div style="margin-top:5px;">尾号{{o.bank_card_no.slice(-4)}}储蓄卡</div>
        </div>
        <div style="display:flex;align-items:center;font-size:0.3rem;">
          <i class="iconfont icon-checked" />
        </div>

      </div>
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
      list: [],
    };
  },
  computed: {
    ...mapState({
      bankCardId: state => state.bankCardId,
    }),
  },
  methods: {
    async selectBankCard(o) {
      await this.$store.commit('selectBankCard', o.id);
      this.$router.back();
    },
  },
  async mounted() {
    document.title = '选择银行';
    this.list = (await this.$http.get('/api/my/user_bank_card?status=2')).body;
  },
};
</script>

<style scoped lang="less">
.bank-list {
  .bank-item {
    padding:10px;
    border-bottom: 5px solid #ddd;
    display:flex;
    align-items:center;
  }

  .bank-item .iconfont {
    font-size: 32px;
  }

  .bank-item.selected .iconfont {
    color: #0094df;
  }
}
</style>
