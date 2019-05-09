<template>
  <div>

    <router-link tag="div" to="/my_info" style="display:flex;background-color:#82a5d6;padding:20px;color:#fff;align-items:center;">
      <div>
        <img :src="item.head_image || headImage" style="width:48px;height:48px;border-radius:24px;" />
      </div>
      <div style="flex:1;margin-left:10px;">
        <div style="font-size:0.5rem;">{{item.nickname}}</div>
        <div style="font-size:0.3rem;margin-top:5px;">{{item.level_name}}</div>
        <div style="font-size:0.3rem;margin-top:5px;">注册时间：{{ user.create_time ? user.create_time.substr(0, 10) : ''}}</div>
      </div>
    </router-link>

    <div style="display:flex;border-top:5px solid #eee;">
      <div style="flex:2;">
        <div style="display:flex;">
          <router-link tag="div" to="/income" style="flex:1;padding:10px 10px;">
            <div style="font-size:0.6rem;">{{item.sum_income || 0}}</div>
            <div style="font-size:0.3rem;">总收入（元）</div>
          </router-link>
          <router-link tag="div" to="/cash_apply" style="flex:1;padding:10px 10px;display:flex;align-items:center;">
            <span style="border:1px solid #0076ac;color:#0076ac;border-radius:5px;padding:2px 5px;">去提现</span>
          </router-link>
        </div>

        <div style="display:flex;">
          <div style="flex:1;padding:10px 10px;">
            <div style="font-size:0.6rem;">{{item.cash_income || 0}}</div>
            <div style="font-size:0.3rem;">已结算（元）</div>
          </div>
          <div style="flex:1;padding:10px 10px;">
            <div style="font-size:0.6rem;">{{item.balance || 0}}</div>
            <div style="font-size:0.3rem;">可结算（元）</div>
          </div>
        </div>
      </div>
      <router-link tag="div" to="/team" style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;">
        <div style="font-size:0.6rem;">{{item.team_all_count}}</div>
        <div style="font-size:0.3rem;">团队人数(人)</div>
      </router-link>
    </div>
    <div style="display:flex;padding:5px;" v-if="item.invite_card_target">
      <div style="flex;2;padding:5px;">
        <div>主推信用卡剩余 {{ item.invite_card_target - item.invite_card_current}} 张退会员费</div>
        <div style="height:4px;border:1px solid #cb9f61;"><div style="background:#cb9f61;height:100%;" :style="{width:`${item.invite_card_current / item.invite_card_target * 100}%`}"></div></div>
        <div style="display:flex;">
          <div>0</div>
          <div style="flex:1;text-align:center;"></div>
          <div>{{item.invite_card_target}}张</div>
        </div>
      </div>
      <div style="flex:1;border-left:1px solid #ddd;padding:5px;">
        <div>待退还：{{ (item.invite_card_target - item.invite_card_cost) * 10}} 元</div>
        <div>已退还：{{ item.invite_card_cost * 10}} 元 </div>
      </div>
    </div>

    <vux-grid :cols="4" style="border-top:5px solid #eee;">
      <vux-grid-item link="/my_info">
        <img src="../assets/个人信息.png" style="width:64px;height:64px;" />
        <div>个人信息</div>
      </vux-grid-item>
      <vux-grid-item link="/my_bank_card">
        <img src="../assets/结算卡.png" style="width:64px;height:64px;" />
        <div>结算卡</div>
      </vux-grid-item>
      <vux-grid-item link="/team">
        <img src="../assets/团队管理.png" style="width:64px;height:64px;" />
        <div>团队管理</div>
      </vux-grid-item>
      <vux-grid-item link="/level_up">
        <img src="../assets/购买代理.png" style="width:64px;height:64px;" />
        <div>购买代理</div>
      </vux-grid-item>

      <vux-grid-item link="/notice">
        <img src="../assets/通知公告.png" style="width:64px;height:64px;" />
        <div>通知公告</div>
      </vux-grid-item>
      <vux-grid-item link="/about">
        <img src="../assets/关于我们.png" style="width:64px;height:64px;" />
        <div>关于我们</div>
      </vux-grid-item>
      <vux-grid-item link="/my_chief">
        <img src="../assets/我的客服.png" style="width:64px;height:64px;" />
        <div>我的客服</div>
      </vux-grid-item>
      <vux-grid-item @click.native="handleExit">
        <img src="../assets/退出系统.png" style="width:64px;height:64px;" />
        <div>退出系统</div>
      </vux-grid-item>
    </vux-grid>

    <img v-if="bottomImage" :src='bottomImage' style="width:100%;" />

  </div>
</template>

<script>
import {
  mapState,
} from 'vuex';

export default {
  data() {
    return {
      item: {},
    };
  },
  computed: {
    ...mapState({
      merchant: state => state.merchant,
      user: state => ((state.info && state.info.user) ? state.info.user : {}),
      bottomImage: state => state.merchant.extendImage['personal.bottom'],
      headImage: state => state.merchant.extendImage.default_head_image,
    }),
  },
  methods: {
    async handleExit() {
      this.$vux.confirm.show({
        title: '确认退出',
        content: `确定退出${this.merchant.name}吗？`,
        onConfirm: async () => {
          await this.$store.commit('clearToken');
          this.$router.push('/login');
        },
      });
    },
  },
  async mounted() {
    document.title = '个人中心';
    this.item = (await this.$http.get('/api/my/user_team')).body[0];
  },
};
</script>

<style scoped lang="less">

.weui-grid {
  text-decoration: none;
  text-align:center;
  color: #000;
  padding: 10px 5px;
  i {
    font-size: 30px;
  }

  > div {
    margin-top:0;
  }
}
</style>
