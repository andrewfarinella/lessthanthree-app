<template>
  <div class="profile-content">
    <div class="container">
      <section class="section" v-if="profile">
        <div class="columns" style="align-items: center">
          <div v-if="profile.picture" class="column is-1">
            <img :src="profile.picture" alt="" class="image is-64x64 is-inline-block" style="border-radius: 50%">
          </div>
          <div class="column">
            <h1 class="title is-1 has-text-white">{{ profile.name }}!</h1>
          </div>
        </div>
      </section>
      <router-view :profile="profile"></router-view>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import {
  USER_QUERY
} from '@/graphql/'

export default {
  name: 'Profile',

  data () {
    return {
      profile: null
    }
  },

  computed: {
    ...mapGetters({
      user: 'user'
    })
  },

  watch: {
    user: {
      handler: function (newValue) {
        if (!this.$route.params || !this.$route.params.id) {
          this.profile = newValue
        }
      },
      immediate: true
    }
  },

  mounted () {
    if (this.$route.params && this.$route.params.id) {
      this.$apollo.addSmartQuery('profile', {
        query: USER_QUERY,
        variables () {
          return {
            id: this.$route.params.id
          }
        },
        update: (data) => {
          return data.user
        },
        result: ({ data }) => {
          this.profile = data.user
        }
      })
    } else {
      this.profile = this.user
    }
  }
}
</script>

<style scoped>

</style>
