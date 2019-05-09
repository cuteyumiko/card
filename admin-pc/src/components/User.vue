<template>
  <div style="padding:10px;display:flex:1;">
    <div style="display:flex;">
      <div style="margin-right:10px;">
        <el-button icon="el-icon-plus" type="primary" size="small" @click="showForm()">添加用户</el-button>
      </div>
      <el-form :inline="true">
        <el-form-item>
          <el-select v-model="search.merchant_id" placeholder="请选择">
            <el-option v-for="o in searchMerchantList" :key="o.id" :label="o.name" :value="o.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.name__like" placeholder="姓名" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.mobile__like" placeholder="手机号" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.referee_0_name__like" placeholder="推荐人" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.referee_0_mobile__like" placeholder="推荐人手机号" clearable></el-input>
        </el-form-item>
        <el-form-item v-if="search.merchant_id">
          <el-select v-model="search.level_id" placeholder="请选择">
            <el-option v-for="o in searchLevelList" :key="o.id" :label="o.name" :value="o.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="search.user_type" placeholder="请选择">
            <el-option label="全部" :value="undefined"></el-option>
            <el-option v-for="o in typeList" :key="o.id" :label="o.name" :value="o.id"></el-option>
          </el-select>
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
        <el-table-column prop="nickname" label="昵称"></el-table-column>
        <el-table-column prop="name" label="姓名/手机号" width="180">
          <template slot-scope="{row}">
            <div>{{row.name || '-'}} / {{row.username || row.mobile }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="balance" label="账户余额" sortable="custom" width="100">
          <template slot-scope="{row}">
            <el-button size="mini" type="text" @click="$router.push(`/user/${row.id}/balance`)">{{row.balance | currencyFormat}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="sum_income" label="总收入" sortable="custom" width="100">
          <template slot-scope="{row}">
            <el-button size="mini" type="text" @click="$router.push(`/user/${row.id}/income`)">{{row.sum_income | currencyFormat}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="level_name" label="等级" width="100"></el-table-column>
        <el-table-column label="推荐人" width="150">
          <template slot-scope="{row}">
            <div>{{row.referee_0_name}} / {{row.referee_0_mobile}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="status_name" label="认证状态" width="80"></el-table-column>
        <el-table-column prop="referee_count" label="推荐人数" width="100" sortable="custom">
          <template slot-scope="{row}">
            <el-button size="mini" type="text" @click="$router.push(`/user/${row.id}/user`)">{{row.referee_count}} 人</el-button>
          </template>
        </el-table-column>
        <el-table-column label="禁用登陆" width="80">
          <template slot-scope="{row}">
            <el-switch @change="updateItem(row.id, { is_disabled: row.is_disabled })" v-model="row.is_disabled"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="禁用提现" width="80">
          <template slot-scope="{row}">
            <el-switch @change="updateItem(row.id, { is_cash_disabled: row.is_cash_disabled })" v-model="row.is_cash_disabled"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="创建时间" sortable="custom" width="150"></el-table-column>
        <el-table-column label="操作" width="250">
          <template slot-scope="{row}">
            <el-button icon="el-icon-edit" size="mini" type="text" @click="showForm(row)">编辑</el-button>
            <el-button icon="iconfont icon-xinyongqia" size="mini" type="text" @click="showUserLevelForm(row)">等级配额</el-button>
            <el-tooltip content="删除" placement="top">
              <el-button icon="el-icon-delete" size="mini" type="text" @click="handleDelete(row)"></el-button>
            </el-tooltip>
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

    <el-dialog :title="`${form.id ? '编辑' : '添加'}人员`" :visible.sync="formVisible" :close-on-click-modal="false">
      <el-form class="edit-form" :model="form" ref="form">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="商户">
              <el-select v-model="form.merchant_id" placeholder="请选择" style="width:100%;" clearable>
                <el-option v-for="o in merchantList" :key="o.id" :label="o.name" :value="o.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="用户名">
              <el-input v-model="form.username" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="姓名">
              <el-input v-model="form.name" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="手机号码">
              <el-input v-model="form.mobile" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="密码">
              <el-input v-model="form.password" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="类型">
              <el-select v-model="form.user_type" placeholder="请选择" style="width:100%;">
                <el-option v-for="o in typeList" :key="o.id" :label="o.name" :value="o.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="认证状态">
              <el-select v-model="form.status" placeholder="请选择" style="width:100%;">
                <el-option v-for="o in statusList" :key="o.id" :label="o.name" :value="o.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="form.user_type === 1">
            <el-form-item label="等级">
              <el-select v-model="form.level_id" placeholder="请选择">
                <el-option v-for="o in levelList" :key="o.id" :label="o.name" :value="o.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="禁用原因">
              <el-input v-model="form.disabled_reason" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="formVisible = false">取消</el-button>
        <el-button type="primary" @click="saveForm" :loading="formLoading">{{form.id ? '保存' : '添加'}}</el-button>
      </span>
    </el-dialog>

    <el-dialog title="用户等级" :visible.sync="userLevelFormVisible" :close-on-click-modal="false">
      <el-form class="edit-form" :model="userLevelForm" ref="userLevelForm">
        <el-row :gutter="10">
          <el-col :span="8" v-for="o in userLevelForm.userLevelList" :key="o.id" style="margin-bottom:5px;">
            <el-form-item :label="o.name" v-if="userLevelForm.config[`${o.id}`]">
              <el-input v-model="userLevelForm.config[`${o.id}`].up_count" auto-complete="off">
                <template slot="prepend">提升数量</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="userLevelFormVisible = false">取消</el-button>
        <el-button type="primary" @click="saveUserLevelForm" :loading="userLevelFormLoading">保存</el-button>
      </span>
    </el-dialog>
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

      form: {},
      formVisible: false,
      formLoading: false,

      userLevelForm: { config: {} },
      userLevelFormVisible: false,
      userLevelFormLoading: false,

      merchantList: [],
      levelList: [],
      typeList: [
        { id: 1, name: '平台管理' },
        { id: 2, name: 'OEM商户' },
        { id: 3, name: '注册会员' },
      ],

      statusList: [
        { id: 1, name: '未完善' },
        { id: 2, name: '已认证' },
        { id: 3, name: '未通过' },
      ],
    };
  },
  watch: {
    search: {
      async handler() {
        if (this.search.merchant_id
          && this.search.level_id
          && !_.filter(this.levelList, o => o.merchant_id === this.search.merchant_id && o.id === this.search.level_id).length) {
          this.search.level_id = undefined;
        }
        await this.reload();
      },
      deep: true,
    },
    async $route() {
      await this.reload();
    },
  },
  computed: {
    list() {
      return _.map(this.a_list, o => ({
        ...o,
        is_disabled: !!o.is_disabled,
        is_cash_disabled: !!o.is_cash_disabled,
        user_type_name: o.user_type ? (_.find(this.typeList, { id: o.user_type }) || { name: o.user_type }).name : o.user_type_name,
        create_time: moment(o.create_time).format('YYYY-MM-DD HH:mm:ss'),
        status_name: o.status ? (_.find(this.statusList, { id: o.status }) || { name: o.status }).name : o.status,
      }));
    },
    searchStatusList() {
      return [
        { id: undefined, name: '全部状态' },
        ...this.statusList,
      ];
    },
    merchant_id() {
      return this.$route.params.merchant_id;
    },
    referee_id() {
      return this.$route.params.referee_id;
    },
    searchMerchantList() {
      return [
        { id: undefined, name: '全部商户' },
        { id: '', name: '未设置' },
        ...this.merchantList,
      ];
    },
    searchLevelList() {
      if (!this.search.merchant_id) return [];
      return [
        { id: undefined, name: '全部等级' },
        { id: '', name: '未设置' },
        ..._.filter(this.levelList, o => o.merchant_id === this.search.merchant_id),
      ];
    },
  },
  methods: {
    reload: _.throttle(async function _reload() {
      this.loading = true;
      const { current, size, ...params } = this.search;
      params.offset = (current - 1) * size;
      params.limit = size;
      if (this.merchant_id) params.merchant_id = this.merchant_id;
      if (this.referee_id) params.referee_id = this.referee_id;
      const { body, headers } = (await this.$http.get('/api/user', { params }));
      this.a_list = body;

      this.total = parseInt(headers.get('X-Total-Count'), 10);
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
      this.form = _.pick(item, ['id', 'username', 'name', 'mobile', 'user_type', 'level_id', 'status', 'disabled_reason', 'merchant_id']);
      this.formVisible = true;
    },

    async saveForm() {
      this.formLoading = true;
      const $form = this.$refs.form;
      const ok = await $form.validate().catch(e => e);
      if (!ok) return;

      try {
        const { id, ...form } = this.form;
        if (form.user_type !== 1) form.level_id = null;

        if (id) {
          await this.$http.patch(`/api/user/${id}`, form);
        } else {
          if (this.merchant_id) form.merchant_id = this.merchant_id;
          await this.$http.post('/api/user', form);
        }
        this.formVisible = false;
        await this.reload();
      } catch (e) {
        const message = e.bodyText || e.message;
        this.$message.error(message);
      }
      this.formLoading = false;
    },

    async updateItem(id, form) {
      try {
        await this.$http.patch(`/api/user/${id}`, form);
      } catch (e) {
        const message = e.bodyText || e.message;
        this.$message.error(message);
      }
    },

    async handleDelete({ id, mobile }) {
      const ok = await this.$confirm(`确认删除${mobile}?`, '提示', { type: 'warning' }).then(() => true).catch(() => false);
      if (!ok) return;

      try {
        await this.$http.delete(`/api/user/${id}`);
        await this.reload();
        this.$message.success('删除成功');
      } catch (e) {
        const message = e.bodyText || e.message;
        this.$message.error(message);
      }
    },

    async showUserLevelForm({ id, merchant_id }) {
      if (!merchant_id) return;
      const $form = this.$refs.userLevelForm;
      if ($form) $form.resetFields();
      const config = (await this.$http.get(`/api/user/${id}/userLevel`)).body;
      const userLevelList = (await this.$http.get('/api/user_level', { params: { merchant_id } })).body;
      this.userLevelForm = {
        id,
        userLevelList,
        config: _(userLevelList).map(o => _.pick(_.find(config, { level_id: o.id }) || { level_id: o.id }, ['level_id', 'up_count'])).mapKeys('level_id').value(),
      };
      this.userLevelFormVisible = true;
    },

    async saveUserLevelForm() {
      this.userLevelFormLoading = true;
      const $form = this.$refs.userLevelForm;
      const ok = await $form.validate().catch(e => e);
      if (!ok) return;
      try {
        const { id, config } = this.userLevelForm;
        await this.$http.put(`/api/user/${id}/userLevel`, _.map(config, (o, i) => ({ level_id: parseInt(i, 10), ...o })));
        this.userLevelFormVisible = false;
      } catch (e) {
        const message = e.bodyText || e.message;
        this.$message.error(message);
      }
      this.userLevelFormLoading = false;
    },
  },
  async mounted() {
    this.levelList = (await this.$http.get('/api/user_level')).body;
    this.merchantList = (await this.$http.get('/api/merchant')).body;
    await this.reload();
  },
};
</script>

<style scoped>

</style>
