<template>
  <div style="padding:10px;display:flex:1;">

    <div style="display:flex;">
      <el-form :inline="true">
        <el-form-item>
          <el-input v-model="search.code__like" placeholder="订单号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="search.status" placeholder="请选择">
            <el-option v-for="o in searchStatusList" :key="o.id" :label="o.name" :value="o.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="search.merchant_id" placeholder="请选择">
            <el-option v-for="o in searchMerchantList" :key="o.id" :label="o.name" :value="o.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="search.payment_id" placeholder="请选择">
            <el-option v-for="o in searchPaymentList" :key="o.id" :label="o.name" :value="o.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <div v-loading="loading">
      <el-table :data="list" style="width: 100%;" @sort-change="sortChange" :default-sort="{prop: 'create_time', order: 'descending'}">
        <el-table-column prop="merchant_name" label="商户" width="100"></el-table-column>
        <el-table-column prop="creator_name" label="提交人" width="100"></el-table-column>
        <el-table-column prop="creator_mobile" label="手机号" width="100"></el-table-column>
        <el-table-column prop="code" label="订单号"></el-table-column>
        <el-table-column prop="money" label="支付金额"></el-table-column>
        <el-table-column prop="payment_name" label="支付通道"></el-table-column>
        <el-table-column prop="status_name" label="订单状态" width="80">
        </el-table-column>
        <el-table-column prop="create_time" label="创建时间" width="200" sortable="custom"></el-table-column>
        <el-table-column prop="payment_time" label="支付时间" width="200" sortable="custom"></el-table-column>
        <el-table-column label="操作" width="240">
          <template slot-scope="{row}">
            <template v-if="row.status === 1">
              <el-tooltip content="删除" placement="top">
                <el-button icon="el-icon-delete" size="mini" type="text" @click="handleDelete(row)"></el-button>
              </el-tooltip>
            </template>
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
      search: { current: 1, size: 10 },
      a_list: [],
      total: 0,
      loading: false,

      statusList: [
        { id: 1, name: '待支付' },
        { id: 2, name: '已支付' },
      ],

      merchantList: [],
      paymentList: [],
    };
  },
  computed: {
    list() {
      return _.map(this.a_list, o => ({
        ...o,
        payment_time: moment(o.payment_time).isValid() ? `${moment(o.payment_time).fromNow()} ( ${moment(o.payment_time).format('MM-DD HH:mm:ss')} )` : '',
        create_time: `${moment(o.create_time).fromNow()} ( ${moment(o.create_time).format('MM-DD HH:mm:ss')} )`,
        status_name: o.status ? (_.find(this.statusList, { id: o.status }) || { name: o.status }).name : o.status,
      }));
    },
    searchStatusList() {
      return [
        { id: undefined, name: '全部状态' },
        ...this.statusList,
      ];
    },

    searchMerchantList() {
      return [
        { id: undefined, name: '全部商户' },
        ...this.merchantList,
      ];
    },

    searchPaymentList() {
      return [
        { id: undefined, name: '全部支付通道' },
        ...this.paymentList,
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
        const { body, headers } = (await this.$http.get('/api/recharge_order', { params }));

        this.a_list = body;
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

    async handleDelete({ id, code }) {
      const ok = await this.$confirm(`确认删除${code}?`, '提示', { type: 'warning' }).then(() => true).catch(() => false);
      if (!ok) return;

      try {
        await this.$http.delete(`/api/recharge_order/${id}`);
        await this.reload();
        this.$message.success('删除成功');
      } catch (e) {
        const message = e.bodyText || e.message;
        this.$message.error(message);
      }
    },
  },
  async mounted() {
    this.merchantList = (await this.$http.get('/api/merchant')).body;
    this.paymentList = (await this.$http.get('/api/payment')).body;
    await this.reload();
  },
};
</script>

<style scoped>
</style>
