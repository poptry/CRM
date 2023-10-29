<template>
    <div class="clue-container">
      <!-- 首行 菜单 -->
      <el-row class="first-row">
        <el-col :span="12">
          <div>
            <el-button type="primary" @click="createNewPro">
              <i class="iconfont icon-xinzeng"></i>
              新建回款
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
      <!-- 回款表 -->
      <el-row>
        <el-col :span="24">
          <el-table
            v-loading="loading"
            @select="selectTable"
            @select-all="selectAll"
            stripe
            :border="true"
            :data="tableData.slice((paging.currentPage-1)*paging.pagesize,paging.currentPage*paging.pagesize)"
            height="500"
            style="width: 100%;">
            <el-table-column
              type="selection"
              >
            </el-table-column>
            <el-table-column
              width="150"
              fixed="left"
              prop="returnedId"
              label="回款编号">
            </el-table-column>
            <el-table-column
              prop="clientName"
              width="150"
              :show-overflow-tooltip="true"
              label="客户名称">
            </el-table-column>
            <el-table-column
              prop="clientId"
              width="250"
              :show-overflow-tooltip="true"
              label="客户编号">
            </el-table-column>
            <el-table-column
              prop="contractName"
              width="150"
              :show-overflow-tooltip="true"
              label="合同名称">
            </el-table-column>
            <el-table-column
              width="150"
              prop="contractId"
              label="合同编号">
            </el-table-column>
            <el-table-column
              width="150"
              prop="returnedAmount"
              label="回款金额">
            </el-table-column>
            <el-table-column
              width="150"
              prop="returnedType"
              :show-overflow-tooltip="true"
              label="回款类型">
            </el-table-column>
            <el-table-column
              width="150"
              prop="returnedTime"
              label="回款时间">
            </el-table-column>
            <el-table-column
              width="150"
              prop="returnedRemark"
              label="回款备注">
            </el-table-column>
            <el-table-column
              width="150"
              prop="returnedAuditState"
              label="回款审核状态">
            </el-table-column>
            <el-table-column
            fixed="right"
            width="150"
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
      <!-- 弹框 -->
      <el-dialog
        title="新建回款"
        :modal="false"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        :destroy-on-close="true"
        :visible.sync="dialogVisible"
        :show-close="false"
        width="60%">
        <el-form label-width="80px" :inline="true" :rules="rules" ref="returnInfo" :model="returnInfo" class="demo-form-inline">
          <el-row>
            <el-col :span="12">
              <el-form-item label="选择客户" prop="clientNameAndId">
                <el-input :readonly="true" placeholder="客户名称/编号" v-model="returnInfo.clientNameAndId">
                  <el-button slot="append" icon="iconfont icon-xinzeng" @click="chooseClient"></el-button>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="选择合同" prop="contractNameAndId">
                <el-input :readonly="true" placeholder="合同名称/编号" v-model="returnInfo.contractNameAndId">
                  <el-button :disabled="returnInfo.clientNameAndId === ''" slot="append" icon="iconfont icon-xinzeng" @click="chooseContract"></el-button>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="回款金额" prop="returnedAmount">
                <el-input v-model="returnInfo.returnedAmount" placeholder="回款金额"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="回款时间" prop="returnedTime">
                <el-date-picker
                  v-model="returnInfo.returnedTime" 
                  type="date"
                  placeholder="选择日期">
                  </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="回款方式" prop="returnedType">
                <el-select v-model="returnInfo.returnedType"  placeholder="请选择回款方式">
                <el-option label="支付宝" value="支付宝"></el-option>
                <el-option label="支票" value="支票"></el-option>
                <el-option label="现金" value="现金"></el-option>
                <el-option label="微信支付" value="微信支付"></el-option>
                <el-option label="银行卡" value="银行卡"></el-option>
              </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="回款备注" prop="returnedRemark">
                <el-input resize="none" type="textarea"  :autosize="{ minRows: 4, maxRows: 6}" v-model="returnInfo.returnedRemark" placeholder="回款备注"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="danger" @click="cancle">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 选择客户弹窗 -->
      <el-dialog
      title="选择客户"
      :modal="false"
      :visible.sync="popClient"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      :before-close="closing"
      width="80%">
        <Client @choose="getSelection"></Client>
      </el-dialog>
      <!-- 选择合同弹窗 -->
      <el-dialog
      title="选择客户"
      :modal="false"
      :visible.sync="popContract"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      :before-close="closing"
      width="80%">
        <Contract @choose="getContractSelection"></Contract>
      </el-dialog>
    </div>
  </template>
  
  <script>
  import {getReturn,updateReturn,deleteProduct,addProduct,searchReturn} from '@/api'
  import {timestampToDateTime} from '@/util/common'
  import { mapState } from 'vuex'
  import Client from './Client.vue'
  import Contract from './Contract.vue'
  export default {
    data() {
      return {
        popContract:false,
        popClient:false,
        //分页
        paging:{
          pagesize:8,
          currentPage:1,
        },
        //加载中
        loading:true,
        //双击信息
        dblclinckRow:{},
        //表格数组
        tableData: [],
        //搜索内容
        searchContent:'',
        //checkbox
        selection:[],
        dialogVisible:false,
        handleType:0,//0表示新增产品，1表示编辑产品
        returnInfo:{
          clientId:'',
          clientName: '',
          clientNameAndId: '',
          contractId:'',
          contractName: '',
          contractNameAndId:'',
          returnedAmount: '',
          returnedAuditState: '',
          returnedId: '',
          returnedRemark: '',
          returnedTime: '',
          returnedType: '',
        },
        rules:{
          clientName: [
            { required: true, message: '请输入客户名称', trigger: 'blur' },
          ],
          contractId: [
            { required: true, message: '请输入合同ID', trigger: 'blur' },
          ],
          contractName: [
            { required: true, message: '请输入合同名称', trigger: 'blur' },
          ],
          returnedAmount: [
            { required: true, message: '请输入返回金额', trigger: 'blur' },
          ],
          returnedAuditState: [
            { required: true, message: '请选择返回审核状态', trigger: 'change' },
          ],
          returnedId: [
            { required: true, message: '请输入回款编号', trigger: 'blur' },
          ],
          returnedRemark: [
            { required: true, message: '请输入返回备注', trigger: 'blur' },
          ],
          returnedTime: [
            { required: true, message: '请选择回款时间', trigger: 'change' },
          ],
          returnedType: [
            { required: true, message: '请选择回款方式', trigger: 'change' },
          ]
        }
      }
    },
    components:{
      Client,
      Contract
    },
    methods:{
      //这个是选择客户对话框的关闭回调
      closing(){
        this.popClient = false
        this.popContract = false
        this.$store.commit('isNotInDailog') //取消后，把按钮状态返回
      },
      //获取合同选项
      getContractSelection(selection){
        //回填商机的客户id
        this.returnInfo.contractNameAndId = `${selection[0].contractName}/${selection[0].contractId}`
        this.returnInfo.contractName = selection[0].contractName
        this.returnInfo.contractId = selection[0].contractId
        //关闭
        this.popContract=false
      },
      //获取selection
      getSelection(selection){
        //回填商机的客户id
        this.returnInfo.clientNameAndId = `${selection[0].clientName}/${selection[0].clientId}`
        this.returnInfo.clientId = selection[0].clientId
        this.returnInfo.clientName = selection[0].clientName
        //关闭
        this.popClient=false
      },
      //选择客户
      chooseClient(){
        this.popClient = true
        this.$store.commit('inDailog') //只显示一个新建和确定
      },
      //选择合同
      chooseContract(){
        this.popContract = true
        this.$store.commit('inDailog') //只显示一个新建和确定
      },
      //选择所有
      selectAll(selection){
        this.selection = selection
      },
      //选择条目
      selectTable(selection,row){
        this.selection = selection
      },
      //确认选择
          //确定选择按钮
      confirmChoose(){
        if(this.selection.length >= 1){
          this.selection.forEach(element=>{
            element.proNum = 1
          })
          this.$emit('choose',this.selection)
        }else{
          this.$message({
              message: '请选择至少一个产品',
              type: 'info'
          });
        }
      },
      //点击换页
      handleCurrentChange(currentPage){
        this.paging.currentPage = currentPage
      },
      //新增产品
      createNewPro(){
        this.dialogVisible = true
        this.handleType = 0
      },
      //删除
      handleDelete(row){
        this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteProduct(row.proId).then((response)=>{
            if(response.status === 200){
              this.getProducts()
              this.$message({
                    message: '删除成功',
                    type: 'success'
              });
            }else{
              this.$message({
                    message: '删除失败',
                    type: 'info'
              });
            }
          })
        }).catch(()=>{
          this.$message({
            type: 'info',
            message: '已取消删除'
          });  
        })
      },
      //编辑事件
      handleEidt(row){
        this.dialogVisible = true
        this.handleType = 1
        let {userId,...trueInfo} = row
        this.$nextTick(()=>{
          this.returnInfo = JSON.parse(JSON.stringify(trueInfo))
        })
      },
      //搜索按钮事件
      subSearch(){
        this.loading = true
        searchReturn({
            params:{key:this.searchContent}
        }).then((response)=>{
          if(response.status === 200){
            this.$message({
              type: 'success',
              message: '搜索成功'
            });
            this.loading = false
            this.paging.currentPage = 1
            this.tableData = response.data
          }
        })
      },
      //取消弹窗
      cancle(){
         //置空表单
        this.$refs.returnInfo.resetFields()
        this.dialogVisible = false
      },
      //确定弹窗
      submit(){
        if(this.handleType === 0){
          addProduct(this.returnInfo).then((response)=>{
            if(response.status === 200){
              this.getReturns()
              this.$message({
                    message: '添加成功',
                    type: 'success'
              });
            }
          })
        }else if(this.handleType === 1){
          updateReturn(this.returnInfo).then((response)=>{
            if(response.status === 200){
              this.getReturns()
              this.$message({
                    message: '添加成功',
                    type: 'success'
              });
            }
          })
        }
        this.$refs.returnInfo.resetFields()
        this.dialogVisible = false
      },
      //获取线索信息
      getReturns(){
        this.loading = true
        getReturn().then((response)=>{
          if(response.status === 200){
            this.loading = false
            this.tableData = response.data
            this.tableData.forEach((e)=>{
                e.returnedTime = timestampToDateTime(e.returnedTime)
            })
          }
        })
      }
    },
    computed:{
      ...mapState(['isInDailogPro'])
    },
    created(){
      //产品表初始化
     this.getReturns()
    },
  }
  </script>
  
  <style lang="less" scoped>
      .clue-container{
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