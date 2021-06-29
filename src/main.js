import Vue from 'vue'
import App from './App.vue'
import router from "@/router";
import 'element-ui/lib/theme-chalk/index.css';
import "./assets/fonts/iconfont.css"
import "./assets/css/base.css"
import ElementUi from "element-ui"
import axios from "axios";
import VueQuillEditor from "vue-quill-editor";
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor)
Vue.use(ElementUi)
Vue.config.productionTip = false
axios.defaults.baseURL="http://127.0.0.1:8888/api/private/v1"
axios.interceptors.request.use((config)=>{
  config.headers.Authorization=window.sessionStorage.getItem("token")
  return config
})
Vue.prototype.$http=axios
//全局过滤器
Vue.filter("format",function (time){

})
new Vue({
  render: h => h(App),
  router
}).$mount('#app')
