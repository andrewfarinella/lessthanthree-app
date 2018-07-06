<template>
  <div>
    <div class="field">
      <label class="label" for="name">Game Name</label>
      <input type="text" class="input" id="name" name="name" v-model="name">
    </div>

    <div class="field">
      <div class="columns">
        <div class="column">
          <label for="rating.name" class="label">Name</label>
          <input type="text" class="input" name="rating.name" id="rating.name" v-model="rating.name">
        </div>
        <div class="column">
          <label for="rating.value" class="label">Value</label>
          <input type="text" class="input" name="rating.value" id="rating.value" v-model="rating.value">
        </div>
      </div>
    </div>

    <button class="button is-primary" @click="save">Save</button>
  </div>
</template>

<script>
import {
  ADD_GAME_QUERY,
  ALL_GAMES_QUERY
} from '@/graphql/'

export default {
  name: 'AddNewGame',

  data () {
    return {
      name: '',
      rating: {
        name: '',
        value: null
      }
    }
  },

  methods: {
    async save () {
      const optimisticResponse = {
        __typename: 'Mutation',
        createGame: {
          __typename: 'Game',
          _id: Math.random().toString(36),
          name: this.name,
          ratings: [
            {
              __typename: 'Rating',
              _id: Math.random().toString(36),
              name: this.rating.name,
              value: this.rating.value,
              votes: [
                {
                  __typename: 'Vote',
                  _id: Math.random().toString(36),
                  user: {
                    __typename: 'User',
                    _id: Math.random().toString(36),
                    email: ''
                  },
                  value: this.rating.value
                }
              ]
            }
          ]
        }
      }

      try {
        await this.$apollo.mutate({
          mutation: ADD_GAME_QUERY,
          variables: {
            name: this.name,
            ratings: [this.rating]
          },
          update: (store, { data: { createGame } }) => {
            const data = store.readQuery({ query: ALL_GAMES_QUERY })
            data.games.push(createGame)
            store.writeQuery({ query: ALL_GAMES_QUERY, data })
          },
          optimisticResponse
        })
      } catch (e) {
        console.error(e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
