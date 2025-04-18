<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Login</h3>
          </div>
          <div class="card-body">
            <form @submit.prevent="login">
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  class="form-control" 
                  v-model="form.email"
                  :class="{ 'is-invalid': errors.email }"
                >
                <div class="invalid-feedback" v-if="errors.email">{{ errors.email }}</div>
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input 
                  type="password" 
                  id="password" 
                  class="form-control" 
                  v-model="form.password"
                  :class="{ 'is-invalid': errors.password }"
                >
                <div class="invalid-feedback" v-if="errors.password">{{ errors.password }}</div>
              </div>
              <button type="submit" class="btn btn-primary w-100">Login</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      errors: {}
    }
  },
  methods: {
    async login() {
      try {
        await this.$store.dispatch('auth/login', this.form)
        this.$router.push({ name: 'dashboard' })
      } catch (error) {
        this.errors = error
      }
    }
  }
}
</script>