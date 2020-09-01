<template>
  <v-container>
    <v-row :no-gutters="$vuetify.breakpoint.smAndDown" justify="center">
      <v-col class="hidden-sm-and-down" cols="4">
        <DocumentAdd :app="app" :successCallback="onDocumentAddSuccess"/>
      </v-col>
      <v-col cols="12" sm="8" md="6">
        <v-row>
          <v-col cols="12">
            <v-select v-model="selectedFilter" :items="filters" @change="reset()"
                label="Filter Dokumen" :disabled="fetching" hide-details dense outlined/>
          </v-col>
          <v-col class="hidden-md-and-up" cols="12">
            <v-btn color="primary" @click="documentAdd = true" :disabled="fetching" block>
              <v-icon left>mdi-plus-thick</v-icon> Tambah Dokumen
            </v-btn>
          </v-col>
          <v-col cols="12">
            <v-card>
              <v-toolbar color="primary" dark flat dense>
                <v-toolbar-title>Daftar Dokumen</v-toolbar-title>
                <v-spacer/>
                <v-btn v-if="selectedFilter" @click="filterNavigationPrevious()"
                    icon dark>
                  <v-icon>mdi-arrow-left</v-icon>
                </v-btn>
                <span v-if="selectedFilter">
                  {{ filterNavigationValue }}
                </span>
                <v-btn v-if="selectedFilter" @click="filterNavigationNext()"
                    icon dark>
                  <v-icon>mdi-arrow-right</v-icon>
                </v-btn>
              </v-toolbar>
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
                          <span v-if="document.name">
                          {{ document.name }}
                          </span>
                          <i v-else>
                            (Dokumen Tanpa Nama)
                          </i>
                        </v-list-item-title>
                        <v-list-item-subtitle>
                          <div class="d-flex justify-space-between">
                            <span v-if="document.productKind">
                            {{ document.productKind }}
                            </span>
                            <i v-else>
                              (Jenis Produk Hilang)
                            </i>
                            <span v-if="document.productionDate">
                            {{ document.productionDate.toLocaleDateString() }}
                            </span>
                            <i v-else>
                              (Tanggal Produksi Hilang)
                            </i>
                          </div>
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
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-dialog v-if="$vuetify.breakpoint.smAndDown" v-model="documentAdd"
        :fullscreen="$vuetify.breakpoint.xsOnly" max-width="65%" scrollable>
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
      { value: 'yearly', text: 'Tahunan' },
      { value: 'monthly', text: 'Bulanan' },
      { value: 'daily', text: 'Harian' },
    ];

    return {
      fetching: true,
      filters: filters,
      selectedFilter: 'monthly',
      selectedDate: new Date(),
      documentAdd: false,
      documents: [],
    };
  },
  computed: {
    filterNavigationValue() {
      let options = {};
      if (this.selectedFilter == 'yearly') {
        options = { year: 'numeric' };
      }
      else if (this.selectedFilter == 'monthly') {
        options = { year: 'numeric', month: 'long' };
      }
      else if (this.selectedFilter == 'daily') {
        options = { year: 'numeric', month: 'long', day: 'numeric' };
      }

      return this.selectedDate.toLocaleDateString('id', options);
    }
  },
  methods: {
    reset() {
      this.documents = [];
      this.fetching = true;

      let year = this.selectedDate.getFullYear();
      let month = this.selectedDate.getMonth() + 1;
      let date = this.selectedDate.getDate();

      let productionDate = '';
      if (this.selectedFilter == 'yearly') {
        productionDate = `${year.pad(4)}-[0-9]{2}-[0-9]{2}`;
      }
      else if (this.selectedFilter == 'monthly') {
        productionDate = `${year.pad(4)}-${month.pad(2)}-[0-9]{2}`;
      }
      else if (this.selectedFilter == 'daily') {
        productionDate = `${year.pad(4)}-${month.pad(2)}-${date.pad(2)}`;
      }

      DocumentService.findAll(productionDate)
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
    filterNavigationPrevious() {
      if (this.selectedFilter == 'yearly') {
        this.selectedDate.setFullYear(this.selectedDate.getFullYear() - 1);
      }
      else if (this.selectedFilter == 'monthly') {
        this.selectedDate.setMonth(this.selectedDate.getMonth() - 1);
      }
      else if (this.selectedFilter == 'daily') {
        this.selectedDate.setDate(this.selectedDate.getDate() - 1);
      }

      this.selectedDate = new Date(this.selectedDate);

      this.reset();
    },
    filterNavigationNext() {
      if (this.selectedFilter == 'yearly') {
        this.selectedDate.setFullYear(this.selectedDate.getFullYear() + 1);
      }
      else if (this.selectedFilter == 'monthly') {
        this.selectedDate.setMonth(this.selectedDate.getMonth() + 1);
      }
      else if (this.selectedFilter == 'daily') {
        this.selectedDate.setDate(this.selectedDate.getDate() + 1);
      }

      this.selectedDate = new Date(this.selectedDate);

      this.reset();
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