<template>
  <v-list-item @click="onClick(pallet.id)" two-line link>
    <v-list-item-content eager>
      <v-list-item-title>
        <div class="d-flex justify-space-between">
          <div>
            No. {{ pallet.palletNumber }} {{ basketNumbersString }}
          </div>
          <div>
            {{ quantityString }}
          </div>
        </div>
      </v-list-item-title>
      <v-list-item-subtitle>
        <div class="d-flex justify-space-between">
          <div>
            <span>{{ pallet.startTime }} - {{ pallet.endTime }}</span>
            <i>{{ durationString }}</i>
          </div>
          <div>
            Loader {{ pallet.loader }}
          </div>
        </div>
        <div>{{ pallet.remarks }}</div >
        <div class="error--text">{{ conditionString }}</div >
        <div class="error--text">{{ printResultString }}</div >
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
    durationString() {
      if (this.pallet.startTime) {
        if (this.pallet.endTime) {
          let duration = this.pallet.endTime.toTimeNumber()
            - this.pallet.startTime.toTimeNumber();
          return ` (~${duration.toTimeInput()})`;
        }
      }

      return null;
    },
    quantityString() {
      let stack = null;
      let can = null;

      if (this.pallet.layerQuantity && this.pallet.layerQuantity > 0) {
        stack = `${this.pallet.layerQuantity} Layer`;
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
    conditionString() {
      let string = '';
      let first = true;

      if (!this.pallet.seamingCondition) {
        if (first) {
          first = false;
        }

        string += 'seaming gagal';
      }

      if (!this.pallet.cleanCondition) {
        if (first) {
          first = false;
        }
        else {
          string += ', ';
        }

        string += 'tidak bersih';
      }

      if (!this.pallet.noRustCondition) {
        if (first) {
          first = false;
        }
        else {
          string += ', ';
        }

        string += 'berkarat';
      }

      if (!this.pallet.noOilyCondition) {
        if (first) {
          first = false;
        }
        else {
          string += ', ';
        }

        string += 'berminyak';
      }

      return string;
    },
    printResultString() {
      let string = '';
      let first = true;


      if (!this.pallet.bottomPrintResult) {
        if (first) {
          first = false;
        }

        string += 'bawah';
      }

      if (!this.pallet.middlePrintResult) {
        if (first) {
          first = false;
        }
        else {
          string += ', ';
        }

        string += 'tengah';
      }

      if (!this.pallet.topPrintResult) {
        if (first) {
          first = false;
        }
        else {
          string += ', ';
        }

        string += 'atas';
      }

      if (string.length > 0) {
        return `hasil print ${string} gagal`;
      }

      return null;
    },
  },
}
</script>