<template>
    <div class="container mt-4">
      <div class="row">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Patient Registration</h3>
            </div>
            <div class="card-body">
              <form @submit.prevent="register">
                <div class="mb-3">
                  <label for="name" class="form-label">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    class="form-control"
                    v-model="form.name"
                    :class="{ 'is-invalid': errors?.name }"
                  >
                  <div class="invalid-feedback" v-if="errors?.name">{{ errors?.name }}</div>
                </div>
  
                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input
                    type="email"
                    id="email"
                    class="form-control"
                    v-model="form.email"
                    :class="{ 'is-invalid': errors?.email }"
                  >
                  <div class="invalid-feedback" v-if="errors?.email">{{ errors?.email }}</div>
                </div>
  
                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <input
                    type="password"
                    id="password"
                    class="form-control"
                    v-model="form.password"
                    :class="{ 'is-invalid': errors?.password }"
                  >
                  <div class="invalid-feedback" v-if="errors?.password">{{ errors?.password }}</div>
                </div>

                <div class="mb-3">
                  <label for="password_repeat" class="form-label">Repeat Password</label>
                  <input
                    type="password"
                    id="password_repeat"
                    class="form-control"
                    v-model="form.password_repeat"
                    :class="{ 'is-invalid': errors?.password }"
                  >
                  <div class="invalid-feedback" v-if="errors?.password">{{ errors?.password }}</div>
                </div>
  
                <div class="mb-3">
                  <label for="medical_history" class="form-label">Medical History</label>
                  <textarea
                    id="medical_history"
                    class="form-control"
                    v-model="form.medical_history"
                    :class="{ 'is-invalid': errors?.medical_history }"
                    rows="3"
                  ></textarea>
                  <div class="invalid-feedback" v-if="errors?.medical_history">{{ errors?.medical_history }}</div>
                </div>
  
                <div class="mb-3">
                  <label for="emergency_contact" class="form-label">Emergency Contact</label>
                  <input
                    type="text"
                    id="emergency_contact"
                    class="form-control"
                    v-model="form.emergency_contact"
                    :class="{ 'is-invalid': errors?.emergency_contact }"
                  >
                  <div class="invalid-feedback" v-if="errors?.emergency_contact">{{ errors?.emergency_contact }}</div>
                </div>
  
                <button type="submit" class="btn btn-primary w-100">
                  Register
                </button>
                <div class="invalid-feedback" v-if="errors?.patient_registration">{{ errors?.patient_registration }}</div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue'
  import { useStore } from 'vuex'
  import { useRouter } from 'vue-router'
  
  export default {
    setup() {
      const store = useStore()
      const router = useRouter()
      
      const form = ref({
        name: '',
        email: '',
        password: '',
        medical_history: '',
        emergency_contact: '',
        role: 'patient'
      })
  
      const errors = ref({})
  
      const register = async () => {
        try {
            // Clear previous errors
            errors.value = {}

            // This is a patient
            form.value.role = 'patient';

            if (!form.value.name) {
                errors.value.name = 'Please enter name';
                return;
            }

            if (!form.value.email) {
                errors.value.email = 'Please enter email';
                return;
            }

            if (!form.value.password) {
                errors.value.password = 'Please enter password';
                return;
            }

            if (form.value.password != form.value.password_repeat) {
                errors.value.password = 'Passwords do not match';
                return;
            }

            if (!form.value.emergency_contact) {
                errors.value.emergency_contact = 'Please enter emergency contact';
                return;
            }
  
            // Submit the registration
            await store.dispatch('auth/register', form.value)
    
            // Reset form
            form.value = {
                name: '',
                email: '',
                password: '',
                medical_history: '',
                emergency_contact: '',
                role: ''
            }
  
            // Redirect to login page
            router.push({ name: 'login' })
        } catch (error) {
          if (error.response?.data?.errors) {
            errors.value.patient_registration = 'Error: Registration Failed: ' + error.response.data.errors;
          } else {
            errors.value.patient_registration = 'Error: Registration Failed. Please contact admin';
            console.error('Registration failed:', error)
          }
        }
      }
  
      return {
        form,
        errors,
        register
      }
    }
  }
  </script>
  
  <style scoped>
  .card {
    margin-bottom: 20px;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }
  
  .form-control {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
  }
  
  .form-control:focus {
    border-color: #80bdff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
  
  .btn {
    width: 100%;
    padding: 0.75rem;
    font-size: 1rem;
    font-weight: 500;
  }
  
  .btn-primary {
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
  }
  
  .btn-primary:hover {
    background-color: #0056b3;
  }
  
  .invalid-feedback {
    display: block;
    margin-top: 0.25rem;
    color: #dc3545;
    font-size: 0.875rem;
  }
  </style>