
<template>
    <div id="app">
        <center> <h1> Muat Pallet </h1> </center>
        <v-form class="form">
            <v-text-field
            label="No Pallet"
            v-model="nobasket"
            required
            ></v-text-field>

            <v-text-field
            label="Nomor Basket"
            v-model="nomorbasket"
            required
            ></v-text-field>

            <v-text-field
            label="Kondisi Seaming"
            v-model="kondisiseaming"
            required
            ></v-text-field>

            <v-text-field
            label="Kondisi"
            v-model="kondisi"
            required
            ></v-text-field>

            <v-text-field
            label="Jumlah Layer"
            v-model="jumlahlayer"
            required
            ></v-text-field>

            <v-text-field
            label="Loader"
            v-model="loader"
            required
            ></v-text-field>

            <v-text-field
            label="Keterangan"
            v-model="keterangan"
            required
            ></v-text-field>

            <v-btn @click="addData" color="info"> Tambahkan </v-btn>
            <v-btn @click="clear">Hapus</v-btn>
        </v-form>

         <v-data-table
            :headers="headers"
            :items="Datas"
            hide-actions
            class="elevation-1"
          >
          <template slot="items" slot-scope="props">
              <td class="text-xs-left">{{ props.item.nopallet }}</td>
              <td class="text-xs-left">{{ props.item.nomorbasket }}</td>
              <td class="text-xs-left">{{ props.item.kondisiseaming }}</td>
              <td class="text-xs-left">{{ props.item.kondisi }}</td>
              <td class="text-xs-left">{{ props.item.jumlahlayer }}</td>
              <td class="text-xs-left">{{ props.item.loader }}</td>
              <td class="text-xs-left">{{ props.item.keterangan }}</td> 
              <td class="text-xs-left">
                <v-btn icon @click="removeData(props.item)">
                  <v-icon color="pink">delete</v-icon>
                </v-btn>    
              </td>
           </template>
        </v-data-table>

    </div>
</template>

<script>
export default {
  data: () => ({
    headers: [
      { text: "No Pallet", value: "nopallet" },
      { text: "Nomor Basket", value: "nomorbasket" },
      { text: "Kondisi Seaming", value: "kondisiseaming" },
      { text: "Kondisi", value: "kondisi" },
      { text: "Jumlah Layer", value: "jumlahlayer" },
      { text: "Loader", value: "loader" },
      { text: "Keterangan", value: "keterangan" },
      { text: "Clear", value: "" }
    ],
    nopallet: "",
    nomorbasket: "",
    kondisiseaming: "",
    kondisi: "",
    jumlahlayer: "",
    loader: "",
    keterangan: "",

    Datas: []
  }),
  methods: {
    addData() {
      if (this.nopallet.trim() === "" && this.nomorbasket.trim() === "" && this.kondisiseaming.trim() === "" 
      && this.kondisi.trim() === "" && this.jumlahlayer.trim() === "" && this.loader.trim() === "" 
      && this.kondisi.trim() === "") {
        alert("Data tidak boleh kosong!");
      } else {
        this.Datas.push({
          nopallet: this.nopallet,
          nomorbasket: this.nomorbasket,
          kondisiseaming: this.kondisiseaming,
          kondisi: this.kondisi,
          jumlahlayer: this.jumlahlayer,
          loader: this.loader,
          keterangan: this.keterangan
        });
        this.nopallet = "";
        this.nomorbasket = "";
        this.kondisiseaming = "";
        this.kondisi = "";
        this.jumlahlayer = "";
        this.loader = "";
        this.keterangan = "";
      }
    },
    removeData(id) {
      this.Datas.splice(id, 1);
    },
    clear() {
        this.nopallet = "";
        this.nomorbasket = "";
        this.kondisiseaming = "";
        this.kondisi = "";
        this.jumlahlayer = "";
        this.loader = "";
        this.keterangan = "";
    }
  }
};
</script>

<style scoped>
#app {
  margin-top: 30px;
}
.form {
  margin-top: 20px;
  margin-bottom: 50px;
}
</style>