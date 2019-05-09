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
            <el-option label="全部" :value="undefined"></el-option>
            <el-option v-for="o in statusList" :key="o.id" :label="o.name" :value="o.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <div v-loading="loading">
      <el-table :data="list" style="width: 100%;" @sort-change="sortChange" :default-sort="{prop: 'create_time', order: 'descending'}">
        <el-table-column prop="merchant_name" label="商户" width="100"></el-table-column>
        <el-table-column label="提交人" width="150">
          <template slot-scope="{row}">
            <div>{{row.creator_name}}</div>
            <div>{{row.creator_mobile}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="code" label="订单号"></el-table-column>
        <el-table-column prop="money" label="订单金额"></el-table-column>
        <el-table-column prop="from_level_name" label="原等级" width="100"></el-table-column>
        <el-table-column prop="to_level_name" label="升级等级" width="100"></el-table-column>
        <el-table-column prop="status_name" label="订单状态" width="80"></el-table-column>
        <el-table-column label="支付通道" width="200">
          <template slot-scope="{row}">
            {{row.payment_name}}<template v-if="row.payment_description"> ( {{row.payment_description}} ) </template>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="创建时间" width="200" sortable="custom"></el-table-column>
        <el-table-column label="操作" width="240">
          <template slot-scope="{row}">
            <template v-if="row.status === 1">
              <el-button icon="el-icon-delete" size="mini" type="text" @click="updateItemStatus(row, 2)">完成</el-button>
            </template>
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
      search: { current: 1, size: 10, status: 2 },
      list: [],
      total: 0,
      loading: false,

      form: {},
      formVisible: false,
      formLoading: false,

      statusList: [
        { id: 1, name: '待支付' },
        { id: 2, name: '已完成' },
      ],

      merchantList: [],
    };
  },
  computed: {
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
        const { body, headers } = (await this.$http.get('/api/user_level_order', { params }));

        this.list = _.map(body, (o) => {
          const t1 = moment(o.create_time).format('MM-DD HH:mm:ss');
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

    showForm(item) {
      const $form = this.$refs.form;
      if ($form) $form.resetFields();
      this.form = _.pick(item, ['id', 'name', 'type_id', 'description', 'got_count', 'icon', 'href', 'recommend_bg']);
      this.formVisible = true;
    },

    async saveForm() {
      this.formLoading = true;
      const $form = this.$refs.form;
      const ok = await $form.validate().catch(e => e);
      if (!ok) return;

      try {
        const { id, type_id, ...form } = this.form;
        if (id) {
          await this.$http.patch(`/api/user_level_order/${id}`, form);
        } else {
          await this.$http.post('/api/user_level_order', form);
        }
        this.formVisible = false;
        await this.reload();
      } catch (e) {
        const message = e.bodyText || e.message;
        this.$message.error(message);
      }
      this.formLoading = false;
    },

    async handleDelete({ id, name }) {
      const ok = await this.$confirm(`确认删除${name}?`, '提示', { type: 'warning' }).then(() => true).catch(() => false);
      if (!ok) return;

      try {
        await this.$http.delete(`/api/user_level_order/${id}`);
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
        await this.$http.put(`/api/user_level_order/${id}/status`, { status });
        await this.reload();
        this.$message.success('更新成功');
      } catch (e) {
        const message = e.bodyText || e.message;
        this.$message.error(message);
      }
    },

    handleSuccess_icon([{ url }]) {
      this.form = {
        ...this.form,
        icon: url,
      };
    },
    handleSuccess_recommend_bg([{ url }]) {
      this.form = {
        ...this.form,
        recommend_bg: url,
      };
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
