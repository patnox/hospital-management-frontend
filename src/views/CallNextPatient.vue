<template>
  <div class="container mt-4">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Call Next Patient</h3>
          </div>
          <div class="card-body">
            <div v-if="nextPatient">
              <h4>Next Patient: {{ nextPatient.patient.name }}</h4>
              <p>Appointment ID: {{ nextPatient.appointment_id }}</p>
              <p>Status: {{ nextPatient.status }}</p>
              <button 
                @click="callPatient"
                class="btn btn-primary w-100"
              >
                Call Patient
              </button>
            </div>
            <div v-else>
              <p>No patients in queue</p>
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
    
    const nextPatient = computed(() => {
      return store.state.appointments.queue[0]
    })
    
    const callPatient = async () => {
      try {
        await store.dispatch('appointments/callNextPatient', nextPatient.value?.appointment_id)
        await store.dispatch('appointments/getAppointments')
      } catch (error) {
        console.error(error)
      }
    }
    
    return { nextPatient, callPatient }
  }
}
</script>

<style scoped>
.card {
  margin-bottom: 20px;
}
</style>