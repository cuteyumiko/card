<template>
  <div>

    <div style="display:flex;text-align:center;">
      <router-link to="/product_ticket" tag="div" style="flex:1;">
        <div><i class="iconfont icon-jifen" style="font-size:1rem;color:#f6b315;" /></div>
        <div>积分兑换</div>
      </router-link>
      <router-link to="/level_info" tag="div" style="flex:1;">
        <div><i class="iconfont icon-wodejibie" style="font-size:1rem;color:#20087c;" /></div>
        <div>代理级别</div>
      </router-link>
    </div>

    <router-view />

  </div>
</template>

<script>
export default {
  data() {
    return {
      ref: null,
    };
  },
};
</script>

<style scoped lang="less">
</style>
