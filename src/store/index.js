import Vue from 'vue'
import Vuex from 'vuex'

import actions from './actions'
import getters from './getters'
import mutations from './mutations'

Vue.use(Vuex)

const state = {
  // Current user
  user: null
}

export default new Vuex.Store({
  state,
  actions,
  getters,
  mutations
})
