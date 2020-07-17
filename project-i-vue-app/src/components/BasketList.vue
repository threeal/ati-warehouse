<template>
  <v-card>
    <v-container>
      <v-row>
        <v-col>
          <v-select v-model="selectedSort" :items="sorts" label="Urutkan Data"
              :disabled="fetching" hide-details dense outlined/>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col>
          <v-btn color="primary" @click="onBasketAdd()" :disabled="fetching" block>
            Tambah Data Basket
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
                    Daftar Data Basket
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
                <div v-else-if="baskets.length > 0">
                  <div v-for="(basket, index) in baskets" :key="index">
                    <v-divider/>
                    <BasketListItem :basket="basket" :onClick="onBasketClick"/>
                  </div>
                </div>
                <div v-else>
                  <v-divider/>
                  <v-list-item two-line>
                    <v-list-item-content>
                      <v-list-item-title class="d-flex justify-center">
                        Data Basket Kosong
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
  </v-card>
</template>

<script>
import BasketListItem from './BasketListItem'
import BasketService from '../services/BasketService'

export default {
  name: 'basket-list',
  components: {
    BasketListItem,
  },
  props: {
    app: { type: Object, required: true },
  },
  data() {
    let sorts = [
      { value: 'time', text: 'Berdasarkan Waktu' },
      { value: 'name', text: 'Berdasarkan Nama' },
    ];

    return {
      fetching: true,
      sorts: sorts,
      selectedSort: sorts[0],
      baskets: [],
    };
  },
  methods: {
    onBasketAdd() {
      this.$router.push(`/document/${this.$route.params.documentId}/basket-add`);
    },
    onBasketClick(basketId) {
      this.$router.push(`/document/${this.$route.params.documentId}/basket/${basketId}`);
    },
  },
  mounted() {
    BasketService.findAll(this.$route.params.documentId)
      .then((res) => {
        this.baskets = res.data;
        this.fetching = false;
      })
      .catch(() => {
        this.app.log('Error: Gagal mengambil daftar basket dari database');
      });
  }
}
</script>