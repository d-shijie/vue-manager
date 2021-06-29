import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter)
const Login=()=>import("../views/login/Login")
const Home=()=>import("../views/home/Home")
const WelCome=()=>import("../views/welcome/WelCome")
const User=()=>import("../views/user/User")
const Rights=()=>import("../views/power/Rights")
const Roles=()=>import("../views/power/Roles")
const Goods=()=>import("../views/goods/Goods")
const Params=()=>import("../views/goods/Params")
const Category=()=>import("../views/goods/Category")
const Add=()=>import("../views/goods/Add")
const Report=()=>import("../views/report/Report")
const routes=[
    {
        path:"",
        redirect:"/login"
    },
    {
        path:"/login",
        component:Login
    },
    {
        path:"/home",
        component:Home,
        children:[
            {
                path:"",
                redirect:"/welcome"
            },
            {
                path:"/welcome",
                component:WelCome
            },
            {
                path:"/users",
                component:User
            },
            {
                path:"/rights",
                component:Rights
            },
            {
                path:"/roles",
                component:Roles
            },
            {
                path:"/goods",
                component:Goods
            },
            {
                path:"/params",
                component:Params
            },
            {
                path: "/categories",
                component:Category
            },
            {
                path:"/goods/add",
                component:Add
            },
            {
                path:"/reports",
                component:Report
            }
        ]
    }
]
const router=new VueRouter({
    routes,
})
router.beforeEach((to,from,next)=>{
    if(to.path==="/login") return next();
    const token=window.sessionStorage.getItem("token")
    if(token===null) next("./login")
    next()
})
export default router
