<template>
  <div style="padding:10px;display:flex:1;">

    <div style="display:flex;">
      <el-form :inline="true">
        <el-form-item>
          <el-input v-model="search.order_code__like" placeholder="订单号" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.creator_name__like" placeholder="推荐人" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.creator_mobile__like" placeholder="推荐人手机号" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.order_name__like" placeholder="申请人" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.order_mobile__like" placeholder="申请人手机号" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="search.card_id" placeholder="请选择">
            <el-option v-for="o in searchProductList" :key="o.id" :label="o.name" :value="o.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <div v-loading="loading">
      <el-table :data="list" style="width: 100%;" @sort-change="sortChange" :default-sort="{prop: 'create_time', order: 'descending'}">

        <el-table-column prop="order_code" label="订单号" width="150"></el-table-column>
        <el-table-column prop="name" label="产品" width="100"></el-table-column>
        <el-table-column prop="create_time" label="创建时间" width="200" sortable="custom"></el-table-column>
        <el-table-column prop="change_value" label="收益" width="200"></el-table-column>
        <el-table-column prop="change_value" label="申请人" width="200">
          <template slot-scope="{row}">
            <div>{{row.order_mobile | mobileFormat}} <template v-if="row.order_name"> ( {{row.order_name}} ) </template></div>
          </template>
        </el-table-column>
        <el-table-column label="推荐人">
          <template slot-scope="{row}">
            <div>{{row.creator_mobile}} <template v-if="row.creator_name"> ( {{row.creator_name}} ) </template></div>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination v-if="total"
        style="margin-top:10px;"
        @size-change="size => search.size = size"
        :current-page.sync="search.current"
        :page-size="search.size"
        :total="total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
import _ from 'lodash';
import moment from 'moment';

export default {
  data() {
    return {
      search: { current: 1, size: 10, card_order_id__not: '' },
      list: [],
      total: 0,
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
        const { current, size, ...params } = this.search;
        params.offset = (current - 1) * size;
        params.limit = size;

        const { body, headers } = (await this.$http.get('/api/my/user_balance', { params }));

        this.list = _.map(body, (o) => {
          const t1 = moment(o.create_time).format('MM-DD HH:mm:ss');
          const t2 = moment(o.create_time).fromNow();
          return {
            ...o,
            create_time: `${t2} ( ${t1} )`,
          };
        });
        this.total = parseInt(headers.get('X-Total-Count'), 10);
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
    this.productList = (await this.$http.get('/api/product_card')).body;
    await this.reload();
  },
};
</script>

<style scoped>
</style>
