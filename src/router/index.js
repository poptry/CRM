import Vue from 'vue'
import VueRouter from 'vue-router'

//引入路由组件
import Login from '@/views/Login'
import Main from '@/views//Main'
import Home from '@/views/Home'
import Clue from '@/views/Clue'
import Client from '@/views/Client'
import Product from '@/views/Product'
import Return from '@/views/Return'
import Opportunity from '@/views/Opportunity'
import Contract from '@/views/Contract'
//插件使用
Vue.use(VueRouter)

//组件和路由映射
const routes = [
    {
        path:'/',
        component:Main,
        name:'Main',
        redirect:'./client',//重定向
        children:[
           {
            path:'/home',
            component:Home,
            name:'home'
           },
            {
            path:'/contract',
            component:Contract,
            name:'contract'
            },
            {
                path:'/return',
                component:Return,
                name:'return'
            },
            {
                path:'/opportunity',
                component:Opportunity,
                name:'opportunity'
            },
           {
            path:'/client',
            component:Client,
            name:'client'
           },
           {
            path:'/clue',
            component:Clue,
            name:'clue'
           },
           {
            path:'/product',
            component:Product,
            name:'product'
           }
        ]
    },
    //登录路由
    {
        path:'/login',
        component:Login,
        name:'login'
    }
]

//创建router实例
const router = new VueRouter({
    routes
})

export default router