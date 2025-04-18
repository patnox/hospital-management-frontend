<template>
  <div class="container mt-4">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Queue Status</h3>
          </div>
          <div class="card-body">
            <div v-if="queuePosition">
              <h4>Your Position: {{ queuePosition.position }}</h4>
              <p>Status: {{ queuePosition.status }}</p>
              <p v-if="queuePosition.status === 'called'">
                Please proceed to the doctor's office
              </p>
              <button 
                v-if="queuePosition.status === 'waiting'"
                @click="checkPosition"
                class="btn btn-primary w-100"
              >
                Check Position
              </button>
            </div>
            <div v-else>
              <p>You are not currently in the queue</p>
              <button 
                @click="joinQueue"
                class="btn btn-primary w-100"
              >
                Join Queue
              </button>
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
    
    const queuePosition = computed(() => store.state.appointments.queuePosition)
    
    const joinQueue = async () => {
      try {
        await store.dispatch('appointments/joinQueue', store.state.auth.user.id)
        await store.dispatch('appointments/getAppointments')
      } catch (error) {
        console.error(error)
      }
    }
    
    const checkPosition = async () => {
      try {
        await store.dispatch('appointments/getQueuePosition', store.state.auth.user.id)
      } catch (error) {
        console.error(error)
      }
    }
    
    return { queuePosition, joinQueue, checkPosition }
  }
}
</script>

<style scoped>
.card {
  margin-bottom: 20px;
}
</style>