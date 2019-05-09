<template>
  <div class="ql-editor" style="padding:0;margin:0;" v-html="item.value"></div>
</template>

<script>

export default {
  data() {
    return {
      item: {},
    };
  },
  async mounted() {
    document.title = '关于我们';
    const [item] = (await this.$http.get('/api/m/extend?code=about')).body;
    this.item = item;
  },
};
</script>

<style scoped lang="less">
</style>
