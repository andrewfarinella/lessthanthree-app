<template>
  <div>
    <div class="field">
      <label class="label">Name</label>
      <input type="text" class="input" v-model="name">
    </div>
    <div class="field">
      <label class="label">Value</label>
      <input type="text" class="input" v-model="value" placeholder="98">
    </div>
    <button class="button is-info" @click="save">Add</button>
  </div>
</template>

<script>
import {
  ADD_GAME_RATING_QUERY,
  GAME_QUERY
} from '@/graphql/'

export default {
  props: {
    game: { required: true }
  },

  data () {
    return {
      name: '',
      value: null
    }
  },

  methods: {
    async save () {
      const rating = {
        name: this.name,
        value: this.value
      }

      this.name = ''
      this.value = null
      const optimisticResponse = {
        __typename: 'Mutation',
        addGameRating: this.game
      }
      await this.$apollo.mutate({
        mutation: ADD_GAME_RATING_QUERY,
        variables: {
          id: this.game._id,
          rating
        },
        update: (store, { data: { addGameRating } }) => {
          const data = store.readQuery({ query: GAME_QUERY, variables: { id: addGameRating._id } })
          data.game = addGameRating
          store.writeQuery({
            query: GAME_QUERY,
            data,
            variables: {
              id: addGameRating._id
            }
          })
        },
        optimisticResponse
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
