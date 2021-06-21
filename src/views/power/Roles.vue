<template>
  <div class="roles">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddUserDialog">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolesList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['bdtop','vcenter']" v-for="(item1,index1) in scope.row.children" :key="item1.id">
              <el-col :span="5">
                <el-tag  @close="removeRights(scope.row,item1.id)" closable>{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row class="vcenter" :class="{bdbottom:index2!==item1.children.length-1}" v-for="(item2,index2) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag  @close="removeRights(scope.row,item2.id)" closable type="success">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag @close="removeRights(scope.row,item3.id)" closable type="warning" v-for="(item3,index3) in item2.children">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="角色操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" class="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" class="el-icon-delete">删除</el-button>
            <el-button @click="showSetRightsDialog(scope.row)" size="mini" type="success" class="el-icon-setting">分配角色</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
        @close="setRightsDialogClose"
        title="分配权限"
        :visible.sync="setRightsDialogVisible"
        width="50%">
      <el-tree ref="tree"
               default-expand-all
               :default-checked-keys="defKeys"
               show-checkbox
               :data="rightsList"
               :props="treeProps"
               node-key="id" ></el-tree>
      <span slot="footer" class="dialog-footer">
    <el-button @click="setRightsDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="setRights">确 定</el-button>
  </span>
    </el-dialog>
    <el-dialog
        title="添加角色"
        :visible.sync="addUserDialogVisible"
        width="50%">
      <el-form :model="addUserForm" :rules="addUserFormRules" ref="addUserForm" label-width="100px">
        <el-form-item label="角色名称" prop="authName">
          <el-input v-model="addUserForm.authName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="desc">
          <el-input v-model="addUserForm.desc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addUserDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Roles",
  data(){
    return {
      rolesList:[],
      setRightsDialogVisible:false,
      defKeys:[],
      rightsList:[],
      treeProps:{
        label:"authName",
        children:"children"
      },
      roleId:"",
      addUserDialogVisible:false,
      addUserForm:{
        authName:"",
        desc:""
      },
      addUserFormRules:{
        authName: [{required:true,message:"请输入角色名称",trigger:"blur"}],
        desc:[{required:true,message:"请输入角色描述",trigger:"blur"}]
      }
    }
  },
  created() {
    this.getRolesList()
  },
  methods:{
    getRolesList(){
      this.$http.get("roles").then(res=>{
        this.rolesList=res.data.data
      }).catch(err=>{
        this.$message.error("获取角色列表失败")
      })
    },
    removeRights(role,rid){
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async ()=>{
        const {data:res}=await this.$http.delete("roles/"+role.id+"/rights/"+rid)
        if(res.meta.status!==200){
          return this.$message.error("删除权限失败")
        }else {
          role.children=res.data
          // this.getRolesList()
          this.$message.success("删除权限成功")
        }
      }).catch(err=>{
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      })

    },
    showSetRightsDialog(role){
      this.roleId=role.id
      this.$http.get("rights/tree").then(res=>{
        this.getKeys(role,this.defKeys)
        this.rightsList=res.data.data
        this.setRightsDialogVisible=true
      }).catch(err=>{
        this.$message.error("获取权限列表失败")
      })
    },
    getKeys(node,arr){
      if(!node.children){
        return arr.push(node.id)
      }else {
        node.children.forEach(item=>{
          this.getKeys(item,arr)
        })
      }
    },
    setRightsDialogClose(){
      this.defKeys=[]
    },
    async setRights(){
      const keys = [
        ...this.$refs.tree.getCheckedKeys(),
        ...this.$refs.tree.getHalfCheckedKeys()
      ];
      const strKeys=keys.join(',')
      const {data:res}=await this.$http.post("roles/"+this.roleId+"/rights",{rids:strKeys})
      if(res.meta.status!==200){
        this.$message.error("请求错误")
      }else {
        this.getRolesList()
        this.$message.success("分配成功")
        this.setRightsDialogVisible=false
      }
    },
    showAddUserDialog(){
      this.addUserDialogVisible=true
    },
    addUser(){
      this.$refs.addUserForm.validate(valid=>{
        if(!valid) return
        console.log(this.addUserForm)
        this.$http.post("roles",this.addUserForm).then(res=>{
          this.getRolesList()
          this.$message.success("创建成功")
          this.addUserDialogVisible=false
        }).catch(err=>{
          this.$message.error("创建失败")
        })
      })
    }
  }
}
</script>

<style scoped>
.el-tag {
  margin: 15px 10px;
}
.bdtop{
  border-top: 1px solid #eeeeee;
}
.bdbottom{
  border-bottom: 1px solid #eeeeee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
