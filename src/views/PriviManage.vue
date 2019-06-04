<template>
  <div>
    <el-tree
    :data="treeData2"
    show-checkbox
    node-key="id"
    :default-expanded-keys="[2, 3]"
    :default-checked-keys="[5]"
    :props="defaultProps">
  </el-tree>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        treeData2: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },
    computed: {
    },
    mounted() {
      this.loadPrivileges()
    },
    methods: {
      loadPrivileges() {
        const identity = this.$store.getters.user.identity;

          const url = `/api/privileges?identity=${identity}`;
          
          this.$axios.get(url).then(res => {
            const privData = res.data;
            if(privData.length) {
              this.formate(privData)
            }
          })
      },

      formate(privData) {
        if(Array.isArray(privData)) {
          privData.forEach( item => {
            if(item.parent) {
              this.formate(item)
            } else {
              item.children = [];
              this.treeData2.push(item)
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
        
      }
    },
  };
</script>
<style lang='scss' scoped>
</style>