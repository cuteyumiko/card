<template>
  <div style="padding: 10px;">
    <router-link tag="div" :to="`/notice/${o.id}`" @click="showItemDialog(o)" v-for="o in list" :key="o.id" style="display:flex;box-shadow:0px 0px 10px #eee;padding:10px;">
      <div style="background-color:#203250;color:#fff;width:48px;height:48px;border-radius:24px;display:flex;align-items:center;justify-content:center;">
        <i class="iconfont icon-lingdang" style="font-size:32px;" />
      </div>
      <div style="flex:1;display:flex;align-items:center;margin-left:5px;">{{o.name}}</div>
      <div style="display:flex;align-items:center;">
        <i class="iconfont icon-enter" style="font-size:24px;" />
      </div>
    </router-link>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      showDetail: false,
      showItem: {},
    };
  },
  methods: {
    showItemDialog(item) {
      this.showDetail = true;
      this.showItem = item;
    },
  },
  async mounted() {
    document.title = '公告';
    this.list = (await this.$http.get('/api/m/merchant_notice?type_code=text-marquee')).body;
  },
};
</script>

<style scoped>
.image-tutorial >>> .weui-grid {
  padding: 0;
}
</style>
