import axios from 'axios'

const state = {
  queuePositions: [],
  queuePosition: {},
  loading: false,
  error: null
}

const mutations = {
  SET_QUEUE_POSITIONS(state, queuePositions) {
    state.queuePositions = queuePositions
  },
  SET_QUEUE_POSITION(state, queuePosition) {
    state.queuePosition = queuePosition
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  }
}

const actions = {
  async fetchQueuePositions({ commit }, filters) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    
    let url = '/api/queueadmin'
    if(filters) {
      url = `/api/queueadmin?page=${filters?.page}&perPage=${filters?.perPage}`
      if (filters?.search) {
        url += `&search=${encodeURIComponent(filters?.search)}`
      }
      if (filters?.status) {
        url += `&status=${filters?.status}`
      }
      if (filters?.doctorId) {
        url += `&doctorId=${filters?.doctorId}`
      }
    }
    
    try {
      const response = await axios.get(url)
      commit('SET_QUEUE_POSITIONS', response.data)
      commit('SET_LOADING', false)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || error.message)
      commit('SET_LOADING', false)
      throw error
    }
  },

  async getQueuePositionById({ commit }, id) {
    try {
      const response = await axios.get(`/api/queueadmin/${id}`)
      commit('SET_QUEUE_POSITION', response.data)
      return response
    } catch (error) {
      console.log("Got API error as: " + JSON.stringify(error))
      throw error
    }
  },

  async createQueuePosition({ commit }, queueData) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    
    try {
      const response = await axios.post('/api/queueadmin', queueData)
      commit('SET_QUEUE_POSITIONS', [...state.queuePositions, response.data])
      commit('SET_LOADING', false)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || error.message)
      commit('SET_LOADING', false)
      throw error
    }
  },

  async updateQueuePosition({ commit }, { id, queueData }) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    
    try {
      const response = await axios.put(`/api/queueadmin/${id}`, queueData)
      commit('SET_LOADING', false)
      commit('SET_ERROR', null)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || error.message)
      commit('SET_LOADING', false)
      throw error
    }
  },

  async deleteQueuePosition({ commit }, id) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    
    try {
      await axios.delete(`/api/queueadmin/${id}`)
      commit('SET_LOADING', false)
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || error.message)
      commit('SET_LOADING', false)
      throw error
    }
  },

  async callNextPatient({ commit }) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    
    try {
      const response = await axios.post('/api/queueadmin/call-next')
      commit('SET_LOADING', false)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || error.message)
      commit('SET_LOADING', false)
      throw error
    }
  },

  async callPatient({ commit }, id) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    
    try {
      const response = await axios.post(`/api/queueadmin/${id}/call`)
      commit('SET_LOADING', false)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || error.message)
      commit('SET_LOADING', false)
      throw error
    }
  },

  async markPatientAttended({ commit }, id) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    
    try {
      const response = await axios.post(`/api/queueadmin/${id}/mark-attended`)
      commit('SET_LOADING', false)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || error.message)
      commit('SET_LOADING', false)
      throw error
    }
  },

  async refreshQueue({ commit }, filters) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    
    let url = '/api/queueadmin'
    if(filters) {
      url = `/api/queueadmin?page=${filters?.page}&perPage=${filters?.perPage}`
      if (filters?.search) {
        url += `&search=${encodeURIComponent(filters?.search)}`
      }
      if (filters?.status) {
        url += `&status=${filters?.status}`
      }
      if (filters?.doctorId) {
        url += `&doctorId=${filters?.doctorId}`
      }
    }
    
    try {
      const response = await axios.get(url)
      commit('SET_QUEUE_POSITIONS', response.data)
      commit('SET_LOADING', false)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || error.message)
      commit('SET_LOADING', false)
      throw error
    }
  }
}

const getters = {
  getQueuePositionById: (state) => (id) => {
    return state.queuePositions.find(position => position.id === id)
  },
  getQueueLoading: (state) => state.loading,
  getQueueError: (state) => state.error,
  getQueueStats: (state) => {
    const stats = {
      total: 0,
      waiting: 0,
      called: 0,
      attended: 0
    }
    
    state.queuePositions.forEach(position => {
      stats.total++
      stats[position.status]++
    })
    
    return stats
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}