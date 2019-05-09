<template>
  <div >
    <div style="padding: 0.2rem 0.2rem;">

      <div style="border-left:0.2rem solid #30354e;font-size:0.5rem;color:#fff;margin:0.2rem 0;">
        <div style="margin-left:0.2rem;padding:0.1rem 0.2rem;background:#30354e;display:inline-block;">图文教程</div>
      </div>

      <div v-for="o in item.attachmentList" :key="o.id">
        <img :src="o" style="width:100%;" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      item: {},
    };
  },
  async mounted() {
    document.title = '推广培训';
    this.item = (await this.$http.get(`/api/merchant_article/${this.$route.params.id}`)).body;
    this.item.attachmentList = JSON.parse(this.item.attachment_list);
  },
};
</script>

<style scoped>
.image-tutorial >>> .weui-grid {
  padding: 0;
}
</style>
