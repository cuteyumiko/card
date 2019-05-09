<template>
  <div style="padding:10px;display:flex:1;">
    <div style="display:flex;align-items:center;">
      <div style="flex:1"></div>
      <el-button icon="el-icon-d-arrow-left" type="primary" size="small" @click="$router.push('/stat_ticket')">返回财务统计</el-button>
      <h2 style="flex:1;text-align:center;"> 优惠券收入 </h2>
      <div style="width:133px;"></div>
    </div>

    <el-table :data="list"  style="width: 100%;" show-summary v-loading="loading">
      <el-table-column prop="name" label="产品"></el-table-column>
      <el-table-column prop="sum_income" label="总收入">
        <template slot-scope="{row}">
          <template v-if="row.sum_income">
            <router-link :to="{ path: '/stat_ticket_detail', query: { ticket_id: row.id } }">{{row.sum_income}}</router-link>
          </template><template v-else> - </template>
        </template>
      </el-table-column>
      <el-table-column prop="last_month_income" :label="`上月 ( ${lastMonth} )`">
        <template slot-scope="{row}">
          <template v-if="row.last_month_income">
            <router-link :to="{ path: '/stat_ticket_detail', query: { stage_time: lastMonth, ticket_id: row.id} }">{{row.last_month_income}}</router-link>
          </template><template v-else> - </template>
        </template>
      </el-table-column>
      <el-table-column prop="this_month_income" :label="`本月 ( ${thisMonth} )`">
        <template slot-scope="{row}">
          <template v-if="row.this_month_income">
            <router-link :to="{ path: '/stat_ticket_detail', query: { stage_time: thisMonth, ticket_id: row.id} }">{{row.this_month_income}}</router-link>
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
        name: `[ ${o.source_name} ] ${o.name}`,
        sum_income: _(this.itemList).filter({ ticket_id: o.id }).sumBy('merchant_income'),
        last_month_income: _(this.itemList).filter({ ticket_id: o.id, stage_time: this.lastMonth }).sumBy('merchant_income'),
        this_month_income: _(this.itemList).filter({ ticket_id: o.id, stage_time: this.thisMonth }).sumBy('merchant_income'),
      })).value();
    },
  },

  async mounted() {
    this.productList = (await this.$http.get('/api/product_ticket')).body;
    this.loading = true;
    this.itemList = (await this.$http.get('/api/m/stat_ticket_order_by_merchant$month$product')).body;
    this.loading = false;
  },
};
</script>

<style scoped>
</style>
