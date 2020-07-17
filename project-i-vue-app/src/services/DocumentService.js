import http from '../plugins/http-common'

class DocumentService {
  findAll() {
    return http.get('/api/document');
  }

  create(data) {
    return http.post('/api/document', data);
  }

  findOne(documentId) {
    return http.get(`/api/document/${documentId}`);
  }

  update(documentId, data) {
    return http.put(`/api/document/${documentId}`, data);
  }

  remove(documentId) {
    return http.delete(`/api/document/${documentId}`);
  }
}

export default new DocumentService();