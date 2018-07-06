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
          <router-link v-if="user" to="/profile" class="navbar-item">
            <span v-if="user && user.picture">
              <img :src="user.picture" alt="" class="image is-24x24 is-rounded" style="border-radius: 50%; margin-right: 0.5em;">
            </span>
            <span>
              {{ user.first_name }}
            </span>
          </router-link>
          <span class="navbar-item">
            <button
              id="qsLoginBtn"
              class="button is-dark"
              v-if="!authenticated"
              @click="login">
                Log In
            </button>
            <button
              id="qsLoginBtn"
              class="button is-danger"
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
    <router-view :key="$route.fullPath">
    </router-view>
  </div>
</template>

<script>
import {
  USER_BY_EMAIL_QUERY,
  CREATE_USER_QUERY
} from '@/graphql'

import {
  abilities
} from './abilities.js'

import { Auth0Lock } from 'auth0-lock'
import { HttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'

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
        autoclose: true,
        closable: true,
        auth: {
          audience: process.env.VUE_APP_ROOT_API,
          sso: false,
          redirect: false
        }
      }
    )

    // Listening for the authenticated event
    this.lock.on('authenticated', this.getAuth0UserInfo)

    this.lock.on('signin ready', (authResult) => {
      this.signin = true
      this.signup = false
    })
    this.lock.on('signup ready', (authResult) => {
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
        returnTo: process.env.VUE_APP_AUTH0_URL
      })
    },
    getAuth0UserInfo (authResult) {
      this.lock.getUserInfo(authResult.accessToken, (error, profile) => {
        if (error) {
          localStorage.removeItem('accessToken')
          return
        }

        this.profile = profile
        this.authenticated = true

        localStorage.setItem('accessToken', authResult.accessToken)

        if (this.signin) {
          this.fetchUser(profile.email)
        } else if (this.signup) {
          this.registerUser({
            first_name: profile.given_name,
            last_name: profile.family_name,
            email: profile.email,
            sub: profile.sub
          })
        }
      })
    },
    updateAuthTokens () {
      this.lock.checkSession({}, (err, result) => {
        console.log(err, result)

        localStorage.setItem('accessToken', result.accessToken)

        const httpLink = new HttpLink({
          // You should use an absolute URL here
          uri: process.env.VUE_APP_ROOT_API
        })

        const authLink = setContext((_, { headers }) => {
          // get the authentication token from local storage if it exists
          const token = localStorage.getItem('accessToken')
          // return the headers to the context so httpLink can read them
          return {
            headers: {
              ...headers,
              authorization: token ? `Bearer ${token}` : ''
            }
          }
        })

        this.$apollo.link = authLink.concat(httpLink)
        debugger
        this.getAuth0UserInfo(result)
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
        },
        result: ({ data }) => {
          this.$ability.update(abilities(data.userByEmail))
        }
      })
    },
    registerUser (user) {
      const optimisticResponse = {
        __typename: 'Mutation',
        createUser: {
          __typename: 'User',
          _id: Math.random().toString(36),
          ...user
        }
      }
      this.$apollo.mutate({
        mutation: CREATE_USER_QUERY,
        variables: {
          user
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
  min-height: 100%;
  display: flex;
  flex-direction: column;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

</style>
