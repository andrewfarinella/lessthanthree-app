import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import './registerServiceWorker'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'
import VueApollo from 'vue-apollo'
import { abilitiesPlugin } from '@casl/vue'
import { guestAbilities } from './abilities'

import 'bulma/bulma.sass'

Vue.config.productionTip = false

Vue.filter('round', (value) => {
  return Math.round(value)
})

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

// Create the apollo client
const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  connectToDevTools: true
})

// Install the vue plugin
Vue.use(VueApollo)

Vue.use(abilitiesPlugin, guestAbilities)

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
})

new Vue({
  router,
  store,
  provide: apolloProvider.provide(),
  render: h => h(App)
}).$mount('#app')
