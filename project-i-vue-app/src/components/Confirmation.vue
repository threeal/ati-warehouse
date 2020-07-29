<template>
  <v-dialog v-model="dialog" max-width="480" persistent>
    <v-card>
      <v-toolbar color="primary" dark flat>
        <v-toolbar-title>Konfirmasi</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-row>
          <v-col cols="12" class="body-1">
            {{ description }}
          </v-col>
          <v-col cols="6">
            <v-btn @click="onNo()" :disabled="submitting" color="error" block>
              <v-icon left>mdi-close-thick</v-icon> Tidak
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn @click="onYes()" :disabled="submitting"
                :loading="submitting" color="success" block>
              <v-icon left>mdi-check-bold</v-icon> Ya
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'Confirmation',
  props: {
    app: { type: Object, required: true },
  },
  data() {
    return {
      dialog: false,
      submitting: false,
      description: null,
      promiseCallback: null,
      thenCallback: null,
      catchCallback: null,
    };
  },
  methods: {
    onYes() {
      console.log('yes');
      if (typeof this.promiseCallback === 'function') {
        console.log('promise');
        if (typeof this.thenCallback === 'function'
            || typeof this.catchCallback === 'function') {
          console.log('with return');
          this.submitting = true;
          this.promiseCallback()
            .then((...args) => {
              console.log('then');
              this.thenCallback(...args);
              this.submitting = false;
              this.dialog = false;
            })
            .catch((...args) => {
              console.log('catch');
              this.catchCallback(...args);
              this.submitting = false;
              this.dialog = false;
            });
        }
        else {
          this.promiseCallback();
          this.dialog = false;
        }
      }
      else {
        this.dialog = false;
      }
    },
    onNo() {
      this.dialog = false;
    },
  },
  mounted() {
    if (typeof this.app !== 'undefined') {
      this.app.confirm = (options) => {
        this.description = options.description;
        this.promiseCallback = options.promiseCallback;
        this.thenCallback = options.thenCallback;
        this.catchCallback = options.catchCallback;

        this.submitting = false;
        this.dialog = true;
      };
    }
  }
}
</script>