<template>
  <div class="container mt-5">
    <!-- <div class="login-card"> -->

      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card login-card">
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
                <button type="submit" class="btn btn-primary w-100" :class="{ 'is-invalid': errors.userlogin }">Login</button>
                <div class="invalid-feedback" v-if="errors.userlogin">{{ errors.userlogin }}</div>
              </form>

              <!-- Registration link -->
              <div class="mt-4 text-center">
                <p>
                  Don't have an account?
                  <router-link to="/registerpatient" class="link-primary">
                    Register as a patient
                  </router-link>
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>

    <!-- </div>       -->
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
        this.errors = {};
        if (!this.form.email) {
          this.errors.email = 'Please enter email address';
          return;
        }

        if (!this.form.password) {
          this.errors.password = 'Please enter password';
          return;
        }

        await this.$store.dispatch('auth/login', this.form);
        this.$router.push({ name: 'dashboard' });
      } catch (error) {
        this.errors.userlogin = 'Error: Login Failed';
        console.error('Login failed:', error);
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 150vh;
  min-width: 150vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url('/images/hospitalBackground.jpg');
  background-size: cover;
  background-position: center;
  padding: 20px;
}

.login-card {
  background: rgba(255, 255, 255, 0.95);
  /* padding: 2rem; */
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>