import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter)
const Login=()=>import("../views/login/Login")
const Home=()=>import("../views/home/Home")
const WelCome=()=>import("../views/welcome/WelCome")
const User=()=>import("../views/user/User")
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
