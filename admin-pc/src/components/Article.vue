<template>
  <div style="padding:10px;display:flex:1;">

    <div style="display:flex;">
      <div style="margin-right:10px;">
        <el-button icon="el-icon-plus" type="primary" size="small" @click="showForm()">添加文章</el-button>
        <el-button icon="el-icon-menu" type="primary" size="small" @click="$router.push('/article_type')">查看类型</el-button>
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
      <el-table :data="list" style="width: 100%;" @sort-change="sortChange">
        <el-table-column prop="name" label="标题"></el-table-column>
        <el-table-column prop="type_name" label="类型" width="200"></el-table-column>
        <el-table-column prop="sort" label="排序值" width="100" sortable="custom"></el-table-column>
        <el-table-column prop="create_time" label="创建时间" width="180" sortable="custom"></el-table-column>
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

    <el-dialog :title="`${form.id ? '编辑' : '添加'}文章`" :visible.sync="formVisible" :close-on-click-modal="false" width="80%">
      <el-form class="edit-form" :model="form" ref="form">
        <el-form-item label="标题">
          <el-input v-model="form.name" auto-complete="off" />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="form.type_id" placeholder="请选择">
            <el-option v-for="o in typeList" :key="o.id" :label="o.name" :value="o.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序值">
          <el-input-number v-model="form.sort" controls-position="right" :min="0" :max="9999"></el-input-number>
        </el-form-item>
        <el-form-item label="正文">
          <el-input type="textarea" v-model="form.content" :rows="5" />
        </el-form-item>
        <el-form-item label="图标">
          <el-upload
            class="avatar-uploader"
            action="/api/upload"
            :show-file-list="false"
            :on-success="handleSuccess_icon"
            :before-upload="handleBeforeUpload_icon">
            <img v-if="form.icon" :src="form.icon" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="附件">
          <el-upload  action="/api/upload"
            :on-success="handleSuccess_fileList"
            :on-remove="handleRemove_fileList"
            :before-remove="beforeRemove_fileList"
            multiple
            :limit="3"
            :on-exceed="handleExceed_fileList"
            :file-list="form.fileList">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="formVisible = false">取消</el-button>
        <el-button type="primary" @click="saveForm" :loading="formLoading">{{form.id ? '保存' : '添加'}}</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="contentFormTitle" :visible.sync="contentFormVisible" :close-on-click-modal="false" >
      <el-form class="edit-form" :model="contentForm" ref="contentForm">
        <quill-editor v-model="contentForm[contentFormKey]" ref="qeContent">
        </quill-editor>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="contentFormVisible = false">取消</el-button>
        <el-button type="primary" @click="saveContentForm" :loading="contentFormLoading">保存</el-button>
      </span>
    </el-dialog>

    <el-upload action="/api/upload" ref="upload" :on-success="qeFileUploadScuccess" style="display:none">
      <el-button size="small" ref="imgInput" type="primary" v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="插入中,请稍候">点击上传</el-button>
    </el-upload>
  </div>
</template>

<script>
import _ from 'lodash';
import moment from 'moment';

export default {
  data() {
    return {
      search: { current: 1, size: 10, order: null },
      list: [],
      total: 0,
      loading: false,

      form: {},
      formVisible: false,
      formLoading: false,

      typeList: [],

      contentFormType: '',
      contentFormKey: '',
      contentFormTitle: '',
      contentForm: {},
      contentFormVisible: false,
      contentFormLoading: false,
    };
  },
  computed: {
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
        params.offset = (current - 1) * size;
        params.limit = size;
        const { body, headers } = (await this.$http.get('/api/article', { params }));

        this.list = _.map(body, o => ({ ...o, create_time: moment(o.create_time).format('YYYY-MM-DD HH:mm:ss') }));
        this.total = parseInt(headers.get('X-Total-Count'), 10);
      } catch (e) {
        const message = e.bodyText || e.message;
        this.$message.error(message);
      }

      this.loading = false;
    }, 200, { leading: false }),

    sortChange({ order, prop }) {
      this.search.order = order ? `${prop}${order === 'ascending' ? '+' : '-'}` : null;
    },

    showForm(item = {}) {
      const $form = this.$refs.form;
      if ($form) $form.resetFields();
      this.form = _.pick(item, ['id', 'name', 'content', 'type_id', 'sort', 'icon']);
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
        form.attachmentList = JSON.stringify(_.map(attachmentList, 'url'));
        if (id) {
          await this.$http.patch(`/api/article/${id}`, form);
        } else {
          await this.$http.post('/api/article', form);
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
        await this.$http.delete(`/api/article/${id}`);
        await this.reload();
        this.$message.success('删除成功');
      } catch (e) {
        const message = e.bodyText || e.message;
        this.$message.error(message);
      }
    },

    handleSuccess_icon([res]) {
      this.form = {
        ...this.form,
        icon: res.url,
      };
    },
    handleBeforeUpload_icon(file) {
      const [errmsg] = (!_.startsWith(file.type, 'image') && ['请选择图片格式的文件!'])
                      || ((file.size / 1024 / 1024 > 5) && ['图片大小不能超过 5MB!'])
                      || ([]);

      if (errmsg) this.$message.error(errmsg);
      return errmsg;
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
    handleExceed_fileList(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove_fileList(file) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },

    showContentForm(item, key, title) {
      const $form = this.$refs.contentForm;
      if ($form) $form.resetFields();
      this.contentFormKey = key;
      this.contentFormTitle = title;
      this.contentForm = _.pick(item, ['id', key]);
      this.contentFormVisible = true;
      setTimeout(() => {
        this.$refs.qeContent.quill.getModule('toolbar').addHandler('image', this.qeContentImageHandler);
        this.$refs.qeContent.quill.getModule('toolbar').addHandler('video', this.qeContentVideoHandle);
      });
    },

    async saveContentForm() {
      this.contentFormLoading = true;
      const $form = this.$refs.contentForm;
      const ok = await $form.validate().catch(e => e);
      if (!ok) return;

      try {
        const { id, ...form } = this.contentForm;
        await this.$http.patch(`/api/article/${id}`, form);
        this.contentFormVisible = false;
        await this.reload();
      } catch (e) {
        const message = e.bodyText || e.message;
        this.$message.error(message);
      }
      this.contentFormLoading = false;
    },

    qeContentImageHandler() {
      this.contentFormType = 'image';
      this.$refs.imgInput.$el.click();
    },
    qeContentVideoHandle() {
      this.contentFormType = 'video';
      this.$refs.imgInput.$el.click();
    },
    qeFileUploadScuccess([file]) {
      const addRange = this.$refs.qeContent.quill.getSelection();
      this.$refs.qeContent.quill.insertEmbed(addRange, this.contentFormType, file.url);
    },
  },
  async mounted() {
    this.typeList = (await this.$http.get('/api/article_type')).body;
    await this.reload();
  },
};
</script>

<style scoped>
</style>
