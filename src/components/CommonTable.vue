<template>
  <div>
    sddddddddd
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
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>