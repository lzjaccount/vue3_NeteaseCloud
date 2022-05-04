import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/recommend',
    component: () => import('../views/recommend/Recommend.vue')
  },
  {
    path: '/songlist',
    component: () => import('../views/songList/SongList.vue')
  },
  {
    path: '/songlistdetail',
    component: () => import('../views/songListDetail/SongListDetail.vue')
  },
  {
    path: '/rankinglist',
    component: () => import('../views/rankingList/RankingList.vue')
  },
  {
    path: '/artist',
    component: () => import('../views/artist/Artist.vue')
  },
  {
    path: '/mv',
    component: () => import('../views/mvList/MVList.vue')
  },
  {
    path: '/mvdetail',
    component: () => import('../views/mvDetail/MVDetail.vue')
  },
  {
    path: '/newmusic',
    component: () => import('../views/newMusic/NewMusic.vue')
  },
  {
    path: '/searchresult',
    component: () => import('../views/searchResult/SearchResult.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
