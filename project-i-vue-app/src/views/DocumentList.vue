<template>
  <v-container>
    <v-row>
      <v-col>
        <v-select v-model="selectedFilter" :items="filters" label="Filter Dokumen"
            :disabled="fetching" hide-details dense outlined/>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col>
        <v-btn color="primary" @click="onDocumentAdd()" :disabled="fetching" block>
          Tambah Dokumen
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card flat>
          <v-list>
            <v-list-group value="true">
              <template v-slot:activator>
                <v-list-item-title>
                  Daftar Dokumen
                </v-list-item-title>
              </template>
              <div v-if="fetching">
                <v-divider/>
                <v-list-item two-line>
                  <v-list-item-content>
                    <v-progress-circular color="primary" indeterminate/>
                  </v-list-item-content>
                </v-list-item>
              </div>
              <div v-else-if="documents.length > 0">
                <div v-for="(document, index) in documents" :key="index">
                  <v-divider/>
                  <v-list-item  @click="onDocumentClick(document.id)"
                      two-line link>
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ document.productKind }}
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        {{ document.productionDate}}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </div>
              </div>
              <div v-else>
                <v-divider/>
                <v-list-item two-line>
                  <v-list-item-content>
                    <v-list-item-title class="d-flex justify-center">
                      Dokumen Kosong
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </div>
            </v-list-group>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import DocumentService from '../services/DocumentService'
import AuthService from '../services/AuthService'

export default {
  name: 'document-list',
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
      documents: [],
    };
  },
  methods: {
    onDocumentAdd() {
      this.app.routePush('/document-add');
    },
    onDocumentClick(documentId) {
      this.app.routePush(`/document/${documentId}`);
    },
  },
  mounted() {
    this.app.setAppBar(true, 'Daftar Dokumen');

    DocumentService.findAll()
      .then((res) => {
        this.documents = res.data;
        this.fetching = false;
      })
      .catch((err) => {
        if (err.request) {
          if (err.request.status === 401) {
            this.app.log('Gagal mengambil dokumen, sesi habis');

            AuthService.signOut();
            this.app.routeReplace('/login');
          }
          else {
            this.app.log(`Gagal mengambil dokumen, kesalahan server (${err.request.status})`);
          }
        }
        else {
          this.app.log('Gagal mengambil dokumen, tidak ada jaringan');
        }
      });
  },
}
</script>