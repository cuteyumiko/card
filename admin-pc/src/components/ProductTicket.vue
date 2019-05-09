<template>
  <div style="padding:10px;display:flex:1;">

    <div style="display:flex;">
      <div style="margin-right:10px;">
        <el-button icon="el-icon-plus" type="primary" size="small" @click="showForm()">添加积分券</el-button>
        <el-button icon="el-icon-menu" type="primary" size="small" @click="$router.push('/product_ticket_property')">积分券属性</el-button>
        <el-button icon="el-icon-menu" type="primary" size="small" @click="$router.push('/product_ticket_source')">查看来源</el-button>
      </div>
      <el-form :inline="true">
        <el-form-item>
          <el-input v-model="search.name__like" placeholder="产品名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="search.source_id" placeholder="请选择">
            <el-option v-for="o in searchSourceList" :key="o.id" :label="o.name" :value="o.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <div v-loading="loading">
      <el-table :data="list" style="width: 100%;">
        <el-table-column prop="source_name" label="来源" width="100"></el-table-column>
        <el-table-column prop="name" label="产品名"></el-table-column>
        <el-table-column prop="money" label="佣金 ( 元 )" width="80"></el-table-column>
        <el-table-column prop="points" label="兑换积分" width="80"></el-table-column>
        <el-table-column prop="process_name" label="处理通道" width="160"></el-table-column>
        <el-table-column prop="settle_type_name" label="结算时间" width="80"></el-table-column>
        <el-table-column label="启用" width="100">
          <template slot-scope="{row}">
            <el-switch @change="updateItem(row.id, { is_enabled: row.is_enabled })" v-model="row.is_enabled"></el-switch>
          </template>
        </el-table-column>
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

    <el-dialog :title="`${form.id ? '编辑' : '添加'}积分券`" :visible.sync="formVisible" :close-on-click-modal="false">
      <el-form class="edit-form" :model="form" ref="form" v-loading="formLoading" v-if="formVisible">
        <el-tabs tab-position="left">
          <el-tab-pane label="基础属性">
            <el-row :gutter="10">
              <el-col :span="8">
                <el-form-item label="产品名">
                  <el-input v-model="form.name" auto-complete="off"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="来源">
                  <el-select v-model="form.source_id" placeholder="请选择" style="width:100%;">
                    <el-option v-for="o in sourceList" :key="o.id" :label="o.name" :value="o.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="佣金 ( 元 )">
                  <el-input v-model="form.money" auto-complete="off"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="兑换积分">
                  <el-input v-model="form.points" auto-complete="off"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="处理通道">
                  <el-select v-model="form.process_id" placeholder="请选择" clearable style="width:100%;">
                    <el-option v-for="o in processList" :key="o.id" :label="o.name" :value="o.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="结算时间">
                  <el-select v-model="form.settle_type" placeholder="请选择" style="width:100%;">
                    <el-option v-for="o in settleTypeList" :key="o.id" :label="o.name" :value="o.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="卡号标题">
                  <el-input v-model="form.ticket_number_title" auto-complete="off"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="密码标题">
                  <el-input v-model="form.ticket_password_title" auto-complete="off"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="启用">
                  <el-switch v-model="form.is_enabled"></el-switch>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>

          <el-tab-pane label="普通文本" v-if="propertyList_1.length">
            <el-row :gutter="10">
              <el-col :span="12" v-for="o in propertyList_1" :key="o.id">
                <el-form-item :label="o.name" v-if="form.property[`${o.id}`]">
                  <el-input v-model="form.property[`${o.id}`].value"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="图片" v-if="propertyList_3.length">
            <el-row :gutter="10">
              <el-col :span="8" v-for="o in propertyList_3" :key="o.id">
                <el-form-item :label="o.name" v-if="form.property[`${o.id}`]">
                  <!-- <el-color-picker v-model="form.property[`${o.id}`].value" style="width:100%;"></el-color-picker> -->

                  <el-upload class="avatar-uploader"
                    action="/api/upload"
                    :show-file-list="false"
                    :before-upload="o.handleUpload"
                    :on-success="o.handleSuccess">
                    <i v-if="o.loading" class="el-icon-loading avatar-uploader-icon"></i>
                    <img v-else-if="form.property[`${o.id}`].value" :src="form.property[`${o.id}`].value" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>

          <el-tab-pane label="颜色属性" v-if="propertyList_4.length" >
            <el-row :gutter="10">
              <el-col :span="8" v-for="o in propertyList_4" :key="o.id">
                <el-form-item :label="o.name" v-if="form.property[`${o.id}`]">
                  <el-color-picker v-model="form.property[`${o.id}`].value" style="width:100%;"></el-color-picker>
                </el-form-item>
              </el-col>
            </el-row>

          </el-tab-pane>
        </el-tabs>
      </el-form>
      <span slot="footer" class="dialog-footer" v-if="!formLoading && formVisible">
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

      sourceList: [],

      settleTypeList: [
        { id: 1, name: '隔天' },
        { id: 2, name: '秒到' },
      ],

      propertyList: [],
    };
  },
  computed: {
    searchSourceList() {
      return [
        { id: undefined, name: '全部类型' },
        { id: '', name: '未设置' },
        ...this.sourceList,
      ];
    },
    list() {
      return _.map(this.a_list, o => ({
        ...o,
        is_enabled: !!o.is_enabled,
        settle_type_name: (_.find(this.settleTypeList, { id: o.settle_type }) || { name: o.settle_type }).name,
        create_time: moment(o.create_time).format('YYYY-MM-DD HH:mm:ss'),
      }));
    },

    propertyList_1() {
      return _.filter(this.propertyList, { type_id: 1 });
    },
    propertyList_3() {
      return _.filter(this.propertyList, { type_id: 3 });
    },
    propertyList_4() {
      return _.filter(this.propertyList, { type_id: 4 });
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
        const { body, headers } = (await this.$http.get('/api/product_ticket', { params }));

        this.a_list = body;
        this.total = parseInt(headers.get('X-Total-Count'), 10);
      } catch (e) {
        const message = e.bodyText || e.message;
        this.$message.error(message);
      }

      this.loading = false;
    }, 200, { leading: false }),

    async showForm({ id } = { }) {
      const $form = this.$refs.form;
      if ($form) $form.resetFields();

      this.form = { property: {} };
      this.formVisible = true;
      this.formLoading = true;
      const { property, ...item } = id ? (await this.$http.get(`/api/v2/product_ticket/${id}`, { params: { prop: 'property' } })).body : { property: [] };
      this.form = {
        ..._.pick(item, ['id', 'name', 'points', 'source_id', 'is_enabled', 'money', 'process_id', 'settle_type', 'ticket_number_title', 'ticket_password_title']),
        property: _(this.propertyList).mapKeys('id').mapValues(o => (_.find(property, { property_id: o.id }) || { property_id: o.id, value: '' })).value(),
      };
      this.formLoading = false;
    },

    async saveForm() {
      this.formLoading = true;
      const $form = this.$refs.form;
      const ok = await $form.validate().catch(e => e);
      if (!ok) return;

      try {
        const { id, property, ...form } = this.form;
        form.property = _.map(property, ({ property_id, value }) => ({ property_id, value }));
        if (!form.process_id) form.process_id = null;
        if (id) {
          await this.$http.patch(`/api/v2/product_ticket/${id}`, form);
        } else {
          await this.$http.post('/api/v2/product_ticket', form);
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
        await this.$http.patch(`/api/v2/product_ticket/${id}`, form);
      } catch (e) {
        const message = e.bodyText || e.message;
        this.$message.error(message);
      }
    },

    async handleDelete({ id, name }) {
      const ok = await this.$confirm(`确认删除${name}?`, '提示', { type: 'warning' }).then(() => true).catch(() => false);
      if (!ok) return;

      try {
        await this.$http.delete(`/api/v2/product_ticket/${id}`);
        await this.reload();
        this.$message.success('删除成功');
      } catch (e) {
        const message = e.bodyText || e.message;
        this.$message.error(message);
      }
    },
  },
  async mounted() {
    this.sourceList = (await this.$http.get('/api/product_ticket_source')).body;
    this.processList = (await this.$http.get('/api/product_ticket_process')).body;

    this.propertyList = _.map((await this.$http.get('/api/v2/product_ticket_property')).body, (o) => {
      const ext = {};
      if (o.type_id === 3) {
        ext.handleUpload = () => {
          this.propertyList = _.map(this.propertyList, p => ((p.id === o.id) ? { ...p, loading: true } : p));
        };

        ext.handleSuccess = ([{ url }]) => {
          this.propertyList = _.map(this.propertyList, p => ((p.id === o.id) ? { ...p, loading: false } : p));
          this.form = {
            ...this.form,
            property: {
              ...this.form.property,
              [o.id]: {
                ...this.form.property[o.id],
                value: url,
              },
            },
          };
        };
      }
      return { ...o, ...ext };
    });

    await this.reload();
  },
};
</script>

<style scoped>
</style>
