<template>
  <div>
    <section class="section">
      <div class="box has-background-black-ter">
        <div class="columns">
          <div class="column is-6">
            <div class="field">
              <label for="" class="label has-text-white">Name</label>
              <input type="text" class="input" v-model="values.name">
            </div>
          </div>
          <div class="column is-6">
            <img v-if="preview" :src="preview" alt="">
            <div class="field">
              <label for="" class="label has-text-white">Banner Image URL</label>
              <input type="text" class="input" v-model="values.banner">
            </div>
            <button class="button is-info" @click="updatePreview">Update Preview</button>
          </div>
        </div>
        <button class="button is-primary" @click="save">Save</button>
      </div>
    </section>
  </div>
</template>

<script>
import {
  GAME_QUERY,
  UPDATE_GAME_QUERY
} from '@/graphql'

export default {
  props: [
    'game',
    'user'
  ],

  data () {
    return {
      values: {},
      preview: ''
    }
  },

  watch: {
    game: {
      handler: function (newValue) {
        this.values = { ...newValue }
        this.preview = newValue.banner
      },
      immediate: true
    }
  },

  methods: {
    save () {
      this.$apollo.mutate({
        mutation: UPDATE_GAME_QUERY,
        variables: {
          id: this.game._id,
          game: {
            name: this.values.name,
            banner: this.values.banner
          }
        },
        update: (store, { data: { updateGame } }) => {
          const data = store.readQuery({ query: GAME_QUERY, variables: { id: this.game._id } })
          data.game = updateGame
          store.writeQuery({ query: GAME_QUERY, data, variables: { id: this.game._id } })
        }
      })
    },

    updatePreview () {
      this.preview = this.values.banner
    }
  }
}
</script>

<style scoped>

</style>
