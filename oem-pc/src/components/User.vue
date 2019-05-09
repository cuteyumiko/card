<template>
  <div style="padding:10px;display:flex:1;">

    <div style="display:flex;">
      <el-form :inline="true">
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
        <el-table-column prop="referee_value" width="80" sortable="custom">
          <template slot-scope="{row}">
            <template v-if="row.referee_value">间接</template><template v-else>直推</template>
          </template>
        </el-table-column>
        <el-table-column prop="nickname" label="昵称"></el-table-column>
        <el-table-column prop="name" label="姓名" width="100"></el-table-column>
        <el-table-column prop="mobile" label="手机号" width="150">
          <template slot-scope="{row}">

          <div v-if="row.referee_value">{{row.mobile | mobileFormat}}</div>
          <div v-else>{{row.mobile}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="balance" label="账户余额" sortable="custom" width="100">
          <template slot-scope="{row}">
            <router-link :to="`/user/${row.id}/balance`">{{row.balance | currencyFormat}}</router-link>
          </template>
        </el-table-column>
        <el-table-column prop="sum_income" label="总收入" sortable="custom" width="100">
          <template slot-scope="{row}">
            <router-link :to="`/user/${row.id}/income`">{{row.sum_income | currencyFormat}}</router-link>
          </template>
        </el-table-column>
        <el-table-column label="等级">
          <template slot-scope="{row}">
            {{row.level_name}} <el-button icon="el-icon-upload2" size="mini" type="text" @click="showLevelForm(row)">升级</el-button>
          </template>
        </el-table-column>
        <el-table-column label="推荐人" width="150">
          <template slot-scope="{row}">
            <div>{{row.referee_0_name}} <template v-if="row.referee_value >= 2">{{row.referee_0_mobile | mobileFormat}}</template><template v-else>{{row.referee_0_mobile}}</template></div>
          </template>
        </el-table-column>
        <el-table-column prop="status_name" label="认证状态"></el-table-column>
        <el-table-column prop="create_time" label="创建时间" sortable="custom" width="160"></el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="{row}">
            <el-button icon="el-icon-edit" size="mini" type="text" @click="$router.push(`/user/${row.id}/user`)">下级{{row.referee_count}}人</el-button>
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

    <el-dialog title="等级提升" :visible.sync="levelFormVisible" :close-on-click-modal="false">
      <el-form class="edit-form" :model="levelForm" ref="levelForm">
        <el-alert title="提高等级消耗升级次数，降低等级不消耗也不增加升级次数" type="warning" style="margin-bottom:20px;" :closable="false"></el-alert>
        <div style="margin-bottom:20px;font-size:13px;">
          <span v-for="(o, i) in levelForm_userLevel" :key="i" v-if="o.up_count" style="padding:10px;margin-right:10px;background:#fdf6ec;color:#e6a23c;border-radius:4px;">{{o.level_name}} {{o.up_count}}次</span>
        </div>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="等级">
              <el-select v-model="levelForm.level_id" placeholder="请选择">
                <el-option v-for="o in levelList" :key="o.id" :label="o.name" :value="o.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="levelFormVisible = false">取消</el-button>
        <el-button type="primary" @click="saveLevelForm" :loading="levelFormLoading">提交</el-button>
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

      levelForm: {},
      levelFormVisible: false,
      levelFormLoading: false,
      levelForm_userLevel: [],

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
      if (this.referee_id) params.referee_id = this.referee_id;
      const { body, headers } = (await this.$http.get('/api/my/team_user', { params }));

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

    async showLevelForm(item) {
      const userLevel = (await this.$http.get('/api/my/userLevel')).body;

      const $form = this.$refs.levelForm;
      if ($form) $form.resetFields();
      this.levelForm = _.pick(item, ['id', 'level_id']);
      this.levelForm_userLevel = userLevel;
      this.levelFormVisible = true;
    },

    async saveLevelForm() {
      this.levelFormLoading = true;
      const $form = this.$refs.levelForm;
      const ok = await $form.validate().catch(e => e);
      if (!ok) return;

      try {
        const { id, ...form } = this.levelForm;

        if (id) {
          await this.$http.patch(`/api/user/${id}`, form);
        }
        this.levelFormVisible = false;
        await this.reload();
      } catch (e) {
        const message = e.bodyText || e.message;
        this.$message.error(message);
      }
      this.levelFormLoading = false;
    },

    async updateItem(id, form) {
      try {
        await this.$http.patch(`/api/user/${id}`, form);
      } catch (e) {
        const message = e.bodyText || e.message;
        this.$message.error(message);
      }
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
