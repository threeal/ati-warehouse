<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-row>
          <v-col>
            <v-select v-model="selectedFilter" :items="filters" label="Filter Dokumen"
                :disabled="fetching" hide-details dense outlined/>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col>
            <v-btn color="primary" @click="documentAdd = true" :disabled="fetching" block>
              <v-icon left>mdi-plus-circle</v-icon> Tambah Dokumen
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" sm="8" md="6">
        <v-card>
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Daftar Dokumen</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-list>
              <div v-if="fetching">
                <v-list-item two-line>
                  <v-list-item-content>
                    <v-progress-circular color="primary" indeterminate/>
                  </v-list-item-content>
                </v-list-item>
              </div>
              <div v-else-if="documents.length > 0">
                <div v-for="(document, index) in documents" :key="index">
                  <v-divider v-if="index > 0"/>
                  <v-list-item  @click="onDocumentClick(document.id)"
                      two-line link>
                    <v-list-item-content>
                      <v-list-item-title>
                        <span v-if="document.productKind">
                        {{ document.productKind }}
                        </span>
                        <i v-else>
                          (Jenis Produk Hilang)
                        </i>
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        {{ (document.productionDate)
                          ? document.productionDate.toLocaleDateString()
                          : null }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </div>
              </div>
              <div v-else>
                <v-list-item two-line>
                  <v-list-item-content>
                    <v-list-item-title class="d-flex justify-center">
                      Dokumen Kosong
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </div>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="documentAdd" max-width="480">
      <DocumentAdd :app="app" :cancelCallback="onDocumentAddCancel"
          :successCallback="onDocumentAddSuccess"/>
    </v-dialog>
  </v-container>
</template>

<script>
import DocumentAdd from '../components/DocumentAdd'
import DocumentService from '../services/DocumentService'
import AuthService from '../services/AuthService'
import '../plugins/utility'

export default {
  name: 'document-list',
  components: {
    DocumentAdd,
  },
  props: {
    app: { type: Object, required: true },
  },
  data() {
    let filters = [
      { value: 'all', text: 'Tampilkan Semua' },
      { value: 'day', text: 'Harian' },
      { value: 'month', text: 'Bulanan' },
    ];

    return {
      fetching: true,
      filters: filters,
      selectedFilter: filters[0],
      documentAdd: false,
      documents: [],
    };
  },
  methods: {
    reset() {
      this.documents = [];
      this.fetching = true;

      DocumentService.findAll()
        .then((res) => {
          this.documents = res.data;
          this.fetching = false;
        })
        .catch((err) => {
          if (err.response) {
            if (err.response.status === 401) {
              this.app.log('Sesi habis, harap masuk kembali');

              AuthService.signOut();
              this.app.routeReplace('/login');
            }
            else {
              this.app.log('Gagal mengambil daftar dokumen,'
                + ` kesalahan server (${err.response.status})`);
            }
          }
          else {
            this.app.log('Gagal mengambil daftar dokumen, tidak ada jaringan');
          }
        });
    },
    onDocumentAddCancel() {
      this.documentAdd = false;
    },
    onDocumentAddSuccess() {
      this.documentAdd = false;
      this.reset();
    },
    onDocumentClick(documentId) {
      this.app.routePush(`/document/${documentId}`);
    },
  },
  created() {
    this.app.setAppBar(true, 'Daftar Dokumen');
  },
  mounted() {
    this.reset();
  },
}
</script>