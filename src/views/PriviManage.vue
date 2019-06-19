<template>
  <div class="privilege-manage">
    <h4 class="title">权限设置</h4>
    <el-form
      :inline="true"
      ref="priviAddForm" 
      :model='addData'>
      <el-form-item label="添加权限:">
        <el-col :span="5">
          <el-input v-model="addData.label" placeholder="请输入权限label"></el-input>
        </el-col>
        <el-col :span="1">&nbsp;</el-col>
        <el-col :span="5">
          <el-input v-model="addData.code" placeholder="请输入权限code"></el-input>
        </el-col>
        <el-col :span="1">&nbsp;</el-col>
        <el-col :span="5">
          <el-select v-model="addData.subordinate" placeholder="请选择权限归属" style="width:100%">
            <el-option label="全部" value="all"></el-option>
            <el-option label="管理员" value="manager"></el-option>
          </el-select>
        </el-col>
        <el-col :span="1">&nbsp;</el-col>
        <el-col :span="5">
          <el-select v-model="addData.parent" placeholder="请选择父级" style="width:100%">
            <el-option v-for="(item, index) in leftMenu" :key="index" :label="item.name" :value="item.path"></el-option>
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item class="btnRight">
        <el-button type="primary" icon="view" @click='handelAdd()'
        v-privilege="'privilege-add'">添加</el-button>
      </el-form-item>      
    </el-form>
    <el-tree
      :data="treeData2"
      show-checkbox
      node-key="_id"
      ref="tree"
      :default-expanded-keys="checkedKey"
      :props="defaultProps"
      :render-content="renderContent">
    </el-tree>
  </div>
</template>

<script>

import { Tree } from "element-ui";

  export default {
    data() {
      return {
        addData: {
          label: '',
          code: '',
          subordinate: 'all',
          parent: ''
        },
        treeData2: [],
        idCount: 1,
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },
    components: {
      "el-tree": Tree
    },
    computed: {
      leftMenu() {
        return this.$store.getters.leftMenu;
      },
      checkedKey() {
        let arr = []
        const privilegeArr = this.$store.getters.privileges;

        if(this.treeData2.length > 0) {
          this.treeData2.forEach(item => {
            privilegeArr.forEach(ele => {
              if(item.code == ele.split('-')[0]) {
                if(item.children.length > 0) {
                  item.children.forEach( itemc => {
                    if(itemc.code == ele) {
                      arr.push(itemc._id)
                    }
                  })
                }
              }
            })
            
          })
        }

        this.$nextTick(() => {
          this.$refs.tree.setCheckedKeys(arr);
        })

        return arr;
      }
    },
    mounted() {
      this.loadPrivileges();
    },
    methods: {
      async loadPrivileges() {
        try {
          this.treeData2 = [];
          const url = `/api/privileges`;
        
          const res = await this.$axios.get(url)
          this.loadPriviRoles()
          const privData = res.data;
          
          if(privData.length) {
            this.formate(privData)
          }
        } catch (error) {
          
        }
      },

      async loadPriviRoles() {
        const identity = this.$store.getters.user.identity;

        try {
          const response = await this.$axios.get(`/api/privileges/role?identity=${identity}`);
          let codes = response.data || [];

          await this.$store.commit('GET_PRIVILEGES', codes);

        } catch(err) {
          console.log(err)
        }
      },

      async remove(node, data) {
        const label = `${node.parent.label}-${data.label}`;
        const id = data._id;

        try {
          const res = await this.$axios.delete(`/api/privileges/delete/${id}`)
          this.loadPrivileges();
          this.$message( {
            message: res.msg,
            customClass: "zZindex"
          })
        } catch (error) {
          console.log(error)
        }
      },

      renderContent(h, { node, data, store }) {
        return (
          <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
            <span>
              <span>{node.label}</span>
            </span>
            <span>
              <el-button style="font-size: 12px;" type="text" on-click={ () => this.remove(node, data) }>删除权限</el-button>
            </span>
          </span>);
      },
      formate(privData) {
        if(Array.isArray(privData)) {
          privData.forEach(item => {
            if(!item.parent) {
              item.children = [];
              this.treeData2.push(item);
            }
          })
          
          privData.forEach( item => {
            if(item.parent) {
              this.formate(item)
            }
          })
        } else {
          this.treeData2.forEach(item => {
            const parentCode = privData.code.split('-')[0];
            
            if(parentCode == item.code) {
              item.children.push(privData)
            }
          })
        }
        
      },
      async handelAdd() {
        const isEmity = Object.keys(this.addData).filter( key => !this.addData[key] && key != 'parent')
        console.log(isEmity)
        if(isEmity.length > 0) {
          this.$message('权限code或者权限label不能为空');
          return;
        }

        try {
          const params = JSON.parse(JSON.stringify(this.addData))
          const res = await this.$axios.post('/api/privileges/add', params);
          this.loadPrivileges();
          this.$message( {
            message: res.msg,
            customClass: "zZindex"
          })
        } catch (error) {
          console.log(error)
          this.$message( {
            type: "error",
            message: error,
            customClass: "zZindex"
          })
        }
      }
    },
  };
</script>
<style lang='scss' scoped>
.privilege-manage {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 16px;
}
</style>