<template>
  <v-container>
    <v-container>
      <v-row>
        <v-text-field v-model="loadDate" label="Tanggal Muat" type="date"
            :disabled="!edit" dense outlined/>
      </v-row>
      <v-row>
        <v-text-field v-model="brand" label="Merk"
            :disabled="!edit" dense outlined/>
      </v-row>
      <v-row>
        <v-btn v-if="!edit" @click="onEdit()" color="primary" block>Ubah Detail</v-btn>
        <v-btn v-else @click="onSave()" color="primary" block>Simpan Perubahan</v-btn>
      </v-row>
    </v-container>
    <v-list two-line>
      <v-list-group value="true">
        <template v-slot:activator>
          <v-list-item-title>
            Daftar Data Pallet
          </v-list-item-title>
        </template>
        <v-list-item v-for="(row, index) in rows" :key="index" link>
          <v-list-item-content eager>
            <v-list-item-title>
              <div class="d-flex justify-space-between">
                <div>
                  Pallet {{ row.palletNumber }} (Basket {{ row.basketNumbers }})
                </div>
                <div>
                  {{ row.quantity }}
                </div>
              </div>
            </v-list-item-title>
            <v-list-item-subtitle>
              <div class="d-flex justify-space-between">
                <div>
                  {{ row.startTime }} - {{ row.endTime }}
                </div>
                <div>
                  Loader: {{ row.loader }}
                </div>
              </div>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </v-list>
    <v-container>
      <v-row>
        <v-btn color="primary" block>Tambah Data Pallet</v-btn>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
export default {
  name: 'pallet-load',
  data() {
    return {
      edit: false,
      loadDate: '2020-03-03',
      brand: 'SIRENA',
      panel: 0,
      rows: [
        {
          palletNumber: '1',
          basketNumbers: '5, 6, 7',
          quantity: '50 Tingkat',
          startTime: '05.00',
          endTime: '06.00',
          loader: 'Udin'
        },
        {
          palletNumber: '2',
          basketNumbers: '3, 2',
          quantity: '13 Tingkat 6 Kaleng',
          startTime: '06.00',
          endTime: '06.30',
          loader: 'Udin'
        },
      ],
    };
  },
  methods: {
    onEdit() {
      this.edit = true;
    },
    onSave() {
      this.edit = false;
    },
  },
}
</script>