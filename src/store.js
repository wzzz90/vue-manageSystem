import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const types = {
  SET_AUTHENTICATED: "SET_AUTHENTICATED",
  SET_USER: "SET_USER"
}

const state = {
  isAuthenticated: false,
  user: {}
}

const getters = {
  isAuthenticated: state => state.isAuthenticated,
  user: state => state.user
}

const actions = {
  setAuthenticated({commit}, isAuthenticated) {
    commit(types.SET_AUTHENTICATED, isAuthenticated)
  },
  setUser({commit}, user) {
    commit(types.SET_USER, user)
  },
  clearCurrentState({commit}) {
    commit(types.SET_AUTHENTICATED, false)
    commit(types.SET_USER, null)
  } 
}

const mutations = {
  [types.SET_AUTHENTICATED](state, isAuthenticated) {
    state.isAuthenticated = isAuthenticated || false
  },
  [types.SET_USER](state, user) {
    state.user = user || {}
  }
}
export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
