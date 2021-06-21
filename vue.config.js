const path = require("path");
module.export={
    devServer:{
        open:true,
        proxy:{
            "/api":{
                target:"目标地址",
                changeOrigin:true,//允许跨域
                pathRewrite:{
                    "^/api":""
                },//路径重写
            }
        }
    }
}
