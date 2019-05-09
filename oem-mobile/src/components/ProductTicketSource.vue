<template>
  <div>
    <img :src="item.image_description" style="width:100%;" />

    <router-link tag="div" style="background-color:#1f2035;text-align:center;color:#fff;padding:10px;" :to="{ path: '/product_ticket_apply', query: { source_id: $route.params.id} }">报单</router-link>
  </div>
</template>

<script>

export default {
  data() {
    return {
      item: {},
      imageBase64: null,
    };
  },
  methods: {
  },
  async mounted() {
    document.title = '积分兑换';
    const { id } = this.$route.params;
    this.item = (await this.$http.get(`/api/product_ticket_source/${id}`)).body;
  },
};
</script>

<style scoped lang="less">
</style>
