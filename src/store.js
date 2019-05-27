import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import { resolve } from 'any-promise';

Vue.use(Vuex)

const types = {
  SET_AUTHENTICATED: "SET_AUTHENTICATED",
  SET_USER: "SET_USER",
  GET_PRIVILEGES: "GET_PRIVILEGES"
}

const state = {
  isAuthenticated: false,
  user: {},
  privileges: []
}

const getters = {
  isAuthenticated: state => state.isAuthenticated,
  user: state => state.user,
  privileges: state => state.privileges
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
  },
  async getPrivileges({commit}) {
    try {
      let res = await axios.get(`/api/privileges?identity=${state.user.identity}`)
      // commit(types.GET_PRIVILEGES, res.data.data)
    } catch (error) {
      
      console.log(err)
    }
  }
}

const mutations = {
  [types.SET_AUTHENTICATED](state, isAuthenticated) {
    state.isAuthenticated = isAuthenticated || false
  },
  [types.SET_USER](state, user) {
    state.user = user || {}
  },
  [types.GET_PRIVILEGES](state, privileges) {
    state.privileges = privileges || [];
  }
}
export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
