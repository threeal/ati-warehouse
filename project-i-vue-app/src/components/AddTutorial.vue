<template>
  <div class="submit-form">
    <div v-if="!submitted">
      <div class="form-group">
        <label for="title">Title</label>
        <input type="Text" class="form-control" id="title"
            v-model="tutorial.title" name="title" required/>
      </div>
      <div class="form-group">
        <label for="description">Description</label>
        <input class="form-control" id="description"
            v-model="tutorial.description" name="description" required/>
      </div>
      <button class="btn btn-success" @click="saveTutorial">Submit</button>
    </div>
    <div v-else>
      <h4>You submitted successfully!</h4>
      <button class="btn btn-success" @click="newTutorial">Add</button>
    </div>
  </div>
</template>

<script>
import TutorialDataService from '../services/TutorialDataService'

export default {
  name: 'add-tutorial',
  data() {
    return {
      tutorial: {
        id: null,
        title: '',
        description: '',
        published: false,
      },
      submitted: false,
    };
  },
  methods: {
    saveTutorial() {
      let data = {
        title: this.tutorial.title,
        description: this.tutorial.description,
      };

      TutorialDataService.create(data)
        .then((res) => {
          console.log(res.data);
          this.tutorial.id = res.data.id;
          this.submitted = true;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    newTutorial() {
      this.submitted = false;
      this.tutorial = {
        id: null,
        title: '',
        description: '',
        published: false,
      };
    },
  }
}
</script>

<style scoped>
.submit-form {
  max-width: 300px;
  margin: auto;
}
</style>