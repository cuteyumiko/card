<template>
  <div style="padding:10px;display:flex:1;">
    <div style="display:flex;">
      <div style="margin-right:10px;">
        <el-button icon="el-icon-plus" type="primary" size="small" @click="showForm()">添加课程</el-button>
        <el-button icon="el-icon-menu" type="primary" size="small" @click="$router.push('/course_type')">查看类型</el-button>
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
        <el-form-item>
          <el-select v-model="search.xs_merchant_id__like" placeholder="请选择">
            <el-option v-for="o in searchMerchantList" :key="o.id" :label="o.name" :value="o.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <div v-loading="loading">
      <el-table :data="list"  style="width: 100%;" @sort-change="sortChange" :default-sort="{prop: 'create_time', order: 'descending'}">
        <el-table-column prop="x_merchant_name" label="商户"></el-table-column>
        <el-table-column label="图标" width="60" header-align="center">
          <template slot-scope="{row}">
            <div v-if="row.icon" style="width:48px; height:48px;background-size:contain;background-repeat:no-repeat;background-position:center;" :style="{backgroundImage:`url('${row.icon}')`}"></div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="标题"></el-table-column>
        <el-table-column prop="type_name" label="类型"></el-table-column>
        <el-table-column prop="view_count" label="浏览数量"></el-table-column>
        <el-table-column prop="create_time" label="创建时间" sortable="custom"></el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="{row}">
            <el-button icon="el-icon-edit" size="mini" type="text" @click="showForm(row)">编辑</el-button>
            <el-button icon="el-icon-edit" size="mini" type="text" @click="cloneItem(row)">复制新建</el-button>
            <el-button icon="el-icon-edit" size="mini" type="text" @click="showContentForm(row, 'content', '免费段落')">免费</el-button>
            <el-button icon="el-icon-edit" size="mini" type="text" @click="showContentForm(row, 'vip_content', '会员段落')">会员</el-button>
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

    <el-dialog :title="`${form.id ? '编辑' : '添加'}课程`" :visible.sync="formVisible" :close-on-click-modal="false">
      <el-form class="edit-form" :model="form" ref="form">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="图标">
              <el-upload class="avatar-uploader"
                action="/api/upload"
                :show-file-list="false"
                :on-success="handleSuccess_icon">
                <img v-if="form.icon" :src="form.icon" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="标题">
              <el-input v-model="form.name" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="商户">
              <el-select v-model="form.x_merchant_id" multiple placeholder="请选择" style="width:100%;">
                <el-option v-for="o in merchantList" :key="o.id" :label="o.name" :value="o.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="浏览数量">
              <el-input-number v-model="form.view_count" controls-position="right" :min="0" style="width:100%;"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="链接">
              <el-input v-model="form.href" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>


          <el-col :span="8">
            <el-form-item label="类型">
              <el-select v-model="form.type_id" placeholder="请选择" style="width:100%;">
                <el-option v-for="o in typeList" :key="o.id" :label="o.name" :value="o.id"></el-option>
              </el-select>
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
      search: { current: 1, size: 10, order: null },
      list: [],
      total: 0,
      loading: false,

      form: {},
      formVisible: false,
      formLoading: false,

      typeList: [],

      contentFormKey: '',
      contentFormTitle: '',
      contentForm: {},
      contentFormVisible: false,
      contentFormLoading: false,

      merchantList: [],
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

        const { body, headers } = (await this.$http.get('/api/course', { params }));

        this.list = _.map(body, o => ({ ...o, create_time: moment(o.create_time).format('YYYY-MM-DD HH:mm:ss') }));
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

    showForm(item = {}) {
      const $form = this.$refs.form;
      if ($form) $form.resetFields();

      this.form = {
        ..._.pick(item, ['id', 'name', 'icon', 'type_id', 'content', 'vip_content', 'view_count', 'href']),
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
        const { id, x_merchant_id, ...form } = this.form;
        if (id) {
          await this.$http.patch(`/api/course/${id}`, form);
          await this.$http.put(`/api/course/${id}/merchant`, _.map(x_merchant_id, merchant_id => ({ merchant_id })));
        } else {
          const { id: newid } = await this.$http.post('/api/course', form);
          await this.$http.put(`/api/course/${newid}/merchant`, _.map(x_merchant_id, merchant_id => ({ merchant_id })));
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
        await this.$http.delete(`/api/course/${id}`);
        await this.reload();
        this.$message.success('删除成功');
      } catch (e) {
        const message = e.bodyText || e.message;
        this.$message.error(message);
      }
    },

    async cloneItem(item) {
      try {
        await this.$http.post('/api/course', _.pick(item, ['name', 'icon', 'type_id', 'content', 'vip_content', 'view_count', 'href']));
        await this.reload();
        this.$message.success('复制新建成功');
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

    showContentForm(item, key, title) {
      const $form = this.$refs.contentForm;
      if ($form) $form.resetFields();
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
        await this.$http.patch(`/api/course/${id}`, form);
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
    this.typeList = (await this.$http.get('/api/course_type')).body;
    this.merchantList = (await this.$http.get('/api/merchant')).body;

    await this.reload();
  },
};
</script>

<style scoped>

</style>
