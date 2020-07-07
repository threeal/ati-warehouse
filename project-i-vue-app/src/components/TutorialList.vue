<template>
  <div class="list-row">
    <div class="col-md-8">
      <div class="input-group mb-3">
        <input v-model="title" class="form-control" placeholder="Search by title" type="text" >
        <div class="input-group-append">
          <button class="btn btn-outline-secondary" type="button" @click="searchTitle">
            Search
          </button>
        </div>
      </div>
    </div>
    <div class="col-md-6">
      <h4>Tutorial List</h4>
      <ul class="list-group">
        <li v-for="(tutorial, index) in tutorials"  class="list-group-item"
            :class="{ active: index == currentIndex }" :key="index"
            @click="setActiveTutorial(tutorial, index)">
          {{ tutorial.title }}
        </li>
      </ul>
      <button class="m-3 btn btn-sm btn-danger" @click="removeAllTutorials">
        Remove All
      </button>
    </div>
    <div class="col-md-6">
      <div v-if="currentTutorial">
        <h4>Tutorial</h4>
        <div>
          <label><strong>Title:</strong></label> {{ currentTutorial.title }}
        </div>
        <div>
          <label><strong>Description:</strong></label> {{ currentTutorial.description }}
        </div>
        <div>
          <label><strong>Status:</strong></label>
            {{ (currentTutorial.published) ? 'published' : 'pending' }}
        </div>
        <a class="badge badge-warning" :href="`/tutorials/${currentTutorial.id}`">Edit</a>
      </div>
      <div v-else>
        <br/>
        <p>Please click on a Tutorial...</p>
      </div>
    </div>
  </div>
</template>

<script>
import TutorialDataService from '../services/TutorialDataService'

export default {
  name: 'tutorial-list',
  data() {
    return {
      tutorials: [],
      currentTutorial: null,
      currentIndex: -1,
      title: '',
    };
  },
  methods: {
    retreiveTutorials() {
      TutorialDataService.getAll()
        .then((res) => {
          console.log(res.data);
          this.tutorials = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    refreshList() {
      this.retreiveTutorials();
      this.currentTutorial = null;
      this.currentIndex = -1;
    },
    setActiveTutorial(tutorial, index) {
      this.currentTutorial = tutorial;
      this.currentIndex = index;
    },
    removeAllTutorials() {
      TutorialDataService.deleteAll()
        .then((res) => {
          console.log(res.data);
          this.refreshList();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    searchTitle() {
      TutorialDataService.findByTitle(this.title)
        .then((res) => {
          console.log(res.data);
          this.tutorials = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  mounted() {
    this.retreiveTutorials();
  },
}
</script>

<style scoped>
.list {
  text-align: left;
  max-width: 750px;
  margin: auto;
}
</style>