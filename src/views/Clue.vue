<template>
  <div class="clue-container">
    <!-- 首行 菜单 -->
    <el-row class="first-row">
      <el-col :span="12">
        <div>
          <el-button type="primary" @click="createNewClue">
            <i class="iconfont icon-xinzeng"></i>
            新增线索
          </el-button>
          <el-button type="danger"   @click="deleteClues">
            <i class="iconfont icon-shanchu"></i>
            批量删除
          </el-button>
          <el-button @click="toClient">
            <i class="iconfont icon-kehu"></i>
            转为客户
          </el-button>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="search">
          <el-input @keyup.enter.native="subSearch" placeholder="线索名称" v-model="searchContent"></el-input>
          <el-button type="primary" icon="el-icon-search" @click="subSearch">搜索</el-button>
        </div>
      </el-col>
    </el-row>
    <!-- 用户表 -->
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
            align="center"
            >
          </el-table-column>
          <el-table-column
            width="150"
            prop="clueId"
            align="center"
            label="线索ID">
          </el-table-column>
          <el-table-column
            prop="clueName"
            width="120"
            fixed="left"
            align="center"
            :show-overflow-tooltip="true"
            label="线索客户名称">
          </el-table-column>
          <el-table-column
            prop="cluePhone"
            width="150"
            align="center"
            :show-overflow-tooltip="true"
            label="线索手机">
          </el-table-column>
          <el-table-column
            prop="clueProfession"
            width="150"
            align="center"
            :show-overflow-tooltip="true"
            label="线索行业">
          </el-table-column>
          <el-table-column
            width="150"
            prop="clueSource"
            align="center"
            label="线索来源">
          </el-table-column>
          <el-table-column
            width="150"
            prop="clueAddr"
            align="center"
            label="线索地址">
          </el-table-column>
          <el-table-column
            width="150"
            prop="clueLevel"
            align="center"
            :show-overflow-tooltip="true"
            label="线索级别">
          </el-table-column>
          <el-table-column
            width="150"
            prop="clueContent"
            align="center"
            label="线索内容">
          </el-table-column>
          <el-table-column
            width="150"
            prop="clueMethod"
            align="center"
            label="跟进方式">
          </el-table-column>
          <el-table-column
            prop="clueFirst"
            width="150"
            align="center"
            :show-overflow-tooltip="true"
            label="第一次跟进时间">
          </el-table-column>
          <el-table-column
            prop="clueNext"
            width="150"
            align="center"
            label="下次跟进时间">
          </el-table-column>
          <el-table-column
            width="80"
            prop="userId"
            align="center"
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
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      title="新增线索"
      :visible.sync="dialogVisible"
      :modal="false"
      :show-close="false"
      width="60%">
      <el-form  :inline="true" :rules="rules" ref="clueInfo" :model="clueInfo" class="demo-form-inline">
        <el-row>
          <el-col :span="12">
            <el-form-item label="线索客户名称" prop="clueName">
              <el-input v-model="clueInfo.clueName" placeholder="线索客户名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="线索手机" prop="cluePhone">
              <el-input v-model="clueInfo.cluePhone" placeholder="线索手机"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="线索地址" prop="clueAddr">
              <el-input v-model="clueInfo.clueAddr" placeholder="线索地址"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="线索级别" prop="clueLevel">
              <el-select v-model="clueInfo.clueLevel" placeholder="请选择线索级别">
                <el-option label="低优先级客户" value="低优先级客户"></el-option>
                <el-option label="一般客户" value="一般客户"></el-option>
                <el-option label="重点客户" value="重点客户"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="线索行业" prop="clueProfession">
              <el-select v-model="clueInfo.clueProfession" placeholder="请选择线索行业">
                <el-option label="IT" value="IT"></el-option>
                <el-option label="金融业" value="金融业"></el-option>
                <el-option label="运输/物流" value="运输/物流"></el-option>
                <el-option label="文化传媒" value="文化传媒"></el-option>
                <el-option label="生产" value="生产"></el-option>
                <el-option label="房地产" value="房地产"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="线索来源" prop="clueSource">
              <el-select v-model="clueInfo.clueSource" placeholder="请选择线索来源">
                <el-option label="搜索引擎" value="搜索引擎"></el-option>
                <el-option label="广告" value="广告"></el-option>
                <el-option label="线上询价" value="线上询价"></el-option>
                <el-option label="预约上门" value="预约上门"></el-option>
                <el-option label="电话咨询" value="电话咨询"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="跟进方式" prop="clueMethod">
              <el-select v-model="clueInfo.clueMethod" placeholder="请选择跟进方式">
                <el-option label="手机" value="手机"></el-option>
                <el-option label="微信" value="微信"></el-option>
                <el-option label="QQ" value="QQ"></el-option>
                <el-option label="面谈" value="面谈"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-position="top" label="第一次跟进时间" prop="clueFirst">
              <el-date-picker
                v-model="clueInfo.clueFirst"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="下次跟进时间" prop="clueNext">
              <el-date-picker
                v-model="clueInfo.clueNext"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="跟进内容" prop="clueContent">
              <el-input resize="none" type="textarea"  :autosize="{ minRows: 4, maxRows: 4}" v-model="clueInfo.clueContent" placeholder="备注"></el-input>
            </el-form-item>
          </el-col>
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
      title="线索"
      :visible.sync="drawer">
      <Drawer :clueInfo="this.dblclinckRow" opportunityInfo=""></Drawer>
    </el-drawer>
  </div>
</template>

<script>
import {getClue,addClue,deleteClue,updateClue,convertClue} from '@/api'
import {timestampToDateTime} from '@/util/common'
import Drawer from '@/components/Drawer.vue'
export default {
  data() {
    let checkTime = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('下次跟进时间不能为空'));
        }else if (new Date(this.clueInfo.clueNext).getTime() <= new Date(this.clueInfo.clueFirst).getTime()) {
          callback(new Error('下次联系时间必须晚于第一次联系时间！'))
        }else if (new Date(this.clueInfo.clueNext).getTime() <= new Date().getTime()) {
          callback(new Error('下次联系时间必须晚于今天！'))
        } else {
          callback()
        }
      };
    return {
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
      // clueInfo:{
      //   clueId:'',
      //   clueName:'',
      //   clueSource:'',
      //   clueProfession:'',
      //   clueAddr:'',
      //   clueLevel:'',
      //   clueContent:'',
      //   clueMethod:'',
      //   clueFirst:'',
      //   clueNext:'',
      //   cluePhone:''
      // },
      clueInfo: {
        "clueId": "",
        "clueName": "李四",
        "clueSource": "推荐人介绍",
        "clueProfession": "医生",
        "clueAddr": "上海市",
        "clueLevel": "初级",
        "clueContent": "对产品有兴趣，希望了解更多信息",
        "clueMethod": "电话联系",
        "clueFirst": "2023-10-28",
        "clueNext": "2023-11-02",
        "cluePhone": "13333333333"
      },
      rules:{
        clueName:[{ required: true, message: '请输入线索姓名', trigger: 'blur' }],
        clueSource:[{ required: true, message: '请选择线索来源', trigger: 'blur' }],
        clueProfession:[{ required: true, message: '请选择线索行业', trigger: 'blur' }],
        clueAddr:[{ required: true, message: '请输入线索地址', trigger: 'blur' }],
        clueLevel:[{ required: true, message: '请选择线索级别', trigger: 'blur' }],
        clueContent:[{ required: true, message: '请输入线索内容', trigger: 'blur' }],
        clueMethod:[{ required: true, message: '请输入跟进方式', trigger: 'blur' }],
        clueFirst:[{ required: true, message: '请选择第一次跟进时间', trigger: 'blur' }],
        clueNext:[{ validator:checkTime, trigger: 'change' }],
        cluePhone:[{ required: true, message: '请输入线索手机', trigger: 'blur' }, { pattern: /^1[3|5|7|8|9]\d{9}$/, message: '请输入正确的号码格式', trigger: 'change' }]
      }
    }
  },
  components:{
    Drawer
  },
  methods:{
    //批量删除
    deleteClues(){
      if(this.selection.length <= 0){
        this.$message({
            message: '请选择一个客户',
            type: 'info'
        });
      }else{
        let ids = []
        this.selection.forEach(element=>{
          ids.push(element.clueId)
        })
        this.deleteSomeClues(ids)
        console.log(ids);
      }
    },
    //点击换页
    handleCurrentChange(currentPage){
      this.paging.currentPage = currentPage
    },
    //表格行双击事件
    dblclinck(row){
      this.dblclinckRow = row
      //更改抽屉显示
      this.$store.commit('changeWhich','clue')
      this.drawer = true
    },
    //checkbox事件
    selectHandler(selection,row){
      this.selection = selection
      console.log(this.selection);
    },
    selectAll(selection){
      this.selection = selection
      console.log(this.selection);
    },
    //发送短信
    sendMessage(){
      
    },
    //转化客户事件
    toClient(){
      if(this.selection.length){
        console.log(this.selection);
        convertClue(this.selection).then((data)=>{
          if(data.status === 200){
            this.$message({
                  message: '转换成功',
                  type: 'success'
              });
              this.getClueInfo()
          }else{
            this.$message({
                  message: '转换失败',
                  type: 'info'
              });
          }
        })
      }else if(this.selection.length === 0){
        this.$message({
                  message: '请选择客户',
                  type: 'info'
          });
      }
    },
    //删除
    handleDelete(row){
      this.deleteSomeClues([row.clueId])
    },
    //编辑事件
    handleEidt(row){
      this.handleType = 1
      this.dialogVisible = true
      let {userId,...trueInfo} = row
      this.$nextTick(()=>{
        this.clueInfo = JSON.parse(JSON.stringify(trueInfo))
      })
    },
    //搜索按钮事件
    subSearch(){
      this.loading = true //加载表格
      this.paging.currentPage = 1
    },
    //新建线索
    createNewClue(){
      this.handleType = 0
      this.dialogVisible = true
    },
    //取消弹窗
    cancle(){
       //置空表单
      this.$refs.clueInfo.resetFields()
      this.dialogVisible = false
    },
    //确定弹窗
    submit(){
      //表单校验
      this.$refs.clueInfo.validate((valid) => {
          if (valid) {
            if(this.handleType === 0){
              addClue(this.clueInfo).then((data)=>{
                if(data.status === 200){
                  this.getClueInfo()
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
              updateClue(this.clueInfo).then((data)=>{
                if(data.status === 200){
                  this.getClueInfo()
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
            this.$refs.clueInfo.resetFields()
            this.dialogVisible = false
          }
        });
    },
    //删除接口
    deleteSomeClues(clueIds){
      this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteClue({data:clueIds}).then((data)=>{
            if(data.status === 200){
              this.$message({
                  message: '删除成功',
                  type: 'success'
              });
              this.selection = []
              this.getClueInfo()
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
    //获取线索信息
    getClueInfo(){
      this.loading = true
      getClue().then((data)=>{
        if(data.status === 200){
          data.data.forEach(element => {
          element.clueFirst = timestampToDateTime(element.clueFirst)
          element.clueNext = timestampToDateTime(element.clueNext)
          });
          this.tableData = data.data
          this.loading = false
        }
      })
    }
  },
  created(){
    //线索表初始化
   this.getClueInfo()
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