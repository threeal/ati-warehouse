<template>
  <v-row>
    <v-col cols="12">
      <v-select
        v-model="selectedSort"
        :items="sorts"
        @change="sort()"
        label="Urutkan Data"
        :disabled="fetching"
        hide-details
        dense
        outlined
      />
    </v-col>
    <v-col cols="12">
      <v-btn
        color="primary"
        @click="palletAdd = true"
        :disabled="fetching"
        block
      >
        <v-icon left>mdi-plus-thick</v-icon> Tambah Data Palet
      </v-btn>
    </v-col>
    <v-col cols="12">
      <v-card>
        <v-toolbar color="primary" dark flat dense>
          <v-toolbar-title>Daftar Data Palet</v-toolbar-title>
        </v-toolbar>
        <v-list>
          <div v-if="fetching">
            <v-divider />
            <v-list-item two-line>
              <v-list-item-content>
                <v-progress-circular color="primary" indeterminate />
              </v-list-item-content>
            </v-list-item>
          </div>
          <div v-else-if="pallets.length > 0">
            <div v-for="(pallet, index) in pallets" :key="index">
              <v-divider v-if="index > 0" />
              <PalletListItem :pallet="pallet" :onClick="onPalletClick" />
            </div>
          </div>
          <div v-else>
            <v-divider />
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title class="d-flex justify-center">
                  Data Palet Kosong
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </div>
        </v-list>
      </v-card>
    </v-col>
    <v-dialog
      v-model="palletAdd"
      :fullscreen="$vuetify.breakpoint.xsOnly"
      :max-width="$vuetify.breakpoint.smAndDown ? '65%' : '45%'"
      scrollable
    >
      <PalletAdd
        :app="app"
        :cancelCallback="onPalletAddCancel"
        :successCallback="onPalletAddSuccess"
      />
    </v-dialog>
  </v-row>
</template>

<script>
import PalletAdd from "./PalletAdd";
import PalletListItem from "./PalletListItem";
import PalletService from "../services/PalletService";
import AuthService from "../services/AuthService";

export default {
  name: "pallet-list",
  components: {
    PalletAdd,
    PalletListItem
  },
  props: {
    app: { type: Object, required: true },
    resetCallback: { type: Function }
  },
  data() {
    let sorts = [
      { value: "number", text: "Berdasarkan Nomor" },
      { value: "duration", text: "Berdasarkan Durasi" }
    ];

    return {
      fetching: true,
      sorts: sorts,
      selectedSort: "number",
      palletAdd: false,
      pallets: []
    };
  },
  methods: {
    sort() {
      if (this.selectedSort == "number") {
        this.pallets.sort((a, b) => (a.palletNumber > b.palletNumber ? 1 : -1));
      } else if (this.selectedSort == "duration") {
        this.pallets.sort((a, b) => (a.durationTime < b.durationTime ? 1 : -1));
      }
    },
    reset() {
      PalletService.findAll(this.$route.params.documentId)
        .then(res => {
          this.pallets = res.data;
          this.fetching = false;

          this.sort();

          if (typeof this.resetCallback === "function") {
            this.resetCallback();
          }
        })
        .catch(err => {
          if (err.response) {
            if (err.response.status === 401) {
              this.app.log("Sesi habis, harap masuk kembali");

              AuthService.signOut();
              this.app.routeReplace("/login");
            } else {
              this.app.log(
                "Gagal mengambil daftar palet," +
                  ` kesalahan server (${err.response.status})`
              );
            }
          } else {
            this.app.log("Gagal mengambil daftar palet, tidak ada jaringan");
          }
        });
    },
    onPalletAddCancel() {
      this.palletAdd = false;
    },
    onPalletAddSuccess() {
      this.palletAdd = false;
      this.reset();
    },
    onPalletClick(palletId) {
      this.app.routePush(
        `/document/${this.$route.params.documentId}/pallet/${palletId}`
      );
    }
  },
  mounted() {
    this.reset();
  }
};
</script>
