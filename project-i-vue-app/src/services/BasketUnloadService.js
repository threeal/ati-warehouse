import http from '../plugins/http-common'
import AuthService from './AuthService'

class BasketUnloadService {
  find(documentId) {
    let headers = { headers: AuthService.header() };
    return http.get(`/api/document/${documentId}/basket-unload`, headers);
  }

  create(documentId, data) {
    let headers = { headers: AuthService.header() };
    return http.post(`/api/document/${documentId}/basket-unload`, data, headers);
  }

  update(documentId, data) {
    let headers = { headers: AuthService.header() };
    return http.put(`/api/document/${documentId}/basket-unload`, data, headers);
  }

  remove(documentId) {
    let headers = { headers: AuthService.header() };
    return http.delete(`/api/document/${documentId}/basket-unload`, headers);
  }
}

export default new BasketUnloadService()