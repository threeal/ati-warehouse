<template>
  <v-list-item @click="onClick(basket.id)" two-line link>
    <v-list-item-content eager>
      <v-list-item-title>
        <div class="d-flex justify-space-between">
          <div>
            Basket {{ basket.basketNumber }} (ID {{ basket.basketId }})
          </div>
          <div>
            {{ quantityString }}
          </div>
        </div>
      </v-list-item-title>
      <v-list-item-subtitle>
        <div class="d-flex justify-space-between">
          <div>
            {{ basket.startTime }} - {{ basket.endTime }}
          </div>
          <div v-if="basket.rejectQuantity && basket.rejectQuantity > 0">
            Rijek: {{ basket.rejectQuantity }} ({{ basket.rejectKind }})
          </div>
        </div>
      </v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
export default {
  name: 'basket-list-item',
  props: {
    basket: { type: Object, required: true },
    onClick: { type: Function, required: true },
  },
  computed: {
    quantityString() {
      let basket = null;
      let can = null;

      if (this.basket.trayQuantity && this.basket.trayQuantity > 0) {
        basket = `${this.basket.trayQuantity} Tray`;
      }

      if (this.basket.canQuantity && this.basket.canQuantity > 0) {
        can = `${this.basket.canQuantity} Kaleng`;
      }

      if (basket) {
        if (can)
          return `${basket} ${can}`;
        else
          return basket;
      }
      else if (can) {
        return can;
      }

      return null;
    },
  },
}
</script>