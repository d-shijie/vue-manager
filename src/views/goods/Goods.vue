<template>
  <div class="goods">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input clearable @clear="getGoodsList" v-model="queryInfo.query" aria-placeholder="请输入内容" >
            <el-button @click="getGoodsList" slot="append" class="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAdd">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column width="120px" label="商品价格(元)" prop="goods_price"></el-table-column>
        <el-table-column width="90px" label="商品重量" prop="goods_weight"></el-table-column>
        <el-table-column width="150px" label="商品创建时间" prop="add_time">
          <template slot-scope="scope">
            {{scope.row.add_time|dataFormat}}
          </template>
        </el-table-column>
        <el-table-column width="140px" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" class="el-icon-edit"></el-button>
            <el-button @click="deleted(scope.row.goods_id)" type="danger" size="mini" class="el-icon-delete"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Goods",
  data(){
    return {
      queryInfo:{
        query:"",
        pagenum:1,
        pagesize:10
      },
      goodsList:[],
      total:0
    }
  },
  created() {
    this.getGoodsList()
  },
  methods:{
    async getGoodsList(){
      const {data:res}=await this.$http.get("goods",{params:this.queryInfo})
      if(res.meta.status!==200){
        this.$message.error("获取商品列表失败")
      }else {
        this.goodsList=res.data.goods
        console.log(this.goodsList)
        this.total=res.data.total
      }
    },
    handleSizeChange(size){
      this.queryInfo.pagesize=size
      this.getGoodsList()
    },
    handleCurrentChange(num){
      this.queryInfo.pagenum=num
      this.getGoodsList()
    },
    deleted(id){
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const {data:res}=await this.$http.delete("goods/"+id)
        if(res.meta.status!==200){
          this.$message.error("删除失败")
        }else {
          this.$message.success("删除成功")
          await this.getGoodsList()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });

    },
    goAdd(){
      this.$router.push("/goods/add")
    }
  },
  filters:{
    dataFormat(value){
      const time=new Date(value)
      const year=time.getFullYear()
      const month=(time.getMonth()+1+"").padStart(2,"0")
      const day=(time.getDate()+"").padStart(2,"0")
      const hour=(time.getHours()+"").padStart(2,"0")
      const m=(time.getMinutes()+"").padStart(2,"0")
      const s=(time.getSeconds()+"").padStart(2,"0")
      return year+"-"+month+"-"+day+" "+hour+":"+m+":"+s
    }
  }
}
</script>

<style scoped>
.cell{
  font-size: 12px !important;
}
</style>
