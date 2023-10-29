<template>
    <div class="client-container">
      <common-table></common-table>
    </div>
  </template>
  
  <script>
import {getUserInfo} from '@/api'
import CommonTable from '@/components/CommonTable.vue'
    export default {
  components: { CommonTable },
        data() {
        return {
            tableData: [],
            }
        },
        methods:{

    },
    methods:{
      get(){
              //获取客户数据接口调用
        getUserInfo({params:{token}}).then((data)=>{
          //获取到的客户数据，赋值
          if(data.status === 200){
            this.tableData = data.data
            this.loading = false
          }
        },(err)=>{
          console.log(err);
        })
      }
    },
    created(){
        const token = localStorage.getItem('token')
        getUserInfo({params:{token}}).then((response)=>{
            console.log(response);
            this.tableData = response.data
        })
    }
  }
  </script>
  
  <style lang="less" scoped>
      .client-container{
        .first-row{
          margin-bottom: 20px;
          .el-col{
            .search{
              display: flex;
              justify-content: space-around;
              .el-input{
                width: 60%;
              }
              .el-button{
                width: 30%;
              }
            }
          }
        }
      }
  </style>