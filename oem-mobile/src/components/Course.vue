<template>
  <div>
    <div style="border-bottom:1px solid #ddd;padding-bottom:5px;margin:10px;margin-bottom:0;">
      <div style="border-left: 8px solid #ddd;padding-left:4px;">
        精华区
      </div>
    </div>

    <swiper ref="swiper" :options="swiperOption" v-if="lunboList.length">
      <swiper-slide v-for="o in lunboList" :key="o.id">
        <router-link style="position:relative;margin:5px;" tag="div" :to="`/course_detial?id=${o.id}&referee=${referee_id}`">
          <img :src="o.icon" style="width:100%;height:3rem;" />
          <div style="padding: 2px 5px;background:rgba(125,125,125,0.625); color:#fff;position:absolute;bottom:0;left:0;right:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">{{o.name}}</div>
        </router-link>
      </swiper-slide>
    </swiper>

    <div style="padding:10px;">
      <vux-x-input v-model="search.name__like" placeholder="请输入关键字" style="background-color:#eee;border-radius:5px;">
        <i slot="label" class="iconfont icon-search" style="margin-right:10px;" />
      </vux-x-input>
    </div>

    <div style="display:flex;">
      <div @click="search.type_code = 'kouzi'" :class="{active: search.type_code === 'kouzi' }" class="type-item">
        <div style="display:flex;">
          <!-- <div style="width:18px;height:18px;"></div> -->
          <div>最新口子</div>
        </div>
      </div>
      <div @click="search.type_code = 'jishu'" :class="{active: search.type_code === 'jishu' }" class="type-item">
        <div style="display:flex;">
          <!-- <div style="width:18px;height:18px;"></div> -->
          <div>提额技术</div>
        </div>
      </div>
    </div>

    <div>
      <router-link style="display:flex;border-top:1px solid #eee;padding: 15px;" v-for="o in list" tag="div" :to="`/course_detial?id=${o.id}&referee=${referee_id}`" :key="o.id">
        <div style="width:60px;height:60px;background-size:contain;background-repeat:no-repeat;background-position:center;" :style="{backgroundImage:`url('${o.icon}')`}"></div>
        <div style="flex:1;margin-left:5px;">
          <div style="overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;">{{o.name}}</div>
          <div style="font-size:0.3rem;margin-top:3px;color:#888;">
            VIP用户可见
            <div style="float:right;"><i class="iconfont icon-eye" style="font-size:0.3rem;" /> {{o.view_count}}</div>
          </div>
        </div>
      </router-link>
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
      swiperOption: {
        slidesPerView: 2,
        autoplay: {
          delay: 1500,
          disableOnInteraction: false,
        },
        loop: true,
      },
      noticeList: [],

      search: { type_code: 'kouzi' },
      loading: false,

      lunboList: [],

      list: [],
      typeList: [],
      currentTypeId: null,
    };
  },
  computed: {
    ...mapState({
      info: state => state.info,
    }),
    referee_id() {
      return this.info.id;
    },
  },
  watch: {
    search: {
      async handler() {
        await this.reload();
      },
      deep: true,
    },
  },
  methods: {
    reload: _.throttle(async function _reload() {
      this.loading = true;

      const list = (await this.$http.get('/api/m/course', { params: { order: 'create_time', ...this.search } })).body;
      this.list = _.map(list, o => ({ ...o, create_time: moment.unix(o.create_time).format('YYYY-MM-DD HH:mm:ss') }));

      this.loading = false;
    }, 200, { leading: false }),
  },

  async mounted() {
    document.title = 'Hello学院';

    this.lunboList = (await this.$http.get('/api/m/course?type_code=lunbo')).body;

    this.reload();
  },
};
</script>

<style scoped lang="less">
.swiper-slide {
  img {
    width: 100%;
  }
}

.type-item {
  flex:1;
  display:flex;
  align-items:center;
  justify-content:center;

  > div {
    padding: 10px;
  }
}

.type-item.active {
  > div {
    border-bottom: 1px solid #000;
  }
}
</style>
