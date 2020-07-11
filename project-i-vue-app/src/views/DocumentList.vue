<template>
  <v-container>
    <div class="d-flex justify-space-between">
      <v-select v-model="selectedFilter" :items="filters"
        height="40" hide-details dense solo/>
      <div class="ma-2"/>
      <v-btn color="primary" height="40">+ Dokumen</v-btn>
    </div>
    <v-row>
      <v-col>
        <v-card>
          <v-list>
            <v-list-item-group>
              <v-list-item v-for="(document, index) in documents" :key="index" two-line>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ document.product }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ document.productionDate}}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
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
    ];

    return {
      filters: filters,
      selectedFilter: filters[0],
      documents: [
        {
          product: 'T2 113 PR YNMDCP EO AU',
          productionDate: '21 Juni 2020',
        },
        {
          product: 'T2 113 PR YNMDCP EO AU',
          productionDate: '21 Juni 2020',
        },
        {
          product: 'T2 113 PR YNMDCP EO AU',
          productionDate: '21 Juni 2020',
        },
      ],
    };
  },
  mounted() {
    this.app.title = 'Daftar Dokumen';
  },
}
</script>