<template>
  <div style="padding:10px;display:flex:1;">

    <div style="display:flex;">
      <el-form :inline="true">
        <el-form-item>
          <el-input v-model="search.creator_mobile__like" placeholder="推荐人"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.name__like" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.idno__like" placeholder="身份证号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.mobile__like" placeholder="手机号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="search.status" placeholder="请选择">
            <el-option v-for="o in searchStatusList" :key="o.id" :label="o.name" :value="o.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <div v-loading="loading">
      <el-table :data="list" style="width: 100%;" @sort-change="sortChange" :default-sort="{prop: 'create_time', order: 'descending'}">
        <el-table-column prop="code" label="订单号" width="150"></el-table-column>
        <el-table-column prop="money" label="订单金额" width="100"></el-table-column>
        <el-table-column prop="from_level_name" label="原等级" width="100"></el-table-column>
        <el-table-column prop="to_level_name" label="升级等级" width="100"></el-table-column>
        <el-table-column prop="status_name" label="状态" width="60"></el-table-column>
        <el-table-column prop="create_time" label="创建时间" width="200" sortable="custom"></el-table-column>
        <el-table-column label="推荐人">
          <template slot-scope="{row}">
            <div>{{row.creator_mobile}} <template v-if="row.creator_name"> ( {{row.creator_name}} ) </template></div>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination v-if="total"
        style="margin-top:10px;"
        @size-change="size => search.size = size"
        :current-page.sync="search.current"
        :page-size="search.size"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import moment from 'moment';

export default {
  data() {
    return {
      search: { current: 1, size: 10, status: 2 },
      list: [],
      total: 0,
      loading: false,

      statusList: [
        { id: 1, name: '待支付' },
        { id: 2, name: '已完成' },
      ],
    };
  },
  computed: {
    searchStatusList() {
      return [
        { id: undefined, name: '全部状态' },
        ...this.statusList,
      ];
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

      try {
        const { current, size, ...params } = this.search;
        params.offset = (current - 1) * size;
        params.limit = size;
        const { body, headers } = (await this.$http.get('/api/m/user_level_order', { params }));

        this.list = _.map(body, (o) => {
          const t1 = moment(o.create_time).format('MM-DD HH:mm:ss');
          const t2 = moment(o.create_time).fromNow();
          return {
            ...o,
            create_time: `${t2} ( ${t1} )`,
            status_name: o.status ? (_.find(this.statusList, { id: o.status }) || { name: o.status }).name : o.status,
          };
        });
        this.total = parseInt(headers.get('X-Total-Count'), 10);
      } catch (e) {
        const message = e.bodyText || e.message;
        this.$message.error(message);
      }

      this.loading = false;
    }, 200, { leading: false }),

    sortChange({ order, prop }) {
      this.search = {
        ...this.search,
        order: order ? `${prop}${order === 'ascending' ? '+' : '-'}` : null,
      };
    },
  },
  async mounted() {
    await this.reload();
  },
};
</script>

<style scoped>
</style>
