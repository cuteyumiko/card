<template>
  <div>
    <router-link class="menu-item" tag="div" to="/share_copy_library">
      <i class="iconfont icon-31" style="color:#de3634;"/>
      <div style="flex:1">朋友圈中央文案库</div>
      <div><i class="iconfont icon-enter"></i></div>
    </router-link>

    <router-link class="menu-item" tag="div" to="/share_qr_spread">
      <i class="iconfont icon-erweima" style="color:#0090d3;"/>
      <div style="flex:1">注册邀请二维码海报</div>
      <div><i class="iconfont icon-enter"></i></div>
    </router-link>

    <a class="menu-item" :href="`/join?referee=${info.id}`">
      <i class="iconfont icon-zhuce" style="color:#e88f29;"/>
      <div style="flex:1">分享注册邀请链接</div>
      <div><i class="iconfont icon-enter"></i></div>
    </a>

    <router-link class="menu-item" tag="div" to="/share_face_join">
      <i class="iconfont icon-yonghuming" style="color:#005bb4;"/>
      <div style="flex:1">面对面开通账号</div>
      <div><i class="iconfont icon-enter"></i></div>
    </router-link>
  </div>
</template>

<script>
import {
  mapState,
} from 'vuex';

export default {
  data() {
    return {
    };
  },
  computed: {
    ...mapState({
      info: state => state.info,
      wxOpenId: state => state.wxOpenId,
    }),
    link() {
      return `${location.origin}/join?referee=${this.info.id}`;
    },
  },
  mounted() {
    document.title = '我要分享';
  },
};
</script>

<style scoped lang="less">
.menu-item:visited,
.menu-item:link,
.menu-item:hover,
.menu-item {
  display:flex;
  padding:20px;
  margin:10px;
  background:#fff;
  text-decoration: none;
  align-items: center;
  border: 1px solid #ddd;
  box-shadow: 0px 0px 10px #eee;
  color: #2c3e50;
  > i {
    font-size: 36px;
    margin-right: 10px;
  }
}

</style>
