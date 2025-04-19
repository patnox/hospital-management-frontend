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

    <!-- Appointment Creation Modal -->
    <div class="row mb-4">
      <div class="col-md-12">
        <button 
          @click="showCreateModal = true"
          class="btn btn-primary float-right"
        >
          Create New Appointment
        </button>
      </div>
    </div>

    <!-- Appointment Creation Modal -->
    <div 
      class="modal fade" 
      :class="{ 'show': showCreateModal, 'd-block': showCreateModal }"
      tabindex="-1"
      role="dialog"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Create New Appointment</h5>
            <button 
              type="button" 
              class="close"
              @click="showCreateModal = false"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          
          <div class="modal-body">
            <form @submit.prevent="createAppointment">
              <div class="mb-3">
                <label class="form-label">Patient</label>
                <select 
                  v-model="newAppointment.patient_id" 
                  class="form-control" 
                  required
                >
                  <option value="">Select Patient</option>
                  <option 
                    v-for="patient in patients" 
                    :key="patient?.id"
                    :value="patient?.id"
                  >
                    <!-- {{ patient?.name }} -->
                  </option>
                </select>
              </div>

              <div class="mb-3">
                <label class="form-label">Scheduled Time</label>
                <input 
                  type="datetime-local" 
                  v-model="newAppointment.scheduled_time"
                  class="form-control"
                  required
                />
              </div>

              <button type="submit" class="btn btn-primary mt-3">
                Create Appointment
              </button>
            </form>
          </div>

          <div class="modal-footer">
            <button 
              type="button" 
              class="btn btn-secondary"
              @click="showCreateModal = false"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { computed, ref } from 'vue'
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

    const showCreateModal = ref(false)
    const newAppointment = ref({
      doctor_id: null,
      patient_id: '',
      scheduled_time: ''
    })
    
    const patients = computed(() => store.state.patients)

    const createAppointment = async () => {
      try {
        newAppointment.value.doctor_id = store.getters['auth/user'].id
        
        await store.dispatch('appointments/create', newAppointment.value)
        
        // Reset form and close modal
        newAppointment.value = {
          doctor_id: null,
          patient_id: '',
          scheduled_time: ''
        }
        showCreateModal.value = false
        
        // Refresh appointments
        await store.dispatch('appointments/getAppointments')
      } catch (error) {
        console.error('Error creating appointment:', error)
      }
    }
    
    return { 
      todayAppointments, 
      queue, 
      callNextPatient,
      showCreateModal,
      newAppointment,
      patients,
      createAppointment 
    }
  }
}
</script>

<style scoped>
.card {
  margin-bottom: 20px;
}

.modal.show {
  display: block !important;
}

.modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1050;
}

.form-control {
  border: 1px solid #ced4da;
  border-radius: 0.375rem;
  padding: 0.5rem;
}

.form-label {
  font-weight: 500;
  margin-bottom: 0.5rem;
}
</style>