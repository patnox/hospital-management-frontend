<template>
    <div class="container-fluid">
        <main class="content-wrapper">
            <div class="row">
                <div class="col-md-12">
                    <div class="card">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h4>Queue Management</h4>
                            <div class="d-flex gap-2">
                                <button class="btn btn-primary" @click="callNextPatient">
                                    <i class="fas fa-phone-call"></i> Call Next Patient
                                </button>
                                <button class="btn btn-secondary" @click="refreshQueue">
                                    <i class="fas fa-sync"></i> Refresh Queue
                                </button>
                            </div>
                        </div>
                        <div class="card-body">
                            <!-- Queue Status -->
                            <div class="mb-4">
                                <div class="row">
                                    <div class="col-md-4">
                                        <div class="card bg-primary text-white">
                                            <div class="card-body">
                                                <h5 class="card-title">Current Queue</h5>
                                                <p class="card-text">
                                                    Total Patients: {{ queueStats.total }}<br>
                                                    Waiting: {{ queueStats.waiting }}<br>
                                                    Called: {{ queueStats.called }}<br>
                                                    Attended: {{ queueStats.attended }}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-8">
                                        <div class="card">
                                            <div class="card-body">
                                                <h5 class="card-title">Queue Controls</h5>
                                                <div class="d-flex gap-2">
                                                    <select v-model="filters.doctorId" class="form-control" @change="refreshQueue">
                                                        <option value="">All Doctors</option>
                                                        <option v-for="doctor in doctors" :key="doctor?.id" :value="doctor?.id">
                                                            {{ doctor?.name }} ({{ doctor?.specialization }})
                                                        </option>
                                                    </select>
                                                    <button class="btn btn-secondary" @click="clearFilters">
                                                        <i class="fas fa-circle-xmark"></i> Clear Filters
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Queue Display -->
                            <div class="mb-4">
                                <div class="queue-container">
                                    <div class="queue-section" v-for="status in ['waiting', 'called', 'attended']" :key="status">
                                        <h5 class="queue-title">{{ status.toUpperCase() }}</h5>
                                        <div class="queue-items" :class="{ 'called': status === 'called' }">
                                            <div class="queue-item" v-for="patient in queuePositions" 
                                                 :key="patient.id" 
                                                 :class="{ 'current': patient.position === 1 && status === 'waiting' }">
                                                <div class="queue-item-content">
                                                    <h6>{{ patient.appointment.patient.name }}</h6>
                                                    <p>Position: {{ patient.position }}</p>
                                                    <p>Doctor: {{ patient.appointment.doctor.name }}</p>
                                                    <p>Status: {{ patient.status }}</p>
                                                    <div class="queue-actions">
                                                        <button v-if="status === 'waiting' && patient.position === 1" 
                                                                class="btn btn-sm btn-primary"
                                                                @click="callPatient(patient)">
                                                            <i class="fas fa-phone-call"></i> Call
                                                        </button>
                                                        <button v-if="status === 'called'" 
                                                                class="btn btn-sm btn-success"
                                                                @click="markAttended(patient)">
                                                            <i class="fas fa-check"></i> Mark Attended
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
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle'

const store = useStore()
const queuePositions = computed(() => store.state.queuePositions)
const doctors = computed(() => store.state.doctors)
const loading = computed(() => store.state.loading)
const error = computed(() => store.state.error)

const errors = ref({})

const filters = ref({
    doctorId: '',
    page: 1,
    perPage: 10
})

const queueStats = computed(() => {
    const stats = {
        total: 0,
        waiting: 0,
        called: 0,
        attended: 0
    }

    if (queuePositions.value) {
        stats.total = Object.values(queuePositions.value).flat().length
        Object.values(queuePositions.value).forEach(positions => {
            positions.forEach(pos => {
                stats[pos.status]++
            })
        })
    }

    return stats
})

const refreshQueue = async () => {
    try {
        await store.dispatch('queueadmin/refreshQueue', filters.value);
        console.log("Got queue response: " + JSON.stringify(queuePositions?.value));
    } catch (err) {
        console.error(err)
    }
}

const clearFilters = () => {
    filters.value.doctorId = ''
    refreshQueue()
}

const callNextPatient = async () => {
    try {
        await store.dispatch('queueadmin/callNextPatient')
        refreshQueue()
    } catch (err) {
        console.error(err)
    }
}

const callPatient = async (patient) => {
    try {
        await store.dispatch('queueadmin/callPatient', patient.id)
        refreshQueue()
    } catch (err) {
        console.error(err)
    }
}

const markAttended = async (patient) => {
    try {
        await store.dispatch('queueadmin/markAttended', patient.id)
        refreshQueue()
    } catch (err) {
        console.error(err)
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
    refreshQueue();
    fetchDoctors();
})
</script>

<style>
@import 'bootstrap/dist/css/bootstrap.min.css';
@import '@fortawesome/fontawesome-free/css/all.min.css';

.queue-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
}

.queue-section {
    background: #f8f9fa;
    padding: 15px;
    border-radius: 8px;
}

.queue-title {
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 2px solid #dee2e6;
}

.queue-items {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.queue-item {
    background: white;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.queue-item.current {
    border-left: 4px solid #28a745;
}

.queue-item-content {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.queue-actions {
    display: flex;
    gap: 8px;
    margin-top: 10px;
}

.queue-item.called {
    background: #fff3cd;
}
</style>