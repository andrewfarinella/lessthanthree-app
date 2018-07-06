<template>
  <div class="game-content" :style="'background-image: url(\'' + game.banner + '\')'">
    <div class="container">
      <section class="section">
        <h1 class="title is-1 has-text-white">{{ game.name }}</h1>
        <div class="box">
          <nav class="breadcrumb" aria-label="breadcrumbs">
            <ul>
              <li><router-link to="/">Home</router-link></li>
              <li class="is-active"><a aria-current="page">{{ game.name }}</a></li>
            </ul>
          </nav>
        </div>
      </section>
      <router-view :game="game" :user="user"></router-view>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  GAME_QUERY
} from '@/graphql/'

export default {
  name: 'SingleGameView',

  data () {
    return {
      game: {
        name: '',
        ratings: []
      }
    }
  },

  apollo: {
    game: {
      query: GAME_QUERY,
      variables () {
        return { id: this.$route.params.id }
      }
    }
  },

  computed: {
    ...mapGetters({
      user: 'user'
    })
  },

  mounted () {
    this.$apollo.queries.game.refetch({
      id: this.$route.params.id
    })
  }
}
</script>

<style lang="scss" scoped>
.game-content {
  position: relative;
  z-index: 1;
  flex: 1 0 auto;
  background-position: top center;
  background-repeat: no-repeat;
  background-size: 100% auto;
}
.game-content::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -1;

  display: block;
  background: rgb(255,255,255);
  background: linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,1) 400px);
}
</style>
