<template>
  <section>
    <div class="box has-background-black-ter has-text-white" v-if="profile">
      <div class="columns">
        <div class="column is-6">
          <h2 class="title has-text-white">About me</h2>
        </div>
        <div v-if="isMe" class="column is-6 has-text-right">
          <button class="button is-info">
            <span class="icon is-small">
              <i class="fas fa-edit"></i>
            </span>
            <span>
              Edit
            </span>
          </button>
        </div>
      </div>
      <div class="columns">
        <div class="column is-6">
          <label for="" class="label has-text-white">Name</label>
          {{ profile.first_name }} {{ profile.last_name }}
        </div>
        <div class="column is-6">

        </div>
      </div>
    </div>

    <div class="box has-background-black-ter" v-if="votesByUser && votesByUser.length">
      <h2 class="title has-text-white">My votes</h2>
      <div class="columns">
        <div v-for="game in votesByUser" :key="game._id" class="column is-4">
          <div class="card">
            <div class="card-header has-background-black-ter" :style="'background-image: url(\'' + game.banner + '\')'">
              <p class="card-header-title has-text-white">{{ game.name }}</p>
            </div>
            <div class="card-content has-background-white-ter">
              <table class="table is-fullwidth">
                <tbody v-for="rating in game.ratings" :key="rating._id">
                  <tr v-for="vote in rating.votes" :key="vote._id" class="has-background-white-ter">
                    <td>
                      {{ rating.name }}
                    </td>
                    <td class="has-text-right">
                      <strong class="has-text-success">{{ vote.value }}</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'

import {
  VOTES_BY_USER_QUERY
} from '@/graphql'

export default {
  name: 'ProfileSingle',

  props: [
    'profile'
  ],

  computed: {
    ...mapGetters({
      user: 'user'
    }),
    isMe () {
      if (!this.user || !this.profile) {
        return false
      }
      return this.user._id === this.profile._id
    }
  },

  apollo: {
    votesByUser: {
      query: VOTES_BY_USER_QUERY,
      variables () {
        if (this.profile) {
          return {
            id: this.profile._id
          }
        }

        return {
          id: '123456789012'
        }
      },
      deep: true
    }
  },

  mounted () {
    if (this.profile) {
      this.$apollo.queries.votesByUser.refetch({
        id: this.profile._id
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  overflow: hidden;
  border-radius: 5px;
}
.card-header {
  position: relative;
  z-index: 1;
  background-size: cover;
  background-position: center 15%;
  background-repeat: no-repeat;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: -1;
    background: linear-gradient(180deg, rgba(22, 22, 22, 0.5) 0%, rgba(22, 22, 22, 0.7) 80%, rgba(22, 22, 22, 1) 100%);
  }
}
</style>
