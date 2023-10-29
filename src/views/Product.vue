<template>
    <div class="clue-container">
      <!-- 首行 菜单 -->
      <el-row class="first-row">
        <el-col :span="12">
          <div>
            <el-button type="primary" @click="createNewPro">
              <i class="iconfont icon-xinzeng"></i>
              新增产品
            </el-button>
            <el-button v-show="isInDailogPro"  @click="confirmChoose">
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
      <!-- 产品表 -->
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
        title="新增产品"
        :modal="false"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        :destroy-on-close="true"
        :visible.sync="dialogVisible"
        :show-close="false"
        width="50%">
        <el-form label-width="80px" :inline="true" :rules="rules" ref="productList" :model="productList" class="demo-form-inline">
          <el-form-item label="产品名称" prop="proName">
            <el-input v-model="productList.proName" placeholder="产品名称"></el-input>
          </el-form-item>
          <el-form-item label="产品价格" prop="proPrice">
            <el-input v-model="productList.proPrice" placeholder="产品价格"></el-input>
          </el-form-item>
          <el-form-item label="产品标签" prop="proTag">
            <el-select v-model="productList.proTag" placeholder="请选择产品标签来源">
              <el-option label="新品" value="新品"></el-option>
              <el-option label="定制" value="定制"></el-option>
              <el-option label="库存" value="线上询价"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="产品状态" prop="proState">
            <el-select v-model="productList.proState" placeholder="请选择产品状态来源">
                            <el-option label="预售" value="预售"></el-option>
              <el-option label="在售" value="在售"></el-option>
              <el-option label="售罄" value="售罄"></el-option>
              <el-option label="下架" value="下架"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="产品类型" prop="proType">
            <el-select v-model="productList.proType" placeholder="请选择产品类型">
              <el-option v-for="option in productTypes" :key="option.value" :label="option.label" :value="option.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="产品单位" prop="proUnit">
            <el-input v-model="productList.proUnit" placeholder="产品单位"></el-input>
          </el-form-item>
          <el-form-item label="产品信息" prop="proInfo">
            <el-input 
            type="textarea" 
            resize="none" 
            :autosize="{ minRows: 4, maxRows: 4}" 
            v-model="productList.proInfo" 
            placeholder="产品信息"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="danger" @click="cancle">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </template>
  
  <script>
  import {getProduct,updateProduct,deleteProduct,addProduct,searchProduct} from '@/api'
  import { mapState } from 'vuex'
  export default {
    data() {
      return {
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
        productList:{
          'proId': '',
          'proInfo': '',
          'proName': '',
          'proPrice': '',
          'proState': '',
          'proTag': '',
          'proType': '',
          'proUnit': '',
          'userId': ''
        },
        productTypes: [
          { label: '湿度', value: '湿度' },
          { label: '光照', value: '光照' },
          { label: '压力', value: '压力' },
          { label: '温度', value: '温度' },
          { label: '气压', value: '气压' },
          { label: '距离', value: '距离' },
          { label: '速度', value: '速度' },
          { label: '水质', value: '水质' },
          { label: '振动', value: '振动' },
          { label: '声音', value: '声音' },
          { label: '重力', value: '重力' },
          { label: '气体', value: '气体' },
          { label: '磁场', value: '磁场' }
        ],
        rules:{
        }
      }
    },
    methods:{
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
          deleteProduct({data:[row.proId]}).then((response)=>{
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
          this.productList = JSON.parse(JSON.stringify(trueInfo))
        })
      },
      //搜索按钮事件
      subSearch(){
        this.loading = true
        searchProduct({
          params:{
            proName:JSON.parse(JSON.stringify(this.searchContent))
          }
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
        this.$refs.productList.resetFields()
        this.dialogVisible = false
      },
      //确定弹窗
      submit(){
        if(this.handleType === 0){
          addProduct(this.productList).then((response)=>{
            if(response.status === 200){
              this.getProducts()
              this.$message({
                    message: '添加成功',
                    type: 'success'
              });
            }
          })
        }else if(this.handleType === 1){
          updateProduct(this.productList).then((response)=>{
            if(response.status === 200){
              this.getProducts()
              this.$message({
                    message: '添加成功',
                    type: 'success'
              });
            }
          })
        }
        this.$refs.productList.resetFields()
        this.dialogVisible = false
      },
      //获取线索信息
      getProducts(){
        this.loading = true
        getProduct().then((response)=>{
          if(response.status === 200){
            this.loading = false
            if(this.isInDailogPro){
              console.log(this.isInDailogPro);
               let newArray = response.data
               this.tableData = newArray.filter(item=>{
                return item.proState === '在售'
               })
            }else{
              this.tableData = response.data
            }
          }
        })
      }
    },
    computed:{
      ...mapState(['isInDailogPro'])
    },
    created(){
      //产品表初始化
     console.log('create');
     this.getProducts()
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