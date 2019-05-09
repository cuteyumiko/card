<template>
  <div style="padding:10px;display:flex:1;">

    <div style="display:flex;">
      <div style="margin-right:10px;">
        <el-button icon="el-icon-d-arrow-left" type="primary" size="small" @click="$router.push('/user')">返回用户</el-button>
      </div>
      <el-form :inline="true">
        <el-form-item>
          <el-input v-model="search.name__like" placeholder="等级名"></el-input>
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
        <el-table-column prop="name" label="等级名"></el-table-column>
        <el-table-column prop="value" label="等级值" width="60"></el-table-column>
        <el-table-column prop="money" label="累计缴费升级(元)"></el-table-column>
        <el-table-column prop="referee_count" label="推荐升级(人)"></el-table-column>
        <el-table-column prop="income_money" label="推荐升级佣金(%)"></el-table-column>
        <el-table-column prop="create_time" label="创建时间" width="140"></el-table-column>
        <!-- <el-table-column label="操作" width="300">
          <template slot-scope="{row}">
            <el-button icon="el-icon-edit" size="mini" type="text" @click="showForm(row)">编辑</el-button>
            <el-button icon="iconfont icon-xinyongqia" size="mini" type="text" @click="showCardSourceForm(row)">信用卡</el-button>
            <el-button icon="iconfont icon-weibiaoti5" size="mini" type="text" @click="showLoanPriceForm(row)">贷款</el-button>
            <el-button icon="iconfont icon-qiaquan" size="mini" type="text" @click="showTicketPriceForm(row)">积分券</el-button>
          </template>
        </el-table-column> -->
      </el-table>

      <el-pagination v-if="total"
        style="margin-top:10px;"
        @size-change="size => search.size = size"
        :current-page.sync="search.current"
        :page-size="search.size"
        :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="`${form.id ? '编辑' : '添加'}用户等级`" :visible.sync="formVisible" :close-on-click-modal="false">
      <el-form class="edit-form" :model="form" ref="form">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="等级名">
              <el-input v-model="form.name" auto-complete="off" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="升级提示">
              <el-input v-model="form.level_up_info" auto-complete="off" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="备注">
              <el-input type="textarea" v-model="form.content" :rows="5" />
            </el-form-item>
          </el-col>

          <el-col :span="4">
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
          <el-col :span="10">
            <el-form-item label="卡背景">
              <el-upload class="avatar-uploader"
                action="/api/upload"
                :show-file-list="false"
                :on-success="handleSuccess_card_bg">
                <img v-if="form.card_bg" :src="form.card_bg" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
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

    <el-dialog title="信用卡" :visible.sync="cardSourceFormVisible" :close-on-click-modal="false" width="60%">
      <el-form class="edit-form" :model="cardSourceForm" ref="cardSourceForm">
        <el-row :gutter="10">
          <el-col :span="8" v-for="o in cardSourceList" :key="o.id">
            <el-form-item v-if="cardSourceForm.config[`${o.id}`]">
              <el-input v-model="cardSourceForm.config[`${o.id}`].money" auto-complete="off">
                <template slot="prepend">佣金</template>
              </el-input>
              <template slot="label">{{o.name}}<small v-if="o.merchant_money" style="color:red;"> {{o.merchant_money}} 元</small></template>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cardSourceFormVisible = false">取消</el-button>
        <el-button type="primary" @click="saveCardSourceForm" :loading="cardSourceFormLoading">保存</el-button>
      </span>
    </el-dialog>

    <el-dialog title="贷款" :visible.sync="loanPriceFormVisible" :close-on-click-modal="false" width="60%">
      <el-form class="edit-form" :model="loanPriceForm" ref="loanPriceForm">
        <el-row :gutter="10">
          <el-col :span="8" v-for="o in loanList" :key="o.id">
            <el-form-item v-if="loanPriceForm.config[`${o.id}`]">
              <el-input v-model="loanPriceForm.config[`${o.id}`].money" auto-complete="off">
                <template slot="prepend">佣金</template>
              </el-input>
              <template slot="label">{{o.name}}<small v-if="o.merchant_money" style="color:red;"> {{o.merchant_money}} {{o.money_unit}}</small></template>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="loanPriceFormVisible = false">取消</el-button>
        <el-button type="primary" @click="saveLoanPriceForm" :loading="loanPriceFormLoading">保存</el-button>
      </span>
    </el-dialog>

    <el-dialog title="积分券" :visible.sync="ticketPriceFormVisible" :close-on-click-modal="false" width="60%">
      <el-form class="edit-form" :model="ticketPriceForm" ref="ticketPriceForm">
        <el-row :gutter="10">
          <el-col :span="8" v-for="o in ticketList" :key="o.id">
            <el-form-item v-if="ticketPriceForm.config[`${o.id}`]">
              <el-input v-model="ticketPriceForm.config[`${o.id}`].money" auto-complete="off">
                <template slot="prepend">佣金</template>
              </el-input>
              <template slot="label">{{o.name}}<small v-if="o.merchant_money" style="color:red;"> {{o.merchant_money}} 元</small></template>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ticketPriceFormVisible = false">取消</el-button>
        <el-button type="primary" @click="saveTicketPriceForm" :loading="ticketPriceFormLoading">保存</el-button>
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

      cardSourceForm: { config: {} },
      cardSourceFormVisible: false,
      cardSourceFormLoading: false,
      cardSourceList: [],

      loanPriceForm: { config: {} },
      loanPriceFormVisible: false,
      loanPriceFormLoading: false,
      loanList: [],

      ticketPriceForm: { config: {} },
      ticketPriceFormVisible: false,
      ticketPriceFormLoading: false,
      ticketList: [],
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
        const { body, headers } = (await this.$http.get('/api/m/user_level', { params }));

        this.list = _.map(body, o => ({ ...o, create_time: moment(o.create_time).format('YYYY-MM-DD HH:mm:ss') }));
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
      this.form = _.pick(item, ['id', 'name', 'value', 'icon', 'card_bg', 'level_up_info', 'content']);
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
          await this.$http.patch(`/api/user_level/${id}`, form);
        } else {
          await this.$http.post('/api/user_level', form);
        }
        this.formVisible = false;
        await this.reload();
      } catch (e) {
        const message = e.bodyText || e.message;
        this.$message.error(message);
      }
      this.formLoading = false;
    },

    handleSuccess_icon([{ url }]) {
      this.form = {
        ...this.form,
        icon: url,
      };
    },
    handleSuccess_card_bg([{ url }]) {
      this.form = {
        ...this.form,
        card_bg: url,
      };
    },

    async showCardSourceForm({ id }) {
      const $form = this.$refs.cardSourceForm;
      if ($form) $form.resetFields();
      const config = (await this.$http.get(`/api/user_level/${id}/cardSource`)).body;
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
        await this.$http.put(`/api/user_level/${id}/cardSource`, _.map(config, (o, i) => ({ source_id: parseInt(i, 10), ...o })));
        this.cardSourceFormVisible = false;
      } catch (e) {
        const message = e.bodyText || e.message;
        this.$message.error(message);
      }
      this.cardSourceFormLoading = false;
    },

    async showLoanPriceForm({ id }) {
      const $form = this.$refs.loanPriceForm;
      if ($form) $form.resetFields();
      const config = (await this.$http.get(`/api/user_level/${id}/loanPrice`)).body;
      this.loanPriceForm = {
        id,
        config: _(this.loanList).map(o => _.pick(_.find(config, { loan_id: o.id }) || { loan_id: o.id }, ['loan_id', 'money'])).mapKeys('loan_id').value(),
      };
      this.loanPriceFormVisible = true;
    },

    async saveLoanPriceForm() {
      this.loanPriceFormLoading = true;
      const $form = this.$refs.loanPriceForm;
      const ok = await $form.validate().catch(e => e);
      if (!ok) return;
      try {
        const { id, config } = this.loanPriceForm;
        await this.$http.put(`/api/user_level/${id}/loanPrice`, _.map(config, (o, i) => ({ loan_id: parseInt(i, 10), ...o })));
        this.loanPriceFormVisible = false;
      } catch (e) {
        const message = e.bodyText || e.message;
        this.$message.error(message);
      }
      this.loanPriceFormLoading = false;
    },

    async showTicketPriceForm({ id }) {
      const $form = this.$refs.ticketPriceForm;
      if ($form) $form.resetFields();
      const config = (await this.$http.get(`/api/user_level/${id}/ticketPrice`)).body;
      this.ticketPriceForm = {
        id,
        config: _(this.ticketList).map(o => _.pick(_.find(config, { ticket_id: o.id }) || { ticket_id: o.id }, ['ticket_id', 'money'])).mapKeys('ticket_id').value(),
      };
      this.ticketPriceFormVisible = true;
    },

    async saveTicketPriceForm() {
      this.ticketPriceFormLoading = true;
      const $form = this.$refs.ticketPriceForm;
      const ok = await $form.validate().catch(e => e);
      if (!ok) return;
      try {
        const { id, config } = this.ticketPriceForm;
        await this.$http.put(`/api/user_level/${id}/ticketPrice`, _.map(config, (o, i) => ({ ticket_id: parseInt(i, 10), ...o })));
        this.ticketPriceFormVisible = false;
      } catch (e) {
        const message = e.bodyText || e.message;
        this.$message.error(message);
      }
      this.ticketPriceFormLoading = false;
    },
  },
  async mounted() {
    this.cardSourceList = (await this.$http.get('/api/m/product_card_source')).body;
    this.loanList = (await this.$http.get('/api/m/product_loan')).body;
    this.ticketList = (await this.$http.get('/api/m/product_ticket')).body;
    await this.reload();
  },
};
</script>

<style scoped>
</style>
