<template>
  <div class="notes-container">
    <h2>Your Compact Notes</h2>
    <div class="filter-container">
      <label for="statusFilter">Filter by Status:</label>
      <select id="statusFilter" v-model="filteredStatus">
        <option value="">All</option>
        <option value="created">Created</option>
        <option value="waiting">Waiting</option>
        <option value="finished">Finished</option>
      </select>
    </div>
    <draggable v-model="filteredNotes" class="notes-list" :options="{ group: 'notes-list', direction: 'horizontal' }">
      <div v-for="note in filteredNotes" :key="note.id" class="note-item" :class="getNoteClasses(note)">
        <div class="note-status">{{ note.status }}</div>
        <h3>{{ note.name }}</h3>
        <p class="note-content">{{ note.content }}</p>
        <div class="status-controls">
          <span class="status-control" @click="openStatusDialog(note.id)">➔</span>
          <span class="edit-control" @click.stop="openEditNoteDialog(note.id)">✎</span>
        </div>
      </div>
    </draggable>
    <button class="add-note-button" @click="openAddNoteDialog">Add Note</button>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import Swal from 'sweetalert2'

export default {
  components: {
    draggable
  },
  data () {
    return {
      notes: [],
      filteredStatus: ''
    }
  },
  computed: {
    filteredNotes () {
      return this.filteredStatus
        ? this.notes.filter((note) => note.status.toLowerCase() === this.filteredStatus)
        : this.notes
    }
  },
  methods: {
    async fetchNotes () {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('http://127.0.0.1:8000/notes', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (response.ok) {
          this.notes = await response.json()
        } else {
          console.error('Error fetching notes:', response.statusText)
        }
      } catch (error) {
        console.error('Error fetching notes:', error)
      }
    },
    getNoteClasses (note) {
      return [
        'note-item',
        note.status && note.status.toLowerCase(),
        this.filteredStatus && note.status.toLowerCase() !== this.filteredStatus ? 'filtered-out' : ''
      ]
    },
    async changeNoteStatus (noteId, newStatus) {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`http://127.0.0.1:8000/notes/edit_note_status/${noteId}`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status: newStatus })
        })

        if (response.ok) {
          const updatedNote = this.notes.find((note) => note.id === noteId)
          if (updatedNote) {
            updatedNote.status = newStatus
          }
        } else {
          console.error('Error changing note status:', response.statusText)
        }
      } catch (error) {
        console.error('Error changing note status:', error)
      }
    },
    async openStatusDialog (noteId) {
      const { value: newStatus } = await Swal.fire({
        title: 'Select Status',
        input: 'select',
        inputOptions: {
          created: 'Created',
          waiting: 'Waiting',
          finished: 'Finished'
        },
        inputPlaceholder: 'Select a status',
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Set Status',
        inputValidator: (value) => {
          return new Promise((resolve) => {
            if (value !== '') {
              resolve()
            } else {
              resolve('You need to select a status')
            }
          })
        }
      })

      if (newStatus) {
        this.changeNoteStatus(noteId, newStatus)
      }
    },
    async openEditNoteDialog (noteId) {
      const note = this.notes.find(n => n.id === noteId)
      const { value: formValues } = await Swal.fire({
        title: 'Edit Note',
        html:
          `<input id="swal-input1" class="swal2-input" placeholder="Name" value="${note.name}">` +
          `<textarea id="swal-input2" class="swal2-textarea" placeholder="Content">${note.content}</textarea>`,
        focusConfirm: false,
        preConfirm: () => {
          return [
            document.getElementById('swal-input1').value,
            document.getElementById('swal-input2').value
          ]
        }
      })

      if (formValues) {
        const [name, content] = formValues
        this.editNote({ id: noteId, name, content })
      }
    },
    async editNote ({ id, name, content }) {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`http://127.0.0.1:8000/notes/edit/${id}`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, content })
        })

        if (response.ok) {
          const updatedNote = this.notes.find((note) => note.id === id)
          if (updatedNote) {
            updatedNote.name = name
            updatedNote.content = content
          }
        } else {
          console.error('Error editing note:', response.statusText)
        }
      } catch (error) {
        console.error('Error editing note:', error)
      }
    },
    async openAddNoteDialog () {
      const { value: formValues } = await Swal.fire({
        title: 'Add New Note',
        html:
          '<input id="swal-input1" class="swal2-input" placeholder="Name">' +
          '<textarea id="swal-input2" class="swal2-textarea" placeholder="Content"></textarea>' +
          '<input id="swal-input3" class="swal2-input" placeholder="Category">',
        focusConfirm: false,
        preConfirm: () => {
          return [
            document.getElementById('swal-input1').value,
            document.getElementById('swal-input2').value,
            document.getElementById('swal-input3').value
          ]
        }
      })

      if (formValues) {
        const [name, content, category] = formValues
        this.addNote({ name, content, category })
      }
    },

    async addNote ({ name, content, category }) {
      try {
        const token = localStorage.getItem('token')
        const url = `http://127.0.0.1:8000/notes?name=${encodeURIComponent(name)}&content=${encodeURIComponent(content)}&category_name=${encodeURIComponent(category)}`
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          const newNote = await response.json()
          this.notes.push(newNote)
        } else {
          console.error('Error adding note:', response.statusText)
        }
      } catch (error) {
        console.error('Error adding note:', error)
      }
    }
  },
  mounted () {
    this.fetchNotes()
  }
}
</script>

<style>

.notes-container {
  max-width: 100vw;
  margin: auto;
}

h2 {
  font-size: 26px;
  margin-bottom: 15px;
  color: #3498db;
}

.filter-container {
  margin-bottom: 15px;
}

.notes-list {
  display: flex;
  overflow-x: auto;
}

.note-item {
  max-width: 300px;
  min-width: 250px;
  border: 2px solid #3498db;
  border-radius: 8px;
  margin-right: 15px;
  padding: 15px;
  cursor: grab;
  transition: background-color 0.3s ease-in-out;
  overflow: hidden;
}

.filtered-out {
  display: none;
}

.status-controls {
  display: flex;
  justify-content: space-between;
}

.status-control,
.edit-control {
  cursor: pointer;
  font-size: 18px;
}

.status-control.highlighted,
.edit-control.highlighted {
  color: #fff;
  background-color: #2ecc71;
  border-radius: 50%;
  padding: 8px;
}

.add-note-button {
  font-size: 18px;
  background-color: #3498db;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px;
  margin-top: 20px;
  cursor: pointer;
}
</style>
