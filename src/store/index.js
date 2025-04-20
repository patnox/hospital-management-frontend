import { createStore } from 'vuex'
import auth from './modules/auth'
import appointments from './modules/appointments'
import patients from './modules/patients'
import doctors from './modules/doctors'

export default createStore({
  state: {
    loading: false
  },
  mutations: {
    setLoading(state, value) {
      state.loading = value
    }
  },
  actions: {},
  modules: {
    patients,
    doctors,
    auth,
    appointments
  }
})