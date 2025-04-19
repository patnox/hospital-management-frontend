import axios from 'axios'

const state = {
  appointments: [],
  availability: [],
  queuePosition: null
}

const mutations = {
  setAppointments(state, appointments) {
    state.appointments = appointments
  },
  setAvailability(state, availability) {
    state.availability = availability
  },
  setQueuePosition(state, position) {
    state.queuePosition = position
  }
}

const actions = {
  async getAppointments({ commit }) {
    try {
      const response = await axios.get('/api/appointments')
      commit('setAppointments', response.data)
      return response
    } catch (error) {
      throw error.response.data
    }
  },
  
  async getAvailability({ commit }, params = {}) {
    try {
      const response = await axios.get('/api/appointments/availability', {
        params: params
      })
      // console.log("Got availability as: " + JSON.stringify(response, null, 2));
      commit('setAvailability', response.data.availability)
      return response
    } catch (error) {
      throw error.response.data
    }
  },
  
  async bookAppointment({ commit }, data) {
    try {
      const response = await axios.post('/api/appointments', data)
      return response
    } catch (error) {
      throw error.response.data
    }
  },
  
  async joinQueue({ commit }, appointmentId) {
    try {
      const response = await axios.post(`/api/appointments/${appointmentId}/queue/join`)
      commit('setQueuePosition', response.data)
      return response
    } catch (error) {
      throw error.response.data
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}