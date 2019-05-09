<template>
  <div>
    <div class="ql-editor" v-html="item.value"></div>
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
    document.title = '活动规则及重要告知与申明';
    const [item] = (await this.$http.get('/api/m/extend?code=baoxian_license')).body;
    this.item = item;
  },
};
</script>

<style scoped lang="less">

</style>
