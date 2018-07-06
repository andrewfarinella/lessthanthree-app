<template>
  <div class="field is-grouped">
    <p class="control is-expanded">
      <input class="input" type="text" placeholder="98" v-model="rating">
    </p>
    <p class="control">
      <button type="button" @click="save" class="button is-info">
        Vote
      </button>
    </p>
  </div>
</template>

<script>
import {
  ADD_VOTE_QUERY,
  GAME_QUERY
} from '@/graphql'

export default {
  props: {
    game: { required: true },
    ratingId: { required: true },
    user: { required: false }
  },

  data () {
    return {
      rating: null
    }
  },

  mounted () {
  },

  methods: {
    save () {
      const optimisticResponse = {
        __typename: 'Mutation',
        addRatingVote: this.game
      }

      const rating = this.rating
      this.rating = null

      this.$apollo.mutate({
        mutation: ADD_VOTE_QUERY,
        variables: {
          ratingId: this.ratingId,
          vote: {
            user: this.user._id,
            value: rating
          }
        },
        update: (store, { data: { addRatingVote } }) => {
          const data = store.readQuery({ query: GAME_QUERY, variables: { id: this.game._id } })
          data.game = addRatingVote
          store.writeQuery({
            query: GAME_QUERY,
            data,
            variables: {
              id: this.game._id
            }
          })
        },
        optimisticResponse
      })
    }
  }
}
</script>

<style scoped>

</style>
