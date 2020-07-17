import http from '../plugins/http-common'

class PalletLoad {
  find(documentId) {
    return http.get(`/api/document/${documentId}/pallet-load`);
  }

  create(documentId, data) {
    return http.post(`/api/document/${documentId}/pallet-load`, data);
  }

  update(documentId, data) {
    return http.put(`/api/document/${documentId}/pallet-load`, data);
  }

  remove(documentId) {
    return http.delete(`/api/document/${documentId}/pallet-load`);
  }
}

export default new PalletLoad();