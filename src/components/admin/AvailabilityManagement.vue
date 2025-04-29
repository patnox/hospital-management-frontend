<template>
    <div class="container-fluid">
        <main class="content-wrapper">
            <div class="row">
                <div class="col-md-12">
                    <div class="card">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h4>Manage Doctor Availability</h4>
                            <button class="btn btn-primary" @click="showCreateModal">
                                Add New Availability
                            </button>
                        </div>
                        <div class="card-body">
                            <!-- Search and Filters -->
                            <div class="mb-4">
                                <div class="row">
                                    <div class="col-md-4">
                                        <select v-model="filters.doctor_id" class="form-control" @change="fetchAvailability">
                                            <option value="">All Doctors</option>
                                            <option v-for="doctor in doctors" :key="doctor?.id" :value="doctor?.id">
                                                {{ doctor?.name }} ({{ doctor?.specialization }})
                                            </option>
                                        </select>
                                    </div>
                                    <div class="col-md-4">
                                        <input v-model="filters.search" type="text" class="form-control" 
                                               placeholder="Search availability..." @keyup="fetchAvailability">
                                    </div>
                                    <div class="col-md-4">
                                        <button class="btn btn-outline-secondary" @click="clearSearch">
                                            <i class="fas fa-circle-xmark"></i> Clear Search
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Availability Table -->
                            <table class="table table-striped table-bordered">
                                <thead>
                                    <tr>
                                        <th>Doctor</th>
                                        <th>Day</th>
                                        <th>Start Time</th>
                                        <th>End Time</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-if="availability?.availability?.availability?.data?.length === 0">
                                        <td colspan="6" class="text-center py-4">
                                            No availability found
                                        </td>
                                    </tr>
                                    <tr v-for="item in availability?.availability?.availability?.data" :key="item?.id">
                                        <td>{{ item?.doctor_name }} ({{ item?.doctor?.specialization }})</td>
                                        <td>{{ item?.day }}</td>
                                        <td>{{ item?.start_time }}</td>
                                        <td>{{ item?.end_time }}</td>
                                        <td>
                                            <span class="badge" 
                                                  :class="item.is_booked ? 'bg-danger' : 'bg-success'">
                                                {{ item.is_booked ? 'Booked' : 'Available' }}
                                            </span>
                                        </td>
                                        <td>
                                            <div class="d-flex gap-2">
                                                <button class="btn btn-sm btn-primary" 
                                                        @click="editAvailability(item)">
                                                    <i class="fas fa-pen-to-square"></i>
                                                </button>
                                                <button class="btn btn-sm btn-danger" 
                                                        @click="deleteAvailability(item)">
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

        <!-- Create Availability Modal -->
        <div class="modal fade" id="createAvailabilityModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">{{ modalTitle }}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" 
                                aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="saveAvailability">
                            <div class="mb-3">
                                <label class="form-label">Doctor</label>
                                <select v-model="availabilityData.doctor_id" class="form-select" required>
                                    <option v-for="doctor in doctors?.doctors?.doctors?.data" :key="doctor?.id" 
                                            :value="doctor?.id">
                                        {{ doctor?.name }} ({{ doctor?.specialization }})
                                    </option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Day</label>
                                <input type="date" v-model="availabilityData.day" 
                                       class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Start Time</label>
                                <input type="time" v-model="availabilityData.start_time" 
                                       class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">End Time</label>
                                <input type="time" v-model="availabilityData.end_time" 
                                       class="form-control" required>
                            </div>
                            <button type="submit" class="btn btn-primary w-100">
                                {{ isEditing ? 'Update' : 'Create' }}
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
const availability = computed(() => store.state.availability)
const doctors = computed(() => store.state.doctors)
const loading = computed(() => store.state.loading)
const error = computed(() => store.state.error)

const filters = ref({
    doctor_id: '',
    search: '',
    page: 1,
    perPage: 10
})

const availabilityData = ref({
    doctor_id: '',
    day: '',
    start_time: '',
    end_time: ''
})

const pagination = ref({
    currentPage: 1,
    perPage: 10,
    total: 0,
    lastPage: 0
})

const isEditing = ref(false)
const modalTitle = ref('Add New Availability')

const fetchAvailability = async () => {
    try {
        errors.value = {}
        const response = await store.dispatch('availability/fetchAvailability', filters.value);
        console.log("Got availability response: " + JSON.stringify(availability?.value));
        console.log("Got current page: " + JSON.stringify(availability?.value?.availability?.availability?.current_page));
        pagination.value = {
            currentPage: availability.value?.availability?.availability?.current_page,
            perPage: availability.value?.availability?.availability?.per_page,
            total: availability.value?.availability?.availability?.total,
            lastPage: availability.value?.availability?.availability?.last_page
        }
        console.log("Got availability pagination: " + JSON.stringify(pagination?.value));
    } catch (err) {
        console.error(err)
    }
}

const clearSearch = () => {
    filters.value.search = ''
    filters.value.doctor_id = ''
    fetchAvailability()
}

const handlePageChange = (page) => {
    filters.value.page = page
    fetchAvailability()
}

const showCreateModal = () => {
    isEditing.value = false
    modalTitle.value = 'Add New Availability';
    console.log("Doctors is: " + JSON.stringify(doctors?.value?.doctors?.doctors?.data));
    availabilityData.value = {
        doctor_id: '',
        day: '',
        start_time: '',
        end_time: ''
    }
    const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('createAvailabilityModal'))
    modal.show()
}

const editAvailability = (item) => {
    isEditing.value = true
    modalTitle.value = 'Edit Availability'
    Object.assign(availabilityData.value, item)
    const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('createAvailabilityModal'))
    modal.show()
}

const saveAvailability = async () => {
    try {
        errors.value = {}
        const action = isEditing.value ? 'availability/updateAvailability' : 'availability/createAvailability'
        const response = await store.dispatch(action, availabilityData.value)
        
        const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('createAvailabilityModal'))
        modal.hide()
        fetchAvailability()
        
        return response
    } catch (err) {
        console.error(err)
        if (err.response?.data?.errors) {
            errors.value = err.response.data.errors
        } else {
            errors.value = { general: 'Failed to save availability' }
        }
    }
}

const deleteAvailability = async (item) => {
    try {
        if (confirm('Are you sure you want to delete this availability?')) {
            await store.dispatch('availability/deleteAvailability', item.id)
            fetchAvailability()
        }
    } catch (err) {
        console.error(err)
    }
}

const fetchDoctors = async () => {
    try {
        // Clear previous errors
        errors.value = {}
        const response = await store.dispatch('doctors/fetchDoctors');
        console.log("Got Doctors response: " + JSON.stringify(doctors?.value));
    } catch (err) {
        console.error(err);
    }
  }

onMounted(() => {
    fetchAvailability();
    fetchDoctors();
})
</script>

<style>
@import 'bootstrap/dist/css/bootstrap.min.css';
@import '@fortawesome/fontawesome-free/css/all.min.css';
</style>