<template>
  <div id="app">
    <nav class="navbar is-danger is-fixed-top">
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
    <transition name="page">
      <router-view :key="$route.fullPath" class="page">
      </router-view>
    </transition>
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
            sub: profile.sub,
            picture: profile.picture
          })
        }
      })
    },
    updateAuthTokens () {
      this.lock.checkSession({}, (err, result) => {
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
  background-color: black;
  background-image: url('/img/footer_lodyas.png');
}
#app {
  position: relative;
  z-index: 1;
  overflow: auto;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  padding-top: 2rem;
  color: white;
}
#app::before {
  content: "";
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -1;

  display: block;
  background: rgb(255,255,255);
  background: linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,1) 400px);
}

.box,
.navbar {
  box-shadow: 0 2px 30px rgba(10, 10, 10, 0.4), 0 0 0 1px rgba(10, 10, 10, 0.1) !important;
}
input.input {
    background-color: rgba(0,0,0,0.2);
    color: white;
    border-color: rgba(255,255,255,0.3);
}
ul.menu-list a:hover {
  background-color: rgba(0,0,0,0.5);
}
.button:not(.is-outlined) {
  border: 0;
}
.tag.is-primary,
.button.is-primary {
  background: linear-gradient(128deg, rgba(0,209,178,1) 0%, rgba(0,157,209,1) 100%);
}
.tag.is-info,
.button.is-info {
  background: linear-gradient(128deg, rgba(32,156,238,1) 0%, rgba(32,48,238,1) 100%);
}
.tag.is-warning,
.button.is-warning {
  background: linear-gradient(127deg, rgba(255,221,87,1) 0%, rgba(255,150,61,1) 100%);
}
.tag.is-danger,
.button.is-danger {
  background: linear-gradient(128deg, rgba(255,56,182,1) 0%, rgba(255,56,96,1) 100%);
}

.page {
  position: absolute !important;
  width: 100%;
  overflow: auto;
}

.page-enter-active, .page-leave-active {
  transition: opacity 0.25s;
}
.page-enter, .page-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
