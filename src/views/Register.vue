<template>
  <div class="register">
    <section class="form_container">
      <div class="manage_tip">
          <span class="title">vue全栈后台管理系统</span>
          <el-form :model="registerUser" :rules="rules" ref="registerForm" label-width="80px" class="registerForm" label-position="right">
            <el-form-item label="用户名" prop="name">
              <el-input v-model="registerUser.name" auto-complete="off" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="registerUser.email" auto-complete="off" placeholder="请输入邮箱"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input type="password" v-model="registerUser.password" auto-complete="off" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="password2">
              <el-input type="password" v-model="registerUser.password2" auto-complete="off" placeholder="请再次输入密码"></el-input>
            </el-form-item>
            <el-form-item label="选择身份" prop="identity">
              <el-select v-model="registerUser.identity" placeholder="请选择身份" style="width:100%">
                <el-option label="管理员" value="manager"></el-option>
                <el-option label="员工" value="employee"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="submit_btn" @click="submitForm('registerForm')">提交</el-button>
            </el-form-item>
            <div class="tiparea">
                <p>已有账号，现在<router-link to='/login'>登录</router-link></p>
            </div>
          </el-form>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'register',
  data () {
    var validatePass2 = (rule, value, callback) => {
      if (value !== this.registerUser.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      registerUser: {
        name: '',
        email: '',
        password: '',
        password2: '',
        identity: 'employee'
      },
      rules: {
        name: [
            { required: true, message: '用户名不能为空', trigger: 'blur' },
            { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        email: [{required: true, type: "email", message: '邮箱格式不正确', trigger: 'blur'}],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { min: 6, max: 30, message: "长度在 6 到 30 个字符", trigger: "blur" }
        ],
        password2: [
          { required: true, message: "确认密码不能为空", trigger: "blur" },
          { min: 6, max: 30, message: "长度在 6 到 30 个字符", trigger: "blur"},
          { validator: validatePass2, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
            let res = await this.$axios.post('/api/users/register', this.registerUser)
            // 注册成功
            this.$message({
              message: "账号注册成功！",
              type: "success",
              center: true,
              customClass: "zZindex"
            });
            this.$router.push("/login");
          } catch (error) {
            console.log(error)
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
  }
}

</script>
<style scoped>
.register {
  position: relative;
  width: 100%;
  height: 100%;
  background: url(../assets/bg.jpg) no-repeat center center;
  background-size: 100% 100%;
}
.form_container {
  width: 370px;
  height: 210px;
  position: absolute;
  top: 10%;
  left: 34%;
  padding: 25px;
  border-radius: 5px;
  text-align: center;
}
.form_container .manage_tip .title {
  font-family: "Microsoft YaHei";
  font-weight: bold;
  font-size: 26px;
  color: #fff;
}
.registerForm {
  margin-top: 20px;
  background-color: #fff;
  padding: 20px 40px 20px 20px;
  border-radius: 5px;
  box-shadow: 0px 5px 10px #cccc;
}

.submit_btn {
  width: 100%;
}
.tiparea {
  text-align: right;
  font-size: 12px;
  color: #333;
}
.tiparea p a {
  color: #409eff;
}
</style>