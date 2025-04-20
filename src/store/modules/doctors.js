// src/store/modules/doctors.js

import axios from 'axios';

const state = {
    doctors: [],
    doctor: {},
    currentDoctor: null,
    loading: false,
    error: null
};

const mutations = {
    SET_DOCTORS(state, doctors) {
        state.doctors = doctors;
    },
    SET_CURRENT_DOCTOR(state, doctor) {
        state.currentDoctor = doctor;
        state.doctor = doctor;
    },
    SET_LOADING(state, isLoading) {
        state.loading = isLoading;
    },
    SET_ERROR(state, error) {
        state.error = error;
    },
    setDoctor(state, doctor) {
        state.currentDoctor = doctor;
        state.doctor = doctor;
    },
};

const actions = {
    async fetchDoctors({ commit }) {
        commit('SET_LOADING', true);
        
        try {
            const response = await axios.get('/api/doctors');
            commit('SET_DOCTORS', response.data);
            commit('SET_ERROR', null);
        } catch (error) {
            commit('SET_ERROR', error.message);
        } finally {
            commit('SET_LOADING', false);
        }
    },

    async getDoctorByUserId({ commit }, param = {}) {
        try {
            console.log("Got doctor user id parameter as: " + JSON.stringify(param));
            const response = await axios.get(`/api/doctors/user/${param}`);
            console.log("Got doctor as: " + JSON.stringify(response, null, 2));
            commit('setDoctor', response.data.doctor)
            return response
        } catch (error) {
            console.log("Got API error as: " + JSON.stringify(error));
            throw error
        }
    },

    async fetchDoctorById({ commit }, doctorId) {
        commit('SET_LOADING', true);
        
        try {
            const response = await axios.get(`/api/doctors/${doctorId}`);
            commit('SET_CURRENT_DOCTOR', response.data);
            commit('SET_ERROR', null);
        } catch (error) {
            commit('SET_ERROR', error.message);
        } finally {
            commit('SET_LOADING', false);
        }
    },

    async createDoctor({ commit }, doctorData) {
        commit('SET_LOADING', true);
        
        try {
            const response = await axios.post('/api/doctors', doctorData);
            // Handle success case
            commit('SET_ERROR', null);
            return response.data;
        } catch (error) {
            commit('SET_ERROR', error.message);
            throw error;
        } finally {
            commit('SET_LOADING', false);
        }
    },

    async updateDoctor({ commit }, { doctorId, doctorData }) {
        commit('SET_LOADING', true);
        
        try {
            const response = await axios.put(`/api/doctors/${doctorId}`, doctorData);
            // Handle success case
            commit('SET_ERROR', null);
            return response.data;
        } catch (error) {
            commit('SET_ERROR', error.message);
            throw error;
        } finally {
            commit('SET_LOADING', false);
        }
    },

    async deleteDoctor({ commit }, doctorId) {
        commit('SET_LOADING', true);
        
        try {
            await axios.delete(`/api/doctors/${doctorId}`);
            // Remove doctor from local state
            commit('SET_DOCTORS', 
                state.doctors.filter(doctor => doctor.id !== doctorId));
            commit('SET_ERROR', null);
        } catch (error) {
            commit('SET_ERROR', error.message);
        } finally {
            commit('SET_LOADING', false);
        }
    }
};

const getters = {
    getDoctors: state => state.doctors,
    getCurrentDoctor: state => state.currentDoctor,
    isLoading: state => state.loading,
    getError: state => state.error,
    
    // Helper getters
    getDoctorById: state => id => {
        return state.doctors.find(doctor => doctor.id === id);
    },
    
    getDoctorsBySpecialty: state => specialty => {
        return state.doctors.filter(doctor => doctor.specialty === specialty);
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
};