<template>
  <div class="echart" :id="id" :style="style"></div>
</template>

<script>

import echarts from '@/utils/echarts'

export default {
  name: 'echart',
  props: {
    id: {
      type: String
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String
    },
    option: {
      type: Object
    }
  },

  data () {
    return {
      MyEcharts: ""
    };
  },

  components: {},

  computed: {
    style() {
      return {
        height: this.height,
        width: this.width
      }
    }
  },
  watch: {
    option: {
      handler(newVal, oldVal) {
        if(this.MyEcharts) {
          console.log(newVal)
          if(newVal) {
            this.MyEcharts.setOption(newVal, true)
          } else {
            this.MyEcharts.setOption(oldVal, true)
          }
        } else {
          this.InitCharts();
        }
      },
      deep: true
    }
  },
  mounted() {
    this.InitCharts();
  },

  methods: {
    InitCharts() {
      this.MyEcharts = echarts.init(document.getElementById(this.id));
      this.MyEcharts.clear();
      this.MyEcharts.setOption(this.option, true); 
    }
  }
}

</script>
<style scoped>

</style>