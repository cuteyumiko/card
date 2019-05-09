<template>
  <div>
    <div style="height:5px;background:#eee;"></div>

    <div style="background:#eee;">
      <div @click="showDialog(o)" v-for="o in list" :key="o.id" style="margin-top:10px;background:#fff;padding:10px;">
        <div style="border-bottom: 1px solid #ddd;padding-bottom:5px;">订单号：{{o.code}}</div>
        <div style="display:flex;margin-top:10px;">
          <div style="flex:1;">提现</div>
          <div style="flex:1;">{{o.money}}</div>
          <div style="flex:1;" :style="{color:o.status == 3 ? '#ff0507' : '#ffa300'}">{{o.status_name}}</div>

        </div>
        <div style="display:flex;margin-top:10px;">
          <div style="flex:2;">打款时间：{{o.close_time}}</div>
          <div style="flex:1;"></div>
        </div>
      </div>

    </div>

    <div v-transfer-dom>
      <vux-x-dialog v-model="dialogVisible" hide-on-blur="true">
        <img src="../../assets/cash_failure.jpg" style="width:100%" />
      </vux-x-dialog>
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

      statusList: [
        { id: 1, name: '待处理' },
        { id: 2, name: '打款成功' },
        { id: 3, name: '打款失败,已撤销' },
        { id: 4, name: '打款处理中' },
      ],

      dialogVisible: false,
    };
  },
  computed: {
    list() {
      let retList = this.a_list;
      retList = _.map(retList, o => ({
        ...o,
        status_name: (_.find(this.statusList, { id: o.status }) || { name: o.status }).name,
      }));
      return retList;
    },
  },
  methods: {
    showDialog(item) {
      if (item.status === 3) {
        this.dialogVisible = true;
      }
    },
  },
  async mounted() {
    document.title = '提现明细';

    const list = (await this.$http.get('/api/my/cash_order?order=create_time-')).body;
    this.a_list = _.map(list, o => ({
      ...o,
      close_time: o.close_time ? moment(o.close_time).format('YYYY-MM-DD HH:mm:ss') : '-',
      create_time: moment.unix(o.create_time).format('YYYY-MM-DD HH:mm:ss'),
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
