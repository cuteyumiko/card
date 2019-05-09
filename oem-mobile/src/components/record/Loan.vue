<template>
  <div>
    <div class="status-list">
      <div class="list-item" :class="{active: status === 1 }" @click="status = 1">申请中</div>
      <div class="list-item" :class="{active: status === 2 }" @click="status = 2">已通过</div>
      <div class="list-item" :class="{active: status === 3 }" @click="status = 3">已拒绝</div>
    </div>

    <div style="padding:10px;">
      <vux-x-input v-model="search.keyword" placeholder="请输入银行姓名或姓名" style="background-color:#eee;border-radius:5px;">
        <i slot="label" class="iconfont icon-search" style="margin-right:10px;" />
      </vux-x-input>
    </div>

    <div>
      <div style="display:flex;box-shadow:0px 0px 10px #eee;margin:5px;padding:5px;align-items:center;" v-for="o in showList" :key="o.id">
        <div style="width:64px">
          <img :src="o.lower_head_image || headImage" style="width:48px;height:48px;border-radius:24px;" />
        </div>
        <div style="flex:1">
          <div style="font-size:0.4rem;">
            <template v-if="o.lower_id">{{o.lower_level_name}}{{o.lower_name}}推广</template><template v-else>本人申请</template>
          </div>
          <div style="margin-top:5px;">申请人：{{o.order_name}} {{o.order_mobile | mobieFormat}}</div>
          <div style="margin-top:5px;">订单号：{{o.order_code}}</div>
        </div>
        <div style="text-align:center;">
          <div>{{o.product_name}}</div>
          <template v-if="status !== 3">
            <div v-if="o.money_unit == '％' && o.order_money">{{o.money * o.order_money / 100}} 元</div>
            <div v-else>{{o.money}} {{o.money_unit}}</div>
          </template>
          <div v-if="status === 1" style="color:#966e4c;">预计佣金</div>
          <div v-else-if="status === 2" style="color:#966e4c;">结算佣金</div>
          <div v-else-if="status === 3" style="color:#ca001e;">已拒绝</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import moment from 'moment';
import {
  mapState,
} from 'vuex';

export default {
  data() {
    return {
      list: [],
      status: 1,
      search: {},
    };
  },
  computed: {
    ...mapState({
      headImage: state => state.merchant.extendImage.default_head_image,
    }),
    showList() {
      return _.filter(this.list, (o) => {
        if (this.search.keyword && ((!o.order_name || o.order_name.indexOf(this.search.keyword) === -1) && (!o.product_name || o.product_name.indexOf(this.search.keyword) === -1))) return false;
        if (this.status === 1) return o.status === 1 || o.status === 4;
        return o.status === this.status;
      });
    },
  },
  async mounted() {
    document.title = '贷款申请记录';
    let list = (await this.$http.get('/api/my/product_loan_order_income?order=create_time-')).body;
    list = _.map(list, o => ({
      ...o,
      create_time: moment.unix(o.create_time).format('YYYY-MM-DD HH:mm:ss'),
    }));
    this.list = list;
  },
};
</script>

<style scoped lang="less">
.status-list {
  display:flex;

  .list-item {
    flex: 1;
    background-color: #d3d7db;
    color: #fff;
    text-align: center;
    padding: 10px;
    margin: 5px;
  }
  .list-item.active {
    background-color: #5aa3d7;
  }
}
</style>
