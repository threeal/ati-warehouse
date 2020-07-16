<template>
  <v-container>
    <v-container>
      <v-row>
        <v-select v-model="selectedFilter" :items="filters" label="Filter Dokumen"
            hide-details dense outlined/>
      </v-row>
    </v-container>
    <v-container>
      <v-row>
        <v-btn color="primary" @click="$router.push('/document-add')" block>Tambah Dokumen</v-btn>
      </v-row>
    </v-container>
    <v-card>
      <v-list two-line>
        <v-list-group value="true">
          <template v-slot:activator>
            <v-list-item-title>
              Daftar Dokumen
            </v-list-item-title>
          </template>
          <v-list-item v-if="fetching">
            <v-list-item-content>
              <v-progress-circular color="primary" indeterminate/>
            </v-list-item-content>
          </v-list-item>
          <div v-else>
            <div v-if="documents.length > 0">
              <v-list-item v-for="(document, index) in documents" :key="index"
                  @click="$router.push(`/document/${document.id}`)" link>
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
            <v-list-item v-else>
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
  </v-container>
</template>

<script>
import DocumentService from '../services/DocumentService'

export default {
  name: 'document-list',
  props: {
    app: {
      type: Object,
      required: true,
    },
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
  mounted() {
    this.app.title = 'Daftar Dokumen';

    DocumentService.getAll()
      .then((res) => {
        this.fetching = false;
        this.documents = res.data;
      })
      .catch(() => {
        this.app.log('Error: Gagal mengambil dokumen dari database');
      });
  },
}
</script>