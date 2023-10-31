<template>
  <div class="crm-header">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
      <el-menu-item @click="clickIcon"><i style="color: var(--element-blue); font-size: 1.5em;" class="iconfont icon-lu">业务关系管理系统</i></el-menu-item>
      <el-menu-item @click="clickMenu(item)" v-for="(item,index) in navList" :key="index" :index="item.id">{{ item.name }}</el-menu-item>
      <el-menu-item style="float: right;">
        <el-dropdown @command="handleCommand">
          <el-avatar src="https://tse3-mm.cn.bing.net/th/id/OIP-C.ETwzsvP2G1cpKEfNDjvTswAAAA?w=200&h=180&c=7&r=0&o=5&dpr=2&pid=1.7"></el-avatar>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="exit">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-menu-item>
    </el-menu>
  </div>
</template>
<script>
export default {
  data(){
    return{
      activeIndex:'',
      messages:11221,
      navList:[
        {
          id:'1',
          name:'线索',
          path:'/clue'
        },
        {
          id:'2',
          name:'客户',
          path:'/client'
        },
        {
          id:'3',
          name:'商机',
          path:'/opportunity'
        },
        {
          id:'4',
          name:'合同',
          path:'/contract'
        }, 
        {
          id:'5',
          name:'回款',
          path:'/return'
        },
        {
          id:'6',
          name:'产品',
          path:'/product'
        }
      ]
    }
  },
  methods:{
    handleCommand(command) {
      if(command === 'exit'){
        localStorage.removeItem('userJob')
        localStorage.removeItem('token')
        this.$router.push('/login')
      }
    },
    clickIcon(){
      this.$router.push('/client').catch((error)=>{
        error
      })
      window.scrollTo(0, 0);
      this.activeIndex = '2'
    },
    clickMenu(item){
      this.activeIndex = item.id
      this.$router.push(item.path).catch((error)=>{
        error
      })
      window.scrollTo(0, 0);
    }
  },
  created(){
    for(const item of this.navList){
      if(item.path === this.$route.path){
        this.activeIndex = item.id
      }
    }
  }
}
</script>

<style lang="less" scoped>
.crm-header{
  .el-menu{
    font-family: yuanti;
    font-weight: 500;
    .message{
      float: right;
      .item {
        margin-top: 10px;
        margin-right: 40px;
        line-height: 0;
      }
      i{
        font-size: 25px;
        color: var(--element-blue);
      }
    }
  }
}
</style>