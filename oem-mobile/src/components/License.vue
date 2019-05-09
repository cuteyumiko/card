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
    document.title = '平台服务协议';
    const [item] = (await this.$http.get('/api/m/extend?code=agreement')).body;
    this.item = item;
  },
};
</script>

<style scoped lang="less">

</style>
