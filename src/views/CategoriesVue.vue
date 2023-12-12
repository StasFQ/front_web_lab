<template>
  <div>
    <h2>Категорії</h2>
    <ul class="category-list">
      <li v-for="category in categories" :key="category.id" class="category-item">
        <span>{{ category.name }}</span>
        <button @click="deleteCategory(category.id)" class="delete-btn">Видалити</button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      categories: []
    }
  },
  mounted () {
    this.getCategories()
  },
  methods: {
    async getCategories () {
      try {
        const response = await fetch('http://127.0.0.1:8000/notes/categories')
        if (response.ok) {
          this.categories = await response.json()
          console.log(this.categories)
        } else {
          console.error('Error fetching categories:', response.statusText)
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    },
    async deleteCategory (categoryId) {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`http://127.0.0.1:8000/notes/delete-category/${categoryId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          this.note_count = response.json()
          this.getCategories()
        } else {
          console.error('Error deleting category:', response.statusText)
        }
      } catch (error) {
        console.error('Error deleting category:', error)
      }
    }
  }
}
</script>

<style scoped>
.category-list {
  list-style: none;
  padding: 0;
}

.category-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 10px;
}

.delete-btn {
  background-color: #f44336;
  color: #fff;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  border-radius: 4px;
}

.delete-btn:hover {
  background-color: #d32f2f;
}
</style>
