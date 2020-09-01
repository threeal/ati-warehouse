import http from '../plugins/http-common'
import AuthService from './AuthService'

class DocumentService {
  findAll(productionDate) {
    let address = '/api/document';
    if (productionDate) {
      address += `?productionDate=${productionDate}`;
    }

    let config = { headers: AuthService.header() };

    return http.get(address, config);
  }

  create(data) {
    let config = { headers: AuthService.header() };
    return http.post('/api/document', data, config);
  }

  findOne(documentId) {
    let config = { headers: AuthService.header() };
    return http.get(`/api/document/${documentId}`, config);
  }

  update(documentId, data) {
    let config = { headers: AuthService.header() };
    return http.put(`/api/document/${documentId}`, data, config);
  }

  remove(documentId) {
    let config = { headers: AuthService.header() };
    return http.delete(`/api/document/${documentId}`, config);
  }
}

export default new DocumentService()