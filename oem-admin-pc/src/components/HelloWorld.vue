<template>
  <div style="padding:10px;display:flex:1;">
    <h2>财务统计</h2>

    <el-table :data="list"  style="width: 100%;" :row-style="rowStyle" current-row-key="id" v-loading="loading">
      <el-table-column prop="name" label="时间" header-align="center">
        <template slot-scope="{row}">
          <div @click="toggleItem(row)" style="cursor:pointer;">
            <i v-if="row.arrow" :style="{paddingLeft: `${12*row.level}px`}" :class="{'el-icon-arrow-down' : expandIds.indexOf(row.id) !== -1, 'el-icon-arrow-right': expandIds.indexOf(row.id) === -1 }" />
            <div v-else style="height:14px;display:inline-block;" :style="{paddingLeft: `${12*(row.level+1)}px`}"></div>
            <span>{{row.name}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="merchant_expenditure" label="收入"></el-table-column>
      <el-table-column prop="user_income" label="支出"></el-table-column>
      <el-table-column prop="merchant_income" label="利润"></el-table-column>
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
      loading: false,
      expandIds: [],
      merchantList: [],
      cardList: [],
      loanList: [],
      ticketList: [],
      levelList: [],
    };
  },
  computed: {
    list() {
      const list = [...this.cardList, ...this.loanList, ...this.ticketList, ...this.levelList];

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
        ..._(list).groupBy(o => o.stage_time).map((o, id) => ({
          id,
          stage_time: id,
          name: id,
          merchant_income: _(o).sumBy('merchant_income'),
          user_income: _(o).sumBy('user_income'),
        })).sortBy('stage_time').value(),

        ..._(this.cardList).groupBy(o => o.stage_time).map((o, id) => ({
          id: `${id}|card`,
          name: '信用卡',
          parent_id: id,
          merchant_income: _(o).sumBy('merchant_income'),
          user_income: _(o).sumBy('user_income'),
          href: `/stat_card_order?stage_time=${id}`,
        })).value(),

        ..._(this.loanList).groupBy(o => o.stage_time).map((o, id) => ({
          id: `${id}|loan`,
          name: '贷款',
          parent_id: id,
          merchant_income: _(o).sumBy('merchant_income'),
          user_income: _(o).sumBy('user_income'),
          href: `/stat_loan_order?stage_time=${id}`,
        })).value(),

        ..._(this.ticketList).groupBy(o => o.stage_time).map((o, id) => ({
          id: `${id}|ticket`,
          name: '积分兑换',
          parent_id: id,
          merchant_income: _(o).sumBy('merchant_income'),
          user_income: _(o).sumBy('user_income'),
          href: `/stat_ticket_order?stage_time=${id}`,
        })).value(),

        ..._(this.levelList).groupBy(o => o.stage_time).map((o, id) => ({
          id: `${id}|level`,
          name: '会员升级',
          parent_id: id,
          merchant_income: _(o).sumBy('merchant_income'),
          user_income: _(o).sumBy('user_income'),
          href: `/stat_level_order?stage_time=${id}`,
        })).value(),

      ];

      return _(buildTreeList(_.map(dataList, p => ({
        ...p,
        merchant_expenditure: p.merchant_income + p.user_income,
      }))))
        .filter('show')
        .value();
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
    this.expandIds = [moment().format('YYYY-MM')];

    this.loading = true;
    this.cardList = (await this.$http.get('/api/m/stat_card_order_by_merchant$month$source?order=stage_time')).body;
    this.loanList = (await this.$http.get('/api/m/stat_loan_order_by_merchant$month$product?order=stage_time')).body;
    this.ticketList = (await this.$http.get('/api/m/stat_ticket_order_by_merchant$month$product?order=stage_time')).body;
    this.levelList = (await this.$http.get('/api/m/stat_level_order_by_merchant$month?order=stage_time')).body;
    this.loading = false;
  },
};
</script>

<style scoped>

</style>
