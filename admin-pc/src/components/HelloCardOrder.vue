<template>
  <div style="padding:10px;display:flex:1;">

    <el-form :inline="true">
      <el-form-item>
        <el-select v-model="search.card_id" placeholder="请选择">
          <el-option v-for="o in searchProductList" :key="o.id" :label="o.name" :value="o.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <div v-loading="loading">
      <el-table :data="list" style="width: 100%;" @sort-change="sortChange" show-summary :default-sort="{prop: 'create_time', order: 'descending'}">

        <el-table-column prop="code" label="订单号" width="150"></el-table-column>
        <el-table-column prop="product_name" label="产品"></el-table-column>
        <el-table-column prop="money" label="收入" width="100"></el-table-column>
        <el-table-column prop="user_income" label="支出" width="100"></el-table-column>
        <el-table-column prop="merchant_income" label="利润" width="100"></el-table-column>
        <el-table-column prop="create_time" label="创建时间" width="200" sortable="custom"></el-table-column>
        <el-table-column label="推荐人">
          <template slot-scope="{row}">
            <div>{{row.creator_mobile}} <template v-if="row.creator_name"> ( {{row.creator_name}} ) </template></div>
          </template>
        </el-table-column>
      </el-table>
    </div>

  </div>
</template>

<script>
import _ from 'lodash';
import moment from 'moment';

export default {
  data() {
    return {
      search: { status: 2 },
      list: [],
      loading: false,

      productList: [],
    };
  },
  computed: {
    searchProductList() {
      return [
        { id: undefined, name: '全部产品' },
        ...this.productList,
      ];
    },
  },
  watch: {
    search: {
      async handler() {
        await this.reload();
      },
      deep: true,
    },
  },
  methods: {
    reload: _.throttle(async function _reload() {
      this.loading = true;

      try {
        const { ...params } = this.search;
        const { body } = (await this.$http.get('/api/product_card_order', { params }));

        this.list = _.map(body, (o) => {
          const t1 = moment(o.create_time).format('MM-DD HH:mm:ss');
          const t2 = moment(o.create_time).fromNow();
          return {
            ...o,
            money: o.merchant_income + o.user_income,
            create_time: `${t2} ( ${t1} )`,
          };
        });
      } catch (e) {
        const message = e.bodyText || e.message;
        this.$message.error(message);
      }

      this.loading = false;
    }, 200, { leading: false }),

    sortChange({ order, prop }) {
      this.search = {
        ...this.search,
        order: order ? `${prop}${order === 'ascending' ? '+' : '-'}` : null,
      };
    },
  },
  async mounted() {
    this.search = {
      ...this.search,
      ...this.$route.query,
    };
    this.productList = (await this.$http.get('/api/product_card')).body;
    await this.reload();
  },
};
</script>

<style scoped>
</style>
