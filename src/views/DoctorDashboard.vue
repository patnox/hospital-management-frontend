<template>
  <div class="container mt-4">
    <div class="row">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Doctor Dashboard</h3>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <div class="card mb-3">
                  <div class="card-body">
                    <h5 class="card-title">Today's Appointments</h5>
                    <div class="list-group">
                      <div 
                        class="list-group-item" 
                        v-for="appointment in todayAppointments" 
                        :key="appointment.id"
                      >
                        <div class="d-flex justify-content-between">
                          <div>
                            <h6 class="mb-1">{{ appointment.patient.name }}</h6>
                            <p class="mb-1">Time: {{ appointment.scheduled_time }}</p>
                            <p class="mb-1">Status: {{ appointment.status }}</p>
                          </div>
                          <div>
                            <button 
                              v-if="appointment.status === 'pending'"
                              @click="callNextPatient(appointment.id)"
                              class="btn btn-primary"
                            >
                              Call Patient
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="card mb-3">
                  <div class="card-body">
                    <h5 class="card-title">Queue Status</h5>
                    <div class="list-group">
                      <div 
                        class="list-group-item" 
                        v-for="patient in queue" 
                        :key="patient.id"
                      >
                        <div class="d-flex justify-content-between">
                          <div>
                            <h6 class="mb-1">{{ patient.patient.name }}</h6>
                            <p class="mb-1">Position: {{ patient.position }}</p>
                            <p class="mb-1">Status: {{ patient.status }}</p>
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
    
    const todayAppointments = computed(() => {
      return store.state.appointments.appointments.filter(appointment => {
        return new Date(appointment.scheduled_time).toDateString() === 
               new Date().toDateString()
      })
    })
    
    const queue = computed(() => store.state.appointments.queue)
    
    const callNextPatient = async (appointmentId) => {
      try {
        await store.dispatch('appointments/callNextPatient', appointmentId)
        await store.dispatch('appointments/getAppointments')
      } catch (error) {
        console.error(error)
      }
    }
    
    return { todayAppointments, queue, callNextPatient }
  }
}
</script>

<style scoped>
.card {
  margin-bottom: 20px;
}
</style>