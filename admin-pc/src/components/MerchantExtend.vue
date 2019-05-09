<template>
  <div style="padding:10px;display:flex:1;">
    <div style="display:flex;">
      <div style="margin-right:10px;">
        <el-button icon="el-icon-d-arrow-left" type="primary" size="small" @click="$router.push('/merchant')">返回商户</el-button>
        <el-button icon="el-icon-plus" type="primary" size="small" @click="showForm()">添加配置项</el-button>
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
        <el-table-column prop="type_name" label="类型"></el-table-column>
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

    <el-dialog :title="`${form.id ? '编辑' : '添加'}商户扩展项`" :visible.sync="formVisible" :close-on-click-modal="false" width="80%">
      <el-form class="edit-form" :model="form" ref="form">
        <el-form-item label="名称">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="编码">
          <el-input v-model="form.code" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="类型">
          <el-select v-model="form.type_id" placeholder="请选择" style="width:100%;">
            <el-option v-for="o in typeList" :key="o.id" :label="o.name" :value="o.id"></el-option>
          </el-select>
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

      typeList: [
        { id: 1, name: '普通文本' },
        { id: 2, name: '富文本' },
        { id: 3, name: '图片' },
        { id: 4, name: '颜色' },
        { id: 5, name: '是否选择' },
      ],
    };
  },
  computed: {
    searchTypeList() {
      return [
        { id: undefined, name: '全部' },
        ...this.typeList,
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
        const { body, headers } = (await this.$http.get('/api/merchant_extend', { params }));

        this.list = _.map(body, o => ({
          ...o,
          type_name: o.type_id ? (_.find(this.typeList, { id: o.type_id }) || { name: o.type_id }).name : '',
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
      const { pass_config, ...form } = _.pick(item, ['id', 'name', 'code', 'type_id']);
      this.form = form;
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
          await this.$http.patch(`/api/merchant_extend/${id}`, form);
        } else {
          await this.$http.post('/api/merchant_extend', form);
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
        await this.$http.delete(`/api/merchant_extend/${id}`);
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
