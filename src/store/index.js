import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: null
  },
  getters: {
    getToken: (state) => state.token
  },
  mutations: {
    setToken (state, token) {
      state.token = token
      localStorage.setItem('accessToken', token)
    }
  },
  actions: {
    loadTokenFromStorage ({ commit }) {
      const storedToken = localStorage.getItem('accessToken')
      if (storedToken) {
        commit('setToken', storedToken)
      }
    },
    clearToken ({ commit }) {
      commit('setToken', null)
      localStorage.removeItem('accessToken')
    }
  },
  modules: {}
})
