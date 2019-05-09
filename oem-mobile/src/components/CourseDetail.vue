<template>
  <div style="padding:5px;">
    <div style="font-size:0.5rem;font-weight:700;">{{item.name}}</div>
    <div style="text-align:right;margin-top:5px;">{{item.create_time}}</div>

    <div style="position:relative;">
      <div class="ql-editor" v-html="item.content"></div>

      <template v-if="info.user">
        <div v-if="info.user.level_value > 1" class="ql-editor" v-html="item.vip_content"></div>
        <router-link v-else class="tip-bg" tag="div" to="/level_up">以下部分需要升级会员才能查看哦</router-link>
      </template>
      <template v-else>
        <div class="tip-bg" @click="goLogin">登陆查看剩下部分</div>
      </template>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import {
  mapState,
} from 'vuex';
import wx from 'weixin-js-sdk';

export default {
  data() {
    return {
      item: {},
    };
  },
  computed: {
    ...mapState({
      wxOpenId: state => state.wxOpenId,
      info: state => state.info,
    }),
    referee_id() {
      const { referee } = this.$route.query;
      return this.info.id || (referee ? parseInt(referee, 10) : null);
    },
  },
  watch: {
    referee_id() {
      this.updateRoute();
    },

    $route() {
      this.updateWxShare();
    },
  },
  methods: {
    async goLogin() {
      await this.$store.commit('setLoginSuccessRedirect', this.$route.fullPath);
      this.$router.push({ path: '/login', query: { referee: this.referee_id } });
    },
    updateRoute() {
      const { referee, id } = this.$route.query;
      const { referee_id } = this;
      if (referee_id && `${referee_id}` !== `${referee}`) {
        const { path } = this.$route;
        location.href = `${path}?id=${id}&referee=${referee_id}`;
      }
    },
    updateWxShare() {
      if (this.wxOpenId) {
        wx.onMenuShareTimeline({
          title: this.item.name,
          link: `${location.origin}${this.$route.fullPath}`,
          imgUrl: encodeURI(this.item.icon),
          // success: () => alert('success'),
          // cancel: () => alert('cancel'),
        });
        wx.onMenuShareAppMessage({
          title: this.item.name,
          // desc: 'desc',
          link: `${location.origin}${this.$route.fullPath}`,
          imgUrl: encodeURI(this.item.icon),
          // success: () => alert('success'),
          // cancel: () => alert('cancel'),
        });
      }
    },

  },
  async mounted() {
    document.title = 'Hello学院';
    const { id } = this.$route.query;
    const item = (await this.$http.get(`/api/course/${id}`)).body;
    item.create_time = moment(item.create_time).format('YYYY-MM-DD HH:mm:ss');
    this.item = item;
    document.title = item.name;

    this.updateRoute();
    this.updateWxShare();
  },
};
</script>

<style scoped lang="less">
.tip-bg {
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  background-image: -webkit-linear-gradient(top,hsla(0,0%,98%,0),hsla(0,0%,98%,.9) 28%,#fafafa 49.1%,#fafafa);
  font-size:0.5rem;
  text-align:center;
  padding-top: 60px;
  padding-bottom: 30px;
  color: #0079bb;
  font-weight: 700;
}
</style>
