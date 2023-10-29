<template>
    <div class="clue-container">
      <!-- 首行 菜单 -->
      <el-row class="first-row">
        <el-col :span="12">
          <div>
            <el-button type="primary" @click="createNewClue">
              <i class="iconfont icon-xinzeng"></i>
              新增商机
            </el-button>
            <el-button type="danger" v-show="!isInDailog"  @click="deleteSomeOpportunities">
              <i class="iconfont icon-shanchu"></i>
              批量删除
            </el-button>
            <el-button v-show="isInDailog"  @click="confirmChoose">
              <i class="iconfont icon-queding"></i>
              确定选择
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
      <!-- 商机表 -->
      <el-row>
        <el-col :span="24">
          <el-table
            v-loading="loading"
            @select="selectHandler"
            @select-all="selectAll"
            @row-dblclick="dblclinck"
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
              prop="opportunityId"
              label="商机ID">
            </el-table-column>
            <el-table-column
              prop="opportunityName"
              width="150"
              fixed="left"
              :show-overflow-tooltip="true"
              label="商机名称">
            </el-table-column>
            <el-table-column
              prop="opportunityAmount"
              width="150"
              :show-overflow-tooltip="true"
              label="商机金额">
            </el-table-column>
            <el-table-column
              prop="opportunityState"
              width="150"
              :show-overflow-tooltip="true"
              label="商机状态">
            </el-table-column>
            <el-table-column
              width="150"
              prop="opportunityPreFinishTime"
              label="商机预计成交时间">
            </el-table-column>
            <el-table-column
              width="150"
              prop="opportunityNextTime"
              label="下次联系时间">
            </el-table-column>
            <el-table-column
              width="150"
              prop="clientId"
              :show-overflow-tooltip="true"
              label="客户ID">
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
      <!-- 新增弹框 -->
      <el-dialog
        :modal="false"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        :destroy-on-close="true"
        title="新增商机"
        :visible.sync="dialogVisible"
        :show-close="false"
        width="80%">
        <el-form label-width="80px" label-position="top" :inline="true" :rules="rules" ref="opportunityInfo" :model="opportunityInfo" class="demo-form-inline">
          <el-row :gutter="20">
            <el-col :span="12">
                <el-form-item label="商机名称" prop="opportunityName">
                    <el-input v-model="opportunityInfo.opportunityName" placeholder="商机名称"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="选择客户" prop="clientId">
                    <el-input :readonly="true" placeholder="客户编号" v-model="opportunityInfo.clientNameAndId">
                        <el-button slot="append" icon="iconfont icon-xinzeng" @click="chooseClient"></el-button>
                    </el-input>
                </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
                <el-form-item  label="商机预计成交时间" prop="opportunityPreFinishTime">
                    <el-date-picker
                        v-model="opportunityInfo.opportunityPreFinishTime"
                        type="date"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="下次跟进时间" prop="opportunityNextTime">
                    <el-date-picker
                        v-model="opportunityInfo.opportunityNextTime"
                        type="date"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
                <el-form-item label="产品及其折扣(%)" prop="discount">
                    <el-input placeholder="不需要百分号" v-model="opportunityInfo.discount">
                        <el-button slot="append" icon="iconfont icon-xinzeng" @click="chooseProduct"></el-button>
                    </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="商机金额(元)" prop="opportunityAmount">
                <el-input :readonly="true" v-model="opportunityInfo.opportunityAmount" placeholder="选择产品后自动计算"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-table
                  :data="opportunityPros"
                  style="width: 100%">
                  <el-table-column
                    width="150"
                    prop="proId"
                    label="产品ID">
                  </el-table-column>
                  <el-table-column
                    prop="proName"
                    width="150"
                    fixed="left"
                    :show-overflow-tooltip="true"
                    label="产品名称">
                  </el-table-column>
                  <el-table-column
                    prop="proInfo"
                    width="250"
                    :show-overflow-tooltip="true"
                    label="产品信息">
                  </el-table-column>
                  <el-table-column
                    prop="proPrice"
                    width="150"
                    :show-overflow-tooltip="true"
                    label="产品价格">
                  </el-table-column>
                  <el-table-column
                    width="150"
                    prop="proState"
                    label="产品状态">
                  </el-table-column>
                  <el-table-column
                    width="150"
                    prop="proTag"
                    label="产品标签">
                  </el-table-column>
                  <el-table-column
                    width="150"
                    prop="proType"
                    :show-overflow-tooltip="true"
                    label="产品类型">
                  </el-table-column>
                  <el-table-column
                    width="150"
                    prop="proUnit"
                    label="产品单位">
                  </el-table-column>
                  <el-table-column
                    width="150"
                    prop="userId"
                    label="用户ID">
                  </el-table-column>
                  <el-table-column
                    fixed="right"
                    width="150"
                    label="操作">
                    <template slot-scope="scope">
                      <div style="display: flex; justify-content:space-evenly">
                        <el-button type="danger" size="mini" @click="handleDelete(scope.row)">取消</el-button>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    fixed="right"
                    width="150"
                    prop="proNum"
                    label="数量">
                    <template slot-scope="scope">
                        <input  @input="inputing" type="number" v-model="scope.row.proNum" style="width: 80px;outline: none;">
                    </template>
                  </el-table-column>
                </el-table>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="danger" @click="cancle">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 右边抽屉 -->
      <el-drawer
        size="60%"
        title="商机"
        :visible.sync="drawer">
        <Drawer @flashTable="getOpportunityInfo" v-if="this.dblclinckRow" clueInfo="" :opportunityInfo="this.dblclinckRow" isWhich="opportunity"></Drawer>
      </el-drawer>
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
      <!-- 选择产品 -->
      <el-dialog
        v-if="popProduct"
        title="选择产品"
        :modal="false"
        :visible.sync="popProduct"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        :destroy-on-close="true"
        :before-close="closingPro"
        width="80%">
            <Product @choose="getProductSelection"></Product>
      </el-dialog>
    </div>
  </template>
  
  <script>
  import {getOpportunity,getOpportunityPro,addOpportunity,deleteOpportunity,updateOpportunity,searchOpportunity} from '@/api'
  import {timestampToDateTime} from '@/util/common'
  import Drawer from '@/components/Drawer.vue'
  import Client from './Client.vue'
  import Product from './Product.vue'
  import { mapState } from 'vuex'
  export default {
    data() {
      let checkTime = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('下次跟进时间不能为空'));
        }else if (new Date(this.opportunityInfo.opportunityPreFinishTime).getTime() <= new Date(this.opportunityInfo.opportunityNextTime).getTime()) {
          callback(new Error('下次跟进早于预计成交时间！'))
        } else {
          callback()
        }
      };
      return {
        proNum:[],
        //选择客户弹框
        popClient:false,
        //选择产品弹框
        popProduct:false,
        //新增商机选择的产品
        opportunityPros:[],
        //分页
        paging:{
          pagesize:8,
          currentPage:1,
        },
        //加载表格
        loading:true,
        //双击信息
        dblclinckRow:{},
        //抽屉控制
        drawer:false,
        //表格数组
        tableData: [],
        //搜索内容
        searchContent:'',
        //checkbox
        selection:[],
        dialogVisible:false,
        handleType:0,//0表示新增线索，1表示编辑线索
        opportunityInfo:{
            opportunityAmount: '',
            opportunityName: '',
            opportunityNextTime: '',
            opportunityPreFinishTime: '',
            opportunityState:'验证客户',
            clientId:'',
            clientNameAndId:'',
            discount:100
        },
        rules: {
            opportunityName: [{ required: true, message: '请输入商机名称', trigger: 'blur' }],
            opportunityNextTime: [{ validator:checkTime, trigger: 'change' }],
            opportunityPreFinishTime: [{ required: true, message: '请选择预计完成时间', trigger: 'blur' }],
            clientId:[{ required: true, message: '请选择客户', trigger: 'blur' }],
            discount:[{ required: true, message: '请输入折扣', trigger: 'blur' }]
        }
      }
    },
    components:{
      Drawer,
      Client,
      Product
    },
    methods:{
      //批量删除
      deleteSomeOpportunities(){
        if(this.selection.length <= 0){
          this.$message({
              message: '至少选择一个商机',
              type: 'info'
          });
        }else{
          let ids = []
          this.selection.forEach(element=>{
            ids.push(element.opportunityId)
          })
          this.deleteOpportunities(ids)
        }
      },
      //获取产品
      getOpportunityPros(){
        getOpportunityPro().then(res=>{
          console.log(res);
        })
      },
      //确认选择
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
      //输入数量时的回调
      inputing(){
        this.calculate(this.opportunityPros)
      },
      //计算商机金额
      calculate(pro){
        let sum = 0
        pro.forEach(element=>{
          sum += Number(element.proNum)*Number(element.proPrice)
        })
        sum = sum * Number(this.opportunityInfo.discount) / 100
        console.log(sum.toFixed(2));
        this.opportunityInfo.opportunityAmount = sum.toFixed(2)
      },
      //获取selection
      getSelection(selection){
        //回填商机的客户id
        this.opportunityInfo.clientNameAndId = `${selection[0].clientName}/${selection[0].clientId}`
        this.opportunityInfo.clientId = selection[0].clientId
        //关闭
        this.popClient=false
      },
      // 获取产品selection
      getProductSelection(selection){
        this.opportunityPros = selection
        this.calculate(this.opportunityPros)
        this.popProduct=false
      },
      //选择客户
      chooseClient(){
        this.popClient = true
        this.$store.commit('inDailog') //只显示一个新建和确定
      },
      //选择产品
      chooseProduct(){
        this.popProduct = true
        this.$store.commit('inDailogPro') //只显示一个新建和确定
      },
      //点击换页
      handleCurrentChange(currentPage){
        this.paging.currentPage = currentPage
      },
      //表格行双击事件
      dblclinck(row){
        this.dblclinckRow = row
        //更改抽屉显示
        this.$store.commit('changeWhich','opportunity')
        this.drawer = true
      },
      //checkbox事件
      selectHandler(selection,row){
        this.selection = selection
      },
      selectAll(selection){
        this.selection = selection
      },
      //删除接口
      deleteOpportunities(opportunityIds){
        this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteOpportunity({data:opportunityIds}).then((data)=>{
            if(data.status === 200){
              this.$message({
                  message: '删除成功',
                  type: 'success'
              });
              this.getOpportunityInfo()
            }else{
              this.$message({
                  message: '删除失败',
                  type: 'success'
              });
            }
        })
      }).catch(() => { 
        this.$message({
            type: 'info',
            message: '已取消删除'
          });  
        });
      },
      //删除按钮事件
      handleDelete(row){
        this.deleteOpportunities([row.opportunityId])
      },
      //编辑事件
      handleEidt(row){
        this.handleType = 1
        this.dialogVisible = true
        let {userId,...trueInfo} = row
        this.$nextTick(()=>{
          this.opportunityInfo = JSON.parse(JSON.stringify(trueInfo))
        })
      },
      //搜索按钮事件
      subSearch(){
        this.loading = true //加载表格
        searchOpportunity({params:{OpportunityName:this.searchContent}}).then((data)=>{
            if(data.status === 200){
                data.data.forEach(element => {
                    element.opportunityNextTime = timestampToDateTime(element.opportunityNextTime)
                    element.opportunityPreFinishTime = timestampToDateTime(element.opportunityPreFinishTime)
                });
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
      //新建商机
      createNewClue(){
        this.handleType = 0
        this.dialogVisible = true
      },
      //这个是选择客户对话框的关闭回调
      closing(){
        this.popClient = false
        this.$store.commit('isNotInDailog') //取消后，把按钮状态返回
      },
      //关闭产品回调
      closingPro(){
        this.popProduct = false
        this.$store.commit('isNotInDailogPro') //取消后，把按钮状态返回
        // https://blog.csdn.net/yb305/article/details/116190251 解决弹窗缓存问题
      },
      //取消弹窗
      cancle(){
         //置空表单
        this.$refs.opportunityInfo.resetFields()
        this.dialogVisible = false
      },
      //确定弹窗
      submit(){
        let newProArray = []
        this.opportunityPros.forEach(element => {
          let {proNum,proId} = {...element}
          newProArray.push({proNum,proId})
        });
        //表单校验
        this.$refs.opportunityInfo.validate((valid) => {
            if (valid) {
              if(this.handleType === 0){
                addOpportunity({crmOpportunity:{...this.opportunityInfo},crmProOpportunitys:newProArray}).then((data)=>{
                  if(data.status === 200){
                    this.getOpportunityInfo()
                    this.$message({
                      message: '添加成功',
                      type: 'success'
                    });
                  }else{
                    this.$message({
                      message: '添加失败',
                      type: 'info'
                    });
                  }
                })
              }else if(this.handleType === 1){
                updateOpportunity(this.opportunityInfo).then((data)=>{
                  if(data.status === 200){
                    this.getOpportunityInfo()
                    this.$message({
                      message: '编辑成功',
                      type: 'success'
                    });
                  }else{
                    this.$message({
                      message: '编辑失败',
                      type: 'info'
                    });
                  }
                })
              }
            }
            this.$refs.opportunityInfo.resetFields()
            this.dialogVisible = false
          });
      },
      //获取商机信息
      getOpportunityInfo(){
        this.loading = true
        getOpportunity().then((data)=>{
          if(data.status === 200){
            data.data.forEach(element => {
                element.opportunityNextTime = timestampToDateTime(element.opportunityNextTime)
                element.opportunityPreFinishTime = timestampToDateTime(element.opportunityPreFinishTime)
            });
            this.tableData = data.data
            this.loading = false
          }
        })
      }
    },
    computed:{
         ...mapState(['isInDailog','isClue'])
    },
    created(){
      //线索表初始化
     this.getOpportunityInfo()
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