/* eslint-disable */
import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

import store from "@/store";

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Login',
    component: () => import('@/views/logInToRegister.vue'),
  },
  {
    path: '/aboutUs',
    name: 'aboutUs',
    component: () => import('@/views/agreement/aboutUs.vue'),
  },
  {
    path: '/userAgre',
    name: 'userAgre',
    component: () => import('@/views/agreement/userAgreement.vue'),
  },
  {
    path: '/privacyPolicy',
    name: 'privacyPolicy',
    component: () => import('@/views/agreement/privacyPolicy.vue'),
  },
  {
    path: '/advertis',
    name: 'advertis',
    component: () => import('@/views/agreement/advertis.vue'),
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    children: [{
      path: 'cont/:id',
      component: () => import('@/views/HomeCont.vue'),
      name: 'HomeCont'
    }, {
      path: 'journal/:id',
      component: () => import('@/views/journal.vue'),
      name: 'journal',
      children: [{
        path: 'all',
        component: () => import('@/views/journalAll.vue'),
        name: 'all',
      }, {
        path: 'class',
        component: () => import('@/views/journalClass.vue'),
        name: 'class',
      }, {
        path: 'list',
        component: () => import('@/views/journalClassList.vue'),
        name: 'list',
      }]
    }, {
      path: 'globalSearch/:id',
      component: () => import('@/views/globalSearch.vue'),
      name: 'globalSearch'
    }, {
      path: 'myCollection/:id',
      component: () => import('@/views/myCollection.vue'),
      name: 'myCollection'
    }, {
      path: 'personalSettings/:id',
      component: () => import('@/views/personalSettings.vue'),
      name: 'personalSettings'
    }]
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  { path: '*', redirect: '/' }
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (store.state.token) {
    next();
  }
  else {
    if (to.path == '/' || to.path == '/aboutUs' || to.path == '/userAgre' || to.path == '/privacyPolicy' || to.path == '/advertis') {
      next();
    }
    else {
      next('/')
    }
  }


})

export default router
