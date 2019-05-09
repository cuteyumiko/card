<template>
  <div style="padding:10px;display:flex:1;">

    <div style="display:flex;">
      <div style="margin-right:10px;">
        <el-button icon="el-icon-plus" type="primary" size="small" @click="showForm()">添加文案</el-button>
      </div>
      <el-form :inline="true">
        <el-form-item>
          <el-input v-model="search.name__like" placeholder="文案名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="search.xs_merchant_id__like" placeholder="请选择">
            <el-option v-for="o in searchMerchantList" :key="o.id" :label="o.name" :value="o.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <div v-loading="loading">
      <el-table :data="list" style="width: 100%;" @sort-change="sortChange" :default-sort="{prop: 'create_time', order: 'descending'}">
        <el-table-column prop="x_merchant_name" label="商户"></el-table-column>
        <el-table-column prop="name" label="文案名"></el-table-column>
        <el-table-column prop="download_count" label="下载量"></el-table-column>
        <el-table-column label="启用" width="100">
          <template slot-scope="{row}">
            <el-switch @change="updateItem(row.id, { is_enabled: row.is_enabled })" v-model="row.is_enabled"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="附件">
          <template slot-scope="{row}">
            <div v-for="p in row.fileList" :key="p.id"><a :href="p.url" target="_blank" >{{p.name}}</a></div>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="创建时间" sortable="custom"></el-table-column>
        <el-table-column label="操作" width="250">
          <template slot-scope="{row}">
            <el-button icon="el-icon-edit" size="mini" type="text" @click="showForm(row)">编辑</el-button>
            <el-button icon="el-icon-edit" size="mini" type="text" @click="cloneItem(row)">复制新建</el-button>
            <el-button icon="el-icon-edit" size="mini" type="text" @click="showContentForm(row, 'content', '正文')">正文</el-button>
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

    <el-dialog :title="`${form.id ? '编辑' : '添加'}文案`" :visible.sync="formVisible" :close-on-click-modal="false">
      <el-form class="edit-form" :model="form" ref="form">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="商户">
              <el-select v-model="form.x_merchant_id" multiple placeholder="请选择">
                <el-option v-for="o in merchantList" :key="o.id" :label="o.name" :value="o.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="文案名">
              <el-input v-model="form.name" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="下载量">
              <el-input v-model="form.download_count" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="启用">
              <el-switch v-model="form.is_enabled"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="正文">
              <el-input type="textarea" v-model="form.content" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="附件">
              <el-upload  action="/api/upload"
                :on-success="handleSuccess_fileList"
                :on-remove="handleRemove_fileList"
                :before-remove="beforeRemove_fileList"
                multiple
                list-type="picture-card"
                :file-list="form.fileList">
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="formVisible = false">取消</el-button>
        <el-button type="primary" @click="saveForm" :loading="formLoading">{{form.id ? '保存' : '添加'}}</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="contentFormTitle" :visible.sync="contentFormVisible" :close-on-click-modal="false" >
      <el-form class="edit-form" :model="contentForm" ref="contentForm">
        <tinymce
          id="dt-content"
          v-model="contentForm[contentFormKey]" @editorInit="e => e.setContent(contentForm[contentFormKey])"
          :other_options="{height: 300}"></tinymce>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="contentFormVisible = false">取消</el-button>
        <el-button type="primary" @click="saveContentForm" :loading="contentFormLoading">保存</el-button>
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

      contentFormKey: '',
      contentFormTitle: '',
      contentForm: {},
      contentFormVisible: false,
      contentFormLoading: false,

      merchantList: [],
    };
  },
  computed: {
    list() {
      return _.map(this.a_list, o => ({
        ...o,
        is_enabled: !!o.is_enabled,
        create_time: moment(o.create_time).format('YYYY-MM-DD HH:mm:ss'),
        fileList: _.map((o.file_list ? JSON.parse(o.file_list) : []), x => ({
          name: _.last(x.split('/')),
          url: x,
        })),
      }));
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
        const { current, size, xs_merchant_id__like, ...params } = this.search;
        params.offset = (current - 1) * size;
        params.limit = size;
        if (xs_merchant_id__like === '') params.xs_merchant_id = ''; else params.xs_merchant_id__like = xs_merchant_id__like;

        const { body, headers } = (await this.$http.get('/api/copy_library', { params }));

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

    showForm(item = { fileList: [] }) {
      const $form = this.$refs.form;
      if ($form) $form.resetFields();

      this.form = {
        ..._.pick(item, ['id', 'name', 'icon', 'content', 'download_count', 'is_enabled', 'fileList']),
        x_merchant_id: item.x_merchant_id ? _.map(item.x_merchant_id.split(','), o => parseInt(o, 10)) : [],
      };
      this.formVisible = true;
    },

    async saveForm() {
      this.formLoading = true;
      const $form = this.$refs.form;
      const ok = await $form.validate().catch(e => e);
      if (!ok) return;

      try {
        const { id, fileList, x_merchant_id, ...form } = this.form;
        form.file_list = JSON.stringify(_.map(fileList, 'url'));
        if (id) {
          await this.$http.patch(`/api/copy_library/${id}`, form);
          await this.$http.put(`/api/copy_library/${id}/merchant`, _.map(x_merchant_id, merchant_id => ({ merchant_id })));
        } else {
          const { id: newid } = await this.$http.post('/api/copy_library', form);
          await this.$http.put(`/api/copy_library/${newid}/merchant`, _.map(x_merchant_id, merchant_id => ({ merchant_id })));
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
        await this.$http.patch(`/api/copy_library/${id}`, form);
      } catch (e) {
        const message = e.bodyText || e.message;
        this.$message.error(message);
      }
    },

    async handleDelete({ id, name }) {
      const ok = await this.$confirm(`确认删除${name}?`, '提示', { type: 'warning' }).then(() => true).catch(() => false);
      if (!ok) return;

      try {
        await this.$http.delete(`/api/copy_library/${id}`);
        await this.reload();
        this.$message.success('删除成功');
      } catch (e) {
        const message = e.bodyText || e.message;
        this.$message.error(message);
      }
    },

    async cloneItem(item) {
      try {
        await this.$http.post('/api/copy_library', _.pick(item, ['name', 'content', 'download_count', 'is_enabled', 'file_list']));
        await this.reload();
        this.$message.success('复制新建成功');
      } catch (e) {
        const message = e.bodyText || e.message;
        this.$message.error(message);
      }
    },

    handleSuccess_fileList(res) {
      this.form.fileList = [
        ...this.form.fileList,
        ...res,
      ];
    },

    handleRemove_fileList(file) {
      this.form.fileList = _.filter(this.form.fileList, o => o.url !== file.url);
    },
    beforeRemove_fileList(file) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },

    showContentForm(item, key, title) {
      this.contentFormKey = key;
      this.contentFormTitle = title;
      this.contentForm = _.pick(item, ['id', key]);
      this.contentFormVisible = true;
    },

    async saveContentForm() {
      this.contentFormLoading = true;
      const $form = this.$refs.contentForm;
      const ok = await $form.validate().catch(e => e);
      if (!ok) return;

      try {
        const { id, ...form } = this.contentForm;
        await this.$http.patch(`/api/copy_library/${id}`, form);
        this.contentFormVisible = false;
        await this.reload();
      } catch (e) {
        const message = e.bodyText || e.message;
        this.$message.error(message);
      }
      this.contentFormLoading = false;
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
