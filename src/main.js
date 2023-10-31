import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/common.css'
import '@/assets/color.css'
import router from './router';
import store from './store';



import '@/assets/iconfont/iconfont.css'
Vue.use(ElementUI)
Vue.config.productionTip = false


//路由守卫
router.beforeEach((to,from,next)=>{
  //判断token
  const token =localStorage.getItem('token')
  if(!token && to.name !=='login'){
    next('./login')
  }else{
    next()//一定要next()放行
  }
})

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
