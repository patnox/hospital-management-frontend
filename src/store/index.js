import { createStore } from 'vuex'
import auth from './modules/auth'
import appointments from './modules/appointments'

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
    auth,
    appointments
  }
})