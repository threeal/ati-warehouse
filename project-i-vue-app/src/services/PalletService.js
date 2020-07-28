import http from '../plugins/http-common'
import AuthService from './AuthService'

class PalletService {
  findAll(documentId) {
    let headers = { headers: AuthService.header() };
    return http.get(`/api/document/${documentId}/pallet`, headers);
  }

  create(documentId, data) {
    let headers = { headers: AuthService.header() };
    return http.post(`/api/document/${documentId}/pallet`, data, headers);
  }

  findOne(documentId, palletId) {
    let headers = { headers: AuthService.header() };
    return http.get(`/api/document/${documentId}/pallet/${palletId}`, headers);
  }

  update(documentId, palletId, data) {
    let headers = { headers: AuthService.header() };
    return http.put(`/api/document/${documentId}/pallet/${palletId}`, data, headers);
  }

  remove(documentId, palletId) {
    let headers = { headers: AuthService.header() };
    return http.delete(`/api/document/${documentId}/pallet/${palletId}`, headers);
  }
}

export default new PalletService()