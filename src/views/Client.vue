<template>
  <div class="client-container">
    <!-- 首行 菜单 -->
    <el-row class="first-row">
      <el-col :span="12">
        <div>
          <el-button  type="primary" @click="createNewUser">
            <i class="iconfont icon-xinzeng"></i>
            新增客户
          </el-button>
          <el-button type="danger" v-show="!isInDailog"  @click="deleteClients">
            <i class="iconfont icon-shanchu"></i>
            批量删除
          </el-button>
          <el-button v-show="isInDailog"  @click="confirmChoose">
            <i class="iconfont icon-queding"></i>
            确定选择
          </el-button>
          <el-button v-show="!isInDailog"  @click="toHightSeas">
            <i class="iconfont icon-gonghai"></i>
            放入公海
          </el-button>
          <el-button  v-show="!isInDailog"  @click="lookSea">
            <i class="iconfont icon-chakan"></i>
            查看公海
          </el-button>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="search">
          <el-input @keyup.enter.native="subSearch" v-model="searchContent"></el-input>
          <el-button type="primary" icon="el-icon-search" @click="subSearch">搜索</el-button>
        </div>
      </el-col>
    </el-row>
    <!-- 用户表 -->
      <el-row>
        <el-col :span="24">
          <el-table
            v-loading="loading"
            @row-dblclick="dblclinck"
            @select="selectTable"
            @select-all="selectAll"
            stripe
            :border="true"
            :data="tableData.slice((paging.currentPage-1)*paging.pagesize,paging.currentPage*paging.pagesize)"
            height="500"
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
            <el-table-column
              prop="userId"
              width="80"
              label="用户ID">
            </el-table-column>
            <el-table-column
            width="150"
            fixed="right"
            prop=""
            label="操作">
              <template slot-scope="scope">
                <div style="display: flex; justify-content:space-evenly">
                  <el-button size="mini" @click="handleEidt(scope.row)">编辑</el-button>
                  <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <!-- 分页 -->
      <el-row>
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="paging.currentPage"
          :page-size="paging.pagesize"
          style="float: right;margin-top: 10px;"
          background
          layout="prev, pager, next"
          :total="tableData.length">
        </el-pagination>
      </el-row>
    <!-- </el-skeleton> -->
    <!-- 弹框 -->
    <el-dialog
      title="新增客户"
      :visible.sync="dialogVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      :modal="false"
      width="50%"
      :show-close="false">
      <el-form label-width="80px" :inline="true" :rules="rules" ref="clientInfo" :model="clientInfo" class="demo-form-inline">
        <el-form-item label="客户姓名" prop="clientName">
          <el-input v-model="clientInfo.clientName" placeholder="客户姓名"></el-input>
        </el-form-item>
        <el-form-item label="客户手机" prop="clientPhone">
          <el-input v-model="clientInfo.clientPhone" placeholder="客户手机"></el-input>
        </el-form-item>
        <el-form-item label="客户来源" prop="clientSource">
          <el-input v-model="clientInfo.clientSource" placeholder="客户来源"></el-input>
        </el-form-item>
        <el-form-item label="客户地址" prop="clientAddr">
          <el-input v-model="clientInfo.clientAddr" placeholder="客户地址"></el-input>
        </el-form-item>
        <el-form-item label="客户等级" prop="clientLevel">
          <el-select v-model="clientInfo.clientLevel" placeholder="请选择客户等级">
            <el-option label="低优先级客户" value="低优先级客户"></el-option>
            <el-option label="一般客户" value="一般客户"></el-option>
            <el-option label="重点客户" value="重点客户"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户行业" prop="clientProfession">
          <el-select v-model="clientInfo.clientProfession" placeholder="请选择客户行业">
            <el-option label="IT" value="IT"></el-option>
            <el-option label="金融业" value="金融业"></el-option>
            <el-option label="运输/物流" value="运输/物流"></el-option>
            <el-option label="文化传媒" value="文化传媒"></el-option>
            <el-option label="生产" value="生产"></el-option>
            <el-option label="房地产" value="房地产"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="clientRemark">
          <el-input resize="none" type="textarea"  :autosize="{ minRows: 4, maxRows: 4}" v-model="clientInfo.clientRemark" placeholder="备注"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="cancle">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
        title="公海"
        :modal="false"
        :visible.sync="popSea"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        :destroy-on-close="true"
        width="80%">
            <HightSeaVue ></HightSeaVue>
      </el-dialog>
  </div>
</template>

<script>
import {getUserInfo,searchClient,addUserInfo,updateClient,deleteClient,convertHighSeas} from '@/api'
import { mapState } from 'vuex';
import HightSeaVue from '@/components/HightSea';
export default {
  data() {
    return {
      tableSea:[],
      //控制公海框
      popSea:false,
      //多选
      selection:[],
      //分页
      paging:{
        pagesize:8,
        currentPage:1,
      },
      //加载中
      loading:true,
      isShow:true,
      tableData: [],
      searchContent:'',
      dialogVisible:false,
      handleType:0,//0表示新增客户，1表示编辑
      clientInfo:{
        clientName:'',
        clientPhone:'',
        clientAddr:'',
        clientSource:'',
        clientLevel:'',
        clientRemark:'',
        clientProfession:'',
      },
      rules:{
        clientName:[{ required: true, message: '请输入客户姓名', trigger: 'blur' }],
        clientPhone:[{ required: true, message: '请输入客户手机', trigger: 'blur' },{ pattern: /^1[3|5|7|8|9]\d{9}$/, message: '请输入正确的号码格式', trigger: 'change' }],
        clientSource:[{ required: true, message: '请选择客户来源', trigger: 'blur' }],
        clientAddr:[{ required: true, message: '请输入客户地址', trigger: 'blur' }],
        clientLevel:[{ required: true, message: '请选择客户等级', trigger: 'change' }],
      }
    }
  },
  components:{HightSeaVue},
  methods:{
    //查看公海按钮
    lookSea(){
      this.popSea = true
    },
    deleteClients(){
      console.log(this.selection);
      if(this.selection.length <= 0){
        this.$message({
            message: '请选择一个客户',
            type: 'info'
        });
      }else{
        let ids = []
        this.selection.forEach(element=>{
          ids.push(element.clientId)
        })
        this.deleteSomeClients(ids)
      }
    },
    //确定选择按钮
    confirmChoose(){
      if(this.selection.length === 1){
        this.$emit('choose',this.selection)
        this.$store.commit('isNotInDailog')
      }else{
        this.$message({
            message: '请选择一个且最多一个客户',
            type: 'info'
        });
        this.$store.commit('isNotInDailog')
      }
    },
    //点击换页
    handleCurrentChange(currentPage){
      console.log(currentPage);
      this.paging.currentPage = currentPage
      console.log(this.paging.currentPage);
    },
    //表格条目双击事件
    dblclinck(row){
      this.handleEidt(row)
    },
    //放入公海 
    toHightSeas(){
      if(this.selection.length <= 0){
        this.$message({
            message: '请选择一个客户',
            type: 'info'
        });
      }else{
        let ids = []
        this.selection.forEach(element=>{
          ids.push(element.clientId)
        })
        convertHighSeas(ids).then(res=>{
          if(res.status === 200){
                this.$message({
                message: '放入成功',
                type: 'success'
            });
            this.getClientInfo()
          }
        })
      }
    },
    //发送短信
    sendMessage(){
      //
    },
    //选择所有
    selectAll(selection){
      this.selection = selection
    },
    //选择条目
    selectTable(selection,row){
      this.selection = selection
    },
    //删除按钮事件
    handleDelete(row){
      //解构id
      let {clientId} = {...row}
      this.deleteSomeClients([clientId])
    },
    //编辑事件
    handleEidt(row){
      this.handleType = 1
      this.dialogVisible = true
      let {userId,...trueInfo} = row
      // https://www.jianshu.com/p/56f0a542668d
      this.$nextTick(()=>{
        this.clientInfo = JSON.parse(JSON.stringify(trueInfo))
      })
    },
    //搜索按钮事件
    subSearch(){
      this.loading = true //加载表格
      searchClient({params:{clientName:this.searchContent}}).then((data)=>{
        if(data.status === 200){
          this.tableData = data.data
          this.$message({
                    message: '搜索成功',
                    type: 'success'
          });
          //加载成功
          this.loading = false
          this.paging.currentPage = 1
        }else{
          this.$message({
                    message: '搜索失败',
                    type: 'info'
          });
        }
      })
    },
    //新建客户
    createNewUser(){
      this.dialogVisible = true
      this.handleType = 0
    },
    //取消弹窗
    cancle(){
      this.dialogVisible = false
      //置空表单
      this.$refs.clientInfo.resetFields()
    },
    //确定弹窗
    submit(){
      //表单校验
      this.$refs.clientInfo.validate((valid) => {
          if (valid) {
            if(this.handleType === 0){
              //规范接口参数
              const data = {crmClient:{...this.clientInfo},token:localStorage.getItem('token')}
              //添加用户接口调用
              addUserInfo(data).then((data)=>{
                //判断是否添加成功
                if(data.status === 200){
                  //重新请求表格
                  this.getClientInfo()
                  this.$message({
                    message: '添加成功',
                    type: 'success'
                  });
                }
              },(erro)=>{
                this.$message.error(erro);
              })
            }else if(this.handleType === 1){
              //更新用户接口调用
              updateClient(this.clientInfo).then((data)=>{
                if(data.status === 200){
                  //重新请求表单
                  this.getClientInfo()
                  this.$message({
                    message: '更新成功',
                    type: 'success'
                  });
                }
              })
            }
            this.dialogVisible = false
            this.$refs.clientInfo.resetFields()
          }
        });
    },
    //删除客户接口事件
    deleteSomeClients(clientIds){
      this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteClient({data:clientIds}).then((data)=>{
            if(data.status === 200){
              //重新获取客户信息
                this.getClientInfo()
                this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.selection = []
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    //获取客户信息接口事件
    getClientInfo(){
      this.loading = true
      const token = localStorage.getItem('token') //获取token
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
    },
  },
  computed:{
    ...mapState(['isInDailog'])
  },
  created(){
    //开局调用获取客户表格
   this.getClientInfo()
  },
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