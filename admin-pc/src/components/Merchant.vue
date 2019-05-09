<template>
  <div style="padding:10px;display:flex:1;">

    <div style="display:flex;">
      <div style="margin-right:10px;">
        <el-button icon="el-icon-plus" type="primary" size="small" @click="showForm()">添加商户</el-button>
        <el-button icon="el-icon-menu" type="primary" size="small" @click="$router.push('/merchant_extend')">配置项</el-button>
        <el-button icon="el-icon-menu" type="primary" size="small" @click="$router.push('/merchant_article_type')">文章类型</el-button>
        <el-button icon="el-icon-menu" type="primary" size="small" @click="$router.push('/merchant_bill_type')">海报类型</el-button>
      </div>
      <el-form :inline="true">
        <el-form-item>
          <el-input v-model="search.name__like" placeholder="商户名"></el-input>
        </el-form-item>
      </el-form>
    </div>

    <div v-loading="loading">
      <el-table :data="list"  style="width: 100%;">
        <el-table-column prop="name" label="商户名" width="80"></el-table-column>
        <el-table-column prop="host" label="域名"></el-table-column>
        <el-table-column prop="company_name" label="公司全称" width="200"></el-table-column>
        <el-table-column prop="company_telephone" label="联系电话"></el-table-column>
        <el-table-column prop="create_time" label="创建时间"></el-table-column>
        <el-table-column label="操作" width="700">
          <template slot-scope="{row}">
            <el-button icon="el-icon-edit" size="mini" type="text" @click="showForm(row)">编辑</el-button>
            <el-button icon="el-icon-edit" size="mini" type="text" @click="showExtendForm(row)">配置</el-button>
            <el-button icon="el-icon-edit" size="mini" type="text" @click="$router.push(`/merchant/${row.id}/article`)">文章</el-button>
            <el-button icon="el-icon-edit" size="mini" type="text" @click="$router.push(`/merchant/${row.id}/bill`)">海报</el-button>
            <el-button icon="iconfont icon-xinyongqia" size="mini" type="text" @click="$router.push(`/merchant/${row.id}/user_level`)">会员等级</el-button>
            <el-button icon="iconfont icon-xinyongqia" size="mini" type="text" @click="showCardForm(row)">信用卡</el-button>
            <!-- <el-button icon="iconfont icon-xinyongqia" size="mini" type="text" @click="showCardSourceForm(row)">信用卡来源</el-button> -->
            <el-button icon="iconfont icon-weibiaoti5" size="mini" type="text" @click="showLoanConfigForm(row)">贷款</el-button>
            <el-button icon="iconfont icon-qiaquan" size="mini" type="text" @click="showTicketPriceForm(row)">积分券</el-button>
            <el-button icon="iconfont icon-xinyongqia" size="mini" type="text" @click="showSmsForm(row)">短信</el-button>

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

    <el-dialog :title="`${form.id ? '编辑' : '添加'}商户`" :visible.sync="formVisible" :close-on-click-modal="false">
      <el-form class="edit-form" :model="form" ref="form">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="商户名">
              <el-input v-model="form.name" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="域名">
              <el-input v-model="form.host" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="公司全称">
              <el-input v-model="form.company_name" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系电话">
              <el-input v-model="form.company_telephone" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="自动代付额度（每日）">
              <el-input v-model="form.max_cash_day" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="最小提现额度">
              <el-input v-model="form.min_cash_order" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="提现手续费">
              <el-input v-model="form.cash_fee" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="微信AppID ( 内容分享 )">
              <el-input v-model="form.wx_appid" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="微信AppSecret ( 内容分享 )">
              <el-input v-model="form.wx_secret" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="绑卡接口">
              <el-select v-model="form.bindcard_id" placeholder="请选择" style="width:100%;" clearable>
                <el-option v-for="o in bindcardList" :key="o.id" :label="o.name" :value="o.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="代付接口">
              <el-select v-model="form.agentpay_id" placeholder="请选择" style="width:100%;" clearable>
                <el-option v-for="o in agentpayList" :key="o.id" :label="o.name" :value="o.id"></el-option>
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

    <el-dialog title="信用卡配置" :visible.sync="cardFormVisible" :close-on-click-modal="false" width="80%">
      <el-form class="edit-form" :model="cardForm" ref="cardForm">
        <el-tabs tab-position="left">
          <el-tab-pane :label="o.name" v-for="o in cardList" :key="o.id">
            <template v-if="cardForm.config[`${o.id}`]">
              <el-row :gutter="10">
                <el-col :span="8">
                  <el-form-item label="链接">
                    <el-input v-model="cardForm.config[`${o.id}`].href" auto-complete="off" style="margin-top:2px;" placeholder="不填使用产品中的申请链接"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`佣金 ${o.money} 元`">
                    <el-input v-model="cardForm.config[`${o.id}`].money" auto-complete="off" style="margin-top:2px;" placeholder="不填使用产品中的申请链接"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="申请办卡背景">
                    <el-upload class="avatar-uploader"
                      action="/api/upload"
                      :show-file-list="false"
                      :before-upload="cardForm.config[`${o.id}`].handleUpload__apply_bg"
                      :on-success="cardForm.config[`${o.id}`].handleSuccess__apply_bg">
                      <i v-if="cardForm.config[`${o.id}`].apply_bg === 'loading'" class="el-icon-loading avatar-uploader-icon"></i>
                      <div v-else-if="cardForm.config[`${o.id}`].apply_bg">
                        <img :src="cardForm.config[`${o.id}`].apply_bg" class="avatar">
                        <div @click.stop="() => cardForm.config[`${o.id}`].handleClear__apply_bg()">删除</div>
                      </div>
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                  </el-form-item>
                </el-col>
              </el-row>
            </template>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cardFormVisible = false">取消</el-button>
        <el-button type="primary" @click="saveCardForm" :loading="cardFormLoading">保存</el-button>
      </span>
    </el-dialog>

    <el-dialog title="信用卡来源" :visible.sync="cardSourceFormVisible" :close-on-click-modal="false" width="80%">
      <el-form class="edit-form" :model="cardSourceForm" ref="cardSourceForm">
        <el-row :gutter="10">
          <el-col :span="8" v-for="o in cardSourceList" :key="o.id" style="margin-bottom:5px;">
            <el-form-item v-if="cardSourceForm.config[`${o.id}`]">
              <el-input v-model="cardSourceForm.config[`${o.id}`].money" auto-complete="off">
                <template slot="prepend">佣金</template>
              </el-input>
              <template slot="label">{{o.name}}<small v-if="o.money" style="color:red;"> {{o.money}} 元</small></template>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cardSourceFormVisible = false">取消</el-button>
        <el-button type="primary" @click="saveCardSourceForm" :loading="cardSourceFormLoading">保存</el-button>
      </span>
    </el-dialog>

    <el-dialog title="贷款配置" :visible.sync="loanConfigFormVisible" :close-on-click-modal="false" width="60%">
      <el-form class="edit-form" :model="loanConfigForm" ref="loanConfigForm">
        <el-row :gutter="10">
          <el-col :span="8" v-for="o in loanList" :key="o.id">
            <el-form-item v-if="loanConfigForm.loanConfig[`${o.id}`]">
              <el-input v-model="loanConfigForm.loanConfig[`${o.id}`].money" auto-complete="off">
                <template slot="prepend">佣金</template>
              </el-input>
              <el-input v-model="loanConfigForm.loanConfig[`${o.id}`].href" auto-complete="off" style="margin-top:2px;" placeholder="不填使用产品中的申请链接">
                <template slot="prepend">链接</template>
              </el-input>
              <template slot="label">{{o.name}}<small v-if="o.money" style="color:red;"> {{o.money}} {{o.money_unit}}</small></template>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="loanConfigFormVisible = false">取消</el-button>
        <el-button type="primary" @click="saveLoanConfigForm" :loading="loanConfigFormLoading">保存</el-button>
      </span>
    </el-dialog>

    <el-dialog title="积分券佣金" :visible.sync="ticketPriceFormVisible" :close-on-click-modal="false" width="60%">
      <el-form class="edit-form" :model="ticketPriceForm" ref="ticketPriceForm">
        <el-row :gutter="10">
          <el-col :span="8" v-for="o in ticketList" :key="o.id">
            <el-form-item>
              <el-input v-model="ticketPriceForm.ticketPrice[`${o.id}`]" auto-complete="off"></el-input>
              <template slot="label">{{o.name}}<small v-if="o.money" style="color:red;"> {{o.money}} 元</small></template>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ticketPriceFormVisible = false">取消</el-button>
        <el-button type="primary" @click="saveTicketPriceForm" :loading="ticketPriceFormLoading">保存</el-button>
      </span>
    </el-dialog>

    <el-dialog title="短信" :visible.sync="smsFormVisible" :close-on-click-modal="false" width="80%">
      <el-form class="edit-form" :model="smsForm" ref="smsForm">

        <el-tabs tab-position="left">
          <el-tab-pane :label="o.name" v-for="o in smsList" :key="o.id">

            <template v-if="smsForm.config[`${o.id}`]">
              <el-form-item label="通道">
                <el-select v-model="smsForm.config[`${o.id}`].pass_code" placeholder="请选择" style="width:100%;">
                  <el-option v-for="o in smsPassList" :key="o.code" :label="o.name" :value="o.code"></el-option>
                </el-select>
              </el-form-item>

              <template v-if="smsPassByCode[smsForm.config[`${o.id}`].pass_code]">
                <el-form-item :label="x.label" v-for="x in smsPassByCode[smsForm.config[`${o.id}`].pass_code].config" :key="x.name">
                  <el-select v-if="x.list" v-model="smsForm.config[`${o.id}`].pass_config[x.name]" placeholder="请选择" style="width:100%;">
                    <el-option v-for="p in x.list" :key="p.value" :label="p.label" :value="p.value"></el-option>
                  </el-select>
                  <el-input v-else :type="x.type" v-model="smsForm.config[`${o.id}`].pass_config[x.name]" auto-complete="off"></el-input>
                </el-form-item>
              </template>
            </template>

          </el-tab-pane>
        </el-tabs>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="smsFormVisible = false">取消</el-button>
        <el-button type="primary" @click="saveSmsForm" :loading="smsFormLoading">保存</el-button>
      </span>
    </el-dialog>

    <el-dialog title="配置" :visible.sync="extendFormVisible" :close-on-click-modal="false" width="80%">
      <el-form class="edit-form" :model="extendForm" ref="extendForm">

        <el-tabs tab-position="left">
          <el-tab-pane :label="o.name" v-for="o in extendList" :key="o.id">

            <template v-if="extendForm.valueMap[`${o.id}`]">

              <template v-if="o.type_id === 1">
                <el-input v-model="extendForm.valueMap[`${o.id}`].value"></el-input>
              </template>
              <template v-else-if="o.type_id === 2">
                <tinymce
                  :id="`dt-extend-${o.id}`" @editorInit="e => e.setContent(extendForm.valueMap[`${o.id}`].value)"
                  v-model="extendForm.valueMap[`${o.id}`].value"
                  :other_options="tinymceOptions"></tinymce>
              </template>
              <template v-else-if="o.type_id === 3">
                <el-upload class="avatar-uploader"
                  action="/api/upload"
                  :show-file-list="false"
                  :before-upload="extendForm.valueMap[`${o.id}`].handleUpload"
                  :on-success="extendForm.valueMap[`${o.id}`].handleSuccess">
                  <i v-if="extendForm.valueMap[`${o.id}`].value === 'loading'" class="el-icon-loading avatar-uploader-icon"></i>
                  <img v-else-if="extendForm.valueMap[`${o.id}`].value" :src="extendForm.valueMap[`${o.id}`].value" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </template>
              <template v-else-if="o.type_id === 4">
                <el-color-picker v-model="extendForm.valueMap[`${o.id}`].value" style="width:100%;"></el-color-picker>
              </template>
              <template v-else-if="o.type_id === 5">
                <el-checkbox v-model="extendForm.valueMap[`${o.id}`].value" true-label="1" false-label="0">点一下这里</el-checkbox>
              </template>
            </template>

          </el-tab-pane>
        </el-tabs>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="extendFormVisible = false">取消</el-button>
        <el-button type="primary" @click="saveExtendForm" :loading="extendFormLoading">保存</el-button>
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
        codesample_content_css: ['https://cdn.bootcss.com/tinymce/4.7.12/plugins/codesample/css/prism.css'],
        imagetools_cors_hosts: ['cdn.hello.com'],
      },

      search: { current: 1, size: 10 },
      list: [],
      total: 0,
      loading: false,

      form: {},
      formVisible: false,
      formLoading: false,

      contentFormType: '',
      contentFormKey: '',
      contentFormTitle: '',
      contentForm: {},
      contentFormVisible: false,
      contentFormLoading: false,

      cardForm: { config: {} },
      cardFormVisible: false,
      cardFormLoading: false,
      cardList: [],

      cardSourceForm: { config: {} },
      cardSourceFormVisible: false,
      cardSourceFormLoading: false,
      cardSourceList: [],

      loanConfigForm: { loanConfig: {} },
      loanConfigFormVisible: false,
      loanConfigFormLoading: false,
      loanList: [],

      ticketPriceForm: { ticketPrice: {} },
      ticketPriceFormVisible: false,
      ticketPriceFormLoading: false,
      ticketList: [],

      smsForm: { config: {} },
      smsFormVisible: false,
      smsFormLoading: false,
      smsList: [],
      smsPassList: [],

      extendForm: { valueMap: {} },
      extendFormVisible: false,
      extendFormLoading: false,
      extendList: [],

      bindcardList: [],
      agentpayList: [],
    };
  },
  computed: {
    smsPassByCode() {
      return _.mapKeys(this.smsPassList, o => o.code);
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
        const { body, headers } = (await this.$http.get('/api/merchant', { params }));

        this.list = _.map(body, o => ({ ...o, create_time: moment(o.create_time).format('YYYY-MM-DD HH:mm:ss') }));
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
      this.form = _.pick(item, ['id', 'name', 'host', 'company_name', 'company_telephone', 'max_cash_day', 'min_cash_order', 'cash_fee', 'wx_appid', 'wx_secret', 'bindcard_id', 'agentpay_id']);
      this.formVisible = true;
    },

    async saveForm() {
      this.formLoading = true;
      const $form = this.$refs.form;
      const ok = await $form.validate().catch(e => e);
      if (!ok) return;

      try {
        const { id, ...form } = this.form;
        if (!form.bindcard_id) form.bindcard_id = null;
        if (id) {
          await this.$http.patch(`/api/merchant/${id}`, form);
        } else {
          await this.$http.post('/api/merchant', form);
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
        await this.$http.delete(`/api/merchant/${id}`);
        await this.reload();
        this.$message.success('删除成功');
      } catch (e) {
        const message = e.bodyText || e.message;
        this.$message.error(message);
      }
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
        await this.$http.patch(`/api/merchant/${id}`, form);
        this.contentFormVisible = false;
        await this.reload();
      } catch (e) {
        const message = e.bodyText || e.message;
        this.$message.error(message);
      }
      this.contentFormLoading = false;
    },

    async showCardForm({ id }) {
      const $form = this.$refs.cardForm;
      if ($form) $form.resetFields();
      const config = (await this.$http.get(`/api/merchant/${id}/cardPrice`)).body;
      this.cardForm = {
        id,
        config: _(this.cardList)
          .map(o => _.pick(_.find(config, { card_id: o.id }) || { card_id: o.id }, ['card_id', 'money', 'href', 'apply_bg', 'money']))
          .map(o => ({
            ...o,
            handleUpload__apply_bg: () => {
              this.cardForm = {
                ...this.cardForm,
                config: _.mapValues(this.cardForm.config, p => ({ ...p, apply_bg: o.card_id === p.card_id ? 'loading' : p.apply_bg })),
              };
            },
            handleSuccess__apply_bg: ([{ url }]) => {
              this.cardForm = {
                ...this.cardForm,
                config: _.mapValues(this.cardForm.config, p => ({ ...p, apply_bg: o.card_id === p.card_id ? url : p.apply_bg })),
              };
            },
            handleClear__apply_bg: () => {
              this.cardForm = {
                ...this.cardForm,
                config: _.mapValues(this.cardForm.config, p => ({ ...p, apply_bg: o.card_id === p.card_id ? '' : p.apply_bg })),
              };
            },
          }))
          .mapKeys('card_id')
          .value(),
      };
      this.cardFormVisible = true;
    },

    async saveCardForm() {
      this.cardFormLoading = true;
      const $form = this.$refs.cardForm;
      const ok = await $form.validate().catch(e => e);
      if (!ok) return;
      try {
        const { id, config } = this.cardForm;
        await this.$http.put(`/api/merchant/${id}/cardPrice`, _.map(config, (o, i) => ({ card_id: parseInt(i, 10), ...o })));
        this.cardFormVisible = false;
      } catch (e) {
        const message = e.bodyText || e.message;
        this.$message.error(message);
      }
      this.cardFormLoading = false;
    },

    async showCardSourceForm({ id }) {
      const $form = this.$refs.cardSourceForm;
      if ($form) $form.resetFields();
      const config = (await this.$http.get(`/api/merchant/${id}/cardSource`)).body;
      this.cardSourceForm = {
        id,
        config: _(this.cardSourceList).map(o => _.pick(_.find(config, { source_id: o.id }) || { source_id: o.id }, ['source_id', 'money'])).mapKeys('source_id').value(),
      };
      this.cardSourceFormVisible = true;
    },

    async saveCardSourceForm() {
      this.cardSourceFormLoading = true;
      const $form = this.$refs.cardSourceForm;
      const ok = await $form.validate().catch(e => e);
      if (!ok) return;
      try {
        const { id, config } = this.cardSourceForm;
        await this.$http.put(`/api/merchant/${id}/cardSource`, _.map(config, (o, i) => ({ source_id: parseInt(i, 10), ...o })));
        this.cardSourceFormVisible = false;
      } catch (e) {
        const message = e.bodyText || e.message;
        this.$message.error(message);
      }
      this.cardSourceFormLoading = false;
    },

    async showLoanConfigForm({ id }) {
      const $form = this.$refs.loanConfigForm;
      if ($form) $form.resetFields();
      const loanConfig = (await this.$http.get(`/api/merchant/${id}/loanPrice`)).body;
      this.loanConfigForm = {
        id,
        loanConfig: _(this.loanList).map(o => _.pick(_.find(loanConfig, { loan_id: o.id }) || { loan_id: o.id }, ['loan_id', 'money', 'href'])).mapKeys('loan_id').value(),
      };
      this.loanConfigFormVisible = true;
    },

    async saveLoanConfigForm() {
      this.loanConfigFormLoading = true;
      const $form = this.$refs.loanConfigForm;
      const ok = await $form.validate().catch(e => e);
      if (!ok) return;
      try {
        const { id, loanConfig } = this.loanConfigForm;
        await this.$http.put(`/api/merchant/${id}/loanPrice`, _(loanConfig).map((o, i) => ({ loan_id: parseInt(i, 10), ...o })).filter(o => o.money).value());
        this.loanConfigFormVisible = false;
      } catch (e) {
        const message = e.bodyText || e.message;
        this.$message.error(message);
      }
      this.loanConfigFormLoading = false;
    },

    async showTicketPriceForm({ id }) {
      const $form = this.$refs.ticketPriceForm;
      if ($form) $form.resetFields();
      const ticketPrice = (await this.$http.get(`/api/merchant/${id}/ticketPrice`)).body;
      this.ticketPriceForm = {
        id,
        ticketPrice: _.mapValues(_.mapKeys(_.map(this.ticketList, o => (_.find(ticketPrice, { ticket_id: o.id }) || { ticket_id: o.id })), 'ticket_id'), 'money'),
      };
      this.ticketPriceFormVisible = true;
    },

    async saveTicketPriceForm() {
      this.ticketPriceFormLoading = true;
      const $form = this.$refs.ticketPriceForm;
      const ok = await $form.validate().catch(e => e);
      if (!ok) return;
      try {
        const { id, ticketPrice } = this.ticketPriceForm;
        await this.$http.put(`/api/merchant/${id}/ticketPrice`, _.map(ticketPrice, (money, ticket_id) => ({ ticket_id: parseInt(ticket_id, 10), money })));
        this.ticketPriceFormVisible = false;
      } catch (e) {
        const message = e.bodyText || e.message;
        this.$message.error(message);
      }
      this.ticketPriceFormLoading = false;
    },

    async showSmsForm({ id }) {
      const $form = this.$refs.smsForm;
      if ($form) $form.resetFields();
      let config = (await this.$http.get(`/api/merchant/${id}/sms`)).body;
      config = _.map(config, o => ({
        ...o,
        pass_config: o.pass_config ? JSON.parse(o.pass_config) : {},
      }));
      this.smsForm = {
        id,
        config: _(this.smsList).map(o => _.pick(_.find(config, { sms_id: o.id }) || { sms_id: o.id, pass_config: {} }, ['sms_id', 'pass_code', 'pass_config'])).mapKeys('sms_id').value(),
      };
      this.smsFormVisible = true;
    },

    async saveSmsForm() {
      this.smsFormLoading = true;
      const $form = this.$refs.smsForm;
      const ok = await $form.validate().catch(e => e);
      if (!ok) return;
      try {
        const { id, config } = this.smsForm;
        await this.$http.put(`/api/merchant/${id}/sms`, _.map(config, ({ pass_config, ...o }, i) => ({ sms_id: parseInt(i, 10), ...o, pass_config: JSON.stringify(pass_config) })));
        this.smsFormVisible = false;
      } catch (e) {
        const message = e.bodyText || e.message;
        this.$message.error(message);
      }
      this.smsFormLoading = false;
    },

    async showExtendForm({ id }) {
      const $form = this.$refs.extendForm;
      if ($form) $form.resetFields();
      const list = (await this.$http.get(`/api/merchant/${id}/extend`)).body;
      this.extendForm = {
        id,
        valueMap: _(this.extendList)
          .map(o => _.pick(_.find(list, { extend_id: o.id }) || { extend_id: o.id }, ['extend_id', 'value']))
          .map(o => ({
            ...o,
            handleUpload: () => {
              this.extendForm = {
                ...this.extendForm,
                valueMap: _.mapValues(this.extendForm.valueMap, p => ({ ...p, value: o.extend_id === p.extend_id ? 'loading' : p.value })),
              };
            },
            handleSuccess: ([{ url }]) => {
              this.extendForm = {
                ...this.extendForm,
                valueMap: _.mapValues(this.extendForm.valueMap, p => ({ ...p, value: o.extend_id === p.extend_id ? url : p.value })),
              };
            },
          }))
          .mapKeys('extend_id')
          .value(),
      };
      this.extendFormVisible = true;
    },

    async saveExtendForm() {
      this.extendFormLoading = true;
      const $form = this.$refs.extendForm;
      const ok = await $form.validate().catch(e => e);
      if (!ok) return;
      try {
        const { id, valueMap } = this.extendForm;
        await this.$http.put(`/api/merchant/${id}/extend`, _.map(valueMap, (o, i) => ({ ...o, extend_id: parseInt(i, 10) })));
        this.extendFormVisible = false;
      } catch (e) {
        const message = e.bodyText || e.message;
        this.$message.error(message);
      }
      this.extendFormLoading = false;
    },
  },
  async mounted() {
    this.cardList = (await this.$http.get('/api/product_card', { params: { is_enabled: 1 } })).body;
    this.cardSourceList = (await this.$http.get('/api/product_card_source', { params: { is_enabled: 1 } })).body;
    this.loanList = (await this.$http.get('/api/product_loan', { params: { is_enabled: 1 } })).body;
    this.ticketList = (await this.$http.get('/api/product_ticket')).body;
    const smsList = (await this.$http.get('/api/sms')).body;
    this.smsList = _.filter(smsList, 'code');
    this.smsPassList = (await this.$http.get('/api/pass/sms')).body;
    this.extendList = (await this.$http.get('/api/merchant_extend')).body;

    this.bindcardList = (await this.$http.get('/api/v2/bindcard')).body;
    this.agentpayList = (await this.$http.get('/api/v2/agentpay')).body;
    await this.reload();
  },
};
</script>

<style scoped>
</style>
