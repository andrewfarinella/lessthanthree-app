<template>
  <section class="section">
    <div class="columns">
      <div class="column" :class="{'is-9': user}">
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
                    <div class="column has-text-right" v-if="$can('delete', vote)">
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
      <div class="column is-3" v-if="user">
        <div class="box" v-if="$can('create', 'Rating')">
          <h4 class="title is-4">Add Rating</h4>
          <add-game-rating :game="game" :user="user" />
        </div>
        <div class="box" v-if="$can('update', 'Game')">
          <aside class="menu">
            <p class="menu-label">
              General
            </p>
            <ul class="menu-list">
              <li><router-link :to="{ name: 'game.edit', params: { id: game._id }}">Edit</router-link></li>
              <li v-if="$can('delete', 'Game')"><a class="has-text-danger">Delete</a></li>
            </ul>
          </aside>
        </div>
      </div>
    </div>

  </section>
</template>

<script>
import {
  REMOVE_VOTE_QUERY
} from '@/graphql/'

import AddGameRating from '@/components/AddGameRating'
import AddRatingVote from '@/components/AddRatingVote'

export default {
  components: {
    AddRatingVote,
    AddGameRating
  },

  props: [
    'game',
    'user'
  ],

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
  }
}
</script>

<style scoped>

</style>
