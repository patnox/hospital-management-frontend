<template>
  <div class="container mt-4">
    <div class="row">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Doctor Dashboard: {{ currentUser?.name }}</h3>
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

    <!-- REF: https://getbootstrap.com/docs/5.3/components/modal/ -->
    <!-- Appointment Creation Modal -->

    <div class="row mb-4">
      <div class="col-md-12">
        <button 
          type="button" 
          @click="showCreateModal = true"
          class="btn btn-primary" 
          data-bs-toggle="modal" 
          data-bs-target="#staticBackdrop">
            Create Appointment
        </button>
      </div>
    </div>

    <!-- Modal -->
    <div class="modal fade" 
          :class="{ 'show': showCreateModal, 'd-block': showCreateModal }"
          id="staticBackdrop" 
          data-bs-backdrop="static" 
          data-bs-keyboard="false" 
          aria-labelledby="staticBackdropLabel" 
          aria-hidden="true"
          tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="staticBackdropLabel">Create Appointment</h1>
            <button 
              type="button" 
              @click="showCreateModal = false"
              class="btn-close" 
              data-bs-dismiss="modal" 
              aria-label="Close">
            </button>
          </div>
          <div class="modal-body">
            
            <!-- form start -->
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
                    v-for="patient in patients?.patients?.data" 
                    :key="patient?.id"
                    :value="patient.id"
                  >
                    {{ patient?.name }} ({{ patient?.email }})
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

              <div>
                <button 
                  type="button" 
                  @click="showCreateModal = false"
                  class="btn btn-secondary mt-3 float-start" 
                  data-bs-dismiss="modal">
                  Close
                </button>
                <button 
                  type="submit" 
                  class="btn btn-primary mt-3 float-end"
                  data-bs-dismiss="modal">
                  Create Appointment
                </button>
              </div>
            </form>
            <!-- form end -->

          </div>
          <div class="modal-footer">
            
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script>
import { computed, ref, onMounted } from 'vue'
import { useStore } from 'vuex'

export default {
  setup() {
    const store = useStore()

    // Call getAvailability and patient id when component mounts
    onMounted(() => {
      // Get patients
      store.dispatch('patients/fetchPatients');
      // Get availability
      store.dispatch('appointments/getAvailability');
      // Get appointments
      store.dispatch('appointments/getAppointments');
    })
    
    const todayAppointments = computed(() => {
      return store.state.appointments.appointments.filter(appointment => {
        return new Date(appointment.scheduled_time).toDateString() === 
               new Date().toDateString()
      })
    });

    const currentDoctor = computed(() => store.state.doctors.doctor);
    
    const queue = computed(() => store.state.appointments.queue);
    const currentUser = computed(() => store.state.auth.user);
    
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
    
    const patients = computed(() => store.state.patients.patients);

    function formatDatetime(datetimeValue) {
      if (!datetimeValue) return '';
      const date = new Date(datetimeValue);
      if (isNaN(date.getTime())) return '';

      const pad = (n) => (n < 10 ? '0' + n : n);

      const Y = date.getFullYear();
      const m = pad(date.getMonth() + 1);
      const d = pad(date.getDate());
      const H = pad(date.getHours());
      const i = pad(date.getMinutes());
      const s = pad(date.getSeconds());

      return `${Y}-${m}-${d} ${H}:${i}:${s}`;
    }

    const createAppointment = async () => {
      try {
        console.log("Got patients as: " + JSON.stringify(patients?.value));
        console.log("Got current user id as: " +  currentUser?.value?.id);

        // Get patient id
        await store.dispatch('doctors/getDoctorByUserId', currentUser?.value?.id);

        console.log("Got current doctor id as: " +  currentDoctor?.value?.id);
        newAppointment.value.doctor_id = currentDoctor?.value?.id;

        newAppointment.value.scheduled_time = formatDatetime(newAppointment.value.scheduled_time);
        
        console.log("Got create appointment payload as: " + JSON.stringify(newAppointment.value));
        await store.dispatch('appointments/bookAppointment', newAppointment.value)
        
        // Reset form and close modal
        newAppointment.value = {
          doctor_id: null,
          patient_id: '',
          scheduled_time: ''
        }

        showCreateModal.value = false;
        
        // Refresh appointments
        await store.dispatch('appointments/getAppointments');

        // Refresh patients
        store.dispatch('patients/fetchPatients');

        // Refresh availability
        store.dispatch('appointments/getAvailability');

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
      createAppointment,
      currentUser
    }
  }
}
</script>

<style scoped>
.card {
  margin-bottom: 20px;
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