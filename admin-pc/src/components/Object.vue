<template>
  <div style="padding:10px;display:flex:1;display:flex;flex-direction:column;">
    <div style="display:flex;">
      <div style="margin-right:10px;">
        <el-button icon="el-icon-plus" type="primary" size="small" @click="showForm()">添加{{object}}</el-button>
      </div>
      <el-form :inline="true">
        <el-form-item>
          <el-input v-model="search.name__like" placeholder="名称"></el-input>
        </el-form-item>
      </el-form>
    </div>

    <el-table :data="list" height="100%" style="width: 100%;" v-loading="loading">
      <el-table-column prop="name" label="名称"></el-table-column>
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

    <el-dialog :title="`${form.id ? '编辑' : '添加'}${object}`" :visible.sync="formVisible" :close-on-click-modal="false" width="80%">
      <el-form class="edit-form" :model="form" ref="form">
        <el-form-item label="名称">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
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
    };
  },
  computed: {
    object() {
      const { object } = this.$route.params;
      return object;
    },
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
  methods: {
    reload: _.throttle(async function _reload() {
      this.loading = true;

      try {
        const { current, size, ...params } = this.search;
        params.offset = (current - 1) * size;
        params.limit = size;
        const { body, headers } = (await this.$http.get(`/api/${this.object}`, { params }));

        this.list = _.map(body, o => ({ ...o, create_time: moment(o.create_time).format('YYYY-MM-DD HH:mm:ss') }));
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
      this.form = _.pick(item, ['id', 'name']);
      this.formVisible = true;
    },

    async saveForm() {
      this.formLoading = true;
      const $form = this.$refs.form;
      const ok = await $form.validate().catch(e => e);
      if (!ok) return;

      try {
        const { id, ...form } = this.form;
        if (id) {
          await this.$http.patch(`/api/${this.object}/${id}`, form);
        } else {
          await this.$http.post(`/api/${this.object}`, form);
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
        await this.$http.delete(`/api/${this.object}/${id}`);
        await this.reload();
        this.$message.success('删除成功');
      } catch (e) {
        const message = e.bodyText || e.message;
        this.$message.error(message);
      }
    },
  },
  async mounted() {
    await this.reload();
  },
};
</script>

<style scoped>
</style>
