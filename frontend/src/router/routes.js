import { TASK_MANAGEMENT_API } from '../config/apiConfig';

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') }
    ]
  },
  {
    path: `/${TASK_MANAGEMENT_API}/task_record`,
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/taskRecord.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
