import HomePage from '../Pages/HomePage.vue'
import SubmitPage from '../Pages/SubmitPage.vue'
import SubmissionsPage from '../Pages/SubmissionsPage.vue'
import NotFoundPage from '../Pages/NotFoundPage.vue'

export default [
  { path: '/', name: 'home', component: HomePage, meta: { title: 'Home' } },
  { path: '/submit', name: 'submit', component: SubmitPage, meta: { title: 'Submit' } },
  { path: '/submissions', name: 'submissions', component: SubmissionsPage, meta: { title: 'Submissions' } },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundPage, meta: { title: 'Page not found' } },
]