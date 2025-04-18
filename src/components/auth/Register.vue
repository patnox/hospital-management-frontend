<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Register</h3>
          </div>
          <div class="card-body">
            <form @submit.prevent="register">
              <div class="mb-3">
                <label for="name" class="form-label">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  class="form-control" 
                  v-model="form.name"
                  :class="{ 'is-invalid': errors.name }"
                >
                <div class="invalid-feedback" v-if="errors.name">{{ errors.name }}</div>
              </div>
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  class="form-control" 
                  v-model="form.email"
                  :class="{ 'is-invalid': errors.email }"
                >
                <div class="invalid-feedback" v-if="errors.email">{{ errors.email }}</div>
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input 
                  type="password" 
                  id="password" 
                  class="form-control" 
                  v-model="form.password"
                  :class="{ 'is-invalid': errors.password }"
                >
                <div class="invalid-feedback" v-if="errors.password">{{ errors.password }}</div>
              </div>
              <div class="mb-3">
                <label for="role" class="form-label">Role</label>
                <select 
                  id="role" 
                  class="form-select" 
                  v-model="form.role"
                  :class="{ 'is-invalid': errors.role }"
                >
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="doctor">Doctor</option>
                  <option value="patient">Patient</option>
                </select>
                <div class="invalid-feedback" v-if="errors.role">{{ errors.role }}</div>
              </div>
              <div v-if="form.role === 'doctor'">
                <div class="mb-3">
                  <label for="specialization" class="form-label">Specialization</label>
                  <input 
                    type="text" 
                    id="specialization" 
                    class="form-control" 
                    v-model="form.specialization"
                    :class="{ 'is-invalid': errors.specialization }"
                  >
                  <div class="invalid-feedback" v-if="errors.specialization">{{ errors.specialization }}</div>
                </div>
                <div class="mb-3">
                  <label for="department" class="form-label">Department</label>
                  <input 
                    type="text" 
                    id="department" 
                    class="form-control" 
                    v-model="form.department"
                    :class="{ 'is-invalid': errors.department }"
                  >
                  <div class="invalid-feedback" v-if="errors.department">{{ errors.department }}</div>
                </div>
              </div>
              <div v-if="form.role === 'patient'">
                <div class="mb-3">
                  <label for="medical_history" class="form-label">Medical History</label>
                  <textarea 
                    id="medical_history" 
                    class="form-control" 
                    v-model="form.medical_history"
                    :class="{ 'is-invalid': errors.medical_history }"
                  ></textarea>
                  <div class="invalid-feedback" v-if="errors.medical_history">{{ errors.medical_history }}</div>
                </div>
                <div class="mb-3">
                  <label for="emergency_contact" class="form-label">Emergency Contact</label>
                  <input 
                    type="text" 
                    id="emergency_contact" 
                    class="form-control" 
                    v-model="form.emergency_contact"
                    :class="{ 'is-invalid': errors.emergency_contact }"
                  >
                  <div class="invalid-feedback" v-if="errors.emergency_contact">{{ errors.emergency_contact }}</div>
                </div>
              </div>
              <button type="submit" class="btn btn-primary w-100">Register</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex'

export default {
  data() {
    return {
      form: {
        name: '',
        email: '',
        password: '',
        role: '',
        specialization: '',
        department: '',
        medical_history: '',
        emergency_contact: ''
      },
      errors: {}
    }
  },
  setup() {
    const store = useStore()
    
    const register = async () => {
      try {
        this.errors = {}
        await store.dispatch('auth/register', this.form)
        this.$router.push({ name: 'login' })
      } catch (error) {
        this.errors = error
      }
    }
    
    return { register }
  }
}
</script>

<style scoped>
.card {
  margin-bottom: 20px;
}
</style>
