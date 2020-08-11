import http from '../plugins/http-common'
import AuthService from './AuthService'

class UserService {
  findAll() {
    let headers = { headers: AuthService.header() };
    return http.get('/api/user', headers);
  }

  findOne(userId) {
    let headers = { headers: AuthService.header() };
    return http.get(`/api/user/${userId}`, headers);
  }

  verify(userId) {
    let headers = { headers: AuthService.header() };
    return http.post(`/api/user/${userId}/verify`, {}, headers);
  }

  promoteAdmin(userId) {
    let headers = { headers: AuthService.header() };
    return http.post(`/api/user/${userId}/admin`, {}, headers);
  }

  demoteAdmin(userId) {
    let headers = { headers: AuthService.header() };
    return http.delete(`/api/user/${userId}/admin`, headers);
  }

  updatePassword(userId, data) {
    let headers = { headers: AuthService.header() };
    return http.put(`/api/user/${userId}/password`, data, headers);
  }

  remove(userId) {
    let headers = { headers: AuthService.header() };
    return http.delete(`/api/user/${userId}`, headers);
  }
}

export default new UserService()