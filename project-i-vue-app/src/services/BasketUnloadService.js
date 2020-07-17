import http from '../plugins/http-common'

class BasketUnload {
  find(documentId) {
    return http.get(`/api/document/${documentId}/basket-unload`);
  }

  create(documentId, data) {
    return http.post(`/api/document/${documentId}/basket-unload`, data);
  }

  update(documentId, data) {
    return http.put(`/api/document/${documentId}/basket-unload`, data);
  }

  remove(documentId) {
    return http.delete(`/api/document/${documentId}/basket-unload`);
  }
}

export default new BasketUnload();