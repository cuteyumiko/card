<template>
  <div style="display:flex;flex-direction:column;height:100%;">

    <div style="background:#05002a;height:64px;display:flex;align-items:center;padding:0 10px;">
      <div style="flex:1;color:#fff;font-size:24px;">{{merchant.name}}后台管理系统</div>
      <el-dropdown @command="command => this[command]()">
        <span class="el-dropdown-link" style="cursor:pointer;color:#fff;">
          {{ tokenInfo.display_name }} <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="showPasswordForm">密码修改</el-dropdown-item>
          <el-dropdown-item command="handleLogout">退出系统</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div style="display:flex;flex:1;">
      <div style="width:250px;">
        <el-menu :router="true" unique-opened>
          <template v-for="(o, i) in menuTree">
            <el-submenu v-if="o.children" :key="i" :index="`${i}`">
              <template slot="title">
                <i :class="o.icon"></i>
                <span>{{o.name}}</span>
              </template>
              <el-menu-item v-for="(p, j) in o.children" :key="j" :index="p.path">{{p.name}}</el-menu-item>
            </el-submenu>
            <el-menu-item v-else :key="i" :index="o.path">
              <template slot="title">
                <i :class="o.icon"></i>
                <span>{{o.name}}</span>
              </template>
            </el-menu-item>
          </template>
        </el-menu>
      </div>
      <router-view style="flex:1;" :style="{minHeight}" />
    </div>

    <el-dialog title="密码修改" :visible.sync="passwordFormVisible" :close-on-click-modal="false" width="400px">
      <el-form class="edit-form" :model="passwordForm" ref="passwordForm">
        <el-form-item prop="old_password" :rules="[{required:true, message:'请输入旧密码'}]" label="旧密码">
          <el-input type="password" v-model="passwordForm.old_password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="new_password" :rules="[{required:true, message:'请输入新密码'}]" label="新密码">
          <el-input type="password" v-model="passwordForm.new_password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="confirm_password" :rules="[{required:true, message:'请再次新密码'}]" label="确认新密码">
          <el-input type="password" v-model="passwordForm.confirm_password" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="passwordFormVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmPasswordForm">提交修改</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  mapState,
} from 'vuex';

const menuTree = [
  { name: '首页',
    icon: 'lt lt-diandongche',
    path: '/',
  },
  { name: '用户管理',
    icon: 'lt lt-diandongche',
    path: '/user',
  },
  { name: '平台公告',
    icon: 'lt lt-diandongche',
    path: '/notice',
  },
  { name: '订单管理',
    icon: 'lt lt-iconset0250',
    children: [
      { name: '信用卡', path: '/product_card_order', resCode: 'user_manager' },
      { name: '贷款', path: '/product_loan_order', resCode: 'role_manager' },
      { name: '积分兑换', path: '/product_ticket_order', resCode: 'role_manager' },
      { name: '会员升级', path: '/user_level_order', resCode: 'role_manager' },
      { name: '提现申请', path: '/cash_order', resCode: 'role_manager' },
    ],
  },
];

export default {
  data() {
    return {
      minHeight: '0',
      passwordFormVisible: false,
      passwordForm: {},
    };
  },
  computed: {
    ...mapState({
      tokenInfo: state => state.info,
      merchant: state => state.merchant,
    }),

    menuTree() {
      return menuTree;
    },
  },
  methods: {
    async handleLogout() {
      await this.$store.commit('clearToken');
      this.$router.replace('/login');
    },

    showPasswordForm() {
      const $form = this.$refs.passwordForm;
      if ($form) $form.resetFields();

      this.passwordForm = {};
      this.passwordFormVisible = true;
    },
    async confirmPasswordForm() {
      try {
        const $form = this.$refs.passwordForm;
        await $form.validate();
        const { old_password, new_password, confirm_password } = this.passwordForm;

        if (new_password !== confirm_password) throw new Error('新密码两次输入不一致');
        const form = { old_password, new_password };

        await this.$http.post('/api/i/password', form);
        this.$message.success('修改密码成功');
        this.passwordFormVisible = false;
      } catch (e) {
        const message = e.bodyText || e.message;
        this.$message.error(message);
      }
    },
  },
  mounted() {
    this.minHeight = `${document.documentElement.clientHeight - 64}px`;
  },
};
</script>

<style scoped>
>>> .el-menu {
  height: 100%;
  background: #1c2166;
  border-right: 0;
}

>>> .el-menu .el-submenu .el-submenu__title,
>>> .el-menu .el-submenu .el-submenu__title i,
>>> .el-menu .el-menu-item {
  color: #fff;
}

>>> .el-menu .el-submenu .el-submenu__title:hover,
>>> .el-menu .el-submenu .el-submenu__title:hover i,
>>> .el-menu .el-menu-item:hover,
>>> .el-menu .el-menu-item.is-active {
  background: #1a0d53;
  color: #4ba4f3;
}
</style>
