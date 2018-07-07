<template>
  <section class="section">
    <div class="columns">
      <div class="column" :class="{'is-9': user}">
        <div class="" id="rating-grid">
          <div class="rating" v-for="rating in game.ratings" :key="rating._id">
            <div class="box rating-box has-background-black-ter">
              <div class="columns">
                <div class="column">
                  <h3 class="title is-3 has-text-white">{{ rating.name }}</h3>
                </div>
                <div class="column has-text-right">
                  <p class="title is-1" :class="getRatingValueClass(rating.value)">{{ rating.value | round }}</p>
                </div>
              </div>

              <div class="columns">
                <div class="column">
                  <ul v-if="rating.votes">
                    <li v-for="vote in rating.votes" :key="vote._id">
                      <div class="columns is-marginless" style="align-items: center">
                        <div class="column is-1 is-paddingless">
                          <strong class="is-size-4" :class="getRatingValueClass(vote.value)">{{ vote.value }} </strong>
                        </div>
                        <div class="column is-8 is-paddingless">
                          <router-link :to="{ name: 'profile.show', params: { id: vote.user._id }}" class="has-text-white is-flex" style="align-items: center;">
                            <img :src="vote.user.picture" class="image is-16x16" style="border-radius: 50%; margin-right: 5px;" :alt="vote.user.name">
                          </router-link>
                        </div>
                        <div class="column is-3 is-paddingless has-text-right" v-if="$can('delete', vote)">
                          <button class="button is-small is-text" @click="removeVote(game._id, rating._id, vote._id)">
                            <span class="icon has-text-danger">
                              <i class="fas fa-times"></i>
                            </span>
                          </button>
                        </div>
                      </div>
                      <hr>
                    </li>
                  </ul>
                  <div class="columns">
                    <template v-if="user">
                      <template v-if="!hasVoted(rating.votes)">
                        <div class="column is-6">
                          <add-rating-vote :game="game" :rating-id="rating._id" :user="user" />
                        </div>
                      </template>
                      <template v-else>
                        <div class="column is-12">
                          <p class="has-text-white">
                            You have already voted.
                          </p>
                        </div>
                      </template>
                    </template>
                    <template v-else>
                      <div class="column is-12">
                        <p>Log-in to cast your own vote!</p>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="column is-3" v-if="user && game._id">
        <div class="box has-background-black-ter" v-if="$can('create', 'Rating')">
          <h4 class="title is-4 has-text-white">Add Rating</h4>
          <add-game-rating :game="game" :user="user" />
        </div>
        <div class="box has-background-black-bis" v-if="$can('update', 'Game')">
          <aside class="menu">
            <p class="menu-label">
              General
            </p>
            <ul class="menu-list">
              <li><router-link :to="{ name: 'game.edit', params: { id: game._id }}" class="has-text-white">Edit</router-link></li>
              <li v-if="$can('delete', 'Game')"><a class="has-text-danger">Delete</a></li>
            </ul>
          </aside>
        </div>
      </div>
    </div>

  </section>
</template>

<script>
import Masonry from 'masonry-layout'
import {
  REMOVE_VOTE_QUERY
} from '@/graphql/'

import AddGameRating from '@/components/AddGameRating'
import AddRatingVote from '@/components/AddRatingVote'

import {
  valueColorClass
} from '@/mixins'

export default {
  components: {
    AddRatingVote,
    AddGameRating
  },

  mixins: [
    valueColorClass
  ],

  props: [
    'game',
    'user'
  ],

  data () {
    return {
      msnry: null
    }
  },

  mounted () {
    this.$nextTick(() => {
      this.updateMasonry()
    })
  },

  watch: {
    game () {
      this.$nextTick(() => {
        this.updateMasonry()
      })
    },
    user () {
      this.$nextTick(() => {
        this.updateMasonry()
      })
    }
  },

  methods: {
    updateMasonry () {
      const grid = document.getElementById('rating-grid')
      this.msnry = new Masonry(grid, {
        itemSelector: '.rating'
      })
    },

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

<style lang="scss" scoped>
hr {
  margin: 0.5em 0 1em;
}

#rating-grid {
  margin: 0 -1rem;
}

.rating {
  width: calc(50% - 2rem);
  margin: 0 1rem 2rem;
}

.rating-box {
  hr {
    background-color: gray;
  }
}
</style>
