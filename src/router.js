import Vue from 'vue'
import Router from 'vue-router'
import Games from './views/Games.vue'
import Game from './views/Game.vue'
import GameSingle from './views/GameSingle.vue'
import GameEdit from './views/GameEdit.vue'
import About from './views/About.vue'
import AuthCallback from './components/AuthCallback.vue'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Games
    },
    {
      path: '/game/:id',
      component: Game,
      children: [
        {
          path: '',
          name: 'game.show',
          component: GameSingle
        },
        {
          path: 'edit',
          name: 'game.edit',
          component: GameEdit
        }
      ]
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
