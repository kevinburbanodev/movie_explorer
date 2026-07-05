import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'movie-list',
      component: () => import('@/features/movies/pages/MovieListPage.vue'),
    },
    {
      path: '/movies/:id',
      name: 'movie-detail',
      component: () => import('@/features/movies/pages/MovieDetailPage.vue'),
      props: true,
    },
    {
      path: '/person/:id',
      name: 'person-detail',
      component: () => import('@/features/people/pages/PersonDetailPage.vue'),
      props: true,
    },
  ],
  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition ?? { top: 0 }
  },
})

export default router
