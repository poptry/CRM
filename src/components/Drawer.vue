<template>
  <div class="drawer">
    <!-- 线索抽屉 -->
    <div v-if="isWhich==='clue'">
      <el-row>
        <el-col :span="12"><h1>{{ clueInfo.clueName }}</h1></el-col>
      </el-row>
      <!-- 基本信息 -->
      <div class="basic">
        <div class="title">
          <span>线索来源</span>
          <span>手机</span>
          <span>第一次联系时间</span>
        </div>
        <div class="data">
          <span>{{clueInfo.clueSource}}</span>
          <span>{{clueInfo.cluePhone}}</span>
          <span>{{clueInfo.clueFirst}}</span>
        </div>
      </div>
      <!-- 跟进内容 -->
      <div class="followContent">
        <el-row>
          <el-form
            ref="clueInfo" :model="clueInfo">
            <el-form-item label="第一次跟进内容">
              <el-input
                type="textarea"
                :rows="2"
                resize="none"
                :autosize="{ minRows: 4, maxRows: 6}"
                placeholder="请输入内容"
                v-model="clueInfo.clueContent">
              </el-input>
            </el-form-item>
            <el-row>
              <el-col :span="8">
                <el-form-item label="下次联系时间">
                  <el-date-picker
                    v-model="clueInfo.clueNext"
                    type="date"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8" style="margin-left: 20px;"> 
                <el-form-item label="跟进方式">
                  <el-input v-model="clueInfo.clueMethod"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <!-- <el-button size="small" type="primary">保存</el-button> -->
          </el-form>
        </el-row>
      </div>
    </div>
    <!-- 商机抽屉 -->
    <div v-if="isWhich==='opportunity'">
      <el-row>
        <el-col :span="12"><h1>{{ opportunityInfo.opportunityName }}</h1></el-col>
        <el-col v-if="active === 200">
          <el-result icon="success" title="您已经赢单"></el-result>
        </el-col>
        <el-col v-if="active === 400">
          <el-result icon="error" title="您已经输单"></el-result>
        </el-col>
        <el-col v-if="active === 404">
          <el-result icon="info" title="这是一个无效单"></el-result>
        </el-col>
      </el-row>
      <div class="basic">
        <div class="title">
          <span>商机金额</span>
          <span>下次跟进时间</span>
          <span>预计成交时间</span>
        </div>
        <div class="data">
          <span>{{opportunityInfo.opportunityAmount}}</span>
          <span>{{opportunityInfo.opportunityNextTime}}</span>
          <span>{{opportunityInfo.opportunityPreFinishTime}}</span>
        </div>
      </div>
      <div style="border: 1px solid rgb(240, 239, 239);border-top:transparent ;">
        <el-steps :active="active" align-center style="margin-top: 20px;">
          <el-step v-for="(item,index) in state" :key="index" :title="item"></el-step>
        </el-steps>
        <el-form :model="form" label-width="80px">
          <el-form-item v-show="active===0">
            <el-checkbox-group v-model="form.type" @change="changeCheckbox">
              <el-row>
                <el-checkbox label="掌握客户的基本资料(行业、背景、企业规模、人员)" name="type"></el-checkbox>
              </el-row>
              <el-row>
                <el-checkbox label="评估客户的需求与公司产品或服务的匹配度" name="type"></el-checkbox>
              </el-row>
              <el-row>
                <el-checkbox label="介绍公司的产品与解决方案（引导客户)" name="type"></el-checkbox>
              </el-row>
              <el-row>
                <el-checkbox label="了解客户的需求与异议" name="type"></el-checkbox>
              </el-row>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item v-show="active===1">
            <el-checkbox-group v-model="form.type" @change="changeCheckbox">
              <el-row>
                <el-checkbox label="确认项目立项及预算金额" name="type"></el-checkbox>
              </el-row>
              <el-row>
                <el-checkbox label="了解项目时间进度安排" name="type"></el-checkbox>
              </el-row>
              <el-row>
                <el-checkbox label="掌握项目组成员名单，及关键决策人" name="type"></el-checkbox>
              </el-row>
              <el-row>
                <el-checkbox label="掌握竞争对手名单" name="type"></el-checkbox>
              </el-row>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item v-show="active===2">
            <el-checkbox-group v-model="form.type" @change="changeCheckbox">
              <el-row>
                <el-checkbox label="根据客户的需求有针对性的提供产品和服务的说明或者解决方案" name="type"></el-checkbox>
              </el-row>
              <el-row>
                <el-checkbox label="与客户项目组成员保持紧密沟通，掌握关键决策人对公司产品的看法" name="type"></el-checkbox>
              </el-row>
              <el-row>
                <el-checkbox label="异议的排除与应对策略" name="type"></el-checkbox>
              </el-row>
              <el-row>
                <el-checkbox label="争取主导标书需求与指标提交商务正式报价" name="type"></el-checkbox>
              </el-row>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item v-show="active===3">
            <el-checkbox-group v-model="form.type" @change="changeCheckbox">
              <el-row>
                <el-checkbox label="确认客户对价格敏感度" name="type"></el-checkbox>
              </el-row>
              <el-row>
                <el-checkbox label="确认最主要的竞争对手及竞争分析" name="type"></el-checkbox>
              </el-row>
              <el-row>
                <el-checkbox label="确认招投标时间计划" name="type"></el-checkbox>
              </el-row>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item style="margin-top: 10px;">
            <el-button v-show="hide" type="primary" @click="onSubmit">推进商机进度</el-button>
            <div v-show="isOver">
              <el-button v-show="!hide" type="success" @click="win">赢单</el-button>
              <el-button v-show="!hide" type="danger" @click="lose">输单</el-button>
              <el-button v-show="!hide" type="info" @click="invalid">无效</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <el-divider  content-position="left">相关产品</el-divider>
      <el-collapse v-model="activeNames">
        <el-collapse-item v-for="(pro,index) in products" :title="pro.proName" :name="index"  :key="index">
          <div>单价：<span v-text="pro.proPrice"></span></div>
          <div>描述：<span v-text="pro.proInfo"></span></div>
          <div>状态：<span v-text="pro.proState"></span></div>
          <div>类型：<span v-text="pro.proType"></span></div>
          <div>单位：<span v-text="pro.proUnit"></span></div>
          <div>数量：<span v-text="pro.proNum"></span></div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <el-divider content-position="left">新建跟进</el-divider>
      <!-- 新建跟进 -->
    <div class="create-new-follow">
      <el-button type="primary" icon="el-icon-edit" @click="isFollow = true" circle></el-button>
    </div>
    <div v-show="isFollow">
      <div class="followContent">
        <el-row>
          <el-form
            ref="followInfo" :model="followInfo" :rules="rules">
            <el-form-item label="跟进内容" prop="followDetails">
              <el-input
                type="textarea"
                :rows="2"
                resize="none"
                :autosize="{ minRows: 4, maxRows: 6}"
                placeholder="请输入内容"
                v-model="followInfo.followDetails">
              </el-input>
            </el-form-item>
            <el-form-item label="备注"  prop="followRemark">
              <el-input
                type="textarea"
                :rows="2"
                resize="none"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入备注"
                v-model="followInfo.followRemark">
              </el-input>
            </el-form-item>
            <el-row>
              <el-col :span="8">
                <el-form-item label="下次联系时间" prop="followNextTime">
                  <el-date-picker
                    v-model="followInfo.followNextTime"
                    type="date"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8" style="margin-left: 20px;"> 
                <el-form-item label="跟进方式" prop="followType">
                  <el-input v-model="followInfo.followType"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-button @click="save" size="small" type="primary">保存</el-button>
          </el-form>
        </el-row>
      </div>
    </div>
    <el-divider content-position="left">跟进记录</el-divider>
    <!-- 跟进记录 -->
    <div v-for="(item,index) in followRecords" :key="index" class="follow-records">
      <div class="shadow-box follow-records-item">
        <p class="follow-records-content">内容：{{ item.followDetails }}</p>
        <span class="follow-records-remark">备注：{{item.followRemark}}</span>
        <span class="follow-records-next">下次联系时间：{{item.followNextTime}}</span>
        <span class="follow-records-time">记录于：{{ item.followNowTime }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import {getOpportunityPro,getOpportunityFollow,getClueFollow,addClueFollow,addOpportunityFollow,updateOpportunityState} from '@/api'
import { mapState } from 'vuex';
import {timestampToDateTime,getNowTime,formatDate} from '@/util/common.js'
export default {
  props:['clueInfo','opportunityInfo'],
   data(){
    return{
      activeNames:['1'],
      //是否结束了
      isOver:true,
      //商机状态
      state:[
        '验证客户',
        '需求分析',
        '方案/报价',
        '谈判审核',
        '结束'
      ],
      //跟进记录
      followRecords:[],
      //控制进度条
      active:0,
      //隐藏推进按钮
      hide:true,
      //跟进文本域
      textarea:'',
      //是否显示跟进输入框
      isFollow:false,
      //跟进信息
      followInfo:{
        followDetails:'',
        followRemark:'',
        followNextTime:'',
        followType:''
      },
      rules: {
        followDetails: [
          { required: true, message: '请输入跟进内容', trigger: 'blur' },
        ],
        followRemark: [
          { required: true, message: '请输入跟进备注', trigger: 'blur' }
        ],
        followNextTime: [
          {required: true, message: '请选择下次联系日期', trigger: 'change' }
        ],
        followType: [
          { required: true, message: '请输入跟进方式', trigger: 'blur' }
        ]
      },
      form:{
        type:[]
      },
      products:[]
    }
 },
 computed:{
    ...mapState(['isClue','isWhich'])
 },
 methods:{
    //获取产品
  getOpportunityPros(id){
    getOpportunityPro({params:{opportunityId:id}}).then(res=>{
      this.products = res.data
      console.log(res);
    })
  },
  //赢单按钮
  win(){
    this.changeOpportunityState('赢单')
    this.active = 200
    this.isOver = false
  },
  //输单按钮
  lose(){
    this.changeOpportunityState('输单')
    this.active = 400
    this.isOver = false
  },
  //无效按钮
  invalid(){
    this.changeOpportunityState('无效')
    this.active = 404
    this.isOver = false
  },
  //多选按钮事件
  changeCheckbox(){
    this.isFollow = true
    this.followInfo.followDetails = this.form.type.toString()
  },
  //跟进保存
  save(){
    this.$refs.followInfo.validate((valid) => {
      if(valid){
        this.saveFollowRecords()
      }
    })
  },
  //推进提交
  onSubmit(){
    if(this.active <4){
      //跟进内容填写展开
      this.isFollow = true
      //校验表单
      this.$refs.followInfo.validate((valid) => {
        //表单通过，保存记录， 更改状态
        if(valid){
            this.active++
            this.hide = this.active < 4 ?  true : false
            this.followInfo.followNowTime = getNowTime()
            this.followInfo.opportunityId = this.opportunityInfo.opportunityId
            this.saveFollowRecords() //调用更新记录
            this.changeOpportunityState(this.state[this.active])
        }
      })
    }
  },
  //更改商机状态
  changeOpportunityState(state){
    let obj = {opportunityId:this.opportunityInfo.opportunityId,opportunityState:state}
    //更改商机状态
    updateOpportunityState(obj).then(res=>{
      if(res.status === 200){
        this.$message({
          message: '推进成功',
          type: 'success'
        });
        this.$emit('flashTable')
      }
    })
  },
  //保存跟进记录
  saveFollowRecords(){
    this.followInfo.followNowTime = getNowTime()
    this.followInfo.followNextTime = formatDate(this.followInfo.followNextTime)
    if(this.isWhich === 'clue'){
      this.followInfo.clueId = this.clueInfo.clueId
      addClueFollow(this.followInfo).then(res=>{
        if(res.status === 200){
            this.getFollow()
            //置空表单
            this.$refs.followInfo.resetFields()
        }
      })
    }else{
      this.followInfo.opportunityId = this.opportunityInfo.opportunityId
      addOpportunityFollow(this.followInfo).then(res=>{
          if(res.status === 200){
            this.getFollow()
            //置空表单
            this.$refs.followInfo.resetFields()
          }
      })
    }
  },
  //监视
  activeData(){
    //如果商机信息存在,根据不同的商机状态更改active值
    if(this.opportunityInfo!==''){
      switch(this.opportunityInfo.opportunityState){
        case '验证客户':this.active = 0
        break;
        case '需求分析':this.active = 1
        break;
        case '方案/报价':this.active = 2
        break;
        case '谈判审核':this.active = 3
        break;
        case '赢单':this.active = 200
        break;
        case '输单':this.active = 400
        break;
        case '无效':this.active = 404
        break;
        default:this.active = 10
      }
      this.hide = this.active < 4 ?  true : false
      if(this.active>=200){
        this.isOver = false
      }else{
        this.isOver = true
      }
   }
  },
  //获取跟进记录
  getFollow(){
    if(this.isWhich === 'clue'){
      console.log(this.clueInfo.clueId);
      getClueFollow({params:{clueId:this.clueInfo.clueId}}).then((res)=>{
        this.followRecords = res.data
        this.followRecords.forEach(element=>{
          element.followNextTime=timestampToDateTime(element.followNextTime)
          element.followNowTime=timestampToDateTime(element.followNowTime)
        })
      })
    }else{
      getOpportunityFollow({params:{opportunityId:this.opportunityInfo.opportunityId}}).then((res)=>{
        this.followRecords = res.data
        this.followRecords.forEach(element=>{
          element.followNextTime=timestampToDateTime(element.followNextTime)
          element.followNowTime=timestampToDateTime(element.followNowTime)
        })
      })
    }
  }
 },
 watch:{
  //监视属性,商机信息更换就换一下
  opportunityInfo: function(newValue,oldValue){
    console.log('更改');
      if(newValue){
        this.activeData()
        this.getFollow()
        console.log(newValue);
        this.getOpportunityPros(newValue.opportunityId)
      }
    },
  clueInfo:function(newValue,oldValue){
    console.log('更改');
    if(newValue){
      this.getFollow()
    }
  },
 },
 mounted(){
  if(this.opportunityInfo){
    this.getFollow()
    this.activeData()
    this.getOpportunityPros(this.opportunityInfo.opportunityId)
  }else{
    this.getFollow()
  }
 }
}
</script>
<style lang="less" scoped>
  .drawer{
    padding: 0 20px 20px 20px;
    color: var(--fontColor);
    .follow-records{
      margin-top: 10px;
      .follow-records-item{
        padding: 10px;
        overflow: hidden;
        box-shadow: 0px 0px 6px 6px #f4f4f4,inset 0px 0px 1px 4px rgb(229, 229, 229);
        border-radius: 5px;
        .follow-records-content{
          font-size: 16px;
          color: rgba(0, 0, 0, 0.87);
        }
        .follow-records-next,.follow-records-remark{
          display: block;
          font-size: 14px;
          color: rgba(0, 0, 0, 0.87);
        }
        .follow-records-remark{
          margin-top: 10px;
        }
        .follow-records-time{
          float: right;
          display: block;
          font-size: 12px;
          color: rgba(0, 0, 0, 0.67);
        }
      }
    }
    .basic{
      width: 100%;
      background: #f8f8f8;
      border-radius: 10px;
      padding: 15px;
      .title{
        display: flex;
        color: var(--fontColor-m);
        justify-content: space-around;
      }
      .data{
        display: flex;
        font-size: 14px;
        justify-content: space-around;
        margin-top: 10px;
      }
    }
    .followContent{
        .el-button{
          float: right;
          margin-top: 10px;
        }
      }
  }
</style>