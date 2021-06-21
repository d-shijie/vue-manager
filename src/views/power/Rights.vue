<template>
  <div class="rights">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table :data="rightList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column  label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level==='0'" type="primary">一级</el-tag>
            <el-tag v-else-if="scope.row.level==='1'" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Rights",
  data(){
    return {
      rightList:[]
    }
  },
  created() {
    this.getRightsList()
  },
  methods:{
   async getRightsList(){
      const {data:res}=await this.$http.get("rights/list")
     res.meta.status=200? this.rightList=res.data : this.$message.error("获取权限列表失败")
    }
  }
}
</script>

<style scoped>

</style>
