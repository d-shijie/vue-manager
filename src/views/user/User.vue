<template>
  <div class="user">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" clearable v-model="queryInfo.query" class="input-with-select">
            <el-button @click="getUserList" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button @click="addDialogVisible=true" type="primary">
            添加用户
          </el-button>
        </el-col>
      </el-row>
      <el-table
          stripe
          border
          :data="userList"
          style="width: 100%">
        <el-table-column
            prop="username"
            label="用户名"
            width="180">
        </el-table-column>
        <el-table-column
            prop="email"
            label="邮箱"
            width="180">
        </el-table-column>
        <el-table-column
            prop="mobile"
            label="电话"
            width="180">
        </el-table-column>
        <el-table-column
            prop="role_name"
            label="用户名"
            width="180">
        </el-table-column>
        <el-table-column
            prop="mg_state"
            label="状态"
            width="180">
          <template slot-scope="scope">
            <el-switch @change="userStateChange(scope.row)" v-model="scope.row.mg_state">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
            label="操作"
            width="180">
          <template slot-scope="scope">
            <el-button @click="showEditDialog(scope.row.id)" type="primary" icon="el-icon-edit" circle></el-button>
            <el-button @click="removeUser(scope.row.id)" type="danger" icon="el-icon-delete" circle></el-button>
            <el-button @click="showSetRightsDialog(scope.row)" type="warning" icon="el-icon-setting" circle></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 2, 3, 4]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </el-card>
    <el-dialog
        @close="addDialogClose"
        title="添加用户"
        :visible.sync="addDialogVisible"
        width="40%">
      <el-form :model="addForm" :rules="addFormRules" ref="addForm" label-width="100px" >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
    </el-dialog>
    <el-dialog
        title="编辑"
        :visible.sync="editDialogVisible"
        width="40%">
      <el-form :model="editForm" :rules="editFormRules" ref="editForm" label-width="100px">
        <el-form-item label="用户名"  prop="username">
          <el-input disabled v-model="editForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱"  prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUser">确 定</el-button>
  </span>
    </el-dialog>
    <el-dialog
        title="分配角色"
        :visible.sync="setRightsDialogVisible"
        width="50%">
      <div>
        <p>当前用户：{{userInfo.username}}</p>
        <p>当前角色：{{userInfo.role_name}}</p>
        <p>分配新角色： <el-select v-model="selectRoleId" placeholder="请选择">
          <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
          </el-option>
        </el-select></p>
      </div>

      <span slot="footer" class="dialog-footer">
    <el-button @click="setRightsDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="setRoles">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "User",
  data(){
    let checkEmail=(rule,value,callback)=>{
      let regEmail=/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if(regEmail.test(value)){
        return callback()
      }else {
        callback(new Error("请输入正确的邮箱"))
      }
    }
    let checkPhone=(rule,value,callback)=>{
      let regPhone=/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
      if(regPhone.test(value)){
        return callback()
      }else {
        callback(new Error("请输入正确的手机号"))
      }
    }
    return {
      userList:[],
      queryInfo:{
        query:"",
        pagenum:1,
        pagesize:2
      },
      total:0,
      addDialogVisible:false,
      addForm:{
        username:"",
        password:"",
        email:"",
        mobile:""
      },
      addFormRules:{
        username:[
          {required:true,message:"请输入手机号",trigger:"blur"},
          {min:3,max:10,message: "用户名在3-10个字符之间",trigger: "blur"}
        ],
        password: [
          {required:true,message:"请输入密码",trigger:"blur"},
          {min:6,max:15,message: "用户名在6-15个字符之间",trigger: "blur"}
        ],
        email:[
          {required:true,message:"请输入邮箱",trigger:"blur"},
          {validator:checkEmail,trigger: "blur"}
        ],
        mobile:[
          {required:true,message:"请输入手机号",trigger:"blur"},
          {validator:checkPhone,trigger: "blur"}
        ],
      },
      editDialogVisible:false,
      editForm:{},
      editFormRules:{
        email: [{required:true,message:"请输入邮箱",trigger: "blur"},
          {validator:checkEmail,trigger: "blur"}],
        mobile:[{required:true,message:"请输入手机号",trigger: "blur"},
          {validator:checkPhone,trigger: "blur"}]
      },
      setRightsDialogVisible:false,
      userInfo:{},
      rolesList:[],
      selectRoleId:""
    }
  },
  created() {
    this.getUserList()
  },
  methods:{
    async getUserList(){
      const {data :res}=await this.$http.get("users",{params:this.queryInfo})
      if(res.meta.status!==200){
        this.$message.error("请求错误")
      }else {
        this.userList=res.data.users
        this.total=res.data.total
      }
    },
    async userStateChange(row){
      const {data:res}=await this.$http.put("users/"+row.id+"/state/"+row.mg_state)
      if(res.meta.status!==200){
        row.mg_state=!row.mg_state
        this.$message.error("更新失败")
      }else {
        this.$message.success("更新成功")

      }
    },
    handleSizeChange(val){
      this.queryInfo.pagesize=val
      this.getUserList()
    },
    handleCurrentChange(val){
      this.queryInfo.pagenum=val
      this.getUserList()
    },
    addUser(){
      this.$refs.addForm.validate(async valid=>{
        if(!valid) return;
        const {data:res}=await this.$http.post("users",this.addForm)
        if(res.meta.status!==201){
          this.$message.error("添加用户失败")
        }else {
          this.$message.success("添加用户成功")
          this.addDialogVisible=false
          await this.getUserList()
        }
      })
    },
    addDialogClose(){
      this.$refs.addForm.resetFields()
    },
    async showEditDialog(id){
      const {data:res}=await this.$http.get("users/"+id)
      if(res.meta.status!==200){
        this.$message.error("查询失败")
      }else {
        this.editForm=res.data
        this.editDialogVisible=true
      }
    },
    editUser(){
      this.$refs.editForm.validate(valid=>{
        if(valid===false){
          return
        }else {
          this.$http.put("users/"+this.editForm.id,
              {email:this.editForm.email,mobile:this.editForm.mobile})
              .then(res=>{
                this.getUserList()
                this.editDialogVisible=false
              }).catch(err=>{
            this.$message.error("修改用户失败")
          })
        }
      })
    },
    removeUser(id){
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete("users/"+id).then(res=>{
          this.getUserList()
          this.$message.success("删除成功")
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
    showSetRightsDialog(role){
      this.userInfo=role
      this.getRolesList()
      this.setRightsDialogVisible=true
    },
    getRolesList() {
      this.$http.get("roles").then(res=>{
        this.rolesList=res.data.data
      }).catch(err=>{
        this.$message.error("获取角色列表失败")
      })
    },
    setRoles(){
      if(!this.selectRoleId){
        this.$message.info("请选择要分配的角色")
      }else {
        this.$http.put("users/"+this.userInfo.id+"/role",{rid:this.selectRoleId}).then(res=>{
          this.getUserList()
          this.setRightsDialogVisible=false
        }).catch(err=>{
          this.$message.error("分配失败")
        })
      }
    }
  }
}
</script>

<style scoped>
.el-card {
  margin-top: 15px;
}
.el-table {
  margin-top: 15px;
}
.el-pagination{
  margin-top: 10px;
}
</style>
