<template>
  <div>

    <div class="status-list">
      <div class="list-item" :class="{active: status === 0 }" @click="status = 0">全部</div>
      <div class="list-item" :class="{active: status === 2 }" @click="status = 2">已认证</div>
      <div class="list-item" :class="{active: status === 1 }" @click="status = 1">未完善</div>
    </div>
    <template v-if="!loading">

    <div class="tab-swiper vux-center" v-for="o in list" :key="o.id" style="display:flex;padding:10px;margin:5px;background:#f5f6f7;border-radius:5px;align-items:center;">

      <div style="width:64px">
        <img :src="o.creator_head_image || headImage" style="width:48px;height:48px;border-radius:24px;" />
      </div>
      <div style="flex:1;">
        <div>{{o.name}} <span style="font-size:0.3rem;">{{o.mobile}}</span></div>
        <div style="margin-top:3px;">{{o.level_name}} {{o.status_name}}</div>
        <div style="margin-top:3px;">加入时间：{{o.create_time | dateFormat('YYYY-MM-DD')}}</div>
      </div>
      <div style="text-align:center;">
        <div>{{o.referee_count}}</div>
        <div>代理数量</div>
      </div>
      <div style="text-align:center;margin-left:5px;">
        <div>{{o.sum_income || 0}}</div>
        <div>总收益</div>
      </div>
    </div>
    </template>
    <template v-else>
      <div style="text-align:center;">
        加载中 <vux-inline-loading></vux-inline-loading>
      </div>
    </template>

  </div>
</template>

<script>
import _ from 'lodash';
import {
  mapState,
} from 'vuex';

export default {
  data() {
    return {
      loading: false,
      status: 0,
      a_list: [],

      statusList: [
        { id: 1, name: '未完善' },
        { id: 2, name: '已认证' },
        { id: 3, name: '未通过' },
      ],
    };
  },
  computed: {
    ...mapState({
      headImage: state => state.merchant.extendImage.default_head_image,
    }),
    list() {
      if (!this.status) return this.a_list;
      return _.filter(this.a_list, { status: this.status });
    },
  },
  async mounted() {
    document.title = '团队管理';
    const { level_id } = this.$route.params;
    this.loading = true;

    const list = (await this.$http.get('/api/my/team_user', {
      params: {
        referee_value: 0,
        level_id,
        order: 'sum_income',
      },
    })).body;
    this.loading = false;
    this.a_list = _.map(list, o => ({
      ...o,
      status_name: o.status ? (_.find(this.statusList, { id: o.status }) || { name: o.status || '未完善' }).name : o.status,
    }));
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
