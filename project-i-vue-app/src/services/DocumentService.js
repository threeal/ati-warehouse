import http from '../plugins/http-common'

class DocumentService {
  create(data) {
    return http.post('/document', data);
  }

  getAll() {
    return http.get('/document');
  }
}

export default new DocumentService();