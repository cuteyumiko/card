<template>
  <div>
    <div style="background-color:#81a5d6;color:#fff;text-align:center;padding: 10px;">
      <div style="display:flex;">
        <div style="flex:1;">
          <div style="font-size:0.5rem;">{{info.user.balance || 0}}</div>
          <div style="font-size:0.3rem;">可提现（元）</div>
        </div>
        <router-link tag="div" to="/cash_apply" style="flex:1;display:flex;align-items:center;justify-content:center;">
          <span style="border:1px solid #faf800;color:#faf800;border-radius:5px;padding:2px 5px;">去提现</span>
        </router-link>
      </div>
      <div style="display:flex;margin-top:10px;">
        <div style="flex:1;">
          <div style="font-size:0.5rem;">{{info.user.cash_income || 0}}</div>
          <div style="font-size:0.3rem;">已提现（元）</div>
        </div>
        <div style="flex:1;">
          <div style="font-size:0.5rem;">{{info.user.sum_income || 0}}</div>
          <div style="font-size:0.3rem;">总收益（元）</div>
        </div>
      </div>
    </div>

    <div class="income-menu">
      <router-link tag="div" class="menu-item" :class="{active: $route.path === '/income/detail' }" to="/income/detail">收入明细</router-link>
      <router-link tag="div" class="menu-item" :class="{active: $route.path === '/income/cash_order' }" to="/income/cash_order">提现明细</router-link>
    </div>

    <router-view />

  </div>
</template>

<script>
import {
  mapState,
} from 'vuex';

export default {
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
    };
  },
  computed: {
    ...mapState({
      info: state => state.info,
    }),
  },
  mounted() {
    document.title = '我的收益';
  },
};
</script>

<style scoped lang="less">
.income-menu {
  display:flex;
  text-align:center;
  .menu-item {
    flex:1;
    padding: 10px;
  }

  .menu-item.active {
    border-bottom: 1px solid #888;
  }
}
</style>
