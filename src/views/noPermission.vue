<template>
  <div class="no-permission">
    <a @click="goBack">返回上一页</a>
    您没有访问权限，请与管理员联系
  </div>
</template>

<script>
export default {
  name: 'noPermission',
  data () {
    return {
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    }
  }
}

</script>
<style lang='scss' scoped>

</style>