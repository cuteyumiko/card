<template>
  <div>
    <template v-if="info.user && !info.user.level_disable_recommend">
      <img v-if="imageBase64" :src="imageBase64" style="width:100%;"/>
      <vue-qr :dotScale="1" :text="link" height="200" width="200" :callback="handleQR" :bindElement="false"></vue-qr>
    </template>
  </div>
</template>

<script>
import {
  mapState,
} from 'vuex';

const loadImage = src => new Promise((resolve) => {
  const img = new Image();
  img.src = src.replace(/^https?:\/\/.*?(?:\/)/, '/cdn/');
  img.onload = () => resolve(img);
});

export default {
  data() {
    return {
      item: {},
      imageBase64: null,
    };
  },
  computed: {
    ...mapState({
      info: state => state.info,
    }),
    link() {
      return `${location.origin}/product_card_apply?referee=${this.info.id}&id=${this.item.id}`;
    },
  },
  methods: {
    async handleQR(data) {
      const bgImage = await loadImage(this.item.recommend_bg);
      const qrImage = await loadImage(data);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      let [x, y, width, height] = this.item.qr_rect.split(',');
      x = parseInt(x, 10);
      y = parseInt(y, 10);
      width = parseInt(width, 10);
      height = parseInt(height, 10);

      canvas.width = bgImage.width;
      canvas.height = bgImage.height;
      ctx.drawImage(bgImage, 0, 0);
      ctx.drawImage(qrImage, x, y, width, height);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.font = '24px 微软雅黑';
      ctx.fillStyle = this.item.text_color || '#fff';
      ctx.fillText(`推荐人：${this.info.display_name}`, x + (width / 2), y + height + 5);
      this.imageBase64 = canvas.toDataURL('image/png');
    },
  },
  async mounted() {
    document.title = '推荐办卡';

    const { id } = this.$route.query;
    this.item = (await this.$http.get(`/api/product_card/${id}`)).body;
    if (!this.item.is_enabled) {
      this.$vux.toast.text('产品已下架');
      this.$router.push('/product_card');
    }

    if (this.info && this.info.user && this.info.user.level_disable_recommend) {
      this.$vux.confirm.show({
        title: '升级后才可推广',
        content: '确定升级加薪吗？',
        onConfirm: async () => {
          this.$router.push('/level_up?sidx=3');
        },
        onCancel: () => {
          this.$router.push('/');
        },
      });
    }
  },
};
</script>

<style scoped lang="less">
</style>
