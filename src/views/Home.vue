<template>
  <div class="container">
    <section class="section">
      <h1 class="title is-1 has-text-white">Games</h1>
      <div class="box">
        <div class="columns is-multiline">
          <div class="column is-4" v-for="game in games" :key="game._id">
            <router-link :to="`/game/${game._id}`" class="card">
              <div class="card-image" v-if="game.banner">
                <figure class="image">
                  <img :src="game.banner" alt="Placeholder image">
                </figure>
              </div>
              <div class="card-image" v-else>
                <figure class="image">
                  <img src="https://via.placeholder.com/450x250" alt="Placeholder image">
                </figure>
              </div>
              <div class="card-header">
                <p class="card-header-title">{{ game.name }}</p>
              </div>
              <div class="card-content">
                <div class="field is-grouped is-grouped-multiline">
                  <div class="control" v-for="rating in game.ratings.slice(0, 2)" :key="rating._id">
                    <div class="tags has-addons">
                      <span class="tag">{{ rating.name }}</span>
                      <span class="tag is-primary">{{ rating.value | round }}</span>
                    </div>
                  </div>
                  <div class="control" v-if="game.ratings.length > 2">
                    ...
                  </div>
                </div>
              </div>
              <footer class="card-footer">
                <div class="card-footer-item">
                  <small class="has-text-left">{{ game.ratings.length }} rating(s)</small>
                </div>
              </footer>
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <section class="section" v-if="user">
      <h2 class="title is-12 has-text-white">Add Game</h2>
      <div class="columns">
        <div class="column is-6">
          <div class="box">
            <add-new-game />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import {
  ALL_GAMES_QUERY
} from '@/graphql/'

import AddNewGame from '@/components/AddNewGame'
import AddGameRating from '@/components/AddGameRating'

export default {
  name: 'home',

  apollo: {
    games: ALL_GAMES_QUERY
  },

  computed: {
    ...mapGetters({
      user: 'user'
    })
  },

  components: {
    AddNewGame,
    AddGameRating
  }
}
</script>

<style lang="scss" scoped>
.card-image {
  max-height: 150px;
  min-height: 150px;
  overflow: hidden;
  display: flex;
  align-items: center;

  .image {
    flex: 1 1 auto;
  }
}
</style>
