<template>
    <div class="container-fluid">
      <!-- Main Content -->
      <main class="content-wrapper">
        <div class="row">
          <div class="col-md-12">
            <div class="card">
              <div class="card-header d-flex justify-content-between align-items-center">
                <h4>Manage Users</h4>
                <button class="btn btn-primary" @click="showCreateModal">
                  Add New User
                </button>
              </div>
              <div class="card-body">
                <!-- Search -->
                <div class="mb-4">
                  <div class="input-group">
                    <input v-model="filters.search" 
                           @keyup="fetchUsers" 
                           type="text" 
                           class="form-control" 
                           placeholder="Search users...">
                    <button class="btn btn-outline-secondary" 
                            type="button" 
                            @click="clearSearch"
                            data-bs-toggle="tooltip"
                            title="Clear Search">
                      <i class="fas fa-circle-xmark"></i>
                    </button>
                  </div>
                </div>
  
                <!-- Users Table -->
                <table class="table table-striped table-bordered">
                  <thead>
                    <tr>
                      <th><b>Name</b></th>
                      <th><b>Email</b></th>
                      <th><b>Role</b></th>
                      <th><b>Actions</b></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="users?.users?.users?.length === 0">
                      <td colspan="4" class="text-center py-4">
                        No users found
                      </td>
                    </tr>
                    <tr v-for="user in users?.users?.users?.data" :key="user?.id">
                      <td>{{ user?.name }}</td>
                      <td>{{ user?.email }}</td>
                      <td>{{ user?.role }}</td>
                      <td>
                        <div class="d-flex gap-2">
                          <button
                            class="btn btn-sm btn-primary"
                            @click="editUser(user)"
                            data-bs-toggle="tooltip"
                            title="Edit User"
                          >
                            <i class="fas fa-pen-to-square"></i>
                          </button>
                          <button
                            class="btn btn-sm btn-danger"
                            @click="deleteUser(user)"
                            data-bs-toggle="tooltip"
                            title="Delete User"
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
  
      <!-- Create User Modal -->
      <div class="modal fade" id="createUserModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Add New User</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="createUser">
                <div class="mb-3">
                  <label class="form-label">Name</label>
                  <input type="text" class="form-control" v-model="newUser.name" required :class="{ 'is-invalid': errors?.name }">
                  <div class="invalid-feedback" v-if="errors?.name">{{ errors?.name }}</div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input type="email" class="form-control" v-model="newUser.email" required :class="{ 'is-invalid': errors?.email }">
                  <div class="invalid-feedback" v-if="errors?.email">{{ errors?.email }}</div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Password</label>
                  <input
                    type="password"
                    class="form-control"
                    v-model="newUser.password"
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
                    v-model="newUser.repeat_password"
                    required
                    :class="{ 'is-invalid': errors?.password }"
                  >
                  <div class="invalid-feedback" v-if="errors?.password">{{ errors?.password }}</div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Role</label>
                  <select class="form-select" v-model="newUser.role" required :class="{ 'is-invalid': errors?.role }">
                    <option value="admin">Admin</option>
                    <option value="doctor">Doctor</option>
                    <option value="patient">Patient</option>
                  </select>
                  <div class="invalid-feedback" v-if="errors?.role">{{ errors?.role }}</div>
                </div>
                <button type="submit" class="btn btn-primary w-100" :class="{ 'is-invalid': errors?.user_saving }">Create User</button>
                <div class="invalid-feedback" v-if="errors?.user_saving">{{ errors?.user_saving }}</div>
              </form>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Edit User Modal -->
      <div class="modal fade" id="editUserModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Edit User</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="updateUser">
                <div class="mb-3">
                  <label class="form-label">Name</label>
                  <input type="text" class="form-control" v-model="selectedUser.name" required>
                  <div class="invalid-feedback" v-if="errors?.name">{{ errors?.name }}</div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input type="email" class="form-control" v-model="selectedUser.email" required>
                  <div class="invalid-feedback" v-if="errors?.email">{{ errors?.email }}</div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Role</label>
                  <select class="form-select" v-model="selectedUser.role" required>
                    <option value="admin">Admin</option>
                    <option value="doctor">Doctor</option>
                    <option value="patient">Patient</option>
                  </select>
                  <div class="invalid-feedback" v-if="errors?.role">{{ errors?.role }}</div>
                </div>
                <button type="submit" class="btn btn-primary w-100" :class="{ 'is-invalid': errors?.user_editing }">Update User</button>
                <div class="invalid-feedback" v-if="errors?.user_editing">{{ errors?.user_editing }}</div>
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
  const users = computed(() => store.state.users)
  const currentUser = computed(() => store.state.currentUser)
  const loading = computed(() => store.state.loading)
  const error = computed(() => store.state.error)
  
  const filters = ref({
    search: '',
    page: 1,
    perPage: 10
  })
  
  const newUser = ref({
    name: '',
    email: '',
    password: '',
    repeat_password: '',
    role: 'patient'
  })
  
  const selectedUser = reactive({
    id: null,
    name: '',
    email: '',
    role: 'patient'
  })
  
  const pagination = ref({
    currentPage: 1,
    perPage: 10,
    total: 0,
    lastPage: 0
  })
  
  const fetchUsers = async () => {
    try {
      // Clear previous errors
      errors.value = {}
      const response = await store.dispatch('users/fetchUsers', filters.value);
      console.log("Got response: " + JSON.stringify(users?.value));
      console.log("Got current page: " + JSON.stringify(users?.value?.users?.users?.current_page));
      pagination.value = {
        currentPage: users?.value?.users?.users?.current_page,
        perPage: users?.value?.users?.users?.per_page,
        total: users?.value?.users?.users?.total,
        lastPage: users?.value?.users?.users?.last_page
      }
      console.log("Got pagination: " + JSON.stringify(pagination?.value));
    } catch (err) {
      console.error(err)
    }
  }
  
  const clearSearch = () => {
    filters.value.search = ''
    fetchUsers()
  }
  
  const handlePageChange = (page) => {
    filters.value.page = page
    fetchUsers()
  }
  
  const showCreateModal = () => {
    newUser.value = {
      name: '',
      email: '',
      password: '',
      repeat_password: '',
      role: 'patient'
    }
    const modal = new bootstrap.Modal(document.getElementById('createUserModal'))
    modal.show()
  }
  
  const createUser = async () => {
    try {
      // Clear previous errors
      errors.value = {}
      if (!newUser.value.name) {
        errors.value.name = 'Please enter name';
        return;
      }
      if (!newUser.value.email) {
        errors.value.email = 'Please enter email';
        return;
      }
      if (!newUser.value.password) {
        errors.value.password = 'Please enter password';
        return;
      }
      if (newUser.value.password && newUser.value.password.length < 6) {
        errors.value.password = 'Password Must be longer than 6 characters';
        return;
      }
      if (newUser.value.password != newUser.value.repeat_password) {
        errors.value.password = 'Passwords do not match';
        return;
      }
      await store.dispatch('auth/register', newUser.value)
      const modal = bootstrap.Modal.getInstance(document.getElementById('createUserModal'))
      modal.hide()
      fetchUsers()
    } catch (err) {
      console.error(err);
      errors.value.user_saving = 'Error: User saving Failed. Please contact admin';
    }
  }
  
  const editUser = (user) => {
    Object.assign(selectedUser, user);
    const modal = new bootstrap.Modal(document.getElementById('editUserModal'))
    modal.show()
  }
  
  const updateUser = async () => {
    try {
      // Clear previous errors
      errors.value = {}
      if (!selectedUser.name) {
        errors.value.name = 'Please enter name';
        return;
      }
      if (!selectedUser.email) {
        errors.value.email = 'Please enter email';
        return;
      }
      await store.dispatch('users/updateUser', {
        userId: selectedUser.id,
        userData: selectedUser
      })
      const modal = bootstrap.Modal.getInstance(document.getElementById('editUserModal'))
      modal.hide()
      fetchUsers()
    } catch (err) {
      console.error(err);
      errors.value.user_editing = 'Error: User editing Failed. Please contact admin';
    }
  }
  
  const deleteUser = async (user) => {
    try {
      if (confirm('Are you sure you want to delete this user?')) {
        await store.dispatch('users/deleteUser', user.id)
        fetchUsers()
      }
    } catch (err) {
      console.error(err)
    }
  }
  
  onMounted(() => {
    fetchUsers()
  })
  </script>
  
  <style>
  @import 'bootstrap/dist/css/bootstrap.min.css';
  @import '@fortawesome/fontawesome-free/css/all.min.css';
  </style>