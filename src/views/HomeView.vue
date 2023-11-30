<template>
  <div class="main-menu">
    <h1>Notes Manager</h1>
    <nav>
      <router-link to="/" class="menu-link">Home</router-link>
      <router-link to="/notes" class="menu-link">Notes</router-link>
      <router-link to="/users" class="menu-link">Users</router-link>
    </nav>
    <div class="stats">
      <div class="stat-item">
        <h3>Total Users</h3>
        <p>{{ totalUsers }}</p>
      </div>
      <div class="stat-item">
        <h3>Total Notes</h3>
        <p>{{ totalNotes }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      totalUsers: 0,
      totalNotes: 0
    }
  },
  methods: {
    async fetchStats () {
      try {
        const usersResponse = await fetch('http://localhost:8000/user/stats')
        const notesResponse = await fetch('http://localhost:8000/note/stats')

        const totalUsers = await usersResponse.json()
        const totalNotes = await notesResponse.json()

        this.totalUsers = totalUsers
        this.totalNotes = totalNotes
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }
  },
  mounted () {
    this.fetchStats()
  }
}
</script>

<style scoped>
.main-menu {
  background-color: #2d866b;
  color: #fff;
  padding: 20px;
  text-align: center;
}

h1 {
  font-size: 24px;
  margin-bottom: 20px;
}

nav {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.menu-link {
  color: #fff;
  text-decoration: none;
  margin: 0 15px;
  font-size: 18px;
  transition: color 0.3s ease;
}

.menu-link:hover {
  color: #ffd700;
}

.stats {
  display: flex;
  justify-content: space-around;
}

.stat-item {
  text-align: center;
}

.stat-item h3 {
  font-size: 18px;
}

.stat-item p {
  font-size: 24px;
  font-weight: bold;
}
</style>
