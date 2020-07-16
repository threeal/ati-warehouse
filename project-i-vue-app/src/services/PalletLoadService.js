import http from '../plugins/http-common'

class PalletLoad {
  find(id) {
    return http.get(`/api/pallet-load/${id}`);
  }

  create(id, data) {
    return http.post(`/api/pallet-load/${id}`, data);
  }

  update(id, data) {
    return http.put(`/api/pallet-load/${id}`, data);
  }

  remove(id) {
    return http.delete(`/api/pallet-load/${id}`);
  }
}

export default new PalletLoad();