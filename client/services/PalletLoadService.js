import http from "../plugins/http-common";
import AuthService from "./AuthService";

class PalletLoadService {
  find(documentId) {
    let headers = { headers: AuthService.header() };
    return http.get(`/api/document/${documentId}/pallet-load`, headers);
  }

  create(documentId, data) {
    let headers = { headers: AuthService.header() };
    return http.post(`/api/document/${documentId}/pallet-load`, data, headers);
  }

  update(documentId, data) {
    let headers = { headers: AuthService.header() };
    return http.put(`/api/document/${documentId}/pallet-load`, data, headers);
  }

  remove(documentId) {
    let headers = { headers: AuthService.header() };
    return http.delete(`/api/document/${documentId}/pallet-load`, headers);
  }
}

export default new PalletLoadService();
