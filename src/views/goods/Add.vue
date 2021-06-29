<template>
  <div class="add">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
          title="添加商品信息"
          type="info"
          center
          show-icon>
      </el-alert>
      <el-steps align-center :active="activeIndex-''" finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form label-position="top" :model="addForm" :rules="addFormRules" ref="addForm" label-width="100px">
        <el-tabs @tab-click="tabClick" :before-leave="tabLeave" v-model="activeIndex"  tab-position="left" >
          <el-tab-pane name="0" label="基本信息">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input type="number" v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input type="number" v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item  label="商品数量" prop="goods_number">
              <el-input type="number" v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                  v-model="addForm.goods_cat"
                  :options="cateList"
                  :props="{ expandTrigger: 'hover',value:'cat_id',label:'cat_name',children:'children' }"
                  @change="handleChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="1"  label="商品参数">
            <el-form-item v-for="(item,index) in attrList"
                          :label="item.attr_name"
                          :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox border
                             :key="index"
                             v-for="(item,index) in item.attr_vals"
                             :label="item"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="2"  label="商品属性">
            <el-form-item v-for="(item,index) in onlyData" :label="item.attr_name">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="3"  label="商品图片">
            <el-upload
                :headers="headerObj"
                action="http://127.0.0.1:8888/api/private/v1/upload"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :on-success="handleSuccess"
                list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane name="4"  label="商品内容">
            <quill-editor  v-model="addForm.goods_introduce"></quill-editor>
            <el-button @click="add" class="add_btn" type="primary">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <el-dialog
        title="图片预览"
        :visible.sync="uploadDialogVisible"
        width="50%">
      <img :src="preViewPath" class="previewImg" alt="">

    </el-dialog>
  </div>
</template>

<script>
import _ from "lodash"
export default {
  name: "Add",
  data(){
    return {
      addForm:{
        goods_name:"",
        goods_price:"",
        goods_weight:"",
        goods_number:"",
        goods_cat:"",
        pics:[],
        goods_introduce:"",
        attrs:[]
      },
      addFormRules:{
        goods_name:[{required:true,message:"请输入商品名称",trigger:"blur"}],
        goods_price:[{required:true,message:"请输入商品价格",trigger:"blur"}],
        goods_weight:[{required:true,message:"请输入商品重量",trigger:"blur"}],
        goods_number:[{required:true,message:"请输入商品数量",trigger:"blur"}],
        goods_cat:[{required:true,message:"请选择商品分类",trigger:"blur"}],
      },
      activeIndex:"0",
      cateList:[],
      attrList:[],
      onlyData:[],
      uploadDialogVisible:false,
      headerObj:{
        Authorization:window.sessionStorage.getItem("token")
      },
      preViewPath:""
    }
  },
  computed:{
    catId(){
      if(this.addForm.goods_cat.length===3){
        return this.addForm.goods_cat[2]
      }
      return null
    }
  },
  created() {
    this.getCategoryList()
  },
  methods:{
    async getCategoryList(){
      const {data:res}=await this.$http.get("categories")
      if(res.meta.status!==200){
        this.$message.error("获取商品分类列表失败")
      }else {
        this.cateList=res.data
      }
    },
    handleChange(){
      if(this.addForm.goods_cat.length!==3){
        this.addForm.goods_cat=[]
      }
    },
    tabLeave(activeName,oldActiveName){
      if(oldActiveName==="0"&&this.addForm.goods_cat.length!==3){
        this.$message.error("请选择商品分类")
        return false
      }
    },
    tabClick(){
      if(this.activeIndex==="1"){
        this.$http.get("categories/"+this.catId+"/attributes",{params:{sel:"many"}})
            .then(res=>{
              this.$message.success("获取商品参数成功")
              this.attrList=res.data.data
            }).catch(err=>{
          this.$message.error("获取商品参数失败")
        })
      }
      else if(this.activeIndex==='2'){
        this.$http.get("categories/"+this.catId+"/attributes",{params:{sel:"only"}})
            .then(res=>{
              console.log(res)
              this.onlyData=res.data.data
            })
            .catch(err=>{
              this.$message.error("获取商品属性失败")
            })
      }
    },
    handlePreview(file){
      this.preViewPath=file.response.data.url
      this.uploadDialogVisible=true
    },
    handleRemove(file){
      const filePath=file.response.data.tmp_path
      const i=this.addForm.pics.findIndex(item=>
          item.pic===filePath
      )
      this.addForm.pics.splice(i,1)
    },
    handleSuccess(file){
      this.$message.success("上传成功")
      const picInfo={pic:file.data.tmp_path}
      this.addForm.pics.push(picInfo)
    },
    add(){
      this.$refs.addForm.validate(async valid=>{
        if(!valid){
          this.$message.error("请填写必要的表单项")
        }else {
          const form=_.cloneDeep(this.addForm)
          console.log(form)
          form.goods_cat=form.goods_cat.join(",")
          this.attrList.forEach(item=>{
            const newInfo={
              attr_id:item.attr_id,
              attr_value:item.attr_vals.join(" ")
            }
            this.addForm.attrs.push(newInfo)
          })
          this.onlyData.forEach(item=>{
            const newInfo={
              attr_id:item.attr_id,
              attr_value:item.attr_vals
            }
            this.addForm.attrs.push(newInfo)
          })
          form.attrs=this.addForm.attrs
          const {data:res} = await this.$http.post("goods",form)
          if(res.meta.status!==201){
            this.$message.error("添加商品失败")
          }else {
            this.$message.success("添加商品成功")
            await this.$router.push("/goods")
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.el-steps{
  margin: 15px 0;
}
.previewImg {
  width: 100%;
}

.add_btn {
  margin-top: 15px;
}
</style>
