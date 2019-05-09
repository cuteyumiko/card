<template>
  <div style="padding:10px;display:flex:1;">

    <div style="display:flex;">
      <div style="margin-right:10px;">
        <el-button icon="el-icon-plus" type="primary" size="small" @click="showForm()">添加贷款</el-button>
        <el-button icon="el-icon-menu" type="primary" size="small" @click="$router.push('/product_loan_type')">查看类型</el-button>
        <el-button icon="el-icon-menu" type="primary" size="small" @click="$router.push('/product_loan_property')">贷款属性</el-button>
      </div>
      <el-form :inline="true">
        <el-form-item>
          <el-input v-model="search.name__like" placeholder="产品名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="search.type_ids__like" placeholder="请选择">
            <el-option v-for="o in searchTypeList" :key="o.id" :label="o.name" :value="o.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <div v-loading="loading">
      <el-table :data="list" style="width: 100%;" @sort-change="sortChange" :default-sort="{prop: 'sort', order: 'descending'}">
        <el-table-column label="图标" width="60" header-align="center">
          <template slot-scope="{row}">
            <div v-if="row.icon" style="width:48px; height:48px;background-size:contain;background-repeat:no-repeat;background-position:center;" :style="{backgroundImage:`url('${row.icon}')`}"></div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="产品名"></el-table-column>
        <el-table-column label="类型">
          <template slot-scope="{row}">
            <div v-for="o in row.type" :key="o.id">{{o.name}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
        <el-table-column prop="got_count" label="已办数量"></el-table-column>
        <el-table-column prop="sort" label="排序" sortable="custom"></el-table-column>
        <el-table-column prop="money" label="佣金">
          <template slot-scope="{row}">
            {{row.money}} {{row.money_unit}}
          </template>
        </el-table-column>
        <el-table-column label="推荐" width="100">
          <template slot-scope="{row}">
            <el-switch @change="updateItem(row.id, { is_recommend: row.is_recommend })" v-model="row.is_recommend"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="启用" width="100">
          <template slot-scope="{row}">
            <el-switch @change="updateItem(row.id, { is_enabled: row.is_enabled })" v-model="row.is_enabled"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="quota" label="额度"></el-table-column>
        <el-table-column prop="interest" label="月息"></el-table-column>
        <el-table-column prop="create_time" label="创建时间" width="160" sortable="custom"></el-table-column>
        <el-table-column label="操作" width="100">
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

    <el-dialog :title="`${form.id ? '编辑' : '添加'}贷款`" :visible.sync="formVisible" :close-on-click-modal="false">
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
                <el-form-item label="推荐办卡背景">
                  <el-upload class="avatar-uploader"
                    action="/api/upload"
                    :show-file-list="false"
                    :on-success="handleSuccess_recommend_bg">
                    <img v-if="form.recommend_bg" :src="form.recommend_bg" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="申请办卡背景">
                  <el-upload class="avatar-uploader"
                    action="/api/upload"
                    :show-file-list="false"
                    :on-success="handleSuccess_apply_bg">
                    <img v-if="form.apply_bg" :src="form.apply_bg" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="类型">
                  <el-select v-model="form.type_id" multiple placeholder="请选择" style="width:100%;">
                    <el-option v-for="o in typeList" :key="o.id" :label="o.name" :value="o.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="产品名">
                  <el-input v-model="form.name" auto-complete="off"></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="16">
                <el-form-item label="描述">
                  <el-input v-model="form.description" auto-complete="off"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="已办数量">
                  <el-input-number v-model="form.got_count" controls-position="right" :min="0" style="width:100%;"></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="排序">
                  <el-input-number v-model="form.sort" controls-position="right" :min="0" style="width:100%;"></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="佣金">
                  <el-input v-model="form.money" auto-complete="off">
                    <el-select v-model="form.money_unit" slot="append" placeholder="请选择" style="width:100px;">
                      <el-option v-for="o in moneyUnitList" :key="o.id" :label="o.name" :value="o.id"></el-option>
                    </el-select>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="推荐">
                  <el-switch v-model="form.is_recommend" style="width:100%;"></el-switch>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="二维码位置">
                  <el-input v-model="form.qr_rect" auto-complete="off" placeholder="x,y,width,height"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="申请链接">
                  <el-input v-model="form.href" auto-complete="off"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="额度">
                  <el-input v-model="form.quota" auto-complete="off"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="月息">
                  <el-input v-model="form.interest" auto-complete="off"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="文字颜色">
                  <el-color-picker v-model="form.text_color" style="width:100%;"></el-color-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="提示">
                  <el-input v-model="form.tip_text" auto-complete="off"></el-input>
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
          <el-tab-pane label="颜色属性" v-if="propertyList_4.length">
            <el-row :gutter="10">
              <el-col :span="8" v-for="o in propertyList_4" :key="o.id">
                <el-form-item :label="o.name" v-if="form.property[`${o.id}`]">
                  <!-- <el-color-picker v-model="form.property[`${o.id}`].value" style="width:100%;"></el-color-picker> -->
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="文本域" v-if="propertyList_6.length">
            <el-row :gutter="10">
              <el-col :span="12" v-for="o in propertyList_6" :key="o.id">
                <el-form-item :label="o.name" v-if="form.property[`${o.id}`]">
                  <el-input type="textarea" autosize v-model="form.property[`${o.id}`].value"></el-input>
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

      form: {},
      formVisible: false,
      formLoading: false,

      typeList: [],

      moneyUnitList: [
        { id: '元', name: '元' },
        { id: '％', name: '%' },
      ],

      propertyList: [],
    };
  },
  computed: {
    searchTypeList() {
      return [
        { id: undefined, name: '全部类型' },
        ..._.map(this.typeList, o => ({
          id: `[${o.id}]`, name: o.name,
        })),
      ];
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
    propertyList_6() {
      return _.filter(this.propertyList, { type_id: 6 });
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
        const { body, headers } = (await this.$http.get('/api/product_loan', { params }));

        this.list = _.map(body, (o) => {
          const type = o.type_ids ? _.map(o.type_ids.replace(/\[|\]/g, '').split(','), p => _.find(this.typeList, q => `${q.id}` === p)) : o.type_ids;
          return {
            ...o,
            is_recommend: !!o.is_recommend,
            is_enabled: !!o.is_enabled,
            create_time: moment(o.create_time).format('YYYY-MM-DD HH:mm:ss'),
            type,
            type_id: _.map(type, 'id'),
          };
        });
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

    async showForm({ id } = { }) {
      const $form = this.$refs.form;
      if ($form) $form.resetFields();

      this.form = { property: {} };
      this.formVisible = true;
      this.formLoading = true;
      const { property, ...item } = id ? (await this.$http.get(`/api/v2/product_loan/${id}?prop=property`)).body : { property: [] };
      const type = item.type_ids ? _.map(item.type_ids.replace(/\[|\]/g, '').split(','), p => _.find(this.typeList, q => `${q.id}` === p)) : item.type_ids;
      this.form = {
        ..._.pick(item, ['id', 'name', 'is_recommend', 'type_id', 'description', 'got_count', 'icon', 'href', 'recommend_bg', 'apply_bg', 'qr_rect', 'quota', 'interest', 'money', 'money_unit', 'text_color', 'sort', 'tip_text']),
        property: _(this.propertyList).mapKeys('id').mapValues(o => (_.find(property, { property_id: o.id }) || { property_id: o.id, value: '' })).value(),
        type,
        type_id: _.map(type, 'id'),
      };
      this.formLoading = false;
    },

    async saveForm() {
      this.formLoading = true;
      const $form = this.$refs.form;
      const ok = await $form.validate().catch(e => e);
      if (!ok) return;

      try {
        const { id, property, type_id, ...form } = this.form;
        form.property = _.map(property, ({ property_id, value }) => ({ property_id, value }));
        form.type = _.map(type_id, o => ({ type_id: o }));
        if (id) {
          await this.$http.patch(`/api/v2/product_loan/${id}`, form);
        } else {
          await this.$http.post('/api/v2/product_loan', form);
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
        await this.$http.patch(`/api/v2/product_loan/${id}`, form);
      } catch (e) {
        const message = e.bodyText || e.message;
        this.$message.error(message);
      }
    },

    async handleDelete({ id, name }) {
      const ok = await this.$confirm(`确认删除${name}?`, '提示', { type: 'warning' }).then(() => true).catch(() => false);
      if (!ok) return;

      try {
        await this.$http.delete(`/api/v2/product_loan/${id}`);
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
    handleSuccess_recommend_bg([{ url }]) {
      this.form = {
        ...this.form,
        recommend_bg: url,
      };
    },
    handleSuccess_apply_bg([{ url }]) {
      this.form = {
        ...this.form,
        apply_bg: url,
      };
    },
  },
  async mounted() {
    this.typeList = (await this.$http.get('/api/product_loan_type')).body;

    this.propertyList = _.map((await this.$http.get('/api/v2/product_loan_property')).body, (o) => {
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
