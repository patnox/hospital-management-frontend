import axios from 'axios'

const state = {
  patients: [],
  patient: {},
  loading: false,
  error: null
}

const mutations = {
  SET_PATIENTS(state, patients) {
    state.patients = patients
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  },
  setPatient(state, patient) {
    state.patient = patient
  },
}

const actions = {
    async fetchPatients({ commit }) {
        commit('SET_LOADING', true)
        commit('SET_ERROR', null)

        try {
            const response = await axios.get('/api/patients')
            commit('SET_PATIENTS', response.data)
            commit('SET_LOADING', false)
            return response.data
        } catch (error) {
            commit('SET_ERROR', error.response?.data?.message || error.message)
            commit('SET_LOADING', false)
            throw error
        }
    },

    async getPatientByUserId({ commit }, param = {}) {
        try {
            // console.log("Got user id parameter as: " + JSON.stringify(param));
            const response = await axios.get(`/api/patients/user/${param}`);
            // console.log("Got patient as: " + JSON.stringify(response, null, 2));
            commit('setPatient', response.data.patient)
            return response
        } catch (error) {
            console.log("Got API error as: " + JSON.stringify(error));
            throw error
        }
    },

  async createPatient({ commit }, patientData) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)

    try {
      const response = await axios.post('/api/patients', patientData)
      commit('SET_PATIENTS', [...state.patients, response.data])
      commit('SET_LOADING', false)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || error.message)
      commit('SET_LOADING', false)
      throw error
    }
  },

  async updatePatient({ commit }, { id, patientData }) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)

    try {
      const response = await axios.put(`/api/patients/${id}`, patientData)
      const index = state.patients.findIndex(p => p.id === id)
      if (index !== -1) {
        state.patients.splice(index, 1, response.data)
      }
      commit('SET_LOADING', false)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || error.message)
      commit('SET_LOADING', false)
      throw error
    }
  },

  async deletePatient({ commit }, id) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)

    try {
      await axios.delete(`/api/patients/${id}`)
      commit('SET_PATIENTS', state.patients.filter(p => p.id !== id))
      commit('SET_LOADING', false)
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || error.message)
      commit('SET_LOADING', false)
      throw error
    }
  }
}

const getters = {
  getPatientById: (state) => (id) => {
    return state.patients.find(patient => patient.id === id)
  },
  getPatientsLoading: (state) => state.loading,
  getPatientsError: (state) => state.error
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}