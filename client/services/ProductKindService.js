import http from "../plugins/http-common";
import AuthService from "./AuthService";

class ProductKindService {
  findAll() {
    let headers = { headers: AuthService.header() };
    return http.get("/api/product-kind", headers);
  }

  create(data) {
    let headers = { headers: AuthService.header() };
    return http.post("/api/product-kind", data, headers);
  }

  findOne(productKindId) {
    let headers = { headers: AuthService.header() };
    return http.get(`/api/product-kind/${productKindId}`, headers);
  }

  update(productKindId, data) {
    let headers = { headers: AuthService.header() };
    return http.put(`/api/product-kind/${productKindId}`, data, headers);
  }

  remove(productKindId) {
    let headers = { headers: AuthService.header() };
    return http.delete(`/api/product-kind/${productKindId}`, headers);
  }
}

export default new ProductKindService();
