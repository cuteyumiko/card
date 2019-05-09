<template>
  <div style="padding:10px;display:flex:1;">

    <div style="display:flex;">
      <el-form :inline="true">
        <el-form-item>
          <el-select v-model="search.merchant_id" placeholder="请选择">
            <el-option v-for="o in searchMerchantList" :key="o.id" :label="o.name" :value="o.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.code__like" placeholder="订单号" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.creator_name__like" placeholder="申请人" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.creator_mobile__like" placeholder="申请人手机号" clearable></el-input>
        </el-form-item>


        <el-form-item>
          <el-select v-model="search.status" placeholder="请选择">
            <el-option v-for="o in searchStatusList" :key="o.id" :label="o.name" :value="o.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <div v-loading="loading">
      <el-table :data="list" style="width: 100%;" @sort-change="sortChange" :default-sort="{prop: 'create_time', order: 'descending'}">
        <el-table-column prop="merchant_name" label="商户" width="80"></el-table-column>
        <el-table-column label="申请人" width="100">
          <template slot-scope="{row}">
            <div>{{row.creator_name}}</div>
            <div>{{row.creator_mobile}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="code" label="订单号"></el-table-column>
        <el-table-column prop="money" label="提现金额" width="80"></el-table-column>
        <el-table-column prop="mobile" label="手机号码" width="100"></el-table-column>
        <el-table-column label="银行卡" width="160">
          <template slot-scope="{row}">
            <div>{{row.bank_name}} {{row.bank_card_name}}</div>
            <div>{{row.bank_card_no}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="status_name" label="订单状态" width="80"></el-table-column>
        <el-table-column prop="create_time" label="创建时间" width="140" sortable="custom">
          <template slot-scope="{row}">
            <div>{{row.create_time_from_now}}</div>
            <div>{{row.create_time}}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280">
          <template slot-scope="{row}">
            <template v-if="row.status === 1">
              <el-button icon="el-icon-delete" size="mini" type="text" @click="updateItemStatus(row, 2, {method:'agentpay', title: '确认代付打款?'})">代付打款</el-button>
              <el-button icon="el-icon-delete" size="mini" type="text" @click="updateItemStatus(row, 2, {title: '确认手工打款?'})">手工打款</el-button>
              <el-button icon="el-icon-delete" size="mini" type="text" @click="updateItemStatus(row, 3, {title: '确认撤销申请?'})">撤销申请</el-button>
            </template>
            <div>{{row.comments}}</div>
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
      search: { current: 1, size: 10, status: 1 },
      list: [],
      total: 0,
      loading: false,

      statusList: [
        { id: 1, name: '待处理' },
        { id: 2, name: '打款成功' },
        { id: 3, name: '已撤销' },
        { id: 4, name: '打款处理中' },
      ],

      merchantList: [],
    };
  },
  computed: {
    searchStatusList() {
      return [
        { id: undefined, name: '全部状态' },
        ...this.statusList,
      ];
    },
    searchMerchantList() {
      return [
        { id: undefined, name: '全部商户' },
        { id: '', name: '未设置' },
        ...this.merchantList,
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
        const { body, headers } = (await this.$http.get('/api/cash_order', { params }));

        this.list = _.map(body, o => ({
          ...o,
          create_time_from_now: moment(o.create_time).fromNow(),
          create_time: moment(o.create_time).format('YYYY-MM-DD HH:mm:ss'),
          status_name: (_.find(this.statusList, { id: o.status }) || { name: o.status }).name,
        }));
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

    async handleDelete({ id, name }) {
      const ok = await this.$confirm(`确认删除${name}?`, '提示', { type: 'warning' }).then(() => true).catch(() => false);
      if (!ok) return;

      try {
        await this.$http.delete(`/api/cash_order/${id}`);
        await this.reload();
        this.$message.success('删除成功');
      } catch (e) {
        const message = e.bodyText || e.message;
        this.$message.error(message);
      }
    },

    async updateItemStatus({ id }, status, { method, title }) {
      const ok = await this.$confirm(title || '确认修改状态?', '提示', { type: 'warning' }).then(() => true).catch(() => false);
      if (!ok) return;

      try {
        await this.$http.put(`/api/cash_order/${id}/status`, { status, method });
        await this.reload();
        this.$message.success('更新成功');
      } catch (e) {
        const message = e.bodyText || e.message;
        this.$message.error(message);
      }
    },
  },
  async mounted() {
    this.merchantList = (await this.$http.get('/api/merchant')).body;
    await this.reload();
  },
};
</script>

<style scoped>
</style>
