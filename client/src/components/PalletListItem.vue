<template>
  <v-list-item @click="onClick(pallet.id)" two-line link>
    <v-list-item-content eager>
      <v-list-item-title>
        <div class="d-flex justify-space-between">
          <div>
            Palet {{ pallet.palletNumber }} {{ basketNumbersString }}
          </div>
          <div>
            {{ quantityString }}
          </div>
        </div>
      </v-list-item-title>
      <v-list-item-subtitle>
        <div class="d-flex justify-space-between">
          <div>
            {{ pallet.startTime }} - {{ pallet.endTime }}
          </div>
          <div>
            Loader: {{ pallet.loader }}
          </div>
        </div>
      </v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
import '../plugins/utility'

export default {
  name: 'pallet-list-item',
  props: {
    pallet: { type: Object, required: true },
    onClick: { type: Function, required: true },
  },
  computed: {
    basketNumbersString() {
      if (typeof this.pallet.basketNumbers === 'object'
          && this.pallet.basketNumbers.length > 0) {
        return `(Basket ${this.pallet.basketNumbers.toListString()})`;
      }

      return null;
    },
    quantityString() {
      let stack = null;
      let can = null;

      if (this.pallet.stackQuantity && this.pallet.stackQuantity > 0) {
        stack = `${this.pallet.stackQuantity} Tingkat`;
      }

      if (this.pallet.canQuantity && this.pallet.canQuantity > 0) {
        can = `${this.pallet.canQuantity} Kaleng`;
      }

      if (stack) {
        if (can)
          return `${stack} ${can}`;
        else
          return stack;
      }
      else if (can) {
        return can;
      }

      return null;
    },
  },
}
</script>