import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/components/auth/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/components/auth/Register.vue'),
    meta: { requiresAuth: true, roles: ['admin'] }
  },
  {
    path: '/registerpatient',
    name: 'registerpatient',
    component: () => import('@/components/auth/RegisterPatient.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/appointments',
    name: 'appointments',
    component: () => import('@/views/PatientDashboard.vue'),
    meta: { requiresAuth: true, roles: ['patient'] }
  },
  {
    path: '/appointments/doctor',
    name: 'doctor-appointments',
    component: () => import('@/views/DoctorDashboard.vue'),
    meta: { requiresAuth: true, roles: ['doctor'] }
  },
  {
    path: '/appointments/admin',
    name: 'appointments-admin',
    component: () => import('@/components/admin/AppointmentsManagement.vue'),
    meta: { requiresAuth: true, roles: ['admin'] }
  },
  {
    path: '/queue/doctor',
    name: 'doctor-queue',
    component: () => import('@/views/DoctorDashboard.vue'),
    meta: { requiresAuth: true, roles: ['doctor'] }
  },
  {
    path: '/queue/admin',
    name: 'queue-admin',
    component: () => import('@/components/admin/QueueManagement.vue'),
    meta: { requiresAuth: true, roles: ['admin'] }
  },
  {
    path: '/queue',
    name: 'queue',
    component: () => import('@/components/queue/QueueStatus.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/doctors',
    name: 'admindoctors',
    component: () => import('@/components/admin/DoctorsManagement.vue'),
    meta: { requiresAuth: true, roles: ['admin'] }
  },
  {
    path: '/admin/doctors/availability',
    name: 'admindoctorsavailability',
    component: () => import('@/components/admin/AvailabilityManagement.vue'),
    meta: { requiresAuth: true, roles: ['admin'] }
  },
  {
    path: '/admin/patients',
    name: 'adminpatients',
    component: () => import('@/components/admin/PatientsManagement.vue'),
    meta: { requiresAuth: true, roles: ['admin'] }
  },
  {
    path: '/admin/users',
    name: 'adminusers',
    component: () => import('@/components/admin/UsersManagement.vue'),
    meta: { requiresAuth: true, roles: ['admin'] }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !store.state.auth.isAuthenticated) {
    next({ name: 'login' })
  } else if (to.meta.roles && !to.meta.roles.includes(store.state.auth.user?.role)) {
    next({ name: 'dashboard' })
  } else {
    next()
  }
})

router.onError((error) => {
  console.error('Router Error:', error)
})

export default router