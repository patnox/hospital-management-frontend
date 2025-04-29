import axios from 'axios';

const state = {
    users: null,
    currentUser: null,
    loading: false,
    error: null
};

const mutations = {
    SET_USERS(state, payload) {
        state.users = payload;
    },

    SET_CURRENT_USER(state, payload) {
        state.currentUser = payload;
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
    async fetchUsers({ commit }, filters) {
        commit('SET_LOADING', true);
        commit('CLEAR_ERROR');

        try {
            const response = await axios.get('/api/users', {
                params: {
                    ...filters,
                    role: filters.role || undefined
                }
            });

            commit('SET_USERS', response.data);
            commit('SET_LOADING', false);
            
            return response.data;
        } catch (error) {
            commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch users');
            commit('SET_LOADING', false);
            throw error;
        }
    },

    async register({ commit }, userData) {
        commit('SET_LOADING', true);
        commit('CLEAR_ERROR');

        try {
            const response = await axios.post('/api/auth/register', userData);

            // Create doctor/patient record based on role
            if (userData.role === 'doctor') {
                await axios.post('/api/doctors', {
                    specialization: userData.specialization || '',
                    department: userData.department || ''
                });
            } else if (userData.role === 'patient') {
                await axios.post('/api/patients', {
                    medical_history: userData.medical_history || '',
                    emergency_contact: userData.emergency_contact || ''
                });
            }

            commit('SET_LOADING', false);
            return response.data;
        } catch (error) {
            commit('SET_ERROR', error.response?.data?.message || 'Registration failed');
            commit('SET_LOADING', false);
            throw error;
        }
    },

    async updateUser({ commit }, payload) {
        commit('SET_LOADING', true);
        commit('CLEAR_ERROR');

        try {
            const response = await axios.put(`/api/users/${payload.userId}`, payload.userData);

            // Update doctor/patient record if role-specific data changed
            if (payload.userData.specialization || payload.userData.department) {
                await axios.put('/api/doctors/' + payload.userId, {
                    specialization: payload.userData.specialization,
                    department: payload.userData.department
                });
            } else if (payload.userData.medical_history || payload.userData.emergency_contact) {
                await axios.put('/api/patients/' + payload.userId, {
                    medical_history: payload.userData.medical_history,
                    emergency_contact: payload.userData.emergency_contact
                });
            }

            commit('SET_LOADING', false);
            return response.data;
        } catch (error) {
            commit('SET_ERROR', error.response?.data?.message || 'Update failed');
            commit('SET_LOADING', false);
            throw error;
        }
    },

    async deleteUser({ commit }, userId) {
        commit('SET_LOADING', true);
        commit('CLEAR_ERROR');

        try {
            await axios.delete(`/api/users/${userId}`);
            
            // Delete associated doctor/patient record
            await axios.delete(`/api/doctors/${userId}`);
            await axios.delete(`/api/patients/${userId}`);

            commit('SET_LOADING', false);
        } catch (error) {
            commit('SET_ERROR', error.response?.data?.message || 'Deletion failed');
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