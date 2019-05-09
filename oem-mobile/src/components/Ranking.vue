<template>
  <div>
    <div style="display:flex;background-color:#82a5d6;padding:20px;color:#fff;align-items:center;">
      <div>
        <img :src="info.user.head_image || headImage" style="width:48px;height:48px;border-radius:24px;" />
      </div>
      <div style="flex:1;margin-left:10px;">
        <div style="font-size:0.5rem;">{{info.user.nickname}}</div>
        <div style="font-size:0.3rem;margin-top:5px;">{{info.user.level_name}}</div>
        <div style="font-size:0.3rem;margin-top:5px;">{{info.user.mobile}}</div>
      </div>
      <div style="min-width:60px;text-align:center;">
        <div style="font-size:0.6rem;">{{info.user.view_sum_income || 0}}</div>
        <div style="margin-top:5px;">总收益</div>
      </div>
      <div style="min-width:60px;text-align:center;">
        <div style="font-size:0.6rem;">{{idx + 1}}</div>
        <div style="margin-top:5px;">当前排名</div>
      </div>
    </div>

    <div style="margin:10px;">
      <div v-for="(o,i) in list" :key="o.id" style="display:flex;border-bottom: 1px solid #d5d5d5;padding:10px;align-items:center;">
        <div style="width:30px;">
          <div :style="{backgroundColor: iconColor(i)}" style="width:24px;height:24px;border-radius:12px;display:flex;align-items:center;justify-content:center;color:#fff;">{{i+1}}</div>
        </div>
        <div>
          <img :src="o.head_image || headImage" style="width:48px;height:48px;border-radius:24px;" />
        </div>
        <div style="flex:1;margin-left:10px;">
          <div style="font-size:0.5rem;">{{o.nickname}}<span style="font-size:0.3rem;margin-left:2px;">{{o.level_name}}</span></div>
          <div style="font-size:0.3rem;margin-top:5px;">团队人数：{{o.team_all_count + o.add_team_count}}</div>
        </div>
        <div style="font-size:0.4rem;">{{o.view_sum_income || 0}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  mapState,
} from 'vuex';

export default {
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
      list: [],
      idx: 0,
    };
  },
  computed: {
    ...mapState({
      info: state => state.info,
      headImage: state => state.merchant.extendImage.default_head_image,
    }),
  },
  methods: {
    iconColor(i) {
      if (i === 0) return '#d15354';
      else if (i === 1) return '#d2c280';
      else if (i === 2) return '#8494d1';

      return '#e1ba9a';
    },
  },
  async mounted() {
    document.title = '排行榜';

    this.list = (await this.$http.get('/api/m/user_team?order=view_sum_income&limit=10')).body;
    const { headers } = await this.$http.get(`/api/m/user_team?limit=0&view_sum_income__gt=${this.info.user.view_sum_income}`);
    this.idx = parseInt(headers.get('X-Total-Count'), 10);
  },
};
</script>

<style scoped lang="less">
</style>
