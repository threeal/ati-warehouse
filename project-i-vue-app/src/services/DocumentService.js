import http from '../plugins/http-common'

class DocumentService {
  create(data) {
    return http.post('/document', data);
  }

  getAll() {
    return http.get('/document');
  }

  get(id) {
    return http.get(`/document/${id}`);
  }

  update(id, data) {
    return http.put(`/document/${id}`, data);
  }

  delete(id) {
    return http.delete(`/document/${id}`);
  }
}

export default new DocumentService();