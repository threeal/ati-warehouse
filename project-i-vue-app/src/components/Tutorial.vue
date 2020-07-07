<template>
  <div v-if="currentTutorial" class="edit-form">
    <h4>Tutorial</h4>
    <form>
      <div class="form-group">
        <label for="title">Title</label>
        <input type="text" class="form-control" id="title"
            v-model="currentTutorial.title"/>
      </div>
      <div class="form-group">
        <label for="description">Description</label>
        <input type="text" class="form-control" id="description"
            v-model="currentTutorial.description"/>
      </div>
      <div class="form-group">
        <label><strong>Status:</strong></label>
          {{ (currentTutorial.published) ? 'published' : 'pending' }}
      </div>
    </form>
    <button v-if="currentTutorial.published" class="badge badge-primary mr-2"
        @click="updatePublished(false)">
      Unpublish
    </button>
    <button v-else class="badge badge-primary mr-2" @click="updatePublished(true)">
      Publish
    </button>
    <button class="badge badge-danger mr-2" @click="deleteTutorial()">
      Delete
    </button>
    <button type="submit" class="badge badge-success" @click="updateTutorial">
      Update
    </button>
    <p>{{ message }}</p>
  </div>
  <div v-else>
    <br/>
    <p>Please click on a tutorial...</p>
  </div>
</template>

<script>
import TutorialDataService from '../services/TutorialDataService'

export default {
  name: 'tutorial',
  data() {
    return {
      currentTutorial: null,
      message: '',
    };
  },
  methods: {
    getTutorial(id) {
      TutorialDataService.get(id)
        .then((res) => {
          console.log(res.data);
          this.currentTutorial = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    updatePublished(status) {
      let data = {
        id: this.currentTutorial.id,
        title: this.currentTutorial.title,
        description: this.currentTutorial.description,
        published: status,
      };

      TutorialDataService.update(this.currentTutorial.id, data)
        .then((res) => {
          console.log(res.data);
          this.currentTutorial.published = status;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    updateTutorial() {
      TutorialDataService.update(this.currentTutorial.id, this.currentTutorial)
        .then((res) => {
          console.log(res.data);
          this.message = 'This tutorial was updated successfully!';
        })
        .catch((err) => {
          console.log(err);
        });
    },
    deleteTutorial() {
      TutorialDataService.delete(this.currentTutorial.id)
        .then((res) => {
          console.log(res.data);
          this.$router.push({ name: 'tutorials' });
        })
        .catch((err) => {
          console.log(err);
        })
    },
  },
  mounted() {
    this.message = '';
    this.getTutorial(this.$route.params.id);
  },
}
</script>

<style scoped>
.edit-form {
  max-width: 300px;
  margin: auto;
}
</style>