import axios from 'axios';

const state = {
    availability: null,
    doctors: null,
    loading: false,
    error: null
};

const mutations = {
    SET_AVAILABILITY(state, payload) {
        state.availability = payload;
    },

    SET_DOCTORS(state, payload) {
        state.doctors = payload;
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
    async fetchAvailability({ commit }, filters) {
        commit('SET_LOADING', true);
        commit('CLEAR_ERROR');

        try {
            const response = await axios.get('/api/availability', {
                params: {
                    ...filters,
                    doctorId: filters.doctorId || undefined
                }
            });

            commit('SET_AVAILABILITY', response.data);
            commit('SET_LOADING', false);
            
            return response.data;
        } catch (error) {
            commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch availability');
            commit('SET_LOADING', false);
            throw error;
        }
    },

    async createAvailability({ commit }, data) {
        commit('SET_LOADING', true);
        commit('CLEAR_ERROR');

        try {
            const response = await axios.post('/api/availability', data);
            
            // Fetch updated availability to refresh the list
            // await dispatch('fetchAvailability', {
            //     page: 1,
            //     perPage: 10
            // });

            commit('SET_LOADING', false);
            return response.data;
        } catch (error) {
            commit('SET_ERROR', error.response?.data?.message || 'Failed to create availability');
            commit('SET_LOADING', false);
            throw error;
        }
    },

    async updateAvailability({ commit }, data) {
        commit('SET_LOADING', true);
        commit('CLEAR_ERROR');

        try {
            const response = await axios.put(`/api/availability/${data.id}`, {
                doctorId: data.doctorId,
                day: data.day,
                start_time: data.start_time,
                end_time: data.end_time
            });
            
            // Fetch updated availability to refresh the list
            // await dispatch('fetchAvailability', {
            //     page: 1,
            //     perPage: 10
            // });

            commit('SET_LOADING', false);
            return response.data;
        } catch (error) {
            commit('SET_ERROR', error.response?.data?.message || 'Failed to update availability');
            commit('SET_LOADING', false);
            throw error;
        }
    },

    async deleteAvailability({ commit }, id) {
        commit('SET_LOADING', true);
        commit('CLEAR_ERROR');

        try {
            await axios.delete(`/api/availability/${id}`);
            
            // Fetch updated availability to refresh the list
            await dispatch('fetchAvailability', {
                page: 1,
                perPage: 10
            });

            commit('SET_LOADING', false);
        } catch (error) {
            commit('SET_ERROR', error.response?.data?.message || 'Failed to delete availability');
            commit('SET_LOADING', false);
            throw error;
        }
    },

    async fetchDoctors({ commit }) {
        try {
            const response = await axios.get('/api/doctors');
            commit('SET_DOCTORS', response.data);
            return response.data;
        } catch (error) {
            commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch doctors');
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