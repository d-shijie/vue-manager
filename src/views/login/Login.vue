<template>
  <div class="login">
    <div class="login-box">
      <div class="avatar"><img src="../../assets/img/img.png" alt=""></div>
      <el-form :model="loginForm" :rules="loginRules" ref="ruleForm" label-width="100px" >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data(){
    return {
      loginForm:{
        username:"",
        password:""
      },
      loginRules:{
        username:[{required:true,message:"请输入用户名",trigger:"blur"},
          {min:3,max:10,message: "用户名长度在3-10个字符之间",trigger: "blur"}],
        password:[{required:true,message:"请输入密码",trigger:"blur"},
          {min:6,max:15,message: "密码长度在6-15个字符之间",trigger: "blur"}]
      }
    }
  },
  methods:{
    reset(){
      this.$refs.ruleForm.resetFields()
    },
    login(){
      this.$refs.ruleForm.validate(valid=>{
        if(valid===true){
          this.$http.post("login",this.loginForm).then(res=>{
            this.$message.success("登录成功")
            window.sessionStorage.setItem("token",res.data.data.token)
            this.$router.push("/home")
          }).catch(err=>{
            this.$message.error("登陆失败")
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.login {
  height: 100%;
  background:-webkit-linear-gradient(top, #ababcd,white);
}
.login-box {
  width: 450px;
  height: 300px;
  position: absolute;
  top:50%;
  left: 50%;
  border-radius: 10px;
  transform: translate(-50%,-50%);
  background-color: #fff;
}
.avatar {
  width: 100px;
  position: absolute;
  top:-50px;
  left: 50%;
  background-color: #fff;
  transform: translateX(-50%);
  border: 1px solid #eeeeee;
  border-radius: 50%;
  height: 100px;
}
.avatar img {
  width: 100%;
  box-sizing: border-box;
  border-radius: 50%;
  padding: 5px;
}
.el-form {
  margin-top: 70px;
  padding: 0 20px 0 0;
}
</style>
