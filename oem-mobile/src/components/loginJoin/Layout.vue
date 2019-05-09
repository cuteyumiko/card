<template>
  <div>
    <div style="font-size:0;">
      <img :src="bannerImage" style="width:100%" />
    </div>
    <!-- <div style="display:flex;text-align:center;">
      <router-link class="menu-item" :to="{path:'/login', query: {referee}}" :class="{active: $route.path === '/login'}" tag="div">登陆</router-link>
      <router-link class="menu-item" :to="{path:'/join', query: {referee}}" :class="{active: $route.path === '/join'}" tag="div">注册</router-link>
    </div> -->

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
      ref: null,
    };
  },
  computed: {
    ...mapState({
      bannerImage: state => state.merchant.extendImage['login.banner'],
    }),
    referee() {
      const { referee } = this.$route.query;
      return referee;
    },
  },
};
</script>

<style scoped lang="less">
.menu-item {
  flex:1;
  padding:10px;
  background: #eee;
  color: #888;
}
.menu-item.active {
  color: #fff;
  background: #59a2d5;
}
</style>
