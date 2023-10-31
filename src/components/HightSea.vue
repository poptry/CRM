<template>
  <div>
    <el-button  type="primary" @click="drawClient">
        <i class="iconfont icon-lingqukehu"></i>
        领取客户
    </el-button>
    <el-divider></el-divider>
    <el-table
        v-loading="loading"
        @select="selectTable"
        @select-all="selectAll"
        stripe
        :border="true"
        :data=tableData
        height="400"
        style="width: 100%;">
        <el-table-column
            type="selection">
        </el-table-column>
        <el-table-column
            prop="clientId"
            width="150"
            label="客户ID">
        </el-table-column>
        <el-table-column
            prop="clientName"
            style="color: aqua;"
            :show-overflow-tooltip="true"
            width="150"
            fixed="left"
            label="姓名">
        </el-table-column>
        <el-table-column
            prop="clientPhone"
            width="150"
            label="客户手机">
        </el-table-column>
        <el-table-column
            prop="clientSource"
            width="150"
            label="客户来源">
        </el-table-column>
        <el-table-column
            prop="clientAddr"
            width="150"
            :show-overflow-tooltip="true"
            label="客户地址">
        </el-table-column>
        <el-table-column
            prop="clientProfession"
            width="150"
            label="客户行业">
        </el-table-column>
        <el-table-column
            prop="clientLevel"
            width="150"
            label="客户级别">
        </el-table-column>
        <el-table-column
            prop="clientRemark"
            :show-overflow-tooltip="true"
            width="150"
            label="客户备注">
        </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {pullClients,getHighSeas} from '@/api'
export default {
    // props:['tableSea'],
    data(){
        return{
            loading:false,
            selection:[],
            tableData:[],
            paging:{
                pagesize:8,
                currentPage:1,
            },
        }
    },
    methods:{
        //领取客户
        drawClient(){
            let ids = []
            this.selection.forEach(element=>{
                ids.push(element.clientId)
            })
            if(!ids.length<=0){
                this.loading = true
                pullClients(ids).then(res=>{
                    if(res.status === 200){
                        this.$message({
                            message: '领取成功',
                            type: 'success'
                        });
                        this.loading = false
                        this.drawHightSeas()
                    }
                })
            }else{
                this.$message({
                    message: '领取失败',
                    type: 'info'
                });
            }
            
        },
        //获取公海数据
        async drawHightSeas(){
                await getHighSeas().then(res=>{
                    if(res.status === 200)
                    this.tableData = res.data
                })
            },
        //选择所有
        selectAll(selection){
            this.selection = selection
        },
        //选择条目
        selectTable(selection,row){
            this.selection = selection
        },
    },
    created(){
        this.drawHightSeas()
    }
}
</script>
<style lang="less" scoped>

</style>