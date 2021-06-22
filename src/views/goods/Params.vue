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
      <el-tabs v-model="activeName" @tab-click="tabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button @click="addParamsDialogVisible=true" :disabled="!(selectKeys.length===3)" size="mini" type="primary">
            添加参数</el-button>
          <el-table :data="manyTableData" stripe border>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag @close="tagClose(index,scope.row)" closable v-for="(item,index) in scope.row.attr_vals">
                  {{item}}
                </el-tag>
                <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作" >
              <template slot-scope="scope">
                <el-button @click="showEditDialog(scope.row.attr_id)" size="mini" type="primary" class="el-icon-edit">修改</el-button>
                <el-button  @click="deleteParams(scope.row.attr_id)" size="mini" type="danger" class="el-icon-delete">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button @click="addParamsDialogVisible=true" :disabled="!(selectKeys.length===3)" size="mini" type="primary">
            添加属性</el-button>
          <el-table :data="onlyTableData" stripe border>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag @close="tagClose(index,scope.row)" closable v-for="(item,index) in scope.row.attr_vals">
                  {{item}}
                </el-tag>
                <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作" >
              <template slot-scope="scope">
                <el-button @click="showEditDialog(scope.row.attr_id)" size="mini" type="primary" class="el-icon-edit">修改</el-button>
                <el-button @click="deleteParams(scope.row.attr_id)" size="mini" type="danger" class="el-icon-delete">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog
        @close="$refs.addParamsForm.resetFields()"
        :title="'添加'+title"
        :visible.sync="addParamsDialogVisible"
        width="50%">
      <el-form :model="addParamsForm" :rules="addParamsFormRules" ref="addParamsForm" label-width="100px" class="demo-ruleForm">
        <el-form-item :label="title" prop="attr_name">
          <el-input v-model="addParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addParamsDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addParams">确 定</el-button>
  </span>
    </el-dialog>
    <el-dialog
        :title="'修改'+title"
        :visible.sync="editParamsDialogVisible"
        width="50%">
      <el-form :model="editParamsForm" :rules="editParamsFormRules" ref="editParamsForm" label-width="100px" class="demo-ruleForm">
        <el-form-item :label="title" prop="attr_name">
          <el-input v-model="editParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editParamsDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editParams">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Params",
  data(){
    return {
      selectKeys:[],
      parentCateList:[],
      activeName:"many",
      manyTableData:[],
      onlyTableData:[],
      addParamsDialogVisible:false,
      addParamsForm:{
        attr_name:""
      },
      addParamsFormRules:{
        attr_name:[{required:true,message:"请输入参数",trigger:"blur"}]
      },
      editParamsDialogVisible:false,
      editParamsForm:{

      },
      editParamsFormRules:{
        attr_name:[{required:true,message:"请输入参数",trigger:"blur"}]
      },
      inputVisible:false,
      inputValue:""
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
    },
    title(){
      if(this.activeName==="many"){
        return "动态参数"
      }else {
        return "静态属性"
      }
    }
  },
  methods:{
    handleChange(){
      this.getParamsData()
    },
    getParentCateList() {
      this.$http.get("categories").then(res=>{
        this.parentCateList=res.data.data
      })
    },
    tabClick(){
      this.getParamsData()
    },
    async getParamsData(){
      if(this.selectKeys.length!==3){
        this.selectKeys=[]
        return
      }
      const {data:res}=await this.$http.get("categories/"+this.catId+"/attributes",
          {params:{sel:this.activeName}})
      if(res.meta.status!==200){
        this.$message.error("获取失败")
      }else {
        res.data.forEach(item=>{
          item.attr_vals=item.attr_vals? item.attr_vals.split(" ") : []
        })
        for(let i=0;i<res.data.length;i++){
          res.data[i].inputValue=""
          res.data[i].inputVisible=false
        }
        if(this.activeName==="many"){
          this.manyTableData=res.data
        }else{
          this.onlyTableData=res.data
        }
      }
    },
    addParams(){
      this.$refs.addParamsForm.validate(valid=>{
        if(!valid) return
        this.$http.post("categories/"+this.catId+"/attributes",
            {attr_name:this.addParamsForm.attr_name,attr_sel:this.activeName}).then(res=>{
          this.$message.success("添加成功")
          this.getParamsData()
          this.addParamsDialogVisible=false
        }).catch(err=>{
          this.$message.error("添加失败")
        })
      })
    },
    showEditDialog(attrId){
      this.$http.get("categories/"+this.catId+"/attributes/"+attrId,
          {params:{attr_sel:this.activeName}})
          .then(res=>{
            this.editParamsForm=res.data.data
            this.editParamsDialogVisible=true
          })
          .catch(err=>{
            this.$message.error("获取失败")
          })
    },
    editParams(){
      this.$refs.editParamsForm.validate(valid=>{
        if(!valid) return
        this.$http.put("categories/"+this.catId+"/attributes/"+this.editParamsForm.attr_id,
            {attr_name:this.editParamsForm.attr_name,attr_sel:this.activeName})
            .then(res=>{
              this.$message.success("修改成功")
              this.getParamsData()
              this.editParamsDialogVisible=false
            })
            .catch(err=>{
              this.$message.error('修改失败')
            })
      })
    },
    deleteParams(attrId){
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete("categories/"+this.catId+"/attributes/"+attrId).then(res=>{
          this.$message.success("删除成功")
          this.getParamsData()
        }).catch(err=>{
          this.$message.error("删除失败")
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    handleInputConfirm(row) {
      if(row.inputValue.trim().length===0){
        row.inputValue=""
        row.inputVisible=false
        return
      }
      row.attr_vals.push(row.inputValue)
      row.inputValue=""
      row.inputVisible=false
      this.$http.put("categories/"+this.catId+"/attributes/"+row.attr_id,
          {attr_name:row.attr_name,attr_sel:row.attr_sel,attr_vals:row.attr_vals.join(" ")})
          .then(res=>{
            this.$message.success("添加成功")
          }).catch(err=>{
        this.$message.error("添加失败")
      })
    },
    showInput(row) {
      row.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    tagClose(index,row){
      row.attr_vals.splice(index,1)
      this.$http.put("categories/"+this.catId+"/attributes/"+row.attr_id,
          {attr_name:row.attr_name,attr_sel:row.attr_sel,attr_vals:row.attr_vals.join(" ")})
          .then(res=>{
            this.$message.success("删除成功")
          }).catch(err=>{
        this.$message.error("删除失败")
      })
    }
  }
}
</script>

<style scoped>
.el-cascader{
  margin: 15px 0;
}
.input-new-tag{
  width: 120px;
}
.el-tag {
  margin: 0 10px;
}
</style>
