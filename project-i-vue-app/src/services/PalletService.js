import http from '../plugins/http-common'

class PalletService {
  findAll(documentId) {
    return http.get(`/api/document/${documentId}/pallet`);
  }

  create(documentId, data) {
    return http.post(`/api/document/${documentId}/pallet`, data);
  }

  findOne(documentId, palletId) {
    return http.get(`/api/document/${documentId}/pallet/${palletId}`);
  }

  update(documentId, palletId, data) {
    return http.put(`/api/document/${documentId}/pallet/${palletId}`, data);
  }

  remove(documentId, palletId) {
    return http.delete(`/api/document/${documentId}/pallet/${palletId}`);
  }
}

export default new PalletService();