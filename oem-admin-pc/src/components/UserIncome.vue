<template>
  <div style="padding:10px;display:flex:1;">

    <div style="display:flex;">
      <el-form :inline="true">

      </el-form>
    </div>

    <div v-loading="loading">
      <el-table :data="list" style="width: 100%;" @sort-change="sortChange" :default-sort="{prop: 'create_time', order: 'descending'}">
        <el-table-column label="类型" width="100">
          <template slot-scope="{row}">
            <template v-if="row.card_order_id">信用卡</template>
            <template v-else-if="row.loan_order_id">贷款</template>
            <template v-else-if="row.ticket_order_id">积分券</template>
            <template v-else-if="row.level_order_id">会员升级</template>
            <template v-else>其他</template>
          </template>
        </el-table-column>
        <el-table-column prop="change_value" label="收入金额" width="100"></el-table-column>
        <el-table-column label="原因">
          <template slot-scope="{row}">
            {{row.name}}－{{row.comments}}<template v-if="row.lower_id">{{row.lower_name}}推广</template>
          </template>
        </el-table-column>
        <el-table-column prop="order_code" label="订单号" width="150"></el-table-column>
        <el-table-column prop="create_time" label="时间" sortable="custom" width="150"></el-table-column>
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
      search: { current: 1, size: 10, change_value__gt: 0 },
      list: [],
      total: 0,
      loading: false,
    };
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
      const { user_id } = this.$route.params;
      this.loading = true;
      const { current, size, ...params } = this.search;
      params.offset = (current - 1) * size;
      params.limit = size;
      params.user_id = user_id;
      const { body, headers } = (await this.$http.get('/api/user_balance', { params }));

      this.list = _.map(body, o => ({
        ...o,
        user_type_name: o.user_type ? (_.find(this.typeList, { id: o.user_type }) || { name: o.user_type }).name : o.user_type_name,
        create_time: moment(o.create_time).format('YYYY-MM-DD HH:mm:ss'),
        status_name: o.status ? (_.find(this.statusList, { id: o.status }) || { name: o.status }).name : o.status,
      }));
      this.total = parseInt(headers.get('X-Total-Count'), 10);
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
    await this.reload();
  },
};
</script>

<style scoped>

</style>
