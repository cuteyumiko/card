<template>
  <div>
    <div style="height:5px;background:#eee;"></div>
    <div class="type-list">
      <div @click="income_type='all'" :class="{active:income_type === 'all' }" class="type-item">全部</div>
      <div @click="income_type='card'" :class="{active:income_type === 'card' }" class="type-item">信用卡</div>
      <div @click="income_type='loan'" :class="{active:income_type === 'loan' }" class="type-item">网贷</div>
      <div @click="income_type='ticket'" :class="{active:income_type === 'ticket' }" class="type-item">积分兑换</div>
      <div @click="income_type='level'" :class="{active:income_type === 'level' }" class="type-item">会员升级</div>
    </div>
    <div style="height:5px;background:#eee;"></div>
    <div style="padding:10px;">
      <div v-for="o in list" :key="o.id" style="margin-top:10px;padding: 5px;border-bottom:1px solid #ddd;">

        <div style="display:flex;border-bottom: 1px solid #ddd;padding-bottom:5px;">
          <div style="width:100px;">{{o.type_name}}</div>
          <div style="flex:1">订单号：{{o.order_code}}</div>
        </div>
        <div style="display:flex;padding-bottom:5px;">
          <div style="width:100px;">
            <div style="margin-left:10px;margin-top:5px;">{{o.create_date}}</div>
            <div style="margin-left:10px;margin-top:5px;">{{o.create_day}}</div>
            <div style="margin-left:10px;margin-top:5px;">{{o.create_time}}</div>
          </div>
          <div style="flex:1">
            <template v-if="o.level_order_id">
              <div style="margin-top:5px;">收入金额（元）：{{o.change_value}}</div>
              <div style="margin-top:5px;">{{o.name}}－{{o.lower_name}}<template v-if="o.order_creator_id !== o.lower_id">下级代理</template>升级</div>
              <div style="margin-top:5px;">申请人：{{o.order_name}} {{o.order_mobile | mobieFormat}}</div>
            </template>
            <template v-else>
              <div style="margin-top:5px;">收入金额（元）：{{o.change_value}}</div>
              <div style="margin-top:5px;">{{o.name}}－{{o.comments}}<template v-if="o.lower_id">{{o.lower_name}}推广</template></div>
              <div style="margin-top:5px;">申请人：{{o.order_name}} {{o.order_mobile | mobieFormat}}</div>
            </template>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import moment from 'moment';

export default {
  data() {
    return {
      a_list: [],
      income_type: 'all',
    };
  },
  computed: {
    list() {
      let retList = this.a_list;
      switch (this.income_type) {
        case 'card': retList = _.filter(retList, 'card_order_id'); break;
        case 'loan': retList = _.filter(retList, 'loan_order_id'); break;
        case 'ticket': retList = _.filter(retList, 'ticket_order_id'); break;
        case 'level': retList = _.filter(retList, 'level_order_id'); break;
        default: retList = this.a_list; break;
      }


      retList = _.map(retList, (o) => {
        let type_name = '其他';
        if (o.card_order_id) type_name = '信用卡';
        else if (o.loan_order_id) type_name = '网贷';
        else if (o.ticket_order_id) type_name = '积分兑换';
        else if (o.level_order_id) type_name = '会员升级';
        return {
          ...o,
          type_name,
        };
      });
      return retList;
    },
  },

  async mounted() {
    document.title = '收入明细';

    const list = (await this.$http.get('/api/my/user_balance?order=create_time-&change_value__gt=0')).body;
    this.a_list = _.map(list, o => ({
      ...o,
      create_date: moment(o.create_time).format('MM-DD'),
      create_day: moment(o.create_time).format('dddd'),
      create_time: moment(o.create_time).format('HH:mm'),
    }));
  },
};
</script>

<style scoped lang="less">
.type-list {
  display:flex;
  text-align:center;

  .type-item {
    flex:1;
    padding: 5px;
  }

  .type-item.active {
    background-color: #81a5d6;
    color: #fff;
  }
}
</style>
