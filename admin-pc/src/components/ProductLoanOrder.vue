<template>
  <div style="padding:10px;display:flex:1;">

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
        <el-input v-model="search.creator_name__like" placeholder="推荐人" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="search.creator_mobile__like" placeholder="推荐人手机号" clearable></el-input>
      </el-form-item>

      <el-form-item>
        <el-input v-model="search.name__like" placeholder="申请人" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="search.mobile__like" placeholder="申请人手机号" clearable></el-input>
      </el-form-item>

      <el-form-item>
        <el-select v-model="search.status" placeholder="请选择">
          <el-option v-for="o in searchStatusList" :key="o.id" :label="o.name" :value="o.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="search.loan_id" placeholder="请选择" filterable>
          <el-option v-for="o in searchProductList" :key="o.id" :label="o.name" :value="o.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="search.create_time__range" start-placeholder="创建时间起" end-placeholder="创建时间止" type="daterange"></el-date-picker>
      </el-form-item>
    </el-form>

    <div style="margin-right:10px;">
      <el-button v-if="selection.length" icon="el-icon-delete" type="danger" size="small" @click="handleUpdateSelection()">拒绝选择 {{selection.length}} 项</el-button>
      <el-button icon="el-icon-download" type="primary" size="small" @click="exportFile()">导出</el-button>
    </div>

    <div v-loading="loading">
      <el-table :data="list" style="width: 100%;" @selection-change="selectionChange" @sort-change="sortChange" :default-sort="{prop: 'create_time', order: 'descending'}">
        <el-table-column type="selection" width="30"></el-table-column>
        <el-table-column prop="merchant_name" label="商户" width="100"></el-table-column>
        <el-table-column label="推荐人" width="150">
          <template slot-scope="{row}">
            <div>{{row.creator_name}} {{row.creator_mobile}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="code" label="订单号"></el-table-column>
        <el-table-column prop="name" label="申请人" width="150">
          <template slot-scope="{row}">
            <div>{{row.name}} {{row.mobile}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="product_name" label="产品"></el-table-column>
        <el-table-column prop="money" label="贷款金额"></el-table-column>
        <el-table-column prop="status_name" label="订单状态" width="80"></el-table-column>
        <el-table-column prop="create_time" label="创建时间" width="200" sortable="custom"></el-table-column>
        <el-table-column label="操作" width="240">
          <template slot-scope="{row}">
            <template v-if="row.status === 1">
              <el-button v-if="row.product_money_unit == '％'" icon="el-icon-delete" size="mini" type="text" @click="showMoneyForm(row)">贷款金额</el-button>
              <el-button v-if="row.product_money_unit != '％' || row.money" icon="el-icon-delete" size="mini" type="text" @click="updateItemStatus(row, 2)">通过</el-button>
              <el-button icon="el-icon-delete" size="mini" type="text" @click="updateItemStatus(row, 3)">拒绝</el-button>
            </template>
            <template v-else-if="row.status === 3">
              <el-button icon="el-icon-delete" size="mini" type="text" @click="updateItemStatus(row, 1)">撤销为申请中</el-button>
              <el-tooltip content="删除" placement="top">
                <el-button icon="el-icon-delete" size="mini" type="text" @click="handleDelete(row)"></el-button>
              </el-tooltip>
            </template>
            <template v-else-if="row.status === 4">
              <el-button icon="el-icon-delete" size="mini" type="text" @click="updateItemStatus(row, 2)">通过</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination v-if="total"
        style="margin-top:10px;"
        @size-change="size => search.size = size"
        :current-page.sync="search.current"
        :page-size="search.size"
        layout="sizes, prev, pager, next, ->, total"
        :total="total">
      </el-pagination>
    </div>

    <el-dialog title="修改贷款金额" :visible.sync="moneyFormVisible" :close-on-click-modal="false">
      <el-form class="edit-form" :model="moneyForm" ref="moneyForm">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="贷款金额">
              <el-input-number v-model="moneyForm.money" controls-position="right" :min="1"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="moneyFormVisible = false">取消</el-button>
        <el-button type="primary" @click="saveMoneyForm" :loading="formLoading">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash';
import moment from 'moment';
import XLSX from 'xlsx';

export default {
  data() {
    return {
      search: { current: 1, size: 10, status: 1 },
      list: [],
      total: 0,
      loading: false,

      moneyForm: {},
      moneyFormVisible: false,
      moneyFormLoading: false,

      statusList: [
        { id: 1, name: '申请中' },
        { id: 2, name: '已通过' },
        { id: 3, name: '未通过' },
        { id: 4, name: '审核中' },
      ],

      productList: [],
      merchantList: [],

      selection: [],
    };
  },
  computed: {
    searchStatusList() {
      return [
        { id: undefined, name: '全部状态' },
        ...this.statusList,
      ];
    },

    searchProductList() {
      return [
        { id: undefined, name: '全部产品' },
        ...this.productList,
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
        const { current, size, create_time__range, ...params } = this.search;
        if (create_time__range) {
          params.create_time__gt = moment(create_time__range[0]).format('YYYY-MM-DD');
          params.create_time__lt = moment(create_time__range[1]).add(1, 'd').format('YYYY-MM-DD');
        }
        params.offset = (current - 1) * size;
        params.limit = size;
        const { body, headers } = (await this.$http.get('/api/product_loan_order', { params }));

        this.list = _.map(body, (o) => {
          const t1 = moment(o.create_time).format('YY-MM-DD HH:mm:ss');
          const t2 = moment(o.create_time).fromNow();
          return {
            ...o,
            create_time: `${t2} ( ${t1} )`,
            status_name: o.status ? (_.find(this.statusList, { id: o.status }) || { name: o.status }).name : o.status,
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

    showMoneyForm(item) {
      const $form = this.$refs.moneyForm;
      if ($form) $form.resetFields();
      this.moneyForm = _.pick(item, ['id', 'money']);
      this.moneyFormVisible = true;
    },

    async saveMoneyForm() {
      this.moneyFormLoading = true;
      const $form = this.$refs.moneyForm;
      const ok = await $form.validate().catch(e => e);
      if (!ok) return;

      try {
        const { id, ...form } = this.moneyForm;
        await this.$http.patch(`/api/product_loan_order/${id}`, form);
        this.moneyFormVisible = false;
        await this.reload();
      } catch (e) {
        const message = e.bodyText || e.message;
        this.$message.error(message);
      }
      this.moneyFormLoading = false;
    },

    async handleDelete({ id, name }) {
      const ok = await this.$confirm(`确认删除${name}?`, '提示', { type: 'warning' }).then(() => true).catch(() => false);
      if (!ok) return;

      try {
        await this.$http.delete(`/api/product_loan_order/${id}`);
        await this.reload();
        this.$message.success('删除成功');
      } catch (e) {
        const message = e.bodyText || e.message;
        this.$message.error(message);
      }
    },

    async updateItemStatus({ id }, status) {
      const ok = await this.$confirm('确认修改状态?', '提示', { type: 'warning' }).then(() => true).catch(() => false);
      if (!ok) return;

      try {
        await this.$http.put(`/api/product_loan_order/${id}/status`, { status });
        await this.reload();
        this.$message.success('更新成功');
      } catch (e) {
        const message = e.bodyText || e.message;
        this.$message.error(message);
      }
    },

    async exportFile() {
      const { current, size, create_time__range, ...params } = this.search;
      if (create_time__range) {
        params.create_time__gt = moment(create_time__range[0]).format('YYYY-MM-DD');
        params.create_time__lt = moment(create_time__range[1]).add(1, 'd').format('YYYY-MM-DD');
      }
      const { body } = (await this.$http.get('/api/product_loan_order', { params }));

      const wb = XLSX.utils.book_new();
      const ws_name = '贷款申请';
      const list = _.map(body, o => ({
        ...o,
        create_time: moment(o.create_time).format('YYYY-MM-DD HH:mm:ss'),
        status_name: o.status ? (_.find(this.statusList, { id: o.status }) || { name: o.status }).name : o.status,
      }));

      const ws = XLSX.utils.aoa_to_sheet([
        ['订单号', '姓名', '手机号', '产品', '状态', '创建时间', '推荐人', '推荐人手机号'],
        ..._.map(list, o => ([o.code, o.name, o.mobile, o.product_name, o.status_name, o.create_time, o.creator_name, o.creator_mobile])),
      ]);
      XLSX.utils.book_append_sheet(wb, ws, ws_name);
      XLSX.writeFile(wb, '贷款申请.xlsx', {});
    },

    selectionChange(selection) {
      this.selection = _.map(selection, 'id');
    },

    async handleUpdateSelection() {
      const ok = await this.$confirm(`确认更新${this.selection.length}项?`, '提示', { type: 'warning' }).then(() => true).catch(() => false);
      if (!ok) return;

      this.loading = true;
      /* eslint-disable no-await-in-loop */
      for (let i = 0; i < this.selection.length; i += 1) {
        const id = this.selection[i];
        try {
          await this.$http.put(`/api/product_loan_order/${id}/status`, { status: 3 });
        } catch (e) {
          const message = e.bodyText || e.message;
          this.$message.error(message);
        }
      }
      await this.reload();
      this.$message.success('更新完成');
    },
  },
  async mounted() {
    this.productList = (await this.$http.get('/api/product_loan')).body;
    this.merchantList = (await this.$http.get('/api/merchant')).body;
    await this.reload();
  },
};
</script>

<style scoped>
</style>
