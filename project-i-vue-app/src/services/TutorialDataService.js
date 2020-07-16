import http from '../plugins/http-common'

class TutorialDataService {
  getAll() {
    return http.get('/api/tutorials');
  }

  get(id) {
    return http.get(`/api/tutorials/${id}`);
  }

  create(data) {
    return http.post('/api/tutorials', data);
  }

  update(id, data) {
    return http.put(`/api/tutorials/${id}`, data);
  }

  delete(id) {
    return http.delete(`/api/tutorials/${id}`);
  }

  deleteAll() {
    return http.delete('/api/tutorials');
  }

  findByTitle(title) {
    return http.get(`/api/tutorials?title=${title}`);
  }
}

export default new TutorialDataService();