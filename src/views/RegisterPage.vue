<template>
  <div class="register-container">
    <h2>Register</h2>
    <form @submit.prevent="register" class="register-form">

      <label for="email">Email:</label>
      <input type="email" v-model="email" required class="input-field" />

      <label for="password">Password:</label>
      <input type="password" v-model="password" required class="input-field" />

      <input type="hidden" v-model="is_active" />
      <input type="hidden" v-model="is_superuser" />
      <input type="hidden" v-model="is_verified" />
      <input type="hidden" v-model="role_id" />

      <button type="submit" class="register-button">Register</button>
    </form>
  </div>
</template>

<script>
import VueToasted from 'vue-toasted'
import Vue from 'vue'
import router from '../router/index.js'

export default {
  data () {
    return {
      username: '',
      email: '',
      password: '',
      is_active: true,
      is_superuser: false,
      is_verified: false,
      role_id: 0
    }
  },
  methods: {
    async register () {
      try {
        const data = {
          username: this.username,
          email: this.email,
          password: this.password,
          is_active: false,
          is_superuser: false,
          is_verified: false,
          role_id: 1
        }

        const response = await fetch('http://localhost:8000/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })

        // eslint-disable-next-line camelcase
        const data_json = await response.json()

        if (data_json.email) {
          this.$toasted.success('Registration success', { duration: 3000 })
          router.push('/login')
        } else {
          this.$toasted.error('Registration failed', { duration: 3000 })
        }
      } catch (error) {
        console.error('Registration failed:', error)
        this.$toasted.error('Registration failed', { duration: 3000 })
      }
    }
  },
  mounted () {
    Vue.use(VueToasted, {
      iconPack: 'fontawesome'
    })
  }
}
</script>

<style>
.register-container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.register-form {
  display: grid;
  gap: 15px;
}

.input-field {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.register-button {
  background-color: #42b983;
  color: #fff;
  padding: 10px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.register-button:hover {
  background-color: #2d866b;
}
</style>
