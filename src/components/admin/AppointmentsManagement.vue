<template>
    <div class="container-fluid">
        <main class="content-wrapper">
            <div class="row">
                <div class="col-md-12">
                    <div class="card">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h4>Manage Appointments</h4>
                            <button class="btn btn-primary" @click="showCreateModal">
                                Book New Appointment
                            </button>
                        </div>
                        <div class="card-body">
                            <!-- //1 -->

                            <!-- Appointments Table -->
                            <table class="table table-striped table-bordered">
                                <thead>
                                    <tr>
                                        <th>Patient</th>
                                        <th>Doctor</th>
                                        <th>Date</th>
                                        <th>Time</th>
                                        <th>Status</th>
                                        <th>Queue Position</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-if="appointmentsadmin?.appointmentsadmin?.appointments?.data?.length === 0">
                                        <td colspan="7" class="text-center py-4">
                                            No appointments found
                                        </td>
                                    </tr>
                                    <tr v-for="appointment in appointmentsadmin?.appointmentsadmin?.appointments?.data" :key="appointment?.id">
                                        <td>{{ appointment?.patient_name }}</td>
                                        <td>{{ appointment?.doctor_name }} ({{ appointment?.doctor_specialization }})</td>
                                        <td>{{ formatDate(appointment?.scheduled_time) }}</td>
                                        <td>{{ formatTime(appointment?.scheduled_time) }}</td>
                                        <td>
                                            <span class="badge" 
                                                  :class="getStatusClass(appointment?.status)">
                                                {{ appointment?.status }}
                                            </span>
                                        </td>
                                        <td v-if="appointment?.queue_position">
                                            {{ appointment?.queue_position.position }} ({{ appointment?.queue_position.status }})
                                        </td>
                                        <td v-else>
                                            Not in queue
                                        </td>
                                        <td>
                                            <div class="d-flex gap-2">
                                                <button class="btn btn-sm btn-primary" 
                                                        @click="editAppointment(appointment)">
                                                    <i class="fas fa-pen-to-square"></i>
                                                </button>
                                                <button class="btn btn-sm btn-success" 
                                                        @click="callNextPatient(appointment)"
                                                        v-if="appointment?.status === 'pending' && 
                                                              appointment?.queue_position">
                                                    <i class="fab fa-whatsapp"></i>
                                                </button>
                                                <button class="btn btn-sm btn-danger" 
                                                        @click="cancelAppointment(appointment)"
                                                        v-if="appointment?.status === 'pending'">
                                                    <i class="fas fa-trash-alt"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <!-- Pagination -->
                            <nav aria-label="Page navigation">
                                <ul class="pagination justify-content-end">
                                    <li class="page-item" v-if="pagination?.currentPage > 1">
                                        <button class="page-link" @click="handlePageChange(pagination?.currentPage - 1)">
                                            Previous
                                        </button>
                                    </li>
                                    <li class="page-item" v-if="pagination?.currentPage < pagination?.lastPage">
                                        <button class="page-link" @click="handlePageChange(pagination?.currentPage + 1)">
                                            Next
                                        </button>
                                    </li>
                                </ul>
                            </nav>

                        </div>
                    </div>
                </div>
            </div>
        </main>

        <!-- Create/Edit Appointment Modal -->
        <div class="modal fade" id="createAppointmentModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">{{ modalTitle }}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" 
                                aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="saveAppointment">
                            <div class="mb-3">
                                <label class="form-label">Patient</label>
                                <select v-model="appointmentData.patient_id" class="form-control" required>
                                    <option v-for="patient in patients?.patients?.patients?.data" :key="patient?.id" 
                                            :value="patient?.id">
                                        {{ patient?.name }} ({{ patient?.medical_history ? 'Has medical history' : 'No medical history' }})
                                    </option>
                                </select>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Doctor</label>
                                <select v-model="appointmentData.doctor_id" class="form-control" required>
                                    <option v-for="doctor in doctors?.doctors?.doctors?.data" :key="doctor?.id" 
                                            :value="doctor?.id">
                                        {{ doctor?.name }} ({{ doctor?.specialization }})
                                    </option>
                                </select>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Date Time</label>
                                <input type="datetime-local" v-model="appointmentData.scheduled_time" class="form-control" required>
                            </div>

                            <button type="submit" class="btn btn-primary w-100">
                                {{ isEditing ? 'Update' : 'Book' }} Appointment
                            </button>

                        </form>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle'

const store = useStore()
const errors = ref({})
const appointmentsadmin = computed(() => store.state.appointmentsadmin)
const doctors = computed(() => store.state.doctors)
const patients = computed(() => store.state.patients)
const loading = computed(() => store.state.loading)
const error = computed(() => store.state.error)

const filters = ref({
    doctor_id: '',
    search: '',
    status: '',
    page: 1,
    perPage: 10
})

const appointmentData = ref({
    patient_id: '',
    doctor_id: '',
    scheduled_time: ''
})

const isEditing = ref(false)
const modalTitle = ref('Book New Appointment')

const pagination = ref({
    currentPage: 1,
    perPage: 10,
    total: 0,
    lastPage: 0
})

const fetchAppointments = async () => {
    try {
        errors.value = {}
        const response = await store.dispatch('appointmentsadmin/fetchAppointments', filters.value);
        console.log("Got appointments response: " + JSON.stringify(appointmentsadmin?.value?.appointmentsadmin?.appointments?.data));
        pagination.value = {
            currentPage: appointmentsadmin.value?.appointmentsadmin?.appointments?.current_page,
            perPage: appointmentsadmin.value?.appointmentsadmin?.appointments?.per_page,
            total: appointmentsadmin.value?.appointmentsadmin?.appointments?.total,
            lastPage: appointmentsadmin.value?.appointmentsadmin?.appointments?.last_page
        }
        console.log("Got appointments pagination: " + JSON.stringify(pagination?.value));
    } catch (err) {
        console.error(err)
    }
}

const clearSearch = () => {
    filters.value.search = ''
    filters.value.doctor_id = ''
    filters.value.status = ''
    fetchAppointments()
}

const handlePageChange = (page) => {
    filters.value.page = page
    fetchAppointments()
}

const showCreateModal = () => {
    isEditing.value = false
    modalTitle.value = 'Book New Appointment'
    appointmentData.value = {
        patient_id: '',
        doctor_id: '',
        scheduled_time: ''
    }
    const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('createAppointmentModal'))
    modal.show()
}

const editAppointment = (appointment) => {
    isEditing.value = true
    modalTitle.value = 'Edit Appointment'
    appointmentData.value = {
        patient_id: appointment.patient_id,
        doctor_id: appointment.doctor_id,
        scheduled_time: appointment.scheduled_time
    }
    const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('createAppointmentModal'))
    modal.show()
}

const saveAppointment = async () => {
    try {
        errors.value = {}
        const action = isEditing.value ? 'appointmentsadmin/updateAppointment' : 'appointmentsadmin/createAppointment'
        const response = await store.dispatch(action, appointmentData.value)
        
        const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('createAppointmentModal'))
        modal.hide()
        fetchAppointments()
        
        return response
    } catch (err) {
        console.error(err)
        if (err.response?.data?.errors) {
            errors.value = err.response.data.errors
        } else {
            errors.value = { general: 'Failed to save appointment' }
        }
    }
}

const callNextPatient = async (appointment) => {
    try {
        await store.dispatch('appointmentsadmin/callNextPatient', appointment.id)
        fetchAppointments()
    } catch (err) {
        console.error(err)
    }
}

const cancelAppointment = async (appointment) => {
    try {
        if (confirm('Are you sure you want to cancel this appointment?')) {
            await store.dispatch('appointmentsadmin/cancelAppointment', appointment.id)
            fetchAppointments()
        }
    } catch (err) {
        console.error(err)
    }
}

const getStatusClass = (status) => {
    const classes = {
        'pending': 'bg-warning',
        'completed': 'bg-success',
        'cancelled': 'bg-danger'
    }
    return classes[status] || 'bg-secondary'
}

const formatDate = (datetime) => {
    return new Date(datetime).toLocaleDateString()
}

const formatTime = (datetime) => {
    return new Date(datetime).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
    })
}

const fetchPatients = async () => {
    try {
        // Clear previous errors
        errors.value = {}
        const response = await store.dispatch('patients/fetchPatients', filters.value)
        console.log("Got patients response: " + JSON.stringify(patients?.value));
        console.log("Got patients current page: " + JSON.stringify(patients?.value?.patients?.patients?.current_page));
    } catch (err) {
        console.error(err);
    }
}

const fetchDoctors = async () => {
    try {
        // Clear previous errors
        errors.value = {}
        const response = await store.dispatch('doctors/fetchDoctors', filters.value);
        console.log("Got doctors response: " + JSON.stringify(doctors?.value));
    } catch (err) {
      console.error(err);
    }
  }

onMounted(() => {
    fetchAppointments();
    fetchPatients();
    fetchDoctors();
})
</script>

<style>
@import 'bootstrap/dist/css/bootstrap.min.css';
@import '@fortawesome/fontawesome-free/css/all.min.css';
</style>