<template>
  <div class="params">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
          title="注意，只有第三级分类可以设置参数"
          type="warning"
          show-icon>
      </el-alert>
      <el-row>
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
              clearable
              v-model="selectKeys"
              :options="parentCateList"
              :props="{ expandTrigger: 'hover',label:'cat_name',value:'cat_id',children:'children' }"
              @change="handleChange"></el-cascader>
        </el-col>
      </el-row>
      <el-tabs :active-name="activeName" @tab-click="tabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button :disabled="!(selectKeys.length===3)" size="mini" type="primary"> 添加参数</el-button>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button :disabled="!(selectKeys.length===3)" size="mini" type="primary"> 添加属性</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Params",
  data(){
    return {
      selectKeys:[],
      parentCateList:[],
      activeName:"many"
    }
  },
  created() {
    this.getParentCateList()
  },
  computed:{
    catId(){
      if(this.selectKeys.length===3){
        return this.selectKeys[2]
      }
      return null
    }
  },
  methods:{
    handleChange(){
      this.getParentData()
    },
    getParentCateList() {
      this.$http.get("categories").then(res=>{
        this.parentCateList=res.data.data
      })
    },
    tabClick(){
      this.getParentData()
    },
    getParentData(){
      this.$http.get("categories/"+this.catId+"/attributes",{params:{sel:this.activeName}}).then(res=>{
        console.log(res)
      }).catch(err=>{
        this.$message.error("获取数据失败")
      })
    }
  }
}
</script>

<style scoped>
.el-cascader{
  margin: 15px 0;
}
</style>
