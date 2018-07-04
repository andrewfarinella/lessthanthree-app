<template>
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
      <div class="columns">
        <div class="column is-9">
          <div class="box" v-for="rating in game.ratings" :key="rating._id">
            <div class="columns">
              <div class="column">
                <h3 class="title is-3">{{ rating.name }}</h3>
              </div>
              <div class="column has-text-right">
                <p class="title is-3 has-text-info">{{ rating.value | round }}</p>
              </div>
            </div>

            <div class="columns">
              <div class="column">
                <ul v-if="rating.votes">
                  <li v-for="vote in rating.votes" :key="vote._id">
                    <div class="columns">
                      <div class="column">
                        {{ vote.user.email }} | {{ vote.value }}
                      </div>
                      <div class="column has-text-right">
                        <button class="button is-danger" @click="removeVote(game._id, rating._id, vote._id)">Remove</button>
                      </div>
                    </div>
                  </li>
                </ul>
                <div class="columns">
                  <div class="column is-3">
                    <template v-if="user">
                      <add-rating-vote v-if="!hasVoted(rating.votes)" :game="game" :rating-id="rating._id" :user="user" />
                      <p v-else>
                        You have already voted.
                      </p>
                    </template>
                    <template v-else>
                      Log-in to cast your own vote!
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="column is-3">
          <div class="box">
            <h4 class="title is-4">Add Rating</h4>
            <add-game-rating :game="game" :user="user" />
          </div>
        </div>
      </div>

    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  GAME_QUERY,
  REMOVE_VOTE_QUERY
} from '@/graphql/'

import AddGameRating from '@/components/AddGameRating'
import AddRatingVote from '@/components/AddRatingVote'

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

  methods: {
    hasVoted (votes) {
      if (!this.user) {
        return false
      }
      return votes.map(x => x.user._id).indexOf(this.user._id) !== -1
    },
    removeVote (gameId, ratingId, voteId) {
      this.$apollo.mutate({
        mutation: REMOVE_VOTE_QUERY,
        variables: {
          gameId,
          ratingId,
          voteId
        }
      })
    }
  },

  components: {
    AddRatingVote,
    AddGameRating
  }
}
</script>

<style scoped>

</style>
