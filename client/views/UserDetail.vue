<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-row>
          <v-col cols="12">
            <v-text-field
              :value="username"
              label="Nama Pengguna"
              :disabled="fetching"
              :loading="fetching"
              readonly
              filled
              hide-details
              dense
              outlined
            />
          </v-col>
          <v-col cols="12">
            <v-text-field
              :value="fullname || 'Anonim'"
              label="Nama Lengkap"
              :disabled="fetching"
              :loading="fetching"
              readonly
              filled
              hide-details
              dense
              outlined
            />
          </v-col>
          <v-col cols="12">
            <v-btn
              v-if="!verified"
              @click="onVerify()"
              :disabled="fetching"
              color="primary"
              block
            >
              <v-icon left>mdi-account-check</v-icon> Verifikasi Pengguna
            </v-btn>
            <v-btn
              v-else-if="!admin"
              @click="onPromoteAdmin()"
              :disabled="fetching"
              color="primary"
              block
            >
              <v-icon left>mdi-account-tie</v-icon> Jadikan Sebagai Admin
            </v-btn>
            <v-btn
              v-else
              @click="onDemoteAdmin()"
              :disabled="fetching"
              color="primary"
              block
            >
              <v-icon left>mdi-account-off</v-icon> Lepaskan Dari Admin
            </v-btn>
          </v-col>
          <v-col cols="12">
            <v-btn @click="onDelete()" :disabled="fetching" color="error" block>
              <v-icon left>mdi-delete</v-icon> Hapus Pengguna
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import UserService from "../services/UserService";
import AuthService from "../services/AuthService";

export default {
  name: "user-detail",
  props: {
    app: { type: Object, required: true }
  },
  data() {
    return {
      fetching: true,
      submitting: false,
      edit: false,
      username: null,
      fullname: null,
      verified: null,
      admin: null
    };
  },
  methods: {
    reset() {
      this.fetching = true;

      UserService.findOne(this.$route.params.userId)
        .then(res => {
          this.username = res.data.username;
          this.fullname = res.data.fullname;
          this.verified = res.data.verified;
          this.admin = res.data.admin;

          this.fetching = false;
        })
        .catch(err => {
          if (err.response) {
            if (err.response.status === 401) {
              this.app.log("Sesi habis, harap masuk kembali");

              AuthService.signOut();
              this.app.routeReplace("/login");
            } else if (err.response.status === 403) {
              this.app.log("Akses tidak diijinkan");

              this.app.routeReplace("/login");
            } else {
              this.app.log(
                "Gagal mengambil detail pengguna," +
                  ` kesalahan server (${err.response.status})`
              );
            }
          } else {
            this.app.log("Gagal mengambil detail pengguna, tidak ada jaringan");
          }
        });
    },
    onVerify() {
      this.app.confirm({
        description: "Apakah anda yakin ingin memverifikasi pengguna ini?",
        promiseCallback: () => {
          return UserService.verify(this.$route.params.userId);
        },
        thenCallback: () => {
          this.app.log("Pengguna berhasil diverifikasi");
          this.reset();
        },
        catchCallback: err => {
          if (err.response) {
            if (err.response.status === 401) {
              this.app.log("Sesi habis, harap masuk kembali");

              AuthService.signOut();
              this.app.routeReplace("/login");
            } else if (err.response.status === 403) {
              this.app.log("Akses tidak diijinkan");

              this.app.routeReplace("/login");
            } else {
              this.app.log(
                "Pengguna gagal diverifikasi," +
                  ` kesalahan server (${err.response.status})`
              );
            }
          } else {
            this.app.log("Pengguna gagal diverifikasi, tidak ada jaringan");
          }
        }
      });
    },
    onPromoteAdmin() {
      this.app.confirm({
        description:
          "Apakah anda yakin ingin menjadikan pengguna ini sebagai admin?",
        promiseCallback: () => {
          return UserService.promoteAdmin(this.$route.params.userId);
        },
        thenCallback: () => {
          this.app.log("Pengguna berhasil dijadikan sebagai admin");
          this.reset();
        },
        catchCallback: err => {
          if (err.response) {
            if (err.response.status === 401) {
              this.app.log("Sesi habis, harap masuk kembali");

              AuthService.signOut();
              this.app.routeReplace("/login");
            } else if (err.response.status === 403) {
              this.app.log("Akses tidak diijinkan");

              this.app.routeReplace("/login");
            } else {
              this.app.log(
                "Pengguna gagal dijadikan sebagai admin," +
                  ` kesalahan server (${err.response.status})`
              );
            }
          } else {
            this.app.log(
              "Pengguna gagal dijadikan sebagai admin, tidak ada jaringan"
            );
          }
        }
      });
    },
    onDemoteAdmin() {
      this.app.confirm({
        description:
          "Apakah anda yakin ingin melepaskan pengguna ini dari admin?",
        promiseCallback: () => {
          return UserService.demoteAdmin(this.$route.params.userId);
        },
        thenCallback: () => {
          this.app.log("Pengguna berhasil dilepaskan dari admin");
          this.reset();
        },
        catchCallback: err => {
          if (err.response) {
            if (err.response.status === 401) {
              this.app.log("Sesi habis, harap masuk kembali");

              AuthService.signOut();
              this.app.routeReplace("/login");
            } else if (err.response.status === 403) {
              this.app.log("Akses tidak diijinkan");

              this.app.routeReplace("/login");
            } else {
              this.app.log(
                "Pengguna gagal dilepaskan dari admin," +
                  ` kesalahan server (${err.response.status})`
              );
            }
          } else {
            this.app.log(
              "Pengguna gagal dilepaskan dari admin, tidak ada jaringan"
            );
          }
        }
      });
    },
    onDelete() {
      this.app.confirm({
        description: "Apakah anda yakin ingin menghapus pengguna ini?",
        promiseCallback: () => {
          return UserService.remove(this.$route.params.userId);
        },
        thenCallback: () => {
          this.app.log("Pengguna berhasil dihapus");
          this.$router.go(-1);
        },
        catchCallback: err => {
          if (err.response) {
            if (err.response.status === 401) {
              this.app.log("Sesi habis, harap masuk kembali");

              AuthService.signOut();
              this.app.routeReplace("/login");
            } else if (err.response.status === 403) {
              this.app.log("Akses tidak diijinkan");

              this.app.routeReplace("/login");
            } else {
              this.app.log(
                "Pengguna gagal dihapus," +
                  ` kesalahan server (${err.response.status})`
              );
            }
          } else {
            this.app.log("Pengguna gagal dihapus, tidak ada jaringan");
          }
        }
      });
    }
  },
  created() {
    this.app.setAppBar(true, "Detail Pengguna");
  },
  mounted() {
    this.reset();
  }
};
</script>
