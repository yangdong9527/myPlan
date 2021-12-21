import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const contexts = require.context('../views', true, /\.vue$/)

const routes: Array<RouteRecordRaw> = []

contexts.keys().forEach(key => {
  const componentConfig = contexts(key).default
  const routePath = key.replace(/^\.\//, '').replace(/\.vue$/, '')
  // 全局注册组件
  routes.push({
    path: '/' + routePath,
    name: componentConfig.name,
    component: () => import('../views/' + routePath + '.vue')
  })
})

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    ...routes,
    {
      path: '/',
      redirect: '/Home'
    }
  ]
})

export default router
