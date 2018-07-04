import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Game from './views/Game.vue'
import About from './views/About.vue'
import AuthCallback from './components/AuthCallback.vue'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/game/:id',
      name: 'single-game',
      component: Game
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },
    {
      path: '/callback',
      name: 'auth-callback',
      component: AuthCallback
    }
  ]
})
