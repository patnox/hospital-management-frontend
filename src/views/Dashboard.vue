<template>
  <div class="container mt-4">
    <div class="row">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Dashboard</h3>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-4">
                <div class="card mb-3">
                  <div class="card-body">
                    <h5 class="card-title">Welcome, {{ currentUser?.name }}</h5>
                    <p class="card-text">Role: {{ currentUser?.role }}</p>
                    <p class="card-text">Email: {{ currentUser?.email }}</p>
                  </div>
                </div>
              </div>
              <div class="col-md-8">
                <div class="card mb-3">
                  <div class="card-body">
                    <h5 class="card-title">Quick Actions</h5>
                    <div class="btn-group">
                      <router-link 
                        :to="{ name: 'appointments' }" 
                        class="btn btn-primary"
                        v-if="currentUser?.role === 'patient'"
                      >
                        Book Appointment
                      </router-link>
                      <router-link 
                        :to="{ name: 'doctor-appointments' }" 
                        class="btn btn-primary"
                        v-if="currentUser?.role === 'doctor'"
                      >
                        View Appointments
                      </router-link>
                      <router-link 
                        :to="{ name: 'doctor-queue' }" 
                        class="btn btn-primary"
                        v-if="currentUser?.role === 'doctor'"
                      >
                        View Your Queue
                      </router-link>
                      <router-link 
                        :to="{ name: 'appointments-admin' }" 
                        class="btn btn-primary"
                        v-if="currentUser?.role === 'admin'"
                      >
                        Manage Appointments
                      </router-link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  setup() {
    const store = useStore()
    
    const currentUser = computed(() => store.state.auth.user)
    
    return { 
      currentUser
    }
  }
}
</script>

<style scoped>
.card {
  margin-bottom: 20px;
}
.btn-group {
  display: flex;
  gap: 10px;
}
</style>