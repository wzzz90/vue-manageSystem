<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import jwt_decode from 'jwt-decode';

export default {
  name: 'app',
  created() {
    if(localStorage.eleToken) {
      const decode = jwt_decode(localStorage.eleToken);

      this.$store.dispatch('setAuthenticated', !this.isEmpty(decode));
      this.$store.dispatch('setUser', decode);
      // this.loadPrivileges();
    }
            
  },
  methods: {
    isEmpty(value) {
      return (
        value === undefined ||
        value === null ||
        (typeof value === "object" && Object.keys(value).length === 0) ||
        (typeof value === "string" && value.trim().length === 0)
      );
    },
    async loadPrivileges() {
      let url, response, codes;
      const identity = this.$store.getters.user.identity;

      url = `/api/privileges?identity=${identity}`;

      try {
        response = await this.$axios.get(url);
        codes = response.data.data || [];

        await this.$store.commit('GET_PRIVILEGES', codes)

      } catch (error) {
        codes = []
      }
      
    }
  }
}

</script>

<style>
html,body,#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
body .el-table th.gutter{
  display: table-cell !important;
}
</style>
