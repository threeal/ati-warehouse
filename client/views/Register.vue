<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card>
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Daftar</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-row>
              <v-col>
                <v-text-field v-model="username" label="Nama Pengguna"
                    :error-messages="usernameError" :disabled="submitting"
                    dense hide-details="auto" outlined/>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field v-model="password" label="Kata Sandi" type="password"
                    :error-messages="passwordError" :disabled="submitting"
                    dense hide-details="auto" outlined/>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field v-model="passwordConfirm" label="Konfirmasi Kata Sandi"
                    type="password" :error-messages="passwordConfirmError"
                    :disabled="submitting" dense hide-details="auto" outlined/>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-btn @click="onRegister()" :disabled="registerDisabled"
                    :loading="submitting" color="success" block>
                  <v-icon left>mdi-file-document-edit</v-icon> Daftar
                </v-btn>
              </v-col>
            </v-row>
            <center>
              Sudah punya akun? <a @click="onLogin()">Masuk</a>
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
  name: 'register',
  props: {
    app: { type: Object, required: true },
  },
  data() {
    return {
      username: null,
      password: null,
      passwordConfirm: null,
      submitting: false,
    };
  },
  computed: {
    usernameError() {
      if (this.username){
        if (this.username.length < 6) {
          return 'Nama pengguna minimal 6 karakter';
        }

        if (this.username.includes(' ')) {
          return 'Nama pengguna tidak boleh mengandung spasi';
        }
      }

      return null;
    },
    passwordError() {
      if (this.password && this.password.length < 8) {
        return 'Kata sandi minimal 8 karakter';
      }

      return null;
    },
    passwordConfirmError() {
      if (this.passwordConfirm && this.passwordConfirm !== this.password) {
        return 'Kata sandi berbeda';
      }

      return null;
    },
    registerDisabled() {
      return !this.username || !this.password || !this.passwordConfirm
        || this.usernameError !== null || this.passwordError !== null
        || this.passwordConfirmError !== null;
    },
  },
  methods: {
    onRegister() {
      this.submitting = true;

      let data = {
        username: this.username,
        password: this.password,
      };

      AuthService.signUp(data)
        .then(() => {
          this.app.log('Akun berhasil didaftarkan, harap hubungi admin untuk verifikasi');
          this.app.routePush('/login');
        })
        .catch((err) => {
          if (err.response) {
            if (err.response.status === 400) {
              this.app.log('Pendaftaran gagal, nama pengguna sudah terdaftar');
            }
            else {
              this.app.log(`Pendaftaran gagal, kesalahan server (${err.response.status})`);
            }
          }
          else {
            this.app.log('Pendaftaran gagal, tidak ada jaringan');
          }

          this.submitting = false;
        });
    },
    onLogin() {
      this.app.routePush('/login');
    },
  },
  created() {
    this.app.setAppBar(false, 'Daftar');
  },
}
</script>