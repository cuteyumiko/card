<template>
  <div>

    <div class="bank-list">
      <div v-for="o in list" :key="o.id" class="bank-item">
        <router-link :to="`/my_bank_card/${o.id}`" tag="div" style="width:60px;height:60px;background-size:contain;background-repeat:no-repeat;background-position:center;" :style="{backgroundImage:`url('${o.bank_icon}')`}"></router-link>
        <router-link :to="`/my_bank_card/${o.id}`" tag="div" style="flex:1;margin-left:5px;">
          <div>{{o.bank_name}}</div>
          <div style="margin-top:5px;">尾号{{o.bank_card_no.slice(-4)}}储蓄卡</div>
        </router-link>
        <div @click="deleteItem(o)" style="display:flex;align-items:center;margin-right:5px;">
          <i class="iconfont icon-shanchu" style="font-size:24px;" />
        </div>
        <div style="display:flex;align-items:center;font-size:0.3rem;">
          <i class="iconfont icon-enter" />
        </div>
      </div>
    </div>

    <router-link tag="div" style="background:#82a5d6;color:#fff;text-align:center;padding:10px;margin:10px;border-radius:5px;" to="/my_bank_card/create">添加银行卡</router-link>

  </div>
</template>

<script>

export default {
  data() {
    return {
      list: [],
    };
  },
  // computed: {
  //   ...mapState({
  //     info: state => state.info,
  //   }),
  //   link() {
  //     return `${location.origin}/join?referee=${this.info.id}`;
  //   },
  // },
  methods: {
    async reload() {
      this.list = (await this.$http.get('/api/my/user_bank_card?status=2')).body;
    },
    deleteItem(o) {
      this.$vux.confirm.show({
        title: '确认',
        content: `确认删除尾号${o.bank_card_no.slice(-4)}的结算卡？`,
        onConfirm: async () => {
          await this.$http.delete(`/api/user_bank_card/${o.id}`);
          await this.reload();
          this.$vux.toast.text('删除成功');
        },
      });
    },
  },
  async mounted() {
    document.title = '结算卡信息';
    await this.reload();
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
