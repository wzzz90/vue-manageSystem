<template>
    <div class="infoshow">
      <h4 class="title">个人信息</h4>
      <el-form ref="infoForm" :model="infoForm" label-width="80px" style="width:50%;">
        <el-form-item label="用户名称">
          <el-input v-model="infoForm.name"></el-input>
        </el-form-item>
        <el-form-item label="授权ID">
          <el-input v-model="infoForm.id" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="用户角色">
          <el-select v-model="infoForm.identity" placeholder="请选择用户角色">
            <el-option label="管理员" value="manager"></el-option>
            <el-option label="普通员工" value="employee"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生成时间">
          <el-date-picker
            v-model="infoForm.date"
            type="datetime"
            :disabled="true"
            placeholder="生成时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="用户头像">
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            accept=".png, .jpg"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="infoForm.avatar" :src="infoForm.avatar" :onerror="errorUserPhoto" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="活动形式">
          <el-input 
              type="textarea" 
              v-model="infoForm.desc" 
              :autosize="{ minRows: 4, maxRows: 8}">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
</template>
<script>
import { Upload } from 'element-ui';
export default {
  name: "infoshow",
  data() {
    return {
      errorUserPhoto: 'this.src="' + require('@/assets/default_avatar.png') + '"',
      infoForm: {
        name: '',
        id: '',
        identity: '',
        desc: '',
        avatar: ''
      }
    };
  },
  components: {
    "el-upload": Upload
  },
  mounted() {
    this.infoForm = this.$store.getters.user
  },
  methods: {
    handleAvatarSuccess(res, file) {
     this.infoForm.avatar = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      
      return isLt2M;
    },
    async save() {
      try {
        const res = await this.$axios.post('/api/users/edit', this.infoForm)
        localStorage.setItem('eleToken', res.token)

        const decode = jwt_decode(res.token)

        this.$store.dispatch('setAuthenticated', !this.isEmpty(decode));
        this.$store.dispatch('setUser', decode);
        this.loadPriviRoles();
      } catch (error) {
        console.log(error)
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
  }
};
</script>

<style>
.infoshow {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 16px;
  
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
