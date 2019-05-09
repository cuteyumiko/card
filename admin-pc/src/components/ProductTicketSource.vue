<template>
  <div style="padding:10px;display:flex:1;">

    <div style="display:flex;">
      <div style="margin-right:10px;">
        <el-button icon="el-icon-d-arrow-left" type="primary" size="small" @click="$router.push('/product_ticket')">返回积分券</el-button>
        <el-button icon="el-icon-plus" type="primary" size="small" @click="showForm()">添加积分券来源</el-button>
        <el-button icon="el-icon-menu" type="primary" size="small" @click="$router.push('/product_ticket_source_property')">积分券来源属性</el-button>
      </div>
      <el-form :inline="true">
        <el-form-item>
          <el-input v-model="search.name__like" placeholder="产品名"></el-input>
        </el-form-item>
      </el-form>
    </div>

    <div v-loading="loading">
      <el-table :data="list" style="width: 100%;">
        <el-table-column label="图标" width="60" header-align="center">
          <template slot-scope="{row}">
            <div v-if="row.icon" style="width:48px; height:48px;background-size:contain;background-repeat:no-repeat;background-position:center;" :style="{backgroundImage:`url('${row.icon}')`}"></div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="来源名"></el-table-column>
        <el-table-column prop="description" label="使用介绍"></el-table-column>
        <el-table-column label="启用" width="100">
          <template slot-scope="{row}">
            <el-switch @change="updateItem(row.id, { is_enabled: row.is_enabled })" v-model="row.is_enabled"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="首页展示" width="100">
          <template slot-scope="{row}">
            <el-switch @change="updateItem(row.id, { is_home: row.is_home })" v-model="row.is_home"></el-switch>
          </template>
        </el-table-column>
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

    <el-dialog :title="`${form.id ? '编辑' : '添加'}积分券来源`" :visible.sync="formVisible" :close-on-click-modal="false">
      <el-form class="edit-form" :model="form" ref="form" v-loading="formLoading" v-if="formVisible">
        <el-tabs tab-position="left">
          <el-tab-pane label="基础属性">
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
              <el-col :span="8">
                <el-form-item label="使用介绍">
                  <el-input v-model="form.description" auto-complete="off"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="图片介绍">
                  <el-upload class="avatar-uploader"
                    action="/api/upload"
                    :show-file-list="false"
                    :on-success="handleSuccess_image_description">
                    <img v-if="form.image_description" :src="form.image_description" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
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

          <el-tab-pane label="图片属性" v-if="propertyList_3.length">
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

          <el-tab-pane label="颜色" v-if="propertyList_4.length" >
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
      list: [],
      total: 0,
      loading: false,

      form: { property: {} },
      formVisible: false,
      formLoading: false,

      propertyList: [],
    };
  },
  computed: {
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
        const { body, headers } = (await this.$http.get('/api/product_ticket_source', { params }));

        this.list = _.map(body, o => ({
          ...o,
          is_home: !!o.is_home,
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

    async showForm({ id } = { }) {
      const $form = this.$refs.form;
      if ($form) $form.resetFields();

      this.form = { property: {} };
      this.formVisible = true;
      this.formLoading = true;
      const { property, ...item } = id ? (await this.$http.get(`/api/v2/product_ticket_source/${id}?prop=property`)).body : { property: [] };
      this.form = {
        ..._.pick(item, ['id', 'name', 'icon', 'description', 'image_description']),
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
        if (id) {
          await this.$http.patch(`/api/v2/product_ticket_source/${id}`, form);
        } else {
          await this.$http.post('/api/v2/product_ticket_source', form);
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
        await this.$http.patch(`/api/product_ticket_source/${id}`, form);
      } catch (e) {
        const message = e.bodyText || e.message;
        this.$message.error(message);
      }
    },

    async handleDelete({ id, name }) {
      const ok = await this.$confirm(`确认删除${name}?`, '提示', { type: 'warning' }).then(() => true).catch(() => false);
      if (!ok) return;

      try {
        await this.$http.delete(`/api/product_ticket_source/${id}`);
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
    handleSuccess_image_description([{ url }]) {
      this.form = {
        ...this.form,
        image_description: url,
      };
    },
  },
  async mounted() {
    this.propertyList = _.map((await this.$http.get('/api/v2/product_ticket_source_property')).body, (o) => {
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
