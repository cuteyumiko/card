<template>
  <div style="padding:10px;display:flex:1;">
    <h2>收入详情</h2>

    <el-table :data="list"  style="width: 100%;" show-summary v-loading="loading">
      <el-table-column prop="name" label="产品"></el-table-column>
      <el-table-column prop="sum_income" label="总收入">
        <template slot-scope="{row}">
          <template v-if="row.sum_income">
            <router-link :to="{ path: '/stat_loan_detail', query: { loan_id: row.id } }">{{row.sum_income}}</router-link>
          </template><template v-else> - </template>
        </template>
      </el-table-column>
      <el-table-column prop="last_month_income" :label="`上月 ( ${lastMonth} )`">
        <template slot-scope="{row}">
          <template v-if="row.last_month_income">
            <router-link :to="{ path: '/stat_loan_detail', query: { stage_time: lastMonth, loan_id: row.id} }">{{row.last_month_income}}</router-link>
          </template><template v-else> - </template>
        </template>
      </el-table-column>
      <el-table-column prop="this_month_income" :label="`本月 ( ${thisMonth} )`">
        <template slot-scope="{row}">
          <template v-if="row.this_month_income">
            <router-link :to="{ path: '/stat_loan_detail', query: { stage_time: thisMonth, loan_id: row.id} }">{{row.this_month_income}}</router-link>
          </template><template v-else> - </template>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import _ from 'lodash';
import moment from 'moment';

export default {
  data() {
    return {
      loading: false,
      thisMonth: moment().format('YYYY-MM'),
      lastMonth: moment().subtract(1, 'M').format('YYYY-MM'),

      productList: [],
      itemList: [],
    };
  },
  computed: {
    list() {
      return _(this.productList).map(o => ({
        id: o.id,
        name: o.name,
        sum_income: _(this.itemList).filter({ loan_id: o.id }).sumBy('merchant_income'),
        last_month_income: _(this.itemList).filter({ loan_id: o.id, stage_time: this.lastMonth }).sumBy('merchant_income'),
        this_month_income: _(this.itemList).filter({ loan_id: o.id, stage_time: this.thisMonth }).sumBy('merchant_income'),
      })).value();
    },
  },

  async mounted() {
    this.productList = (await this.$http.get('/api/product_loan')).body;
    this.loading = true;
    this.itemList = (await this.$http.get('/api/m/stat_loan_order_by_merchant$month$product')).body;
    this.loading = false;
  },
};
</script>

<style scoped>
</style>
