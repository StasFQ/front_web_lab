<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/login">Login</router-link> |
      <router-link to="/Register">Register</router-link> |
      <router-link to="/categories">Categories</router-link>
    </nav>
    <router-view/>
  </div>
</template>

<style lang="less">
#app {
  font-family: 'Arial', sans-serif;
  text-align: center;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
<script setup>
</script>
