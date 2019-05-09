<template>
  <div style="padding:10px;display:flex:1;">

    <div style="display:flex;">
      <div style="margin-right:10px;">
        <el-button icon="el-icon-plus" type="primary" size="small" @click="showForm()">添加用户</el-button>
        <el-button icon="el-icon-menu" type="primary" size="small" @click="$router.push('/user_level')">查看等级</el-button>
      </div>
      <el-form :inline="true">
        <el-form-item>
          <el-input v-model="search.mobile__like" placeholder="手机号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="search.level_id" placeholder="请选择">
            <el-option label="全部" :value="undefined"></el-option>
            <el-option label="未设置" value=""></el-option>
            <el-option v-for="o in levelList" :key="o.id" :label="o.name" :value="o.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <div v-loading="loading">
      <el-table :data="list" style="width: 100%;" @sort-change="sortChange" :default-sort="{prop: 'create_time', order: 'descending'}">
        <el-table-column prop="nickname" label="昵称"></el-table-column>
        <el-table-column label="姓名/手机号" width="100">
          <template slot-scope="{row}">
            <div>{{row.name}}</div>
            <div>{{row.mobile}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="balance" label="账户余额" sortable="custom">
          <template slot-scope="{row}">
            <router-link :to="`/user/${row.id}/balance`">{{row.balance}}</router-link>
          </template>
        </el-table-column>
        <el-table-column prop="sum_income" label="总收入" sortable="custom">
          <template slot-scope="{row}">
            <router-link :to="`/user/${row.id}/income`">{{row.sum_income}}</router-link>
          </template>
        </el-table-column>
        <el-table-column prop="add_income" label="收入!" sortable="custom"></el-table-column>
        <el-table-column prop="add_team_count" label="团队人数!" sortable="custom"></el-table-column>
        <el-table-column prop="level_name" label="等级"></el-table-column>
        <el-table-column label="推荐人">
          <template slot-scope="{row}">
            <div>{{row.referee_0_name}}</div>
            <div>{{row.referee_0_mobile}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="status_name" label="认证状态"></el-table-column>
        <el-table-column prop="create_time" label="创建时间" sortable="custom" width="160"></el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="{row}">
            <el-button icon="el-icon-edit" size="mini" type="text" @click="showForm(row)">编辑</el-button>
            <el-button icon="el-icon-edit" size="mini" type="text" @click="$router.push(`/user/${row.id}/user`)">下级{{row.referee_count}}人</el-button>
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
              <el-input v-model="form.password" auto-complete="off" placeholder="不填保留旧密码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="等级">
              <el-select v-model="form.level_id" placeholder="请选择" style="width:100%;">
                <el-option v-for="o in levelList" :key="o.id" :label="o.name" :value="o.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="推荐人手机">
              <el-autocomplete v-model="form.referee_0_mobile" valueKey="mobile" :fetch-suggestions="fetchUser_Mobile" auto-complete="off" style="width:100%;">
                <template slot-scope="{item}">{{item.mobile}} {{item.name}}</template>
              </el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="添加的收入">
              <el-input-number v-model="form.add_income" controls-position="right" style="width:100%;" :min="0" :max="99999"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="添加的团队人数">
              <el-input-number v-model="form.add_team_count" controls-position="right" style="width:100%;" :min="0" :max="99999"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="formVisible = false">取消</el-button>
        <el-button type="primary" @click="saveForm" :loading="formLoading">{{form.id ? '保存' : '添加'}}</el-button>
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
      list: [],
      total: 0,
      loading: false,

      form: {},
      formVisible: false,
      formLoading: false,

      levelList: [],

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
        await this.reload();
      },
      deep: true,
    },
    async $route() {
      await this.reload();
    },
  },
  computed: {
    merchant_id() {
      return this.$route.params.merchant_id;
    },
    referee_id() {
      return this.$route.params.referee_id;
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
      const { body, headers } = (await this.$http.get('/api/m/user', { params }));

      this.list = _.map(body, o => ({
        ...o,
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
    showForm(item) {
      const $form = this.$refs.form;
      if ($form) $form.resetFields();
      this.form = _.pick(item, ['id', 'username', 'name', 'mobile', 'user_type', 'level_id', 'referee_0_mobile', 'add_income', 'add_team_count']);
      this.formVisible = true;
    },

    async saveForm() {
      this.formLoading = true;
      const $form = this.$refs.form;
      const ok = await $form.validate().catch(e => e);
      if (!ok) return;

      try {
        const { id, ...form } = this.form;
        if (!form.level_id) form.level_id = null;
        form.user_type = 3;

        if (id) {
          await this.$http.patch(`/api/user/${id}`, form);
        } else {
          await this.$http.post('/api/m/user', form);
        }
        this.formVisible = false;
        await this.reload();
      } catch (e) {
        const message = e.bodyText || e.message;
        this.$message.error(message);
      }
      this.formLoading = false;
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
    async fetchUser_Mobile(mobile, cb) {
      const list = (await this.$http.get(`/api/m/user?mobile__like=${mobile}&limit=10`)).body;
      cb(list);
    },
  },
  async mounted() {
    this.levelList = (await this.$http.get('/api/m/user_level')).body;
    await this.reload();
  },
};
</script>

<style scoped>

</style>
