<template>
  <div style="background:#efefef;flex:1;">

    <div v-for="o in list" :key="o.id" style="background:#fff;margin-top:1px;padding:10px;">
      <div style="flex:1;margin-left:5px;">
        <div class="ql-editor" v-html="o.content"></div>
        <div style="display:flex;margin-top:5px;">
          <div style="width:2.5rem;">
          </div>
          <div style="flex:1;">
            <div style="display:inline-block;" @click="showDialog(p, o.fileList, index)" :href="p.url" v-for="(p, index) in o.fileList" :key="p.url"><div :style="{backgroundImage:`url('${p.url}')`}" style="width:2rem;height:2rem;display:inline-block;margin:3px;background-size:cover;background-repeat:no-repeat;">
            </div></div>
          </div>
        </div>
        <div style="font-size:0.3rem;text-align:right;margin-top:5px;">下载 {{o.download_count}}</div>
      </div>
    </div>

    <vux-x-dialog v-model="dialogVisible" hide-on-blur="true">
      <swiper ref="swiper" :options="swiperOption" v-if="showList.length">
        <swiper-slide v-for="o in showList" :key="o.id">
          <img :src="o.url" style="width:100%;">
        </swiper-slide>
      </swiper>
    </vux-x-dialog>
  </div>
</template>

<script>
import moment from 'moment';
import _ from 'lodash';
import {
  mapState,
} from 'vuex';

export default {
  data() {
    return {
      swiperOption: {
        autoHeight: true,
      },
      list: [],
      dialogVisible: false,
      showList: [],
    };
  },
  computed: {
    ...mapState({
      info: state => state.info,
    }),
    link() {
      return `${location.origin}/join?referee=${this.info.id}`;
    },
  },
  methods: {
    showDialog(item, list, index) {
      if (this.$refs.swiper) {
        this.$refs.swiper.swiper.slideTo(index);
      } else {
        this.swiperOption = {
          ...this.swiperOption,
          initialSlide: index,
        };
      }

      this.showList = list;
      this.dialogVisible = true;
    },
  },
  async mounted() {
    document.title = '中央文案';
    const list = (await this.$http.get('/api/m/copy_library?order=create_time')).body;
    this.list = _.map(list, o => ({
      ...o,
      create_date: moment.unix(o.create_time).format('M月D日'),
      create_time: moment.unix(o.create_time).format('HH:mm'),
      fileList: _.map((o.file_list ? JSON.parse(o.file_list) : []), x => ({
        name: _.last(x.split('/')),
        url: x,
      })),
    }));
  },
};
</script>

<style scoped lang="less">
</style>
