<template>
    <div class="container-fluid">

        <!-- Main Content -->
        <main class="content-wrapper">
        <div class="row">
            <div class="col-md-12">
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                <h4>Manage Doctors</h4>
                <button class="btn btn-primary" @click="showCreateModal">
                    Add New Doctor
                </button>
                </div>
                
                <div class="card-body">
                <!-- Search -->
                <div class="mb-4">
                    <div class="input-group">
                    <input v-model="filters.search" @keyup="fetchDoctors" type="text" class="form-control" placeholder="Search doctors...">
                    <button 
                        class="btn btn-outline-secondary" 
                        type="button" 
                        @click="clearSearch"
                        data-bs-toggle="tooltip"
                        title="Clear Search"
                        >
                        <i class="fas fa-circle-xmark"></i>
                    </button>
                    </div>
                </div>

                <!-- Doctors Table -->
                <table class="table table-striped table-bordered">
                    <thead>
                    <tr>
                        <th><b>Name</b></th>
                        <th><b>Email</b></th>
                        <th><b>Specialization</b></th>
                        <th><b>Department</b></th>
                        <th><b>Actions</b></th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-if="doctors.length === 0">
                        <td colspan="5" class="text-center py-4">
                        No doctors found
                        </td>
                    </tr>
                    <tr v-for="doctor in doctors?.doctors?.data" :key="doctor?.id">
                        <td>{{ doctor?.name }}</td>
                        <td>{{ doctor?.email }}</td>
                        <td>{{ doctor?.specialization }}</td>
                        <td>{{ doctor?.department }}</td>
                        <td>
                        <div class="d-flex gap-2">
                            <button 
                                class="btn btn-sm btn-primary" 
                                @click="editDoctor(doctor)"
                                data-bs-toggle="tooltip"
                                title="Edit Doctor"
                                >
                            <i class="fas fa-pen-to-square"></i>
                            </button>
                            <button 
                                class="btn btn-sm btn-danger" 
                                @click="deleteDoctor(doctor)"
                                data-bs-toggle="tooltip"
                                title="Delete Doctor"
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


        <!-- Create Doctor Modal -->
        <div class="modal fade" id="createDoctorModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Add New Doctor</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="createDoctor">
                            <div class="mb-3">
                                <label class="form-label">Name</label>
                                <input type="text" class="form-control" v-model="newDoctor.name" required :class="{ 'is-invalid': errors?.name }">
                                <div class="invalid-feedback" v-if="errors?.name">{{ errors?.name }}</div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Email</label>
                                <input type="email" class="form-control" v-model="newDoctor.email" required :class="{ 'is-invalid': errors?.email }">
                                <div class="invalid-feedback" v-if="errors?.email">{{ errors?.email }}</div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Password</label>
                                <input 
                                    type="password" 
                                    class="form-control" 
                                    v-model="newDoctor.password" 
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
                                    v-model="newDoctor.repeat_password" 
                                    required
                                    :class="{ 'is-invalid': errors?.password }"
                                    >
                                <div class="invalid-feedback" v-if="errors?.password">{{ errors?.password }}</div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Specialization</label>
                                <input type="text" class="form-control" v-model="newDoctor.specialization" required :class="{ 'is-invalid': errors?.specialization }">
                                <div class="invalid-feedback" v-if="errors?.specialization">{{ errors?.specialization }}</div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Department</label>
                                <input type="text" class="form-control" v-model="newDoctor.department" required :class="{ 'is-invalid': errors?.department }">
                                <div class="invalid-feedback" v-if="errors?.department">{{ errors?.department }}</div>
                            </div>
                            <button type="submit" class="btn btn-primary w-100" :class="{ 'is-invalid': errors?.doctor_saving }">Create Doctor</button>
                            <div class="invalid-feedback" v-if="errors?.doctor_saving">{{ errors?.doctor_saving }}</div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- Edit Doctor Modal -->
        <div class="modal fade" id="editDoctorModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Edit Doctor</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="updateDoctor">
                            <div class="mb-3">
                                <label class="form-label">Name</label>
                                <input type="text" class="form-control" v-model="selectedDoctor.name" required>
                                <div class="invalid-feedback" v-if="errors?.name">{{ errors?.name }}</div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Email</label>
                                <input type="email" class="form-control" v-model="selectedDoctor.email" required>
                                <div class="invalid-feedback" v-if="errors?.email">{{ errors?.email }}</div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Specialization</label>
                                <input type="text" class="form-control" v-model="selectedDoctor.specialization" required>
                                <div class="invalid-feedback" v-if="errors?.specialization">{{ errors?.specialization }}</div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Department</label>
                                <input type="text" class="form-control" v-model="selectedDoctor.department" required>
                                <div class="invalid-feedback" v-if="errors?.department">{{ errors?.department }}</div>
                            </div>
                            <button type="submit" class="btn btn-primary w-100" :class="{ 'is-invalid': errors?.doctor_editing }">Update Doctor</button>
                            <div class="invalid-feedback" v-if="errors?.doctor_editing">{{ errors?.doctor_editing }}</div>
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
  import bootstrap from 'bootstrap/dist/js/bootstrap.bundle';

  
  const store = useStore();
  const errors = ref({});
  
  const doctors = computed(() => store.state.doctors.doctors)
  const currentUser = computed(() => store.state.currentUser)
  const loading = computed(() => store.state.loading)
  const error = computed(() => store.state.error)
  
  const filters = ref({
    search: '',
    page: 1,
    perPage: 10
  })
  
  const newDoctor = ref({
    name: '',
    email: '',
    specialization: '',
    department: '',
    password: '',
    repeat_password: '',
    role: 'doctor'
  })
  
  const selectedDoctor = reactive({
        id: null,
        name: '',
        email: '',
        specialization: '',
        department: '',
        role: 'doctor'
    })
  
  const pagination = ref({
    currentPage: 1,
    perPage: 10,
    total: 0,
    lastPage: 0
  })
  
  const fetchDoctors = async () => {
    try {
        // Clear previous errors
        errors.value = {}
      const response = await store.dispatch('doctors/fetchDoctors', filters.value);
      console.log("Got response: " + JSON.stringify(doctors?.value));
      pagination.value = {
        currentPage: doctors?.value?.doctors?.current_page,
        perPage: doctors?.value?.doctors?.per_page,
        total: doctors?.value?.doctors?.total,
        lastPage: doctors?.value?.doctors?.last_page
      }
      console.log("Got pagination: " + JSON.stringify(pagination?.value));
    } catch (err) {
      console.error(err);
    }
  }
  
  const clearSearch = () => {
    filters.value.search = ''
    fetchDoctors()
  }
  
  const handlePageChange = (page) => {
    filters.value.page = page
    fetchDoctors()
  }
  
  const showCreateModal = () => {
    newDoctor.value = {
        name: '',
        email: '',
        specialization: '',
        department: '',
        password: '',
        repeat_password: '',
        role: 'doctor'
    }
    const modal = new bootstrap.Modal(document.getElementById('createDoctorModal'))
    modal.show()
  }
  
  const createDoctor = async () => {
    try {
        // Clear previous errors
        errors.value = {}

        if (!newDoctor.value.name) {
            errors.value.name = 'Please enter name';
            return;
        }

        if (!newDoctor.value.email) {
            errors.value.email = 'Please enter email';
            return;
        }

        if (!newDoctor.value.password) {
            errors.value.password = 'Please enter password';
            return;
        }

        if (newDoctor.value.password && newDoctor.value.password.length < 6) {
            errors.value.password = 'Password Must be longer than 6 characters';
            return;
        }

        if (newDoctor.value.password != newDoctor.value.repeat_password) {
            errors.value.password = 'Passwords do not match';
            return;
        }

        if (!newDoctor.value.specialization) {
            errors.value.specialization = 'Please enter specialization';
            return;
        }

        if (!newDoctor.value.department) {
            errors.value.department = 'Please enter department';
            return;
        }

        await store.dispatch('auth/register', newDoctor.value)
        const modal = bootstrap.Modal.getInstance(document.getElementById('createDoctorModal'))
        modal.hide()
        fetchDoctors()
    } catch (err) {
        console.error(err);
        errors.value.doctor_saving = 'Error: Doctor saving Failed. Please contact admin';
    }
  }
  
  const editDoctor = (doctor) => {
    // selectedDoctor.value = { ...doctor }
    Object.assign(selectedDoctor, doctor);
    selectedDoctor.role = 'doctor';
    console.log("Doctors now is: " + JSON.stringify(selectedDoctor));
    const modal = new bootstrap.Modal(document.getElementById('editDoctorModal'))
    modal.show()
  }
  
  const updateDoctor = async () => {
    try {
        // Clear previous errors
        errors.value = {}

        if (!selectedDoctor.name) {
            errors.value.name = 'Please enter name';
            return;
        }

        if (!selectedDoctor.email) {
            errors.value.email = 'Please enter email';
            return;
        }

        if (!selectedDoctor.specialization) {
            errors.value.specialization = 'Please enter specialization';
            return;
        }

        if (!selectedDoctor.department) {
            errors.value.department = 'Please enter department';
            return;
        }

        console.log("Doctors id is: " + JSON.stringify(selectedDoctor.id));
        await store.dispatch('doctors/updateDoctor', {
            doctorId: selectedDoctor.id,
            doctorData: selectedDoctor
        })
        const modal = bootstrap.Modal.getInstance(document.getElementById('editDoctorModal'))
        modal.hide()
        fetchDoctors()
    } catch (err) {
        console.error(err);
        errors.value.doctor_editing = 'Error: Doctor editing Failed. Please contact admin';
    }
  }
  
  const deleteDoctor = async (doctor) => {
    try {
        if (confirm('Are you sure you want to delete this doctor?')) {
            await store.dispatch('doctors/deleteDoctor', doctor.id)
            fetchDoctors()
        }
    } catch (err) {
        console.error(err)
    }
  }
  
  onMounted(() => {
    fetchDoctors()
  })
  </script>
  
  <style>
  @import 'bootstrap/dist/css/bootstrap.min.css';
  @import '@fortawesome/fontawesome-free/css/all.min.css';
  </style>
  