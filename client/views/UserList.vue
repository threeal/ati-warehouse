<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card>
          <v-toolbar color="primary" dark flat dense>
            <v-toolbar-title>Daftar Pengguna</v-toolbar-title>
          </v-toolbar>
          <v-list>
            <div v-if="fetching">
              <v-list-item two-line>
                <v-list-item-content>
                  <v-progress-circular color="primary" indeterminate/>
                </v-list-item-content>
              </v-list-item>
            </div>
            <div v-else-if="users.length > 0">
              <div v-for="(user, index) in users" :key="index">
                <v-divider v-if="index > 0"/>
                <v-list-item  @click="onUserClick(user.id)" link>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ user.fullname || 'Anonim' }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ user.username }}
                      <span v-if="!user.verified" class="error--text">
                        (belum diverifikasi)
                      </span>
                      <span v-else-if="user.admin" class="success--text">
                        (admin)
                      </span>
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </div>
            </div>
            <div v-else>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title class="d-flex justify-center">
                    Pengguna Kosong
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </div>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import UserService from '../services/UserService'
import AuthService from '../services/AuthService'

export default {
  name: 'user-list',
  props: {
    app: { type: Object, required: true },
  },
  data() {
    return {
      fetching: true,
      users: [],
    };
  },
  methods: {
    reset() {
      this.users = [];
      this.fetching = true;

      UserService.findAll()
        .then((res) => {
          console.log(res.data);
          this.users = res.data;
          this.fetching = false;
        })
        .catch((err) => {
          if (err.response) {
            if (err.response.status === 401) {
              this.app.log('Sesi habis, harap masuk kembali');

              AuthService.signOut();
              this.app.routeReplace('/login');
            }
            else if (err.response.status === 403) {
              this.app.log('Akses tidak diijinkan');

              this.app.routeReplace('/login');
            }
            else {
              this.app.log('Gagal mengambil daftar pengguna,'
                + ` kesalahan server (${err.response.status})`);
            }
          }
          else {
            this.app.log('Gagal mengambil daftar pengguna, tidak ada jaringan');
          }
        });
    },
    onUserClick(userId) {
      this.app.routePush(`/user/${userId}`);
    },
  },
  created() {
    this.app.setAppBar(true, 'Daftar Pengguna');
  },
  mounted() {
    this.reset();
  },
}
</script>