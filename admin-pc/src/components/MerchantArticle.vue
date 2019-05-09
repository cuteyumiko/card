<template>
  <div style="padding:10px;display:flex:1;">

    <div style="display:flex;">
      <div style="margin-right:10px;">
        <el-button icon="el-icon-d-arrow-left" type="primary" size="small" @click="$router.push('/merchant')">返回商户</el-button>
        <el-button icon="el-icon-plus" type="primary" size="small" @click="showForm()">添加文章</el-button>
      </div>
      <el-form :inline="true">
        <el-form-item>
          <el-input v-model="search.name__like" placeholder="标题"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="search.type_id" placeholder="请选择">
            <el-option v-for="o in searchTypeList" :key="o.id" :label="o.name" :value="o.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <div v-loading="loading">
      <el-table :data="list" style="width: 100%;">
        <el-table-column prop="merchant_name" label="商户" width="80"></el-table-column>
        <el-table-column label="图标" width="60" header-align="center">
          <template slot-scope="{row}">
            <div v-if="row.icon" style="width:48px; height:48px;background-size:contain;background-repeat:no-repeat;background-position:center;" :style="{backgroundImage:`url('${row.icon}')`}"></div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="标题"></el-table-column>
        <el-table-column prop="type_name" label="类型" width="80"></el-table-column>
        <el-table-column prop="sort" label="排序" width="60"></el-table-column>
        <el-table-column label="附件" width="120">
          <template slot-scope="{row}">
            <div v-for="p in row.attachmentList" :key="p.id">
              <a :href="p.url" target="_blank" >{{p.name}}</a>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="创建时间" width="160"></el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="{row}">
            <el-button icon="el-icon-edit" size="mini" type="text" @click="showForm(row)">编辑</el-button>
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

    <el-dialog :title="`${form.id ? '编辑' : '添加'}文章`" :visible.sync="formVisible" :close-on-click-modal="false">
      <el-form class="edit-form" :model="form" ref="form">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="图标">
              <el-upload class="avatar-uploader"
                action="/api/upload"
                :show-file-list="false"
                :before-upload="handleUpload_icon"
                :on-success="handleSuccess_icon">
                <i v-if="form.icon === 'loading'" class="el-icon-loading avatar-uploader-icon"></i>
                <div v-else-if="form.icon">
                  <img v-if="form.icon.indexOf('.mp4') !== -1" :src="`${form.icon}?vframe/jpg/offset/0/w/96/h/96`" style="width:96px;" />
                  <img v-else :src="form.icon" class="avatar" style="width:96px;" />
                  <div @click.stop="handleClear_icon">删除</div>
                </div>
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="标题">
              <el-input v-model="form.name" auto-complete="off" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="类型">
              <el-select v-model="form.type_id" placeholder="请选择" style="width:100%;">
                <el-option v-for="o in typeList" :key="o.id" :label="o.name" :value="o.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="排序值">
              <el-input-number v-model="form.sort" controls-position="right" :min="0" :max="9999" style="width:100%;"></el-input-number>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="附件">
              <el-upload  action="/api/upload"
                :on-success="handleSuccess_attachmentList"
                :on-remove="handleRemove_attachmentList"
                :before-remove="beforeRemove_attachmentList"
                multiple
                :file-list="form.attachmentList">
                <el-button size="small" type="primary">点击上传</el-button>
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
          :other_options="tinymceOptions"></tinymce>
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
      tinymceOptions: {
        height: 300,
        images_upload_url: '/api/upload?format=tinymce',
        body_class: 'ql-editor',
        content_css: ['https://cdn.bootcss.com/normalize/8.0.0/normalize.min.css', 'https://cdn.bootcss.com/quill/1.3.6/quill.core.min.css'],
        imagetools_cors_hosts: ['cdn.hello.com'],
      },

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

      typeList: [],
    };
  },
  computed: {
    list() {
      return _.map(this.a_list, o => ({
        ...o,
        create_time: moment(o.create_time).format('YYYY-MM-DD HH:mm:ss'),
        attachmentList: _.map((o.attachment_list ? JSON.parse(o.attachment_list) : []), p => ({
          name: _.last(p.split('/')),
          url: p,
        })),
      }));
    },

    searchTypeList() {
      return [
        { id: undefined, name: '全部类型' },
        { id: '', name: '未设置' },
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
        const { merchant_id } = this.$route.params;
        params.offset = (current - 1) * size;
        params.limit = size;
        params.merchant_id = merchant_id;
        const { body, headers } = (await this.$http.get('/api/merchant_article', { params }));

        this.a_list = body;
        this.total = parseInt(headers.get('X-Total-Count'), 10);
      } catch (e) {
        const message = e.bodyText || e.message;
        this.$message.error(message);
      }

      this.loading = false;
    }, 200, { leading: false }),

    showForm(item = {}) {
      const $form = this.$refs.form;
      if ($form) $form.resetFields();
      this.form = _.pick(item, ['id', 'name', 'icon', 'type_id', 'sort']);
      this.form.attachmentList = _.map((item.attachment_list ? JSON.parse(item.attachment_list) : []), o => ({
        name: _.last(o.split('/')),
        url: o,
      }));
      this.formVisible = true;
    },

    async saveForm() {
      this.formLoading = true;
      const $form = this.$refs.form;
      const ok = await $form.validate().catch(e => e);
      if (!ok) return;

      try {
        const { id, attachmentList, ...form } = this.form;
        const { merchant_id } = this.$route.params;
        if (merchant_id) form.merchant_id = merchant_id;
        form.attachment_list = JSON.stringify(_.map(attachmentList, 'url'));
        if (id) {
          await this.$http.patch(`/api/merchant_article/${id}`, form);
        } else {
          await this.$http.post('/api/merchant_article', form);
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
        await this.$http.delete(`/api/merchant_article/${id}`);
        await this.reload();
        this.$message.success('删除成功');
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
    handleUpload_icon() {
      this.form = {
        ...this.form,
        icon: 'loading',
      };
    },
    handleClear_icon() {
      this.form = {
        ...this.form,
        icon: '',
      };
    },

    handleSuccess_attachmentList(res) {
      this.form.attachmentList = [
        ...this.form.attachmentList,
        ...res,
      ];
    },

    handleRemove_attachmentList(file) {
      this.form.attachmentList = _.filter(this.form.attachmentList, o => o.url !== file.url);
    },
    beforeRemove_attachmentList(file) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },

    showContentForm(item, key, title) {
      this.contentFormKey = key;
      this.contentFormTitle = title;
      this.contentForm = {
        id: item.id,
        [key]: item[key] || '',
      };
      this.contentFormVisible = true;
    },

    async saveContentForm() {
      this.contentFormLoading = true;
      const $form = this.$refs.contentForm;
      const ok = await $form.validate().catch(e => e);
      if (!ok) return;

      try {
        const { id, ...form } = this.contentForm;
        await this.$http.patch(`/api/merchant_article/${id}`, form);
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
    this.typeList = (await this.$http.get('/api/merchant_article_type')).body;
    await this.reload();
  },
};
</script>

<style scoped>
</style>
