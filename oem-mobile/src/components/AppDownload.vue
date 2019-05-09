<template>
  <div style="position:relative;">
    <img src="../assets/app-bg.jpg" style="width:100%;" />
    <div style="position:absolute;top:0;left:0;right:0;">
      <div style="margin-top:14rem;display:flex;">
        <div @click="redirect(merchant.extendImage.android_app_download_href)" style="flex:1;height:2rem;"></div>
        <div @click="redirect(merchant.extendImage.ios_app_download_href)" style="flex:1;height:2rem;"></div>
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
    };
  },
  computed: {
    ...mapState({
      merchant: state => state.merchant,
    }),
  },

  async mounted() {
    document.title = 'APP下载';
  },

  methods: {
    redirect(href) {
      location.href = href;
    },
  },
};
</script>

<style scoped lang="less">
.debug {
  background: rgba(255, 0, 255, 0.5);
  box-sizing: border-box;
}
</style>
