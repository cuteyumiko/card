<template>
  <div style="padding:10px;display:flex:1;">
    <div style="display:flex;">
      <div style="margin-right:10px;">
        <el-button icon="el-icon-plus" type="primary" size="small" @click="showForm()">添加短信模版</el-button>
      </div>
      <el-form :inline="true">
        <el-form-item>
          <el-input v-model="search.name__like" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="search.pass_code" placeholder="请选择">
            <el-option v-for="o in searchPassList" :key="o.code" :label="o.name" :value="o.code"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <div v-loading="loading">
      <el-table :data="list" style="width: 100%;">
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="code" label="编码"></el-table-column>
        <el-table-column prop="pass_name" label="通道"></el-table-column>
        <el-table-column prop="create_time" label="创建时间"></el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="{row}">
            <el-button icon="el-icon-edit" size="mini" type="text" @click="showForm(row)">编辑</el-button>
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

    <el-dialog :title="`${form.id ? '编辑' : '添加'}短信模版`" :visible.sync="formVisible" :close-on-click-modal="false" width="80%">
      <el-form class="edit-form" :model="form" ref="form">
        <el-form-item label="名称">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="编码">
          <el-input v-model="form.code" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="通道">
          <el-select v-model="form.pass_code" placeholder="请选择" style="width:100%;">
            <el-option v-for="o in passList" :key="o.code" :label="o.name" :value="o.code"></el-option>
          </el-select>
        </el-form-item>

        <template v-if="passByCode[form.pass_code]">
          <el-form-item :label="o.label" v-for="o in passByCode[form.pass_code].config" :key="o.name">
            <el-select v-if="o.list" v-model="form.pass_config[o.name]" placeholder="请选择" style="width:100%;">
              <el-option v-for="p in o.list" :key="p.value" :label="p.label" :value="p.value"></el-option>
            </el-select>
            <el-input v-else :type="o.type" v-model="form.pass_config[o.name]" auto-complete="off"></el-input>
          </el-form-item>
        </template>
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

      passList: [],
    };
  },
  computed: {
    searchPassList() {
      return [
        { id: undefined, name: '全部通道' },
        ...this.passList,
      ];
    },
    passByCode() {
      return _.mapKeys(this.passList, o => o.code);
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
        const { body, headers } = (await this.$http.get('/api/sms', { params }));

        this.list = _.map(body, o => ({
          ...o,
          pass_name: o.pass_code ? (_.find(this.passList, { code: o.pass_code }) || { name: o.pass_code }).name : o.pass_code,
          create_time: moment(o.create_time).format('YYYY-MM-DD HH:mm:ss'),
        }));
        this.total = parseInt(headers.get('X-Total-Count'), 10);
      } catch (e) {
        const message = e.bodyText || e.message;
        this.$message.error(message);
      }

      this.loading = false;
    }, 200, { leading: false }),

    showForm(item) {
      const $form = this.$refs.form;
      if ($form) $form.resetFields();
      const { pass_config, ...form } = _.pick(item, ['id', 'name', 'code', 'pass_code', 'pass_config']);
      form.pass_config = pass_config ? JSON.parse(pass_config) : {};
      this.form = form;
      this.formVisible = true;
    },

    async saveForm() {
      this.formLoading = true;
      const $form = this.$refs.form;
      const ok = await $form.validate().catch(e => e);
      if (!ok) return;

      try {
        const { id, pass_config, ...form } = this.form;
        form.pass_config = JSON.stringify(pass_config);
        if (id) {
          await this.$http.patch(`/api/sms/${id}`, form);
        } else {
          await this.$http.post('/api/sms', form);
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
        await this.$http.delete(`/api/sms/${id}`);
        await this.reload();
        this.$message.success('删除成功');
      } catch (e) {
        const message = e.bodyText || e.message;
        this.$message.error(message);
      }
    },
  },
  async mounted() {
    this.passList = (await this.$http.get('/api/pass/sms')).body;
    await this.reload();
  },
};
</script>

<style scoped>
</style>
