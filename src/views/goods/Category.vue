<template>
  <div class="category">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <el-table border  :data="categoryList" row-key="cat_id" :tree-props="treeProps">
        <el-table-column label="分类名称" prop="cat_name"></el-table-column>
        <el-table-column label="是否有效">
          <template slot-scope="scope">
            <i style="color:lightgreen" v-if="scope.row.deleted!==false" class="el-icon-success"></i>
            <i style="color: red" v-else class="el-icon-error"></i>
          </template>
        </el-table-column>
        <el-table-column label="排序">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.cat_level===0" type="primary">一级</el-tag>
            <el-tag v-else-if="scope.row.cat_level===1" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" class="el-icon-edit">编辑</el-button>
            <el-button type="warning" class="el-icon-delete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 5, 10, 20]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
      <el-dialog
          title="添加分类"
          :visible.sync="addCateDialogVisible"
          width="50%">
        <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateForm" label-width="100px">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
            <el-cascader
                clearable
                change-on-select
                v-model="selectKeys"
                :options="parentCateList"
                :props="{ expandTrigger: 'hover',label:'cat_name',value:'cat_id',children:'children' }"
                @change="handleChange"></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
    <el-button @click="addCateDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Category",
  data(){
    return {
      queryInfo:{
        type:3,
        pagenum:1,
        pagesize:5
      },
      categoryList:[],
      total:0,
      treeProps:{
        children:"children"
      },
      addCateDialogVisible:false,
      addCateForm:{
        cat_name:"",
        cat_id:"",
        cat_level:""
      },
      addCateFormRules:{
        cat_name: [{required:true,message:"请输入分类名称",trigger:"blur"}]
      },
      parentCateList:[],
      selectKeys:""
    }
  },
  created() {
    this.getCategoryList()
  },
  methods:{
    async getCategoryList(){
      const {data:res}=await this.$http.get("categories",{params:this.queryInfo})
      if(res.meta.status!==200){
        this.$message.error("获取分类列表失败")
      }else {
        this.categoryList=res.data.result
        this.total=res.data.total
      }
    },
    handleSizeChange(size){
      this.queryInfo.pagesize=size
      this.getCategoryList()
    },
    handleCurrentChange(num){
      this.queryInfo.pagenum=num
      this.getCategoryList()
    },
    showAddCateDialog(){
      this.getParentCateList()
      this.addCateDialogVisible=true
    },
    handleChange(){
      if(this.selectKeys>0){
        this.addCateForm.cat_pid=this.selectKeys[this.selectKeys.length-1]
        this.addCateForm.cat_level=this.selectKeys.length
        return
      }
      this.addCateForm.cat_pid=0
      this.addCateForm.cat_level=0
    },
    getParentCateList(){
      this.$http.get("categories",{params:{type:2}}).then(res=>{
        this.parentCateList=res.data.data
      }).catch(err=>{
        this.$message.error("获取分类成功")
      })
    },
    addCate(){
      this.$refs.addCateForm.validate(valid=>{
        if(!valid) return
        this.$http.post("categories",this.addCateForm).then(res=>{
          this.getCategoryList()
          this.$message.success("添加成功")
          this.addCateDialogVisible=false
        }).catch(err=>{
          this.$message.error("添加失败")
        })
      })
    }
  }
}
</script>

<style scoped>
.el-cascader{
  width: 100%;
}
</style>
