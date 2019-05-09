<template>
  <div style="padding:10px;display:flex:1;">

    <div style="display:flex;">
      <div style="margin-right:10px;">
        <el-button icon="el-icon-d-arrow-left" type="primary" size="small" @click="$router.push('/product_card')">返回信用卡</el-button>
        <el-button icon="el-icon-plus" type="primary" size="small" @click="showForm()">添加信用卡来源</el-button>
      </div>
      <el-form :inline="true">
        <el-form-item>
          <el-input v-model="search.name__like" placeholder="产品名"></el-input>
        </el-form-item>
      </el-form>
    </div>

    <div v-loading="loading">
      <el-table :data="list" style="width: 100%;">
        <el-table-column prop="id" label="ID" width="40"></el-table-column>
        <el-table-column label="图标" width="60" header-align="center">
          <template slot-scope="{row}">
            <div v-if="row.icon" style="width:48px; height:48px;background-size:contain;background-repeat:no-repeat;background-position:center;" :style="{backgroundImage:`url('${row.icon}')`}"></div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="来源名"></el-table-column>
        <el-table-column prop="money" label="佣金 ( 元 )"></el-table-column>
        <el-table-column label="分销" width="100">
          <template slot-scope="{row}">
            <el-switch @change="updateItem(row.id, { is_recommend: row.is_recommend })" v-model="row.is_recommend"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="启用" width="100">
          <template slot-scope="{row}">
            <el-switch @change="updateItem(row.id, { is_enabled: row.is_enabled })" v-model="row.is_enabled"></el-switch>
          </template>
        </el-table-column>
        <!-- <el-table-column label="启用" width="100">
          <template slot-scope="{row}">
            <el-switch @change="updateItem(row.id, { is_enabled: row.is_enabled })" v-model="row.is_enabled"></el-switch>
          </template>
        </el-table-column> -->
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

    <el-dialog :title="`${form.id ? '编辑' : '添加'}信用卡来源`" :visible.sync="formVisible" :close-on-click-modal="false">
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
          <el-col :span="8">
            <el-form-item label="来源名">
              <el-input v-model="form.name" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="佣金 ( 元 )">
              <el-input v-model="form.money" auto-complete="off"></el-input>
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
    };
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
        const { body, headers } = (await this.$http.get('/api/product_card_source', { params }));

        this.list = _.map(body, o => ({
          ...o,
          is_recommend: !!o.is_recommend,
          is_enabled: !!o.is_enabled,
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
      this.form = {
        ..._.pick(item, ['id', 'name', 'icon', 'money', 'image_description', 'is_enabled']),
      };
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
          await this.$http.patch(`/api/product_card_source/${id}`, form);
        } else {
          await this.$http.post('/api/product_card_source', form);
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
        await this.$http.patch(`/api/product_card_source/${id}`, form);
      } catch (e) {
        const message = e.bodyText || e.message;
        this.$message.error(message);
      }
    },

    async handleDelete({ id, name }) {
      const ok = await this.$confirm(`确认删除${name}?`, '提示', { type: 'warning' }).then(() => true).catch(() => false);
      if (!ok) return;

      try {
        await this.$http.delete(`/api/product_card_source/${id}`);
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
  },
  async mounted() {
    await this.reload();
  },
};
</script>

<style scoped>
</style>
