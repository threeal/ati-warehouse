import http from '../plugins/http-common'

class DocumentService {
  findAll() {
    return http.get('/api/document');
  }

  create(data) {
    return http.post('/api/document', data);
  }

  findOne(id) {
    return http.get(`/api/document/${id}`);
  }

  update(id, data) {
    return http.put(`/api/document/${id}`, data);
  }

  remove(id) {
    return http.delete(`/api/document/${id}`);
  }
}

export default new DocumentService();