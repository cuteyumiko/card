<template>
  <div>
    <div class="type-list">
      <router-link class="list-item" :class="{active: $route.path == '/record/card'}" tag="div" to="/record/card">
        <i class="iconfont icon-xinyongqia" style="color:#d70000;"/>
        <div>信用卡</div>
      </router-link>
      <router-link class="list-item" :class="{active: $route.path == '/record/loan'}" tag="div" to="/record/loan">
        <i class="iconfont icon-wangdai-" style="color:#252552;"/>
        <div>网贷</div>
      </router-link>
      <router-link class="list-item" :class="{active: $route.path == '/record/ticket'}" tag="div" to="/record/ticket">
        <i class="iconfont icon-jifen1" style="color:#5f478d;"/>
        <div>积分券</div>
      </router-link>
      <router-link class="list-item" :class="{active: $route.path == '/record/level_up'}" tag="div" to="/record/level_up">
        <i class="iconfont icon-update" style="color:#8f8d2f;"/>
        <div>升级</div>
      </router-link>
    </div>

    <router-view />
  </div>
</template>

<script>
export default {
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
    };
  },

  mounted() {
    document.title = '申请记录';
  },
};
</script>

<style scoped lang="less">
.type-list {
  display: flex;
  padding:5px;

  .list-item {
    flex:1;
    text-align: center;
    padding: 5px;
    display: flex;
    align-items: center;
    justify-content: center;

    i {
      font-size: 24px;
      margin: 5px;
    }
  }

  .list-item.active {
    background-color: #eee;
  }
}
</style>
