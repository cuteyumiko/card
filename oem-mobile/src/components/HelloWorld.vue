<template>
  <div>

    <swiper ref="swiper" :options="swiperOption" v-if="noticeImageList.length">
      <swiper-slide v-for="o in noticeImageList" :key="o.id">
        <img :src="o.icon">
      </swiper-slide>
    </swiper>

    <div v-if="noticeTextList.length" style="background-color:#eee;padding:10px 20px;border-radius:100px;margin:10px;display:flex;">
      <i class="iconfont icon-xiaoxi" style="line-height:17px;" />
      <vux-marquee v-if="noticeList.length" style="margin-left:10px;">
        <vux-marquee-item v-for="o in noticeTextList" :key="o.id">
          <router-link tag="div" :to="`/notice/${o.id}`" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">{{o.name}}</router-link>
        </vux-marquee-item>
      </vux-marquee>
    </div>

    <vux-grid :cols="4">
      <vux-grid-item link="/product_card">
        <img src="../assets/办信用卡.png" style="width:48px;height:48px;" />
        <div>办信用卡</div>
      </vux-grid-item>
      <vux-grid-item link="/product_loan">
        <img src="../assets/申请贷款.png" style="width:48px;height:48px;" />
        <div>申请贷款</div>
      </vux-grid-item>
      <vux-grid-item link="/product_ticket">
        <img src="../assets/积分兑换.png" style="width:48px;height:48px;" />
        <div>积分兑换</div>
      </vux-grid-item>
      <vux-grid-item link="/product_card_apply?code=huayou.88">
        <img src="../assets/花友商城.png" style="width:48px;height:48px;" />
        <div>88折加油</div>
      </vux-grid-item>
      <vux-grid-item link="/level_up">
        <img src="../assets/升级加薪.png" style="width:48px;height:48px;" />
        <div>升级加薪</div>
      </vux-grid-item>
      <vux-grid-item link="/income">
        <img src="../assets/我的收益.png" style="width:48px;height:48px;" />
        <div>我的收益</div>
      </vux-grid-item>
      <vux-grid-item link="/record">
        <img src="../assets/申请记录.png" style="width:48px;height:48px;" />
        <div>申请记录</div>
      </vux-grid-item>
      <vux-grid-item link="/course">
        <img src="../assets/金融学院.png" style="width:48px;height:48px;" />
        <div>Hello学院</div>
      </vux-grid-item>
      <vux-grid-item link="/tutorial" >
        <img src="../assets/推广培训.png" style="width:48px;height:48px;" />
        <div>推广培训</div>
      </vux-grid-item>
      <vux-grid-item link="/share">
        <img src="../assets/我要推广.png" style="width:48px;height:48px;" />
        <div>我要推广</div>
      </vux-grid-item>
      <vux-grid-item link="/ranking">
        <img src="../assets/排行榜.png" style="width:48px;height:48px;" />
        <div>排行榜</div>
      </vux-grid-item>
      <vux-grid-item link="/personal">
        <img src="../assets/个人中心.png" style="width:48px;height:48px;" />
        <div>个人中心</div>
      </vux-grid-item>
    </vux-grid>

    <div style="border-bottom:1px solid #ddd;padding-bottom:5px;margin:10px;">
      <div style="border-left: 8px solid #ddd;padding-left:4px;">
        新品推荐
      </div>
    </div>

    <div style="display:flex;align-items:center;border-bottom:1px solid #eee;padding: 5px;" v-for="o in homeCardTopList" :key="o.id">
      <div>
        <img :src="o.icon" style="width:48px;height:48px;" />
      </div>
      <div style="flex:1; margin-left:5px;">
        <div>{{o.name}}</div>
        <div style="display:flex;font-size:0.3rem;margin-top:1px;color:#888;">
          <div style="width:2rem;">{{ o.description ? o.description.split('\n')[0] : ''}}</div>
          <div style="flex:1;margin-left:5px;">{{o.got_count}}人已申请</div>
        </div>
        <div style="display:flex;font-size:0.3rem;color:#888;">
          <div style="width:2rem;">{{o.description ? o.description.split('\n')[1] : ''}}</div>
          <div v-if="o.is_recommend" style="flex:1;margin-left:5px;">佣金最高 <span style="color:red;">{{o.max_level_money}}元</span></div>
        </div>
      </div>
      <div style="display:flex;align-items:center;font-size:0.4rem;">
        <div>
          <router-link v-if="o.is_recommend" style="color:red;padding:10px 5px;display:inline-block;border-radius:3px;" tag="div" :to="`product_card_qr?id=${o.id}`">邀请注册</router-link>
          <router-link style="padding:10px 5px;display:inline-block;border-radius:3px;" tag="div" :to="`product_card_apply?id=${o.id}`">立即申请</router-link>
        </div>
      </div>
    </div>

    <div>
      <router-link tag="div" :to="`product_card_apply?id=${o.id}`" style="display:inline-block;border-bottom:1px solid #eee;width:49%;" v-for="o in homeCardList" :key="o.id">
        <div style="display:flex;align-items:center;padding:5px;">
          <div>
            <img :src="o.icon" style="width:48px;height:48px;" />
          </div>
          <div style="flex:1;margin-left:5px;">
            <div>{{o.name}}</div>
            <div style="font-size:0.3rem;margin-top:3px;color:#888;">
              <div>{{o.description.split('\n')[0]}}</div>
              <div v-if="o.is_recommend">佣金最高 <span style="color:red;">{{o.max_level_money}}元/张</span></div>
            </div>
          </div>
        </div>
      </router-link>

      <router-link tag="div" :to="`product_loan_apply?id=${o.id}`" style="display:inline-block;border-bottom:1px solid #eee;width:49%;" v-for="o in homeLoanList" :key="o.id">
        <div style="display:flex;align-items:center;padding:5px;">
          <div>
            <img :src="o.icon" style="width:48px;height:48px;" />
          </div>
          <div style="flex:1;margin-left:5px;">
            <div>{{o.name}}</div>
            <div style="font-size:0.3rem;margin-top:1px;color:#888;">
              <div>额度:{{o.quota}}</div>
              <div v-if="o.is_recommend">佣金最高 <span style="color:red;">{{o.max_level_money}} {{o.money_unit}}</span></div>
            </div>
          </div>
        </div>
      </router-link>
    </div>


    <!-- <div style="text-align:center;">
      <div style="margin-top: 10px;">{{merchant.company_name}}</div>
      <div style="margin-top: 10px;">{{merchant.company_telephone}}</div>
    </div> -->
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
      swiperOption: {
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        autoplay: {
          delay: 2500,
          disableOnInteraction: false,
        },
        loop: true,
      },
      noticeList: [],
      homeCardList: [],
      homeLoanList: [],
      homeCardTopList: [],
    };
  },
  computed: {
    ...mapState({
      merchant: state => state.merchant,
    }),

    noticeImageList() {
      return _.filter(this.noticeList, o => o.type_code === 'image-swiper');
    },
    noticeTextList() {
      return _.filter(this.noticeList, o => o.type_code === 'text-marquee');
    },
  },
  async mounted() {
    document.title = this.merchant.name;
    this.noticeList = (await this.$http.get('/api/m/merchant_notice')).body;
    this.homeCardList = (await this.$http.get('/api/m/product_card?is_enabled=1&type_code__like=[home]&order=sort')).body;
    this.homeLoanList = (await this.$http.get('/api/m/product_loan?is_enabled=1&type_code__like=[home]&order=sort')).body;
    this.homeCardTopList = (await this.$http.get('/api/m/product_card?is_enabled=1&type_code__like=[home.top]&order=sort')).body;
  },
};
</script>

<style scoped lang="less">
.swiper-slide {
  img {
    width: 100%;
  }
}

.weui-grid {
  text-decoration: none;
  text-align:center;
  color: #000;
  padding: 10px 5px;
  i {
    font-size: 30px;
  }

  > div {
    margin-top:5px;
  }
}

.weui-grid:before {
  border: 0;
}

.weui-grid:after {
  border-bottom: 0;
}
</style>
