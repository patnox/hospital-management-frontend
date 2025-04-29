<template>
    <div class="container-fluid">
      <!-- Main Content -->
      <main class="content-wrapper">
        <div class="row">
          <div class="col-md-12">
            <div class="card">
              <div class="card-header d-flex justify-content-between align-items-center">
                <h4>Manage Patients</h4>
                <button class="btn btn-primary" @click="showCreateModal">
                  Add New Patient
                </button>
              </div>
              <div class="card-body">
                <!-- Search -->
                <div class="mb-4">
                  <div class="input-group">
                    <input v-model="filters.search" 
                           @keyup="fetchPatients" 
                           type="text" 
                           class="form-control" 
                           placeholder="Search patients...">
                    <button class="btn btn-outline-secondary" 
                            type="button" 
                            @click="clearSearch"
                            data-bs-toggle="tooltip"
                            title="Clear Search">
                      <i class="fas fa-circle-xmark"></i>
                    </button>
                  </div>
                </div>
  
                <!-- Patients Table -->
                <table class="table table-striped table-bordered">
                  <thead>
                    <tr>
                      <th><b>Name</b></th>
                      <th><b>Email</b></th>
                      <th><b>Medical History</b></th>
                      <th><b>Emergency Contact</b></th>
                      <th><b>Actions</b></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="patients?.patients?.patients?.data?.length === 0">
                      <td colspan="5" class="text-center py-4">
                        No patients found
                      </td>
                    </tr>
                    <tr v-for="patient in patients?.patients?.patients?.data" :key="patient?.id">
                      <td>{{ patient?.name }}</td>
                      <td>{{ patient?.email }}</td>
                      <td>{{ patient?.medical_history }}</td>
                      <td>{{ patient?.emergency_contact }}</td>
                      <td>
                        <div class="d-flex gap-2">
                          <button
                            class="btn btn-sm btn-primary"
                            @click="editPatient(patient)"
                            data-bs-toggle="tooltip"
                            title="Edit Patient"
                          >
                            <i class="fas fa-pen-to-square"></i>
                          </button>
                          <button
                            class="btn btn-sm btn-danger"
                            @click="deletePatient(patient)"
                            data-bs-toggle="tooltip"
                            title="Delete Patient"
                          >
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
                    <li class="page-item" v-if="pagination.currentPage > 1">
                      <button class="page-link" @click="handlePageChange(pagination.currentPage - 1)">
                        Previous
                      </button>
                    </li>
                    <li class="page-item" v-if="pagination.currentPage < pagination.lastPage">
                      <button class="page-link" @click="handlePageChange(pagination.currentPage + 1)">
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
  
      <!-- Create Patient Modal -->
      <div class="modal fade" id="createPatientModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Add New Patient</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="createPatient">
                <div class="mb-3">
                  <label class="form-label">Name</label>
                  <input type="text" class="form-control" v-model="newPatient.name" required :class="{ 'is-invalid': errors?.name }">
                  <div class="invalid-feedback" v-if="errors?.name">{{ errors?.name }}</div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input type="email" class="form-control" v-model="newPatient.email" required :class="{ 'is-invalid': errors?.email }">
                  <div class="invalid-feedback" v-if="errors?.email">{{ errors?.email }}</div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Password</label>
                  <input
                    type="password"
                    class="form-control"
                    v-model="newPatient.password"
                    required
                    :class="{ 'is-invalid': errors?.password }"
                  >
                  <div class="invalid-feedback" v-if="errors?.password">{{ errors?.password }}</div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Repeat Password</label>
                  <input
                    type="password"
                    class="form-control"
                    v-model="newPatient.repeat_password"
                    required
                    :class="{ 'is-invalid': errors?.password }"
                  >
                  <div class="invalid-feedback" v-if="errors?.password">{{ errors?.password }}</div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Medical History</label>
                  <textarea class="form-control" v-model="newPatient.medical_history" rows="3" required :class="{ 'is-invalid': errors?.medical_history }"></textarea>
                  <div class="invalid-feedback" v-if="errors?.medical_history">{{ errors?.medical_history }}</div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Emergency Contact</label>
                  <input type="text" class="form-control" v-model="newPatient.emergency_contact" required :class="{ 'is-invalid': errors?.emergency_contact }">
                  <div class="invalid-feedback" v-if="errors?.emergency_contact">{{ errors?.emergency_contact }}</div>
                </div>
                <button type="submit" class="btn btn-primary w-100" :class="{ 'is-invalid': errors?.patient_saving }">Create Patient</button>
                <div class="invalid-feedback" v-if="errors?.patient_saving">{{ errors?.patient_saving }}</div>
              </form>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Edit Patient Modal -->
      <div class="modal fade" id="editPatientModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Edit Patient</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="updatePatient">
                <div class="mb-3">
                  <label class="form-label">Name</label>
                  <input type="text" class="form-control" v-model="selectedPatient.name" required>
                  <div class="invalid-feedback" v-if="errors?.name">{{ errors?.name }}</div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input type="email" class="form-control" v-model="selectedPatient.email" required>
                  <div class="invalid-feedback" v-if="errors?.email">{{ errors?.email }}</div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Medical History</label>
                  <textarea class="form-control" v-model="selectedPatient.medical_history" rows="3" required></textarea>
                  <div class="invalid-feedback" v-if="errors?.medical_history">{{ errors?.medical_history }}</div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Emergency Contact</label>
                  <input type="text" class="form-control" v-model="selectedPatient.emergency_contact" required>
                  <div class="invalid-feedback" v-if="errors?.emergency_contact">{{ errors?.emergency_contact }}</div>
                </div>
                <button type="submit" class="btn btn-primary w-100" :class="{ 'is-invalid': errors?.patient_editing }">Update Patient</button>
                <div class="invalid-feedback" v-if="errors?.patient_editing">{{ errors?.patient_editing }}</div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed, reactive } from 'vue'
  import { useStore } from 'vuex'
  import bootstrap from 'bootstrap/dist/js/bootstrap.bundle'
  
  const store = useStore();
  const errors = ref({});
  const patients = computed(() => store.state.patients)
  const currentUser = computed(() => store.state.currentUser)
  const loading = computed(() => store.state.loading)
  const error = computed(() => store.state.error)
  
  const filters = ref({
    search: '',
    page: 1,
    perPage: 10
  })
  
  const newPatient = ref({
    name: '',
    email: '',
    medical_history: '',
    emergency_contact: '',
    password: '',
    repeat_password: '',
    role: 'patient'
  })
  
  const selectedPatient = reactive({
    id: null,
    name: '',
    email: '',
    medical_history: '',
    emergency_contact: '',
    role: 'patient'
  })
  
  const pagination = ref({
    currentPage: 1,
    perPage: 10,
    total: 0,
    lastPage: 0
  })
  
  const fetchPatients = async () => {
    try {
      // Clear previous errors
      errors.value = {}
      const response = await store.dispatch('patients/fetchPatients', filters.value)
      console.log("Got response: " + JSON.stringify(patients?.value));
      console.log("Got current page: " + JSON.stringify(patients?.value?.patients?.patients?.current_page));
      pagination.value = {
        currentPage: patients?.value?.patients?.patients?.current_page,
        perPage: patients?.value?.patients?.patients?.per_page,
        total: patients?.value?.patients?.patients?.total,
        lastPage: patients?.value?.patients?.patients?.last_page
      }
      console.log("Got pagination: " + JSON.stringify(pagination?.value));
    } catch (err) {
      console.error(err);
    }
  }
  
  const clearSearch = () => {
    filters.value.search = ''
    fetchPatients()
  }
  
  const handlePageChange = (page) => {
    filters.value.page = page
    fetchPatients()
  }
  
  const showCreateModal = () => {
    newPatient.value = {
      name: '',
      email: '',
      medical_history: '',
      emergency_contact: '',
      password: '',
      repeat_password: '',
      role: 'patient'
    }
    const modal = new bootstrap.Modal(document.getElementById('createPatientModal'))
    modal.show()
  }
  
  const createPatient = async () => {
    try {
      // Clear previous errors
      errors.value = {}
      if (!newPatient.value.name) {
        errors.value.name = 'Please enter name';
        return;
      }
      if (!newPatient.value.email) {
        errors.value.email = 'Please enter email';
        return;
      }
      if (!newPatient.value.password) {
        errors.value.password = 'Please enter password';
        return;
      }
      if (newPatient.value.password && newPatient.value.password.length < 6) {
        errors.value.password = 'Password Must be longer than 6 characters';
        return;
      }
      if (newPatient.value.password != newPatient.value.repeat_password) {
        errors.value.password = 'Passwords do not match';
        return;
      }
      if (!newPatient.value.medical_history) {
        errors.value.medical_history = 'Please enter medical history';
        return;
      }
      if (!newPatient.value.emergency_contact) {
        errors.value.emergency_contact = 'Please enter emergency contact';
        return;
      }
      await store.dispatch('auth/register', newPatient.value)
      const modal = bootstrap.Modal.getInstance(document.getElementById('createPatientModal'))
      modal.hide()
      fetchPatients()
    } catch (err) {
      console.error(err);
      errors.value.patient_saving = 'Error: Patient saving Failed. Please contact admin';
    }
  }
  
  const editPatient = (patient) => {
    Object.assign(selectedPatient, patient);
    selectedPatient.role = 'patient';
    const modal = new bootstrap.Modal(document.getElementById('editPatientModal'))
    modal.show()
  }
  
  const updatePatient = async () => {
    try {
      // Clear previous errors
      errors.value = {}
      if (!selectedPatient.name) {
        errors.value.name = 'Please enter name';
        return;
      }
      if (!selectedPatient.email) {
        errors.value.email = 'Please enter email';
        return;
      }
      if (!selectedPatient.medical_history) {
        errors.value.medical_history = 'Please enter medical history';
        return;
      }
      if (!selectedPatient.emergency_contact) {
        errors.value.emergency_contact = 'Please enter emergency contact';
        return;
      }
      await store.dispatch('patients/updatePatient', {
        patientId: selectedPatient.id,
        patientData: selectedPatient
      })
      const modal = bootstrap.Modal.getInstance(document.getElementById('editPatientModal'))
      modal.hide()
      fetchPatients()
    } catch (err) {
      console.error(err);
      errors.value.patient_editing = 'Error: Patient editing Failed. Please contact admin';
    }
  }
  
  const deletePatient = async (patient) => {
    try {
      if (confirm('Are you sure you want to delete this patient?')) {
        await store.dispatch('patients/deletePatient', patient.id)
        fetchPatients()
      }
    } catch (err) {
      console.error(err)
    }
  }
  
  onMounted(() => {
    fetchPatients()
  })
  </script>
  
  <style>
  @import 'bootstrap/dist/css/bootstrap.min.css';
  @import '@fortawesome/fontawesome-free/css/all.min.css';
  </style>