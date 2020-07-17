import http from '../plugins/http-common'

class BasketService {
  findAll(documentId) {
    return http.get(`/api/document/${documentId}/basket`);
  }

  create(documentId, data) {
    return http.post(`/api/document/${documentId}/basket`, data);
  }

  findOne(documentId, basketId) {
    return http.get(`/api/document/${documentId}/basket/${basketId}`);
  }

  update(documentId, basketId, data) {
    return http.put(`/api/document/${documentId}/basket/${basketId}`, data);
  }

  remove(documentId, basketId) {
    return http.delete(`/api/document/${documentId}/basket/${basketId}`);
  }
}

export default new BasketService();