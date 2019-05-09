<template>
  <div style="padding:10px;display:flex:1;">

    <div style="display:flex;">
      <div style="margin-right:10px;">
        <el-button icon="el-icon-d-arrow-left" type="primary" size="small" @click="$router.push('/merchant')">返回商户</el-button>
        <el-button icon="el-icon-plus" type="primary" size="small" @click="showForm()">添加海报</el-button>
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
        <el-table-column label="海报" width="150" >
          <template slot-scope="{row}">
            <img v-if="row.image" style="width:128px; height:128px;" :src="row.image" />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="标题"></el-table-column>
        <el-table-column prop="type_name" label="类型" width="80"></el-table-column>
        <el-table-column prop="sort" label="排序" width="60"></el-table-column>
        <el-table-column prop="create_time" label="创建时间" width="160"></el-table-column>
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

    <el-dialog :title="`${form.id ? '编辑' : '添加'}海报`" :visible.sync="formVisible" :close-on-click-modal="false">
      <el-form class="edit-form" :model="form" ref="form">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="图标">
              <el-upload class="avatar-uploader"
                action="/api/upload"
                :show-file-list="false"
                :before-upload="handleUpload_image"
                :on-success="handleSuccess_image">
                <i v-if="form.image === 'loading'" class="el-icon-loading avatar-uploader-icon"></i>
                <div v-else-if="form.image">
                  <img :src="form.image" class="avatar" style="width:96px;" />
                  <div @click.stop="handleClear_image">删除</div>
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
            <el-form-item label="二维码位置">
              <el-input v-model="form.qr_rect" auto-complete="off" placeholder="x,y,width,height"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="文字颜色">
              <el-color-picker v-model="form.text_color"></el-color-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="排序值">
              <el-input-number v-model="form.sort" controls-position="right" :min="0" :max="9999" style="width:100%;"></el-input-number>
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
      a_list: [],
      total: 0,
      loading: false,

      form: {},
      formVisible: false,
      formLoading: false,

      typeList: [],
    };
  },
  computed: {
    list() {
      return _.map(this.a_list, o => ({
        ...o,
        create_time: moment(o.create_time).format('YYYY-MM-DD HH:mm:ss'),
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
        const { body, headers } = (await this.$http.get('/api/merchant_bill', { params }));

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
      this.form = _.pick(item, ['id', 'name', 'image', 'qr_rect', 'sort', 'text_color', 'type_id']);
      this.formVisible = true;
    },

    async saveForm() {
      this.formLoading = true;
      const $form = this.$refs.form;
      const ok = await $form.validate().catch(e => e);
      if (!ok) return;

      try {
        const { id, ...form } = this.form;
        const { merchant_id } = this.$route.params;
        if (merchant_id) form.merchant_id = merchant_id;
        if (id) {
          await this.$http.patch(`/api/merchant_bill/${id}`, form);
        } else {
          await this.$http.post('/api/merchant_bill', form);
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
        await this.$http.delete(`/api/merchant_bill/${id}`);
        await this.reload();
        this.$message.success('删除成功');
      } catch (e) {
        const message = e.bodyText || e.message;
        this.$message.error(message);
      }
    },

    handleSuccess_image([{ url }]) {
      this.form = {
        ...this.form,
        image: url,
      };
    },
    handleUpload_image() {
      this.form = {
        ...this.form,
        image: 'loading',
      };
    },
    handleClear_image() {
      this.form = {
        ...this.form,
        image: '',
      };
    },
  },
  async mounted() {
    this.typeList = (await this.$http.get('/api/merchant_bill_type')).body;
    await this.reload();
  },
};
</script>

<style scoped>
</style>
