<template>
  <div class="login shadow-box">
    <div class="contain">
      <div style="width: 100%;display:flex;flex-direction:row;justify-content:space-around;">
        <img src="@/assets/avatar.jpg" alt="" style="height:40px">
        <span class="title">业务关系管理系统</span>
      </div>
      <el-form class="animate__animated animate__backInDown" ref="form" label-position="left" :rules="rules"  :model="userInfo" label-width="80px">
        <el-form-item label="账号:" prop="userName">
          <el-input @keyup.enter.native="submit" class="account" v-model="userInfo.userName"></el-input>
        </el-form-item>
        <el-form-item label="密码:" prop="userPwd">
          <el-input @keyup.enter.native="submit" class="password" type="password" v-model="userInfo.userPwd"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary"  @click="submit">登录</el-button>
    </div>
  </div>
</template>

<script>
import {userLogin} from '@/api'
export default {
    name:'Login',
    data(){
      return{
        userInfo:{
          userName:'',
          userPwd:'',
        },
        rules:{
            userName: [
              { required: true, message: '请输入账号', trigger: 'blur' },
              { required: true, message: '请输入账号', trigger: 'change' },
            ],
            userPwd: [
              { required: true, message: '请输入密码', trigger: 'blur' },
              { required: true, message: '请输入密码', trigger: 'change' }
            ]
          }
      }
    },
    methods:{
      submit(){
        this.$refs.form.validate((valid) =>{
          if(valid){
            userLogin({userName:this.userInfo.userName,passWord:this.userInfo.userPwd}).then((data)=>{
              localStorage.setItem('token',data.data.token)
              localStorage.setItem('userJob',data.data.userJob)
              if(data.status === 200){
                this.$router.push('/')
                this.$message({
                    type: 'success',
                    message: '登录成功!'
                  });
              }else{
                console.log("账号或密码错误");
              }
            },(erro)=>{
              this.$message({
                    type: 'info',
                    message: '账号或密码错误，登录失败!'
              });
              console.log(erro);
            })
          }
        })
       
      }
    },

}
</script>
<style lang="less" scoped>
.login{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: aliceblue;
  color: var(--fontColor);
  .contain{
    max-height: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    padding: 30px 40px;
    border-radius: 50px;
    background: #e0ecff;
    box-shadow:  21px 21px 41px #afafaf,
                -21px -21px 41px #ffffff;
    .title{
      vertical-align: middle;
      font-size: 24px;
      font-weight: 700;
      color: var(--element-blue);
      margin-bottom: 20px;
    }
    .el-button{
      width: 30%;
      margin-top: 20px;
    }
  }
}
 
</style>