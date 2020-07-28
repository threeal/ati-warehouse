import http from '../plugins/http-common'
import AuthService from './AuthService'

class DocumentService {
  findAll() {
    let headers = { headers: AuthService.header() };
    return http.get('/api/document', headers);
  }

  create(data) {
    let headers = { headers: AuthService.header() };
    return http.post('/api/document', data, headers);
  }

  findOne(documentId) {
    let headers = { headers: AuthService.header() };
    return http.get(`/api/document/${documentId}`, headers);
  }

  update(documentId, data) {
    let headers = { headers: AuthService.header() };
    return http.put(`/api/document/${documentId}`, data, headers);
  }

  remove(documentId) {
    let headers = { headers: AuthService.header() };
    return http.delete(`/api/document/${documentId}`, headers);
  }
}

export default new DocumentService()