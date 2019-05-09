<template>
  <div>
    <template v-if="chief.id">
      <div style="display:flex;flex-direction:column;align-items:center;padding:10px;">
        <img :src="chief.head_image || headImage" style="margin-top:10px;width:96px;height:96px;border-radius:48px;" />

        <div style="font-size:0.6rem;margin-top:10px;">{{chief.nickname}}</div>
        <div style="font-size:0.3rem;margin-top:5px;">等级：{{chief.level_name}}</div>
      </div>


      <div style="display:flex;text-align:center;">
        <a :href="`tel:${chief.mobile}`" style="flex:1;text-decoration:none;color:#2c3e50;">
          <div><i class="iconfont icon-dianhua" style="color:#3787c3;font-size:1.5rem;" /></div>
          <div>给我打电话</div>
        </a>
        <div @click="showWeixin = true" style="flex:1;">
          <div><i class="iconfont icon-weixin-copy" style="color:#00b45d;font-size:1.5rem;" /></div>
          <div>加我微信</div>
        </div>
      </div>
    </template>

    <div style="margin:20px 10px;">专属服务客服是带领你加入{{merchant.name}}的负责人，在享受平台相关权益的同时，也肩负着指导和培训下级用户的责任和义务</div>

    <div v-transfer-dom v-if="chief.id">
      <vux-x-dialog v-model="showWeixin">
        <div style="margin:10px;text-align:left;">专属客服二维码
          <i @click="showWeixin = false" class="iconfont icon-close" style="float:right;" />
        </div>
        <div style="border-bottom:1px solid #D9D9D9;"></div>

        <div style="width:5rem;margin:10px auto;">
          <img :src="chief.weixin_qr" style="width:100%;" />
        </div>
        <div style="font-size:0.3rem;">扫一扫二维码，添加上级微信</div>
        <div style="font-size:0.3rem;margin:10px;">复制微信号：<span style="color:red;">{{chief.weixin}}</span></div>

      </vux-x-dialog>
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
      showWeixin: false,
      chief: {},
    };
  },
  computed: {
    ...mapState({
      merchant: state => state.merchant,
      headImage: state => state.merchant.extendImage.default_head_image,
    }),
  },
  methods: {
  },
  async mounted() {
    document.title = '我的客服';
    this.chief = (await this.$http.get('/api/i/chief')).body;
  },
};
</script>

<style scoped lang="less">

</style>
