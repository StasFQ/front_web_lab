<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="login" class="login-form">
      <label for="email">Email:</label>
      <input type="text" v-model="email" required class="input-field" />

      <label for="password">Password:</label>
      <input type="password" v-model="password" required class="input-field" />

      <button type="submit" class="login-button">Login</button>
    </form>
  </div>
</template>

<script>
import VueToasted from 'vue-toasted'
import Vue from 'vue'
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    ...mapActions('auth', ['login', 'setToken']),
    async login (key, value) {
      try {
        const formData = new URLSearchParams()
        formData.append('username', this.email)
        formData.append('password', this.password)

        const response = await fetch('http://localhost:8000/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: formData
        })

        if (response.ok) {
          Vue.toasted.success('Login success', { duration: 3000 })

          const responseData = await response.json()
          const accessToken = responseData.access_token
          localStorage.setItem('token', accessToken)

          this.$router.push('/notes')
        } else {
          Vue.toasted.error('Login failed', { duration: 3000 })
        }
      } catch (error) {
        console.error('Login failed:', error)
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
.login-container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.login-form {
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

.login-button {
  background-color: #42b983;
  color: #fff;
  padding: 10px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.login-button:hover {
  background-color: #2d866b;
}
</style>
