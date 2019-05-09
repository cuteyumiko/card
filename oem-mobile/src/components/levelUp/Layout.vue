<template>
  <div>
    <div class="menu">
      <router-link tag="div" class="menu-item" to="/level_up" :class="{active: $route.path === '/level_up' }">代理级别</router-link>
      <router-link tag="div" class="menu-item" to="/level_up/notes" :class="{active: $route.path === '/level_up/notes' }">购买须知</router-link>
      <router-link tag="div" class="menu-item" to="/level_up/faq" :class="{active: $route.path === '/level_up/faq' }">常见问题</router-link>
    </div>

    <router-view style="margin-top:10px;" />

  </div>
</template>

<script>
export default {
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
    };
  },
};
</script>

<style scoped lang="less">
.menu {
  display: flex;
  text-align: center;

  .menu-item {
    flex: 1;
    padding: 10px;
    margin: 0 10px;
  }

  .menu-item.active {
    color: #637d9d;
    border-bottom: 1px solid #637d9d;
  }
}
</style>
