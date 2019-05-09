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
    document.title = '购买须知';
    const [item] = (await this.$http.get('/api/m/extend?code=levelup.notes')).body;
    this.item = item;
  },
};
</script>

<style scoped>
.ql-editor {
  white-space: normal;
}
</style>
