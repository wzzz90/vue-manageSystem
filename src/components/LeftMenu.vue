<template>
<el-row class="menu_page">
  <el-col>
    <el-menu
      :router="true"
      :default-active="defaultActive"
      class="el-menu-vertical-demo"
      background-color="#324057"
      text-color="#fff"
      active-text-color="#ffd04b"
      @select="handleSelect" >
      <template v-for="item in items">

        <el-menu-item  
          :index="item.path" 
          :key="item.path" 
          :route="{path: item.path}" 
          v-if="!item.meta.hidden && item.meta.dropdown">
          <i :class="'iconfont '+item.meta.icon"></i>
          <span slot="title">{{item.meta.label}}</span>
        </el-menu-item>

        <el-submenu v-if="!item.meta.hidden && !item.meta.dropdown" :index="item.path" :key="item.path">
          <template slot="title">
            <i :class="'iconfont '+item.meta.icon"></i>
            <span slot="title">{{item.meta.label}}</span>
          </template>
            <el-menu-item v-for="citem in item.children" :to="citem.path" :key="citem.path" :route="{path: citem.path}" :index="citem.path" >{{citem.meta.label}}</el-menu-item>
        </el-submenu>
        
      </template>
    </el-menu>
  </el-col>
</el-row>
</template>

<script>
import { routes } from '../router';
export default {
  name: '',
  data () {
    return {
      // items: this.$store.getters.leftMenu
    };
  },

  components: {},

  computed: {
    defaultActive() {
      return this.$store.getters.activeItem;
    },
    items() {
      const items = JSON.parse(JSON.stringify(routes)).filter(item => (item.name !== 'login' && item.name !== 'register' && item.name !== '404' && item.name !== 'noPermission'))

      items.forEach(element => {
        delete element.component
        delete element.redirect
        this.checkPrivilege(element)
        // if(element.children.length == 1 && !!element.children[0].meta.hidden) {
        //   element.meta.hidden = true
        // }
      });
      
      
      console.log(items)
      return items;
    }
  },

  mounted() {

  },

  methods: {
    handleSelect(key, keyPath) {
      this.$store.dispatch('setActiveItem', key)
    },
    checkPrivilege (route) {
      const codes = this.$store.getters.privileges;
      const code = route.meta.code;
      let hasPrivilege = true;
      if(!!code) {
        route.meta.hidden = !(codes.includes(code));
      }
    }
  }
}

</script>
<style scoped>
.menu_page {
  position: fixed;
  top: 71px;
  left: 0;
  min-height: 100%;
  background-color: #324057;
  z-index: 99;
}
.el-menu {
  border: none;
}
.fa-margin {
  margin-right: 5px;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 180px;
  min-height: 400px;
}
.el-menu-vertical-demo {
  width: 35px;
}
.el-submenu .el-menu-item {
  min-width: 180px;
}

.hiddenDropdown,
.hiddenDropname {
  display: none;
}
a {
  text-decoration: none;
}
</style>