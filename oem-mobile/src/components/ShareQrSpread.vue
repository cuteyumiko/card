<template>
  <div style="">

    <vux-tab v-model="idx">
      <vux-tab-item class="vux-center" v-for="o in list" :key="o.id">{{o.name}}</vux-tab-item>
    </vux-tab>

    <vux-swiper v-model="idx" :show-dots="false" :aspect-ratio="2">
      <vux-swiper-item v-for="o in list" :key="o.id">
        <img v-if="o.imageBase64" :src="o.imageBase64" style="width:100%;"/>
      </vux-swiper-item>
    </vux-swiper>
    <vue-qr v-if="list.length" :dotScale="1" :text="link" height="200" width="200" :callback="handleQR" :bindElement="false"></vue-qr>
  </div>
</template>

<script>
import _ from 'lodash';
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
      list: [],
      idx: 0,
    };
  },
  computed: {
    ...mapState({
      info: state => state.info,
    }),
    link() {
      return `${location.origin}/join?referee=${this.info.id}`;
    },
  },
  methods: {
    async handleQR(data) {
      const qrImage = await loadImage(data);
      const list = await Promise.all(_.map(this.list, async (o) => {
        const bgImage = await loadImage(o.image);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        let [x, y, width, height] = o.qr_rect.split(',');
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
        ctx.fillStyle = o.text_color || '#fff';
        ctx.fillText(`推荐人：${this.info.display_name}`, x + (width / 2), y + height + 5);

        const imageBase64 = canvas.toDataURL('image/png');
        return { ...o, imageBase64 };
      }));
      this.list = list;
    },
  },
  async mounted() {
    document.title = '二维码推广';
    this.list = (await this.$http.get('/api/m/merchant_bill', { params: { order: 'sort', type_code: 'share' } })).body;
  },
};
</script>

<style scoped lang="less">
</style>
