import Vue from 'vue';
import Vuex from 'vuex';
import createPersist, { createStorage } from 'vuex-localstorage'
import packageJson from '../package.json';
Vue.use(Vuex)

const types = {
  SET_AUTHENTICATED: "SET_AUTHENTICATED",
  SET_USER: "SET_USER",
  GET_PRIVILEGES: "GET_PRIVILEGES",
  SET_PAGESIZE: "SET_PAGESIZE",
  SET_ACTIVEITEM: "SET_ACTIVEITEM"
}

const state = {
  isAuthenticated: false,
  user: {},
  privileges: [],
  pageSize: 5,
  activeItem: 'index',
}

const getters = {
  isAuthenticated: state => state.isAuthenticated,
  user: state => state.user,
  privileges: state => state.privileges,
  pageSize: state => state.pageSize,
  activeItem: state => state.activeItem,
}

const actions = {
  setAuthenticated({commit}, isAuthenticated) {
    commit(types.SET_AUTHENTICATED, isAuthenticated)
  },
  setUser({commit}, user) {
    commit(types.SET_USER, user)
  },
  setPageSize({commit}, pageSize) {
    commit(types.SET_PAGESIZE, pageSize)
  },
  setActiveItem({commit}, activeItem) {
    commit(types.SET_ACTIVEITEM, activeItem)
  },
  clearCurrentState({commit}) {
    commit(types.SET_AUTHENTICATED, false)
    commit(types.SET_USER, null),
    commit(types.GET_PRIVILEGES, [])
  }
}

const mutations = {
  [types.SET_AUTHENTICATED](state, isAuthenticated) {
    state.isAuthenticated = isAuthenticated || false
  },
  [types.SET_USER](state, user) {
    state.user = user || {}
  },
  [types.SET_PAGESIZE](state, pageSize) {
    state.pageSize = pageSize || 5;
  },
  [types.GET_PRIVILEGES](state, privileges) {
    state.privileges = privileges || [];
  },
  [types.SET_ACTIVEITEM](state, activeItem) {
    state.activeItem = activeItem || 'index';
  } 
  
}

 
export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  plugins: [createPersist({
    namespace: `${packageJson.name}@${packageJson.version}:store`,
    // ONE_WEEK
    expires: 7 * 24 * 60 * 60 * 1e3
  })]
})
