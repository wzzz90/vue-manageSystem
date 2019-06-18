<template>
  <div class="static-container">
    <h4 class="title">数据统计</h4>
    <el-row class="number-container" type="flex" justify="center">
      <el-col class="number-col">
        总收入：￥{{this.statisData.total.income | currencyFormat}}
      </el-col>
      <el-col class="number-col">
       总支出：￥ {{this.statisData.total.expend | currencyFormat}}
      </el-col>
      <el-col class="number-col">
        总账户现金：￥{{this.statisData.total.cash | currencyFormat}}
      </el-col>
    </el-row>
    <el-row class="switch-pieType">
      当前为 <el-select v-model="year" placeholder="请选择年份" @change="switchyear">
        <el-option
          v-for="item in years"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select> 年
    </el-row>
    <Echart :id="'echartColumn'"
            :style="{width: '100%', height: '380px'}"
            :option="chartOptionC">
    </Echart>
    <el-row class="switch-pieType">
      年内各月份收支类型切换： <el-select v-model="pieTypeVal" placeholder="请选择" @change="switchType">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-row>

    <Echart :id="'echartPie'"
            :style="{width: '100%', height: '380px'}"
            :option="chartOptionP">
    </Echart>
  </div>
</template>

<script>
import Echart from '../components/Echart';

export default {
  name: '',
  data () {
    return {
      chartOptionC: {},
      chartOptionP: {},
      statisData: {},
      incomeData: [],
      expendData: [],
      cashData: [],
      year: 2019,
      pieTypeVal: 'income',
      options: [{
        label: '收入',
        value: 'income'
      },
      {
        label: '支出',
        value: 'expend'
      },
      {
        label: '账户现金',
        value: 'cash'
      }]
    };
  },

  components: {
    Echart
  },

  computed: {
    years() {
      const currentYear = new Date().getFullYear();
      let years = [];
      for (let index = 0; index < 3; index++) {
        years.push({label: `${currentYear-index}年`,value: currentYear-index})
      }
      return years;
    }
  },

  async mounted(){
    await this.loadData(this.year);
    await this.initCharts();
  },

  methods: {
    async loadData(year) {
      this.pieTypeVal = 'income'
      try {
        const res = await this.$axios.get(`/api/profiles/statis?year=${year}`);
        this.statisData = res.data;
      } catch (error) {
        
      }
    },
    initCharts() {
      let statisData = {};
      for (const key in this.statisData) {
        if(key !== 'total') {
          statisData[key] = this.statisData[key]
        }
      }
      
      const sourceData =  Object.keys(statisData).map(key => {
          return {
            amount: key + '月',
            '收入（income）': statisData[key].income || 0,
            '支出（expend）': statisData[key].expend || 0,
            '账户现金（cash）': statisData[key].cash || 0
          }
      })
      
      this.incomeData = Object.keys(statisData).map(key => {
          return {
            name: key + '月',
            value: statisData[key].income
          }
      })
      this.expendData = Object.keys(statisData).map(key => {
          return {
            name: key + '月',
            value: statisData[key].expend
          }
      })
      this.cashData = Object.keys(statisData).map(key => {
          return {
            name: key + '月',
            value: statisData[key].cash
          }
      })

      this.chartOptionC = {
          title: {
            text: '年内各月份收支统计',
             left: 'center'
          },
          legend: {
            top: 30
          },
          tooltip: {},
          dataset: {
              dimensions: ['amount', '收入（income）', '支出（expend）', '账户现金（cash）'],
              source: sourceData
          },
          xAxis: {type: 'category'},
          yAxis: {},
          // Declare several bar series, each will be mapped
          // to a column of dataset.source by default.
          series: [
              {type: 'bar'},
              {type: 'bar'},
              {type: 'bar'}
          ]
      }

      this.chartOptionP = {
        title : {
            text: '年内各月份收入统计',
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
        },
        series : [
            {
                name: '年内各月份收支统计',
                type: 'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data:this.incomeData,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };


    },
    switchType(val) {
      const types = ['incomeData', 'expendData', 'cashData'].filter(item => item.includes(val))
      this.chartOptionP.series[0].data = this[types[0]];

      const arr = [{name: '收入', val: 'income'}, {name: '支出', val: 'expend'}, {name: '账户现金', val: 'cash'}]
      const name = arr.filter( item => item.val == val)[0].name;
      this.chartOptionP.title.text = `年内各月份${name}统计`
    },
   async switchyear(val) {
      await this.loadData(val);
      await this.initCharts();
    }
  }
}

</script>
<style lang='scss' scoped>
.static-container {
  padding: 16px;
  width: 100%;
  height: 100%;
  .number-container {
    margin-top: 20px;
    margin-bottom: 36px;
    .number-col {
      text-align: center;
      font-size: 20px;
    }
  }
  .switch-pieType {
    margin: 20px 0;
  }
}
</style>