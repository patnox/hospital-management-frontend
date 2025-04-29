import axios from 'axios';

const state = {
    appointmentsadmin: null,
    doctors: null,
    patients: null,
    loading: false,
    error: null
};

const mutations = {
    SET_APPOINTMENTS(state, payload) {
        state.appointmentsadmin = payload;
    },

    SET_DOCTORS(state, payload) {
        state.doctors = payload;
    },

    SET_PATIENTS(state, payload) {
        state.patients = payload;
    },

    SET_LOADING(state, payload) {
        state.loading = payload;
    },

    SET_ERROR(state, payload) {
        state.error = payload;
    },

    CLEAR_ERROR(state) {
        state.error = null;
    }
};

const actions = {
    async fetchAppointments({ commit }, filters) {
        commit('SET_LOADING', true);
        commit('CLEAR_ERROR');

        try {
            const response = await axios.get('/api/appointmentsadmin', {
                params: {
                    ...filters,
                    doctorId: filters.doctorId || undefined,
                    status: filters.status || undefined
                }
            });

            commit('SET_APPOINTMENTS', response.data);
            commit('SET_LOADING', false);
            console.log("Got all appointments: " + JSON.stringify(response.data));
            return response.data;
        } catch (error) {
            commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch appointments');
            commit('SET_LOADING', false);
            throw error;
        }
    },

    async createAppointment({ commit }, data) {
        commit('SET_LOADING', true);
        commit('CLEAR_ERROR');

        try {
            const response = await axios.post('/api/appointmentsadmin', data);
            
            // Update queue position
            // await axios.post('/api/queue-positions', {
            //     appointment_id: response.data.id,
            //     position: 1,
            //     status: 'waiting'
            // });

            // Fetch updated appointments
            // await dispatch('fetchAppointments', {
            //     page: 1,
            //     perPage: 10
            // });

            commit('SET_LOADING', false);
            return response.data;
        } catch (error) {
            commit('SET_ERROR', error.response?.data?.message || 'Failed to create appointment');
            commit('SET_LOADING', false);
            throw error;
        }
    },

    async updateAppointment({ commit }, data) {
        commit('SET_LOADING', true);
        commit('CLEAR_ERROR');

        try {
            const response = await axios.put(`/api/appointmentsadmin/${data.id}`, {
                doctorId: data.doctorId,
                patientId: data.patientId,
                scheduledTime: data.scheduledTime,
                status: data.status
            });

            // Fetch updated appointments
            await dispatch('fetchAppointments', {
                page: 1,
                perPage: 10
            });

            commit('SET_LOADING', false);
            return response.data;
        } catch (error) {
            commit('SET_ERROR', error.response?.data?.message || 'Failed to update appointment');
            commit('SET_LOADING', false);
            throw error;
        }
    },

    async cancelAppointment({ commit }, id) {
        commit('SET_LOADING', true);
        commit('CLEAR_ERROR');

        try {
            await axios.put(`/api/appointmentsadmin/${id}/cancel`);
            
            // Fetch updated appointments
            await dispatch('fetchAppointments', {
                page: 1,
                perPage: 10
            });

            commit('SET_LOADING', false);
        } catch (error) {
            commit('SET_ERROR', error.response?.data?.message || 'Failed to cancel appointment');
            commit('SET_LOADING', false);
            throw error;
        }
    },

    async callNextPatient({ commit }) {
        commit('SET_LOADING', true);
        commit('CLEAR_ERROR');

        try {
            const response = await axios.post('/api/queue-positions/call-next');
            
            // Fetch updated appointments
            await dispatch('fetchAppointments', {
                page: 1,
                perPage: 10
            });

            commit('SET_LOADING', false);
            return response.data;
        } catch (error) {
            commit('SET_ERROR', error.response?.data?.message || 'Failed to call next patient');
            commit('SET_LOADING', false);
            throw error;
        }
    },

    async markAttended({ commit }, id) {
        commit('SET_LOADING', true);
        commit('CLEAR_ERROR');

        try {
            await axios.put(`/api/appointmentsadmin/${id}/mark-attended`);
            
            // Fetch updated appointments
            await dispatch('fetchAppointments', {
                page: 1,
                perPage: 10
            });

            commit('SET_LOADING', false);
        } catch (error) {
            commit('SET_ERROR', error.response?.data?.message || 'Failed to mark appointment as attended');
            commit('SET_LOADING', false);
            throw error;
        }
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions
};