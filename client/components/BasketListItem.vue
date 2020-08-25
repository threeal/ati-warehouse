<template>
  <v-list-item @click="onClick(basket.id)" two-line link>
    <v-list-item-content eager>
      <v-list-item-title>
        <div class="d-flex justify-space-between">
          <div>
            <span>No. {{ basket.basketNumber }}</span>
            <span> (Basket {{ basket.basketId }})</span>
          </div>
          <div>
            {{ quantityString }}
          </div>
        </div>
      </v-list-item-title>
      <v-list-item-subtitle>
        <div class="d-flex justify-space-between">
          <div>
            <span>{{ basket.startTime }} - {{ basket.endTime }}</span>
            <i>{{ durationString }}</i>
          </div>
          <div v-if="basket.rejectQuantity && basket.rejectQuantity > 0"
              class="error--text">
            <span>{{ basket.rejectQuantity }} Rijek</span>
            <span v-if="basket.rejectKind"> ({{ basket.rejectKind }})</span>
          </div>
        </div>
        <span class="error--text">{{ problemsString }}</span>
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
    durationString() {
      if (this.basket.durationTime) {
        return ` (~${this.basket.durationTime})`;
      }

      return null;
    },
    problemsString() {
      let string = '';
      let first = true;

      if (!this.basket.seamingCondition) {
        if (first) {
          first = false;
        }

        string += 'seaming gagal';
      }

      if (!this.basket.canMarkCondition) {
        if (first) {
          first = false;
        }
        else {
          string += ', ';
        }

        string += 'can mark gagal';
      }

      if (!this.basket.indicatorCondition) {
        if (first) {
          first = false;
        }
        else {
          string += ', ';
        }

        string += 'indikator gagal';
      }

      return string;
    },
  },
}
</script>