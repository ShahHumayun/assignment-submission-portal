import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './routes.js'

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.afterEach((to) => {
  document.title = `${to.meta.title ?? 'Portal'} · Assignment Portal`
})

export default router