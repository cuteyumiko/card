<template>
  <div>
    <div class="ql-editor" v-html="item.content"></div>
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
    document.title = '公告详情';
    const { id } = this.$route.params;
    this.item = (await this.$http.get(`/api/merchant_notice/${id}`)).body;
    document.title = this.item.name;
  },
};
</script>

<style scoped lang="less">
</style>
