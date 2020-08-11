import http from '../plugins/http-common'

class AuthService {

  header() {
    let user = JSON.parse(localStorage.getItem('user'));

    if (user) {
      return { 'x-access-token': user.accessToken };
    }
    else {
      return {};
    }
  }

  signIn(data) {
    return http.post('/api/auth/sign-in', data);
  }

  signOut() {
    localStorage.removeItem('user');
  }

  signUp(data) {
    return http.post('/api/auth/sign-up', data);
  }
}

export default new AuthService()