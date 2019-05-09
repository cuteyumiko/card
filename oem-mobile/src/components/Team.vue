<template>
  <div>
    <div style="text-align:center;background:#5aa3d7;color:#fff;padding:30px;">
      <div style="font-size:1.5rem;">{{total}}</div>
      <div style="font-size:0.5rem;margin-top:10px;display:flex;align-items:center;justify-content:center;"><i class="iconfont icon-tuandui" style="font-size:0.7rem;margin-right:10px;" /> 团队总人数</div>
    </div>

    <div class="team-list">
      <router-link tag="div" :to="`/team/${o.id}`" class="list-item" v-for="o in levelList" :key="o.id">
        <div style="margin-left:10px;">
          <div style="width:40px;height:40px;background-repeat:no-repeat;background-size:contain;" :style="{backgroundImage:`url('${o.icon}')`}"></div>
        </div>
        <div style="flex:1;margin-left:10px;">{{o.name}} <span style="font-size:0.3rem;">( 直接 {{o.directTotal}} 家, 间接 {{o.indirectTotal}} 家 )</span></div>
        <div style="margin-right:5px;">{{o.directTotal + o.indirectTotal}}</div>
        <div>
          <i class="iconfont icon-enter"></i>
        </div>
      </router-link>
    </div>

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
      levelList: [],
      search: {},
      total: 0,
    };
  },
  computed: {
    ...mapState({
      info: state => state.info,
    }),
  },
  methods: {
  },
  async mounted() {
    document.title = '团队管理';
    let levelList = (await this.$http.get('/api/m/user_level')).body;
    const { directUser, indirectUser } = (await this.$http.get('/api/i')).body;
    this.total = _.sumBy(directUser.level, 'total') + _.sumBy(indirectUser.level, 'total');

    levelList = _(levelList).sortBy(o => o.income_money || -1).reverse()
      .map(o => ({
        ...o,
        is_show: !o.is_hidden || o.id === this.info.user.level_id,
      }))
      .map((o, i, arr) => (i === 0 ? o : {
        ...o,
        is_show: arr[i - 1].is_show || o.is_show,
      }))
      .filter('is_show')
      .value();

    // levelList = _.filter(levelList, o => !o.is_hidden || o.id === this.info.user.level_id);
    this.levelList = _.map(levelList, o => ({
      ...o,
      directTotal: (_.find(directUser.level, { level_id: o.id }) || { total: 0 }).total,
      indirectTotal: (_.find(indirectUser.level, { level_id: o.id }) || { total: 0 }).total,
    }));
  },
};
</script>

<style scoped lang="less">

.team-list {
}

.list-item {
  display:flex;
  padding:5px;
  align-items:center;
  border-bottom: 1px solid #ccc;
}


</style>
