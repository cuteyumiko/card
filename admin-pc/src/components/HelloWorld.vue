<template>
  <div style="padding:10px;display:flex:1;display:flex;flex-direction:column;">
    <h2>财务统计</h2>
    <p>未提现金额 {{ balance }}</p>

    <el-table :data="list"  style="width: 100%;" :row-style="rowStyle" current-row-key="id">
      <el-table-column prop="name" label="商户" header-align="center">
        <template slot-scope="{row}">
          <div @click="toggleItem(row)" style="cursor:pointer;">
            <i v-if="row.arrow" :style="{paddingLeft: `${12*row.level}px`}" :class="{'el-icon-arrow-down' : expandIds.indexOf(row.id) !== -1, 'el-icon-arrow-right': expandIds.indexOf(row.id) === -1 }" />
            <div v-else style="height:14px;display:inline-block;" :style="{paddingLeft: `${12*(row.level+1)}px`}"></div>
            <span>{{row.name}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="platform_expenditure" label="平台收入"></el-table-column>
      <el-table-column prop="merchant_expenditure" label="OEM收入"></el-table-column>
      <el-table-column prop="platform_income" label="平台利润"></el-table-column>
      <el-table-column prop="user_income" label="OEM支出"></el-table-column>
      <el-table-column prop="merchant_income" label="OEM利润"></el-table-column>
      <el-table-column prop="cash_money" label="提现"></el-table-column>
      <el-table-column>
        <template slot-scope="{row}">
          <el-button v-if="row.href" icon="el-icon-edit" size="mini" type="text" @click="$router.push(row.href)">查看详细</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import _ from 'lodash';
import moment from 'moment';

export default {
  data() {
    return {
      expandIds: [],
      merchantList: [],
      cardList: [],
      loanList: [],
      ticketList: [],
      levelList: [],
      cashList: [],

      balance: 0,
      sum_income: 0,
    };
  },
  computed: {
    list() {
      const list = [...this.cardList, ...this.loanList, ...this.ticketList, ...this.levelList, ...this.cashList];

      const buildTreeList = (root, parent) => {
        const ret = _(root)
          .filter(o => (parent ? o.parent_id === parent.id : !o.parent_id))
          .map((o) => {
            const current = {
              ...o,
              expand: this.expandIds.indexOf(o.id) !== -1,
              level: parent ? parent.level + 1 : 0,
              arrow: true,
              show: parent ? (parent.expand && parent.show) : true,
            };
            const sub = buildTreeList(root, current);
            if (sub.length) return [current, ...sub];
            current.arrow = false;
            return current;
          })
          .flatten()
          .value();
        return ret;
      };

      const dataList = [
        ..._(this.merchantList).map(o => ({
          id: `${o.id}`,
          name: o.name,
          platform_income: _(list).filter({ merchant_id: o.id }).sumBy('platform_income'),
          merchant_income: _(list).filter({ merchant_id: o.id }).sumBy('merchant_income'),
          user_income: _(list).filter({ merchant_id: o.id }).sumBy('user_income'),
          cash_money: _(list).filter({ merchant_id: o.id }).sumBy('money'),
        })).value(),

        ..._(list).groupBy(o => `${o.merchant_id}|${o.stage_time}`).map((o, id) => ({
          id,
          name: o[0].stage_time,
          parent_id: `${o[0].merchant_id}`,
          platform_income: _(o).sumBy('platform_income'),
          merchant_income: _(o).sumBy('merchant_income'),
          user_income: _(o).sumBy('user_income'),
          cash_money: _(o).sumBy('money'),
        })).sortBy('name')
          .value(),

        ..._(this.cardList).groupBy(o => `${o.merchant_id}|${o.stage_time}`).map((o, id) => ({
          id: `${id}|card`,
          name: '信用卡',
          parent_id: id,
          platform_income: _(o).sumBy('platform_income'),
          merchant_income: _(o).sumBy('merchant_income'),
          user_income: _(o).sumBy('user_income'),
          href: `/stat_card_order?stage_time=${o[0].stage_time}&merchant_id=${o[0].merchant_id}`,
        })).value(),

        ..._(this.loanList).groupBy(o => `${o.merchant_id}|${o.stage_time}`).map((o, id) => ({
          id: `${id}|loan`,
          name: '贷款',
          parent_id: id,
          platform_income: _(o).sumBy('platform_income'),
          merchant_income: _(o).sumBy('merchant_income'),
          user_income: _(o).sumBy('user_income'),
          href: `/stat_loan_order?stage_time=${o[0].stage_time}&merchant_id=${o[0].merchant_id}`,
        })).value(),

        ..._(this.ticketList).groupBy(o => `${o.merchant_id}|${o.stage_time}`).map((o, id) => ({
          id: `${id}|ticket`,
          name: '积分兑换',
          parent_id: id,
          platform_income: _(o).sumBy('platform_income'),
          merchant_income: _(o).sumBy('merchant_income'),
          user_income: _(o).sumBy('user_income'),
          href: `/stat_ticket_order?stage_time=${o[0].stage_time}&merchant_id=${o[0].merchant_id}`,
        })).value(),

        ..._(this.levelList).groupBy(o => `${o.merchant_id}|${o.stage_time}`).map((o, id) => ({
          id: `${id}|level`,
          name: '会员升级',
          parent_id: id,
          platform_income: _(o).sumBy('platform_income'),
          merchant_income: _(o).sumBy('merchant_income'),
          user_income: _(o).sumBy('user_income'),
          href: `/stat_level_order?stage_time=${o[0].stage_time}&merchant_id=${o[0].merchant_id}`,
        })).value(),

      ];

      return _.filter(buildTreeList(_.map(dataList, p => ({
        ...p,
        merchant_income: p.merchant_income.toFixed(2),
        user_income: p.user_income.toFixed(2),
        merchant_expenditure: (p.merchant_income + p.user_income).toFixed(2),
        platform_income: p.platform_income.toFixed(2),
        platform_expenditure: (p.platform_income + p.merchant_income + p.user_income).toFixed(2),

      }))), 'show');
    },
  },
  methods: {
    toggleItem(item) {
      const id = `${item.id}`;
      if (this.expandIds.indexOf(id) === -1) this.expandIds = [...this.expandIds, id];
      else this.expandIds = this.expandIds.filter(o => o !== id);
    },
    rowStyle({ row }) {
      if (!row.level) return {};
      else if (row.level === 1) return { backgroundColor: '#ecf5ff' };
      return { backgroundColor: '#fdf5e6' };
    },
  },
  async mounted() {
    const { balance } = (await this.$http.get('/api/user?sum=balance,sum_income')).body[0];
    this.balance = balance;

    this.merchantList = (await this.$http.get('/api/merchant')).body;
    this.cardList = (await this.$http.get('/api/stat_card_order_by_merchant$month$source?order=stage_time')).body;
    this.loanList = (await this.$http.get('/api/stat_loan_order_by_merchant$month$product?order=stage_time')).body;
    this.ticketList = (await this.$http.get('/api/stat_ticket_order_by_merchant$month$product?order=stage_time')).body;
    this.levelList = (await this.$http.get('/api/stat_level_order_by_merchant$month?order=stage_time')).body;
    this.cashList = (await this.$http.get('/api/stat_cash_order_by_merchant$month?order=stage_time')).body;

    const time = moment().format('YYYY-MM');
    this.expandIds = _.map(this.merchantList, o => `${o.id}|${time}`);
  },
};
</script>

<style scoped>

</style>
