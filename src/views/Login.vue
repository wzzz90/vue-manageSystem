<template>
  <div class="login">
    <section class="form_container">
      <div class="manage_tip">
          <span class="title">vue全栈后台管理系统</span>
          <el-form :model="loginUser" :rules="rules" ref="loginForm" label-width="60px" class="loginForm" label-position="right">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="loginUser.email" auto-complete="off" placeholder="请输入邮箱"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input type="password" v-model="loginUser.password" auto-complete="off" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="submit_btn" @click="submitForm('loginForm')">提交</el-button>
            </el-form-item>
            <div class="tiparea">
                <p>还没有账号？现在<router-link to='/register'>注册</router-link></p>
            </div>
          </el-form>
      </div>
    </section>
  </div>
</template>

<script>
import jwt_decode from 'jwt-decode';

export default {
  name: 'login',
  data () {
    return {
      loginUser: {
        email: '',
        password: '',
      },
      rules: {
        email: [{required: true, type: "email", message: '邮箱格式不正确', trigger: 'blur'}],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { min: 6, max: 30, message: "长度在 6 到 30 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
            let res = await this.$axios.post('/api/users/login', this.loginUser)
            
            localStorage.setItem('eleToken', res.token)

            const decode = jwt_decode(res.token)

            this.$store.dispatch('setAuthenticated', !this.isEmpty(decode));
            this.$store.dispatch('setUser', decode);
            
            // 登录成功
            this.$message({
              message: "账号登录成功！",
              type: "success",
              center: true,
              customClass: "zZindex"
            });

            const path = this.$store.getters.activeItem || '/index'
            this.$router.push(path);

          } catch (error) {
            console.log(error)
          }
        } else {
          return false;
        }
      });
    },

    isEmpty(value) {
      return (
        value === undefined ||
        value === null ||
        (typeof value === "object" && Object.keys(value).length === 0) ||
        (typeof value === "string" && value.trim().length === 0)
      );
    }
  }
}

</script>

<style scoped>
.login {
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
  top: 20%;
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
.loginForm {
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