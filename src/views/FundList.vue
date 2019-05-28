<template>
<div class="fillcontain">
  <div>
  <el-form
      :inline="true"
      ref="search_data" 
      :model='search_data' >
      <el-form-item label="投标时间筛选:">
          <el-date-picker
              v-model="search_data.startTime"
              type="datetime"
              placeholder="选择开始时间">
          </el-date-picker> --
          <el-date-picker
              v-model="search_data.endTime"
              type="datetime"
              placeholder="选择结束时间"
              :picker-options="endDatePicker">
          </el-date-picker>
      </el-form-item>
      <el-form-item>
          <el-button type="primary" size ="small" icon="search" @click='handelFilter()'>筛选</el-button>
      </el-form-item>
      <el-form-item class="btnRight">
        <el-button type="primary" size ="small" icon="view" @click='handelAdd()'
        v-privilege="'add'">添加</el-button>
      </el-form-item>      
    </el-form>
  </div>
  <div class="table_container">
    <el-table
      v-if="tableData.length > 0"
      :data="tableData"
      style="width: 100%"
      border
      >
      <el-table-column
          type="index"
          label="序号"
          align='center'
          width="70">
      </el-table-column>
      <el-table-column
          prop="date"
          label="创建时间"
          align='center'
          width="250"
          sortable>
          <template slot-scope="scope">
              <el-icon name="time"></el-icon>
              <span style="margin-left: 10px">{{ formateDate(scope.row.date) }}</span>
          </template>
      </el-table-column>
      <el-table-column
          prop="type"
          label="收支类型"
          align='center'
          width="150">
      </el-table-column>
      <el-table-column
          prop="describe"
          label="收支描述"
          align='center'
          width="180">
      </el-table-column>
      <el-table-column
          prop="income"
          label="收入"
          align='center'
          width="170"> 
          <template slot-scope="scope">  
              <span style="color:#00d053">+ {{ scope.row.income }}</span>
          </template>
      </el-table-column>
      <el-table-column
          prop="expend"
          label="支出"
          align='center'
          width="170">
          <template slot-scope="scope">  
              <span style="color:#f56767">- {{ scope.row.expend }}</span>
          </template>
      </el-table-column>
      <el-table-column
          prop="cash"
          label="账户现金"
          align='center'
          width="170">
          <template slot-scope="scope">  
              <span style="color:#4db3ff">{{ scope.row.cash }}</span>
          </template>
      </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          align='center'
          width="220">
      </el-table-column>
      <el-table-column 
        prop="operation"
        align="center"
        fixed="right"
        width="360"
        label="操作">
        <template slot-scope="scope">
          <el-button
            v-privilege="'check'"
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">查看</el-button>
          <el-button
            v-privilege="'edit'"
            type="warning"
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            v-privilege="'delete'"
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row>
      <el-col :span="24">
        <div class="pagination">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pagination.pageIndex"
            :page-sizes="pagination.pageSizes"
            :page-size="pagination.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pagination.total">
          </el-pagination>
        </div>
      </el-col>
    </el-row>
    <Dialog :dialog="dialog" :form="form" @update="getData"></Dialog>
  </div>
</div>
  
</template>

<script>
import Dialog from '../components/Dialog'
import dayjs from 'dayjs';
export default {
  name: 'fundlist',
  data () {
    return {
      pagination: {
        pageIndex: 1,
        pageSizes: [5, 10, 15, 20],
        pageSize: this.$store.getters.pageSize || 5,
        total: 0
      },
      tableData: [],
      allTableData: [],
      filterTableData: [],
      dialog: {
        option: 'add',
        show: false,
        title: '添加资金信息'
      },
      form: {},
      search_data: {
        startTime: "",
        endTime: ""
      },
      endDatePicker:this.processDate()
    };
  },
  components: {
    Dialog
  },

  mounted() {
    console.log(this.$store.getters.pageSize)
    this.getData();
  },

  methods: {
    formateDate(date) {
      return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
    },
    async getData() {
      try {
        const res = await this.$axios.get('/api/profiles');
        this.allTableData = res.data;
        this.filterTableData = res.data;
        this.setPagination();
      } catch (error) {
        
      }
    },
    setPagination() {
      this.pagination.total = this.allTableData.length;
      this.pagination.pageIndex = 1;
      this.pagination.pageSize = this.$store.getters.pageSize || 5;
      this.tableData = this.allTableData.filter((item, index) => index < this.pagination.pageSize)
    },
    handleEdit(index, row) {
       this.dialog = {
        title: '修改资金信息',
        option: 'edit',
        show: true
      }
      this.form = JSON.parse(JSON.stringify(this.tableData[index]));
    },
    handelAdd() {
      this.dialog = {
        option: 'add',
        show: true,
        title: '添加资金信息'
      }
      this.form = {
        type: '',
        describe: '',
        income: '',
        expend: '',
        cash: '',
        remark: ''
      }
    },
    handleDelete(index, row) {
      this.$confirm('此操作将永久删除该条信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await this.$axios.delete(`/api/profiles/delete/${row._id}`)
          this.getData();
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        } catch (error) {
          
        }
      })
    },
    handleSizeChange(pageSize) {
      this.pagination.pageIndex = 1;
      this.pagination.pageSize = pageSize;
      this.tableData = this.allTableData.filter((item, index) => index < pageSize);
      this.$store.dispatch('setPageSize', pageSize)
    },
    handleCurrentChange(page) {
      let allTableArr = JSON.parse(JSON.stringify(this.allTableData))
      let index = this.pagination.pageSize * (page - 1)
      this.tableData = this.allTableData.slice(index, index + this.pagination.pageSize)
    },
    handelFilter() {
      if(!this.search_data.startTime || !this.search_data.endTime) {
        this.$message({
          type: 'warning',
          message: '请选择时间区间'
        })
        //this.getData();
        return;
      }
      
      const stime = this.search_data.startTime.getTime();
      const etime = this.search_data.endTime.getTime();

      this.allTableData = this.filterTableData.filter(item => {
        let time = new Date(item.date).getTime();

        return time >= stime && time <= etime;
      })
       // 分页数据
      this.setPagination();
    },
    processDate(){
      let self = this
      return {
        disabledDate(time){
          if(self.search_data.startTime){
            return new Date(self.search_data.startTime).getTime() > time.getTime()
          }
        }
      }
    }
  }
}

</script>
<style scoped>
.fillcontain {
  width: 100%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}
.btnRight {
  float: right;
}
.pagination {
  text-align: right;
  margin-top: 10px;
}
</style>