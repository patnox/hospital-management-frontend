<!-- <script setup>
import { RouterLink, RouterView } from 'vue-router'
</script> -->

<template>
  <div id="app">
    <div v-if="currentUser">
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container">
          <a class="navbar-brand" href="#">Hospital Management</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
              <li class="nav-item">
                <router-link class="nav-link" to="/dashboard">Dashboard</router-link>
              </li>
              <div v-if="currentUser?.role == 'admin'">
                <!-- <li class="nav-item">
                  <router-link class="nav-link" to="/users">Users Admin</router-link>
                </li>
                <li class="nav-item">
                  <router-link class="nav-link" to="/patients">Patients Admin</router-link>
                </li>
                <li class="nav-item">
                  <router-link class="nav-link" to="/doctors">Doctors Admin</router-link>
                </li>
                <li class="nav-item">
                  <router-link class="nav-link" to="/doctors/availability">Doctors Availability Admin</router-link>
                </li> -->
                <ul class="navbar-nav ms-auto">
                  <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown">
                      Users
                    </a>
                    <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                      <li class="nav-item">
                        <router-link class="nav-link" to="/admin/users">Users Admin</router-link>
                      </li>
                      <li class="nav-item">
                        <router-link class="nav-link" to="/admin/patients">Patients Admin</router-link>
                      </li>
                      <li class="nav-item">
                        <router-link class="nav-link" to="/admin/doctors">Doctors Admin</router-link>
                      </li>
                      <li class="nav-item">
                        <router-link class="nav-link" to="/admin/doctors/availability">Doctors Availability Admin</router-link>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
              <div v-if="currentUser?.role == 'doctor'">
                <li class="nav-item">
                  <router-link class="nav-link" to="/doctor-availability/doctor">Availability</router-link>
                </li>
              </div>
              <li class="nav-item">
                <div v-if="currentUser?.role == 'patient'">
                  <router-link class="nav-link" to="/appointments">Appointments</router-link>
                </div>
                <div v-else-if="currentUser?.role == 'doctor'">
                  <router-link class="nav-link" to="/appointments/doctor">Appointments</router-link>
                </div>
                <div v-else-if="currentUser?.role == 'admin'">
                  <router-link class="nav-link" to="/appointments/admin">Appointments Admin</router-link>
                </div>
              </li>
              <li class="nav-item">
                <div v-if="currentUser?.role == 'patient'">
                  <router-link class="nav-link" to="/queue">Queue</router-link>
                </div>
                <div v-else-if="currentUser?.role == 'doctor'">
                  <router-link class="nav-link" to="/queue/doctor">Queue</router-link>
                </div>
                <div v-else-if="currentUser?.role == 'admin'">
                  <router-link class="nav-link" to="/queue/admin">Queue Admin</router-link>
                </div>
              </li>
            </ul>
            <ul class="navbar-nav ms-auto">
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown">
                  {{ currentUser?.name }}
                </a>
                <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li><a class="dropdown-item" href="#" @click="logout">Logout</a></li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>  
    <!-- <div class="login-container">
      <router-view/>
    </div> -->
    <div :class="pageClass">
      <router-view/>
    </div>
  </div>

  <!-- <div class="login-container">
      <router-view/>
  </div> -->
  <!-- <RouterView /> -->
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router';

export default {
  setup() {
    const store = useStore()
    
    const currentUser = computed(() => store.state.auth.user)
    
    const logout = async () => {
      await store.dispatch('auth/logout')
      console.log("Redirecting to login page");
      window.location.href = '/login'
    }

    const route = useRoute();

    const pageClass = computed(() => {
      var pageclass = '';
      var routename = route.name;
      if( routename == 'login') {
        pageclass = 'login-background';
      } else {
        pageclass = 'website-background'
      }
      return pageclass;
      // return route.name === 'login' ? 'login-background' : '';
    });
    
    return {
      currentUser,
      pageClass,
      logout
    }
  }
}
</script>

<style scoped>
.navbar {
  margin-bottom: 20px;
}

.login-background {
  min-height: 100vh;
  /* min-width: 100vh; */
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url('@/assets/hospitalBackground.jpg');
  background-size: cover;
  background-position: center;
  /* padding: 20px; */
  /* margin: 0px; */
}

.website-background {
  min-height: 100vh;
  /* min-width: 100vh; */
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url('@/assets/hospitalWebsite.jpg');
  background-size: cover;
  background-position: center;
  /* padding: 20px; */
  /* margin: 0px; */
}
</style>