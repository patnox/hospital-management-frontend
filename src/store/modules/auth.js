import axios from 'axios'

const state = {
  user: null,
  isAuthenticated: false,
  token: localStorage.getItem('token')
}

const mutations = {
  setUser(state, userData) {
    state.user = userData
    state.isAuthenticated = true
  },
  logout(state) {
    state.user = null
    state.isAuthenticated = false
    state.token = null
  }
}

const actions = {
  async login({ commit }, credentials) {
    try {
      const response = await axios.post('/api/login', credentials)
      const token = response.data.access_token
      
      localStorage.setItem('token', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      commit('setUser', response.data.user)
      return response
    } catch (error) {
      throw error.response.data
    }
  },
  
  async register({ commit }, userData) {
    try {
      const response = await axios.post('/api/register', userData)
      const token = response.data.access_token
      
      localStorage.setItem('token', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      commit('setUser', response.data.user)
      return response
    } catch (error) {
      throw error.response.data
    }
  },
  
  async logout({ commit }) {
    try {
      await axios.post('/api/logout', {}, {
        headers: { Authorization: `Bearer ${state.token}` }
      })
      
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
      commit('logout')
      
      return true
    } catch (error) {
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
      commit('logout')
      throw error
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}