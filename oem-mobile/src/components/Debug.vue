<template>
  <div>
    {{wxOpenId}}
  </div>
</template>

<script>
import {
  mapState,
} from 'vuex';

export default {
  data() {
    return {
    };
  },
  computed: {
    ...mapState({
      wxOpenId: state => state.wxOpenId,
    }),
  },

  async mounted() {
    document.title = 'debug';
  },
};
</script>

<style scoped lang="less">
</style>
