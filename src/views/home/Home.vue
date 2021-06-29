<template>
  <el-container>
    <el-header>
      <div class="left">
        <img src="../../assets/img/img_1.png" alt="">
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button></el-header>
    <el-container>
      <el-aside :width="isCollapse===true? '64px' : '300px'">
        <div @click="collapse" class="collapse">|||</div>
        <el-menu
            :router="true"
            :unique-opened="true"
            :collapse-transition="false"
            :default-active="path"
            :collapse="isCollapse"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b">
          <el-submenu v-for="(item,index) in menuList" :key="item.id" :index="item.id+''">
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item @click="savePath('/'+item.path)" v-for="(item,index) in item.children" :key="item.id" :index="'/'+item.path">
              <i class="el-icon-menu"></i>
              <span slot="title">{{ item.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  data(){
    return {
      iconObj:{
        '125':"iconfont icon-user",
        '103':"iconfont icon-tijikongjian",
        '101':"iconfont icon-shangpin",
        '102':"iconfont icon-danju",
        '145':"iconfont icon-baobiao"
      },
      menuList:[],
      path:"",
      isCollapse:false
    }
  },
  created() {
    this.getMenuList()
  },
  methods:{
    logout(){
      window.sessionStorage.clear()
      this.$router.push("/login")
    },
    async getMenuList(){
      const {data:res}=await this.$http.get("menus")
      if(res.meta.status!==200) {
        this.$message.error("获取失败")
      }else {
        this.menuList=res.data
      }
    },
    savePath(path){
    this.path=path
  },
    collapse(){
      this.isCollapse=!this.isCollapse
    }
  }
}
</script>

<style scoped>
.el-container {
  height: 100%;
}
.el-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #181818;
}
.el-aside {
  background-color: #636262;
}
.el-main {
  background:-webkit-linear-gradient(top,rgba(0,0,0,.3),white);
}
.el-submenu {
  background-color: #2e2e45;
}
.left {
  display: flex;
  align-items: center;
  font-size: 18px;
  color: #ffffff;
}
.left img{
  margin-right: 15px;
  border-radius: 50%;
  width: 50px;
}
.collapse{
  text-align: center;
  color: #ffffff;
  font-size: 12px;
  padding: 5px 0;
  cursor: pointer;
  letter-spacing: 0.2em;
}
</style>
