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
          <el-input v-model="search.creator_name__like" placeholder="提交人" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.creator_mobile__like" placeholder="提交人手机号" clearable></el-input>
        </el-form-item>

        <el-form-item>
          <el-select v-model="search.status" placeholder="请选择">
            <el-option v-for="o in searchStatusList" :key="o.id" :label="o.name" :value="o.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="search.ticket_id" placeholder="请选择">
            <el-option v-for="o in searchProductList" :key="o.id" :label="o.name" :value="o.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <div v-loading="loading">
      <el-table :data="list" style="width: 100%;" @sort-change="sortChange" :default-sort="{prop: 'create_time', order: 'descending'}">
        <el-table-column prop="merchant_name" label="商户" width="100"></el-table-column>
        <el-table-column label="提交人">
          <template slot-scope="{row}">
            <div>{{row.creator_name}}</div>
            <div>{{row.creator_mobile}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="code" label="订单号"></el-table-column>
        <el-table-column prop="ticket_number" label="卡号"></el-table-column>
        <el-table-column prop="ticket_password" label="密码"></el-table-column>
        <el-table-column prop="image" label="图片">
          <template slot-scope="{row}">
            <div v-for="p in row.imageList" :key="p.id"><a :href="p.url" target="_blank" >{{p.name}}</a></div>
          </template>
        </el-table-column>
        <el-table-column prop="product_name" label="产品"></el-table-column>
        <el-table-column prop="status_name" label="订单状态" width="80"></el-table-column>
        <el-table-column prop="create_time" label="创建时间" width="200" sortable="custom"></el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="{row}">
            <template v-if="row.status === 1">
              <el-button icon="el-icon-delete" size="mini" type="text" @click="updateItemStatus(row, 4)">审核中</el-button>
              <el-button icon="el-icon-delete" size="mini" type="text" @click="updateItemStatus(row, 3)">未通过</el-button>
            </template>
            <template v-if="row.status === 4">
              <el-button icon="el-icon-delete" size="mini" type="text" @click="updateItemStatus(row, 2)">通过</el-button>
              <el-button icon="el-icon-delete" size="mini" type="text" @click="updateItemStatus(row, 3)">未通过</el-button>
            </template>
            <template v-if="row.status === 1 || row.status === 3">
              <el-tooltip content="删除" placement="top">
                <el-button icon="el-icon-delete" size="mini" type="text" @click="handleDelete(row)"></el-button>
              </el-tooltip>
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
        { id: 1, name: '待审核' },
        { id: 2, name: '已完成' },
        { id: 3, name: '未通过' },
        { id: 4, name: '审核中' },
      ],

      productList: [],
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
        const { current, size, ...params } = this.search;
        params.offset = (current - 1) * size;
        params.limit = size;
        const { body, headers } = (await this.$http.get('/api/product_ticket_order', { params }));

        this.list = _.map(body, (o) => {
          const t1 = moment(o.create_time).format('YY-MM-DD HH:mm:ss');
          const t2 = moment(o.create_time).fromNow();
          return {
            ...o,
            create_time: `${t2} ( ${t1} )`,
            imageList: _.map((o.image ? [o.image] : []), x => ({
              name: _.last(x.split('/')),
              url: x,
            })),
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

    async handleDelete({ id, name }) {
      const ok = await this.$confirm(`确认删除${name}?`, '提示', { type: 'warning' }).then(() => true).catch(() => false);
      if (!ok) return;

      try {
        await this.$http.delete(`/api/product_ticket_order/${id}`);
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
        await this.$http.put(`/api/product_ticket_order/${id}/status`, { status });
        await this.reload();
        this.$message.success('更新成功');
      } catch (e) {
        const message = e.bodyText || e.message;
        this.$message.error(message);
      }
    },
  },
  async mounted() {
    this.productList = (await this.$http.get('/api/product_ticket')).body;
    this.merchantList = (await this.$http.get('/api/merchant')).body;
    await this.reload();
  },
};
</script>

<style scoped>
</style>
