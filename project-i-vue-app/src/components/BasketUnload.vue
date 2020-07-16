<template>
  <v-container>
    <v-container>
      <v-row>
        <v-text-field v-model="unloadDate" label="Tanggal Bongkar" type="date"
            :disabled="!edit" dense outlined/>
      </v-row>
      <v-row>
        <v-text-field v-model="line" label="Line"
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
            Daftar Data Basket
          </v-list-item-title>
        </template>
        <v-list-item v-for="(row, index) in rows" :key="index" link>
          <v-list-item-content eager>
            <v-list-item-title>
              <div class="d-flex justify-space-between">
                <div>
                  Basket {{ row.basketNumber }} (ID {{ row.basketId }})
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
                <div v-if="row.rejectQuantity > 0">
                  Rijek: {{ row.rejectQuantity }} ({{ row.rejectKind }})
                </div>
              </div>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </v-list>
    <v-container>
      <v-row>
        <v-btn color="primary" block>Tambah Data Basket</v-btn>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
export default {
  name: 'basket-unload',
  data() {
    return {
      edit: false,
      unloadDate: '2020-02-02',
      line: '5',
      panel: 0,
      rows: [
        {
          basketNumber: '1',
          basketId: '32',
          startTime: '05.00',
          endTime: '06.00',
          quantity: '50 Basket',
          rejectQuantity: 10,
          rejectKind: 'PJ',
        },
        {
          basketNumber: '2',
          basketId: '16',
          startTime: '04.00',
          endTime: '07.00',
          quantity: '32 Basket 6 Kaleng',
          rejectQuantity: 0,
          rejectKind: '',
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