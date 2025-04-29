import { createStore } from 'vuex'
import auth from './modules/auth'
import appointments from './modules/appointments'
import patients from './modules/patients'
import doctors from './modules/doctors'
import users from './modules/users'
import availability from './modules/availability'
import appointmentsadmin from './modules/appointmentsadmin'
import queueadmin from './modules/queueadmin'

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
    users,
    availability,
    auth,
    appointments,
    appointmentsadmin,
    queueadmin
  }
})