<template>
  <div class="container mt-4">
    <div class="row">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Book Appointment: {{ currentUser.name }}</h3>
          </div>
          <div class="card-body">
            <form @submit.prevent="bookAppointment">
              <div class="mb-3">
                <div class="invalid-feedback" v-if="errors?.patient_id">{{ errors?.patient_id }}</div>
                <label for="doctor" class="form-label">Doctor</label>
                <select 
                  id="doctor" 
                  class="form-select" 
                  v-model="form.doctor_id"
                  :class="{ 'is-invalid': errors?.doctor_id }"
                >
                  <option value="">Select Doctor</option>
                  <option 
                    v-for="availability in availabilities" 
                    :key="availability?.id"
                    :value="availability?.doctor_id"
                  >
                   {{ availability?.doctor_name }} ({{ availability?.doctor_specialization }})
                  </option>
                </select>
                <div class="invalid-feedback" v-if="errors?.doctor_id">{{ errors?.doctor_id }}</div>
              </div>
              <div class="mb-3">
                <label for="date" class="form-label">Date</label>
                <input 
                  type="datetime-local" 
                  id="date" 
                  class="form-control" 
                  v-model="form.scheduled_time"
                  :class="{ 'is-invalid': errors?.scheduled_time }"
                >
                <div class="invalid-feedback" v-if="errors?.scheduled_time">{{ errors?.scheduled_time }}</div>
              </div>
              <button type="submit" class="btn btn-primary w-100">Book Appointment</button>
              <div class="invalid-feedback" v-if="errors?.form_submission_error">{{ errors?.form_submission_error }}</div>
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
                    <h5 class="mb-1">Doctor: {{ appointment.doctor_name }}</h5>
                    <p class="mb-1">Specialization: {{ appointment.doctor_specialization }}</p>
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
import { computed, ref, onMounted } from 'vue'

export default {
  setup() {
    const store = useStore()
    const form = ref({
      doctor_id: '',
      scheduled_time: '',
      patient_id: ''
    })
    const errors = ref({})
    
    const appointments = computed(() => store.state.appointments.appointments);
    const availabilities = computed(() => store.state.appointments.availability);
    const currentUser = computed(() => store.state.auth.user);
    const currentPatient = computed(() => store.state.patients.patient);

    // Call getAvailability and patient id when component mounts
    onMounted(() => {
      // Get availability
      store.dispatch('appointments/getAvailability');
      // Get appointments
      store.dispatch('appointments/getAppointments');
    })
    
    const bookAppointment = async () => {
      try {
        errors.value = {} // Clear previous errors

        // Get patient id
        await store.dispatch('patients/getPatientByUserId', currentUser?.value?.id);

        // form.value.patient_id = await computed(() => store.state.patients.patient.id);
        // form.value.patient_id = await computed(() => store.state.patients.patient.id);
        form.value.patient_id = currentPatient?.value?.id;

        console.log("bookAppointment: Doctors Id: " + form.value.doctor_id);
        console.log("bookAppointment: scheduled time: " + form.value.scheduled_time);
        console.log("bookAppointment: User Id: " + JSON.stringify(currentUser?.value?.id));
        console.log("bookAppointment: Current Patient: " + JSON.stringify(currentPatient?.value));
        console.log("bookAppointment: Patient Id: " + JSON.stringify(form.value.patient_id));       

        // Validate form data
        if (!form.value.patient_id) {
          errors.value.patient_id = 'Patient ID could not be retrieved'
          return
        }

        if (!form.value.doctor_id) {
          errors.value.doctor_id = 'Please select a doctor'
          return
        }

        if (!form.value.scheduled_time) {
          errors.value.scheduled_time = 'Please select a date and time'
          return
        }

        await store.dispatch('appointments/bookAppointment', {
          doctor_id: form.value.doctor_id,
          scheduled_time: formatDatetime(form.value.scheduled_time),
          patient_id: form.value.patient_id
        })

        form.value.doctor_id = ''
        form.value.scheduled_time = ''
        form.value.patient_id = ''

        await store.dispatch('appointments/getAvailability')
      } catch (error) {
        if (error.response?.data?.errors) {
          errors.value.form_submission_error = JSON.stringify(error.response.data.errors);
          console.error('Error booking appointment:', error.response.data.errors)
        } else {
          errors.value.form_submission_error = JSON.stringify(error);
          console.error('Error booking appointment:', error)
        }
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
    
    return {
      form,
      errors,
      appointments,
      availabilities,
      bookAppointment,
      joinQueue,
      currentUser,
      currentPatient
    }
  }
}
</script>