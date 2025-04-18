<template>
  <div class="container mt-4">
    <div class="row">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Book Appointment</h3>
          </div>
          <div class="card-body">
            <form @submit.prevent="bookAppointment">
              <div class="mb-3">
                <label for="doctor" class="form-label">Doctor</label>
                <select 
                  id="doctor" 
                  class="form-select" 
                  v-model="form.doctor_id"
                  :class="{ 'is-invalid': errors.doctor_id }"
                >
                  <option value="">Select Doctor</option>
                  <option 
                    v-for="availability in availability" 
                    :key="availability.id"
                    :value="availability.doctor_id"
                  >
                    Dr. {{ availability.doctor.name }} ({{ availability.specialization }})
                  </option>
                </select>
                <div class="invalid-feedback" v-if="errors.doctor_id">{{ errors.doctor_id }}</div>
              </div>
              <div class="mb-3">
                <label for="date" class="form-label">Date</label>
                <input 
                  type="date" 
                  id="date" 
                  class="form-control" 
                  v-model="form.scheduled_time"
                  :class="{ 'is-invalid': errors.scheduled_time }"
                >
                <div class="invalid-feedback" v-if="errors.scheduled_time">{{ errors.scheduled_time }}</div>
              </div>
              <button type="submit" class="btn btn-primary w-100">Book Appointment</button>
            </form>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">My Appointments</h3>
          </div>
          <div class="card-body">
            <div class="list-group">
              <div 
                class="list-group-item" 
                v-for="appointment in appointments" 
                :key="appointment.id"
              >
                <div class="d-flex justify-content-between">
                  <div>
                    <h5 class="mb-1">Dr. {{ appointment.doctor.name }}</h5>
                    <p class="mb-1">Specialization: {{ appointment.doctor.specialization }}</p>
                    <p class="mb-1">Date: {{ appointment.scheduled_time }}</p>
                    <p class="mb-1">Status: {{ appointment.status }}</p>
                  </div>
                  <div>
                    <button 
                      v-if="appointment.status === 'pending'" 
                      @click="joinQueue(appointment.id)"
                      class="btn btn-primary"
                    >
                      Join Queue
                    </button>
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
import { useStore } from 'vuex'
import { computed } from 'vue'

export default {
  setup() {
    const store = useStore()
    
    const appointments = computed(() => store.state.appointments.appointments)
    const availability = computed(() => store.state.appointments.availability)
    
    const bookAppointment = async () => {
      try {
        await store.dispatch('appointments/bookAppointment', {
          doctor_id: form.doctor_id,
          scheduled_time: form.scheduled_time
        })
        form.doctor_id = ''
        form.scheduled_time = ''
        await store.dispatch('appointments/getAvailability')
      } catch (error) {
        console.error(error)
      }
    }
    
    const joinQueue = async (appointmentId) => {
      try {
        await store.dispatch('appointments/joinQueue', appointmentId)
        await store.dispatch('appointments/getAppointments')
      } catch (error) {
        console.error(error)
      }
    }
    
    return {
      appointments,
      availability,
      bookAppointment,
      joinQueue
    }
  }
}
</script>