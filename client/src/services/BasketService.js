import http from '../plugins/http-common'
import AuthService from './AuthService'

class BasketService {
  findAll(documentId) {
    let headers = { headers: AuthService.header() };
    return http.get(`/api/document/${documentId}/basket`, headers);
  }

  create(documentId, data) {
    let headers = { headers: AuthService.header() };
    return http.post(`/api/document/${documentId}/basket`, data, headers);
  }

  findOne(documentId, basketId) {
    let headers = { headers: AuthService.header() };
    return http.get(`/api/document/${documentId}/basket/${basketId}`, headers);
  }

  update(documentId, basketId, data) {
    let headers = { headers: AuthService.header() };
    return http.put(`/api/document/${documentId}/basket/${basketId}`, data, headers);
  }

  remove(documentId, basketId) {
    let headers = { headers: AuthService.header() };
    return http.delete(`/api/document/${documentId}/basket/${basketId}`, headers);
  }
}

export default new BasketService()