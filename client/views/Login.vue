<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card>
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Masuk</v-toolbar-title>
            <v-spacer/>
            <v-btn @click="app.swapTheme()" icon dark>
              <v-icon>mdi-theme-light-dark</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <v-row>
              <v-col>
                <v-text-field v-model="username" label="Nama Pengguna"
                    :disabled="submitting" dense hide-details outlined/>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field v-model="password" label="Kata Sandi" type="password"
                    :disabled="submitting" dense hide-details outlined/>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-btn @click="onLogin()" :disabled="loginDisabled"
                    :loading="submitting" color="success" block>
                  <v-icon left>mdi-login</v-icon> Masuk
                </v-btn>
              </v-col>
            </v-row>
            <center>
              Belum punya akun? <a @click="onRegister()">Daftar</a>
            </center>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import AuthService from '../services/AuthService';

export default {
  name: 'login',
  props: {
    app: { type: Object, required: true },
  },
  data() {
    return {
      username: null,
      password: null,
      submitting: false,
    };
  },
  computed: {
    loginDisabled() {
      return !this.username || !this.password;
    },
  },
  methods: {
    onLogin() {
      this.submitting = true;

      let data = {
        username: this.username,
        password: this.password,
      };

      AuthService.signIn(data)
        .then(() => {
          this.app.routeReplace('/document');
        })
        .catch((err) => {
          if (err.response) {
            if (err.response.status === 401) {
              this.app.log('Gagal masuk, akun belum diverifikasi, harap hubungi admin');
            }
            else if (err.response.status === 404) {
              this.app.log('Gagal masuk, nama pengguna atau kata sandi salah');
            }
            else {
              this.app.log(`Gagal masuk, kesalahan server (${err.message})`);
            }
          }
          else {
            this.app.log('Gagal masuk, tidak ada jaringan');
          }

          this.submitting = false;
        });
    },
    onRegister() {
      this.app.routePush('/register');
    },
  },
  created() {
    this.app.setAppBar(false, 'Masuk');
  },
}
</script>