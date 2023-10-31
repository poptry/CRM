<template>
  <div class="client-container">
    <!-- 首行 菜单 -->
    <el-row class="first-row">
      <el-col :span="12">
        <div>
          <el-button  type="primary" @click="createNewUser">
            <i class="iconfont icon-xinzeng"></i>
            新增合同
          </el-button>
          <el-button v-show="isInDailog"  @click="confirmChoose">
            <i class="iconfont icon-queding"></i>
              确定选择
          </el-button>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="search">
          <el-input @keyup.enter.native="subSearch" placeholder="合同名称" v-model="searchContent"></el-input>
          <el-button type="primary" icon="el-icon-search" @click="subSearch">搜索</el-button>
        </div>
      </el-col>
    </el-row>
    <!-- 合同表 -->
      <el-row>
        <el-col :span="24">
          <el-table
            @filter-change="handleFilterChange"
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
              label="客户编号">
            </el-table-column>

            <el-table-column
              prop="contractId"
              width="150"
              label="合同编号">
            </el-table-column>

            <el-table-column
              prop="contractName"
              style="color: aqua;"
              :show-overflow-tooltip="true"
              width="150"
              fixed="left"
              label="合同名称">
            </el-table-column>

            <el-table-column
              prop="contractType"
              width="150"
              label="合同类型">
            </el-table-column>

            <el-table-column
              prop="contractAmount"
              width="150"
              label="合同金额">
            </el-table-column>

            <el-table-column
              prop="contractState"
              width="150"
              column-key="aStatus"
              :filters="[{text: '待审核', value: '待审核'}, {text: '审核通过', value: '审核通过'}, {text: '拒绝通过', value: '拒绝通过'}, {text: '作废合同', value: '作废合同'}]"
              :show-overflow-tooltip="true"
              label="合同状态">
            </el-table-column>
            <el-table-column
              prop="reviewRemarks"
              width="150"
              :show-overflow-tooltip="true"
              label="审核备注">
            </el-table-column>
            <el-table-column
              prop="contractStime"
              width="150"
              label="签约时间">
            </el-table-column>

            <el-table-column
              prop="contractStart"
              width="150"
              label="合同开始时间">
            </el-table-column>

            <el-table-column
              prop="contractEnd"
              :show-overflow-tooltip="true"
              width="150"
              label="客户合同结束时间">
            </el-table-column>

            <el-table-column
              prop="contractRemark"
              width="200"
              label="备注">
            </el-table-column>

            <el-table-column
            width="150"
            fixed="right"
            prop=""
            label="操作">
              <template slot-scope="scope">
                <div style="display: flex; justify-content:space-evenly">
                  <el-button size="mini" @click="handleEidt(scope.row)">编辑</el-button>
                  <el-button v-if="userJob && scope.row.contractState==='待审核'" type="danger" size="mini" @click="handleAduit(scope.row)">审核</el-button>
                  <el-button v-if="!userJob && (scope.row.contractState==='拒绝通过'|| scope.row.contractState==='作废合同')" type="primary" size="mini" @click="reAuidt(scope.row)">重审</el-button>
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
    <!-- 编辑新建弹框 -->
    <el-dialog
      title="合同"
      :visible.sync="dialogVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      :modal="false"
      width="80%"
      :show-close="false">
      <el-form label-width="80px" label-position="top" :inline="true" :rules="rules" ref="contractInfo" :model="contractInfo" class="demo-form-inline">
        <el-row>
          <el-col :span="12">
            <el-form-item label="合同名称" prop="contractName">
              <el-input v-model="contractInfo.contractName" placeholder="合同名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-position="top" label="签约时间" prop="contractStime">
              <el-date-picker
                v-model="contractInfo.contractStime"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="合同类型" prop="contractType">
              <el-select v-model="contractInfo.contractType" placeholder="请选择合同类型">
                <el-option label="供应商合同" value="供应商合同"></el-option>
                <el-option label="服务合同" value="服务合同"></el-option>
                <el-option label="销售合同" value="销售合同"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同金额" prop="contractAmount">
              <el-input v-model="contractInfo.contractAmount" placeholder="合同金额"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="客户" prop="clientNameAndId">
              <el-input :readonly="true" placeholder="选择客户" v-model="contractInfo.clientNameAndId">
                <el-button @click="popClient=true,$store.commit('inDailog')" slot="append" icon="iconfont icon-xinzeng"></el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商机编号" prop="opportunityId">
              <el-input :readonly="true" placeholder="选择商机" v-model="contractInfo.opportunityId">
                <el-button :disabled="contractInfo.clientNameAndId === ''" @click="selectOpportunity" slot="append" icon="iconfont icon-xinzeng"></el-button>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label-position="top" label="合同开始时间" prop="contractStart">
              <el-date-picker
                v-model="contractInfo.contractStart"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-position="top" label="合同结束时间" prop="contractEnd">
              <el-date-picker
                v-model="contractInfo.contractEnd"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="产品及其折扣(%)" prop="contractDiscount">
              <el-input @input="inputing" placeholder="不需要百分号" v-model="contractInfo.contractDiscount">
                <el-button slot="append" icon="iconfont icon-xinzeng" @click="chooseProduct"></el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" prop="contractRemark">
              <el-input resize="none" type="textarea"  :autosize="{ minRows: 4, maxRows: 4}" v-model="contractInfo.contractRemark" placeholder="备注"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-table
            :data="contractPros"
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
        <el-button  type="danger" @click="cancle">取 消</el-button>
        <el-button v-if="handleType===0 || handleType===1 || !userJob" type="primary" @click="submit">确 定</el-button>
        <el-button v-if="handleType===2 && userJob" type="success" @click="popAuidtRemark = true,aduitState='审核通过'">通过</el-button>
        <el-button v-if="handleType===2 && userJob" type="danger" @click="popAuidtRemark = true,aduitState='拒绝通过'">拒绝</el-button>
        <el-button v-if="handleType===2 && userJob" type="info" @click="popAuidtRemark = true,aduitState='作废合同'">作废</el-button>
      </span>
    </el-dialog>
    <!-- 选择商机 -->
    <el-dialog
      v-if="popOpportunity"
      title="选择商机"
      :modal="false"
      :visible.sync="popOpportunity"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      width="80%">
      <Opportunity @choose="getSelection"></Opportunity>
    </el-dialog>
    <!-- 输入审核备注 -->
    <el-dialog
      :top="top"
      title="审核"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :visible.sync="popAuidtRemark"
      :destroy-on-close="true"
      :modal="false"
      :show-close="false"
      width="30%">
      <el-form :label-position="top" ref="reviewR" :rules="remarkRule" label-width="80px" :model="reviewR">
        <el-form-item label="审核备注" prop="reviewRemarks">
          <el-input 
            resize="none" 
            type="textarea"  
            :autosize="{ minRows: 4, maxRows: 4}" 
            v-model="reviewR.reviewRemarks"
            placeholder="审核备注">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="popAuidtRemark = false,reviewR.reviewRemarks=''">取 消</el-button>
        <el-button type="primary" @click="submitAuidt">提交审核</el-button>
      </span>
    </el-dialog>
    <!-- 详细信息的弹窗 -->
    <el-dialog
      title="详细"
      :close-on-click-modal="true"
      :visible.sync="popDetail"
      :modal="false"
      :before-close="beforeClose"
      width="30%">
        <el-tabs v-model="activeName">
          <el-tab-pane label="详细信息" name="first">
            <el-form label-position="left" :model="reviewR" inline class="demo-table-expand">
              <el-form-item label="合同名称">
                <span>{{ contractInfoDetail.contractName }}</span>
              </el-form-item>
              <el-form-item label="合同编号">
                <span>{{ contractInfoDetail.contractId }}</span>
              </el-form-item>
              <el-form-item label="合同类型">
                <span>{{ contractInfoDetail.contractType }}</span>
              </el-form-item>
              <el-form-item label="合同金额">
                <span>{{ contractInfoDetail.contractAmount }}</span>
              </el-form-item>
              <el-form-item label="合同状态">
                <span>{{ contractInfoDetail.contractState }}</span>
              </el-form-item>
              <el-form-item label="签约时间">
                <span>{{ contractInfoDetail.contractStime }}</span>
              </el-form-item>
              <el-form-item label="开始时间">
                <span>{{ contractInfoDetail.contractStart }}</span>
              </el-form-item>
              <el-form-item label="结束时间">
                <span>{{ contractInfoDetail.contractEnd }}</span>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="产品信息" name="second">
            <el-collapse v-model="activeNamesPro" accordion>
              <el-collapse-item v-for="(pro,index) in contractPro" :key="index" :title="pro.proName" :name="index">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item label="产品名称">
                    <span>{{ pro.proName }}</span>
                  </el-form-item>
                  <el-form-item label="产品描述">
                    <span>{{ pro.proInfo }}</span>
                  </el-form-item>
                  <el-form-item label="产品价格">
                    <span>{{ pro.proPrice }}</span>
                  </el-form-item>
                  <el-form-item label="产品单位">
                    <span>{{ pro.proUnit }}</span>
                  </el-form-item>
                  <el-form-item label="产品标签">
                    <span>{{ pro.proTag }}</span>
                  </el-form-item>
                </el-form>
              </el-collapse-item>
            </el-collapse>
          </el-tab-pane>
        </el-tabs>
    </el-dialog>
      <!-- 选择客户弹窗 -->
      <el-dialog
        v-if="popClient"
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
import {getContractInfo,getContractByClient,getContractPro,aduitContract,deleteContract,searchContract,addContractInfo,updateContract,getContractByState} from '@/api'
import { mapState } from 'vuex';
import Opportunity from '@/views/Opportunity';
import Client from './Client.vue'
import Product from './Product.vue'
import {timestampToDateTime} from '@/util/common'
export default {
  data() {
    let checkTime = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('合同结束时间不能为空'));
        }else if (new Date(this.contractInfo.contractEnd).getTime() <= new Date(this.contractInfo.contractStart).getTime()) {
          callback(new Error('合同结束时间必须晚于合同开始时间！'))
        } else {
          callback()
        }
      };
    return {
      //popProduct
      popProduct:false,
      //控制展开页
      activeNamesPro:['0'],
      //详细页
      popDetail:false,
      //详细页产品
      contractPro:[],
      //详细页tab
      activeName:'first',
      //stata
      aduitState:'',
      //
      top:'30vh',
      //审核备注
      reviewR:{
        reviewRemarks:'合同信息无误，内容符合要求'
      },
      // 控制备注弹框
      popAuidtRemark:false,
      // 控制商机弹框
      popOpportunity:false,
      //控制客户弹窗
      popClient:false,
      //身份
      userJob:localStorage.getItem('userJob') === '经理',
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
      handleType:0,//0表示新增客户，1表示编辑，2表示审核
      contractPros:[],//新增商机选择的产品
      // contractInfo:{
      //   opportunityId:'',
      //   contractId:'',
      //   contractName:'',
      //   contractType:'',
      //   contractAmount:'',
      //   contractState:'',
      //   contractStime:'',
      //   contractStart:'',
      //   contractEnd:'',
      //   clientId:'',
      //   contractRemark:'',
      //   clientNameAndId:''
      // },
      contractInfo: {
        "opportunityId": "",
        "contractId": "",
        "contractName": "销售合同",
        "contractType": "一般销售",
        "contractAmount": "100000",
        "contractState": "执行中",
        "contractStime": "2023-11-01",
        "contractStart": "2023-11-10",
        "contractEnd": "2024-11-10",
        "clientId": "",
        "contractRemark": "特殊条款：提供售后服务",
        "clientNameAndId": '',
        "contractDiscount":100
      },
      contractInfoDetail:[],
      rules:{
        clientNameAndId:[{ required: true, message: '必填', trigger: 'change' }],
        contractName:[{ required: true, message: '请输入客户手机', trigger: 'blur' }],
        contractType:[{ required: true, message: '请输入合同类型', trigger: 'blur' }],
        contractStime:[{ required: true, message: '请输入签约时间', trigger: 'blur' }],
        contractStart:[{ required: true, message: '请选择合同开始时间', trigger: 'change' }],
        contractEnd:[{ validator:checkTime, trigger: 'change' }],
        contractStart:[{ required: true, message: '请选择合同开始时间', trigger: 'change' }],
        contractAmount:[{ required: true, message: '请输入合同金额，或者选择对应的商机', trigger: 'change' }],
        contractDiscount:[{ required: true, message:'请输入折扣', trigger: 'change' }],
      },
      remarkRule:{
        reviewRemarks:[{ required: true, message: '审核备注必须', trigger: 'blur' }],
      }
    }
  },
  components:{Opportunity,Client,Product},
  methods:{
    //关闭产品回调
    closingPro(){
      this.popProduct = false
      this.$store.commit('isNotInDailogPro') //取消后，把按钮状态返回
      // https://blog.csdn.net/yb305/article/details/116190251 解决弹窗缓存问题
    },
    //关闭客户弹窗
    closing(){
      this.popClient = false
      this.$store.commit('isNotInDailog') //取消后，把按钮状态返回
    },
    beforeClose(){
      this.popDetail = false
    },
    //重新审核
    reAuidt(row){
      row.contractState = '待审核'
      //更新用户接口调用
      aduitContract({contractId:row.contractId,contractState:row.contractState,reviewRemarks:row.reviewRemarks}).then((data)=>{
          if(data.status === 200){
            //重新请求表单
            this.getContractData()
            this.$message({
              message: '提交成功',
              type: 'success'
            });
          }
        })
      },
    //筛选
    handleFilterChange(filters) {
      console.log(filters)
      const _this = this;
      console.log(filters.aStatus)
      console.log(_this);
      if (filters.aStatus.length > 0) {
        _this.status = filters.aStatus[0];
      } else {
        _this.status = undefined;
      }
      if(_this.status!==undefined){
        getContractByState({params:{contractState:_this.status}}).then(res=>{
        if(res.status === 200){
          console.log(res);
          this.tableData = res.data
          this.paging.currentPage = 1
        }
        })
      }else{
        this.getContractData()
      }
    },
    //选择产品
    chooseProduct(){
      this.popProduct = true
      this.$store.commit('inDailogPro') //只显示一个新建和确定
    },
    //输入数量时的回调
    inputing(){
      this.calculate(this.contractPros)
    },
    //计算商机金额
    calculate(pro){
      let sum = 0
      pro.forEach(element=>{
        sum += Number(element.proNum) * Number(element.proPrice)
      })
      sum = sum * Number(this.contractInfo.contractDiscount) / 100
      this.contractInfo.contractAmount = sum.toFixed(2)
    },
    // 获取产品selection
    getProductSelection(selection){
      this.contractPros = selection
      this.calculate(this.contractPros)
      this.popProduct=false
    }, 
    //选择商机
    selectOpportunity(){
      this.popOpportunity=true
      this.$store.commit('inDailog')
      this.$store.commit('getClient',this.contractInfo.clientId)
    },
    //获取selection
    getSelection(selection,extraParams){
      if(selection && this.popClient === true){
        this.contractInfo.clientNameAndId = `${selection[0].clientName}/${selection[0].clientId}`
        this.contractInfo.clientId = selection[0].clientId
        if(this.contractInfo.clientId!==''){
          this.contractInfo.opportunityId = null
          this.contractInfo.contractAmount = null
          this.contractInfo.contractDiscount = 100
          this.contractPros = []
        }
        this.popClient = false
      }else if(selection && this.popOpportunity === true){
        //记录选择的商机的所有产品信息，再回填到新建合同里边
        this.contractPros = extraParams
        //回填商机id
        this.contractInfo.opportunityId = `${selection[0].opportunityId}`
        this.contractInfo.contractAmount = selection[0].opportunityAmount
        //回填商机的折扣
        this.contractInfo.contractDiscount = selection[0].opportunityDiscount
        //关闭
        this.popOpportunity=false
      }
    },
    // 提交审核
    submitAuidt(){
      this.$refs.reviewR.validate((valid) => {
        if(valid){
          this.aduitApi()
        }
      })
    },
    aduitApi(){
      aduitContract({contractId:this.contractInfo.contractId,contractState:this.aduitState,reviewRemarks:this.reviewR.reviewRemarks}).then((res)=>{
        if(res.status===200){
          this.$message({
            message: '提交成功',
            type: 'success'
          });
          this.popAuidtRemark = false
          this.dialogVisible = false
          this.getContractData()
        }
      }).catch(()=>{
        this.$message({
          message: '提交失败',
          type: 'info'
        });
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
      }
    },
    //点击换页
    handleCurrentChange(currentPage){
      this.paging.currentPage = currentPage
    },
    //表格条目双击事件
    dblclinck(row){
      this.popDetail = true
      this.$nextTick(()=>{
          this.contractInfoDetail = JSON.parse(JSON.stringify(row))
          //获取合同产品信息
          getContractPro({params:{contractId:row.contractId}}).then(res=>{
            this.contractPro = res.data
          })
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
    //打开弹框并且赋值事件
    popAndFill(row){
      this.dialogVisible = true
       this.$nextTick(()=>{
        this.contractInfo = JSON.parse(JSON.stringify(row))
        this.contractInfo.clientNameAndId = this.contractInfo.clientId
        //获取合同产品信息
        getContractPro({params:{contractId:row.contractId}}).then(res=>{
          this.contractPros = res.data
        })
      })
    },
    //审核按钮事件
    handleAduit(row){
      console.log(row);
      this.handleType = 2
      this.popAndFill(row)
    },
    //编辑事件
    handleEidt(row){
      this.handleType = 1
      this.popAndFill(row)
    },

    //搜索按钮事件
    subSearch(){
      this.loading = true //加载表格
      searchContract({params:{ContractName:this.searchContent}}).then((data)=>{
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
      this.$refs.contractInfo.resetFields()
      this.contractPros = []
    },

    //确定弹窗
    submit(){
      //表单校验
      this.$refs.contractInfo.validate((valid) => {
          if (valid) {
            if(this.handleType === 0){
              this.contractInfo.contractState = '待审核'
              //添加用户接口调用
              addContractInfo({crmContract:this.contractInfo,crmProContracts:this.contractPros}).then((data)=>{
                //判断是否添加成功
                if(data.status === 200){
                  //重新请求表格
                  this.getContractData()
                  this.$message({
                    message: '添加成功',
                    type: 'success'
                  });
                  this.contractPros = []
                }
              },(erro)=>{
                this.$message.error(erro);
              })
            }else if(this.handleType === 1){
              //更新用户接口调用
              updateContract(this.contractInfo).then((data)=>{
                if(data.status === 200){
                  //重新请求表单
                  this.getContractData()
                  this.$message({
                    message: '更新成功',
                    type: 'success'
                  });
                }
              })
            }
            this.contractPros = []
            this.dialogVisible = false
            this.$refs.contractInfo.resetFields()
          }
        });
    },

    //删除客户接口事件
    deleteSomeContracts(contractIds){
      this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            deleteContract({data:contractIds}).then((data)=>{
              console.log(data);
              if(data.status === 200){
                //重新获取客户信息
                  this.getContractData()
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

    //获取合同信息接口事件
    getContractData(){
      this.loading = true
      if(this.isInDailog){
        getContractByClient({params:{clientId:this.client}}).then(data=>{
          if(data.status === 200){
            this.tableData = data.data
            this.tableData.forEach(e=>{
              e.contractStart = timestampToDateTime(e.contractStart)
              e.contractStime = timestampToDateTime(e.contractStime)
              e.contractEnd = timestampToDateTime(e.contractEnd)
            })
            this.loading = false
          }
        })
      }else{
        //获取合同数据接口调用
        getContractInfo().then((data)=>{
          //获取到的合同数据，赋值
          if(data.status === 200){
            this.tableData = data.data
            this.tableData.forEach(e=>{
              e.contractStart = timestampToDateTime(e.contractStart)
              e.contractStime = timestampToDateTime(e.contractStime)
              e.contractEnd = timestampToDateTime(e.contractEnd)
            })
            this.loading = false
          }
        },(err)=>{
          console.log(err);
        })
      }

    },
  },
  computed:{
    ...mapState(['isInDailog','client'])
  },
  created(){
    //开局调用获取客户表格
   this.getContractData()
  },
}
</script>

<style lang="less" scoped>
    .client-container{
      .demo-table-expand {
        font-size: 0;
        display: flex;
        flex-direction: column;
        ::v-deep .el-form-item .el-form-item__label {
          width: 90px;
          color: #99a9bf;
        }
        .el-form-item {
          margin-bottom: 0;
        }
      }
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