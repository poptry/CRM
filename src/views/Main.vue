<template>
    <div class="main">
      <el-container>
        <el-header>
          <CommonHeader></CommonHeader>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
        <el-footer></el-footer>
      </el-container>
    </div>
  </template>
  
  <script>
  import CommonHeader from '@/components/CommonHeader';
  export default {
    name: 'Main',
    components:{
      CommonHeader,
    }
  }
  </script>
  
<style lang="less" scoped>
  .main{
    .el-container{
      ::v-deep .el-header{
        padding:0;
      }
    }
  }
</style>