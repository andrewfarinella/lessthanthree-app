<template>
  <div id="app">
    <nav class="navbar is-danger">
      <div class="navbar-brand has-text-white">
        <router-link class="navbar-item" to="/">
          <strong>&lt;3 Games</strong>
        </router-link>
      </div>

      <div id="navbarExampleTransparentExample" class="navbar-menu is-active">
        <div class="navbar-start">
          <router-link class="navbar-item" to="/">
            Games
          </router-link>
        </div>
        <div class="navbar-end">
          <span class="navbar-item">
            <span v-if="user">
              {{ user.email }}
            </span>
            <button
              id="qsLoginBtn"
              class="button is-default"
              v-if="!authenticated"
              @click="login">
                Log In
            </button>
            <button
              id="qsLoginBtn"
              class="button is-default"
              v-else
              @click="logout">
                Log Out
            </button>
          </span>

          <span class="navbar-item">
          </span>
        </div>
      </div>
    </nav>
    <router-view>
    </router-view>
  </div>
</template>

<script>
import {
  USER_BY_EMAIL_QUERY,
  CREATE_USER_QUERY
} from '@/graphql'

import { Auth0Lock } from 'auth0-lock'

export default {
  data () {
    return {
      profile: null,
      lock: null,
      authenticated: false,
      user: null,
      signin: true,
      signup: false
    }
  },
  created () {
    this.lock = new Auth0Lock(
      'idCwcaQgCqO7POm824t_jFqAmZZ1Nehn',
      'lessthanthreegames.auth0.com',
      {
        auth: {
          sso: false,
          redirect: false
        }
      }
    )

    // Listening for the authenticated event
    this.lock.on('authenticated', this.getAuth0UserInfo)

    this.lock.on('signin ready', (authResult) => {
      console.log('signin')
      this.signin = true
      this.signup = false
    })
    this.lock.on('signup ready', (authResult) => {
      console.log('signup')
      this.signin = false
      this.signup = true
    })

    const accessToken = localStorage.getItem('accessToken')

    if (accessToken) {
      this.getAuth0UserInfo({
        accessToken
      })
    }
  },
  mounted () {
  },

  methods: {
    login () {
      this.lock.show()
    },
    logout () {
      localStorage.removeItem('accessToken')
      this.lock.logout({
        returnTo: 'http://localhost:8080'
      })
    },
    getAuth0UserInfo (authResult) {
      this.lock.getUserInfo(authResult.accessToken, (error, profile) => {
        if (error) {
          // Handle error
          return
        }

        this.profile = profile
        this.authenticated = true

        localStorage.setItem('accessToken', authResult.accessToken)

        if (this.signin) {
          this.fetchUser(profile.email)
        } else if (this.signup) {
          this.registerUser(profile.email)
        }
      })
    },
    fetchUser (email) {
      const query = USER_BY_EMAIL_QUERY

      this.$apollo.addSmartQuery('user', {
        query,
        variables () {
          return {
            email
          }
        },
        update: (data) => {
          this.$store.dispatch('updateUser', data.userByEmail)
          return data.userByEmail
        }
      })
    },
    registerUser (email) {
      const optimisticResponse = {
        __typename: 'Mutation',
        createUser: {
          __typename: 'User',
          _id: Math.random().toString(36),
          email
        }
      }
      this.$apollo.mutate({
        mutation: CREATE_USER_QUERY,
        variables: {
          email
        },
        update: (store, { data: { createUser } }) => {
          this.user = createUser
          store.writeQuery({ query: USER_BY_EMAIL_QUERY, data: { userByEmail: createUser, user: createUser } })
        },
        optimisticResponse
      })
    }
  }
}
</script>

<style lang="scss">
body, html {
  min-height: 100%;
  height: 100%;
  overflow: scroll;
  background-color: #1a1f25;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.box {
  box-shadow: inset 0 0 16px 3px rgba(0, 255, 249, 0.48),
              0 2px 3px rgba(10, 10, 10, 0.1),
              0 0 0 1px rgba(10, 10, 10, 0.1);
}
</style>