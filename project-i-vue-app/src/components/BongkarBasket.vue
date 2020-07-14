
<template>
    <div id="app">
        <center> <h1> Bongkar Basket </h1> </center>
        <v-form class="form">
            <v-text-field
            label="No Basket"
            v-model="nobasket"
            required
            ></v-text-field>

            <v-text-field
            label="ID Basket"
            v-model="idbasket"
            required
            ></v-text-field>

            <v-text-field
            label="Kondisi"
            v-model="kondisi"
            required
            ></v-text-field>

            <v-text-field
            label="Jumlah Tingkat"
            v-model="jumlahtingkat"
            required
            ></v-text-field>

            <v-text-field
            label="Jumlah Rijek"
            v-model="jumlahrijek"
            required
            ></v-text-field>

            <v-text-field
            label="Jenis Rijek"
            v-model="jenisrijek"
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
              <td class="text-xs-left">{{ props.item.nobasket }}</td>
              <td class="text-xs-left">{{ props.item.idbasket }}</td>
              <td class="text-xs-left">{{ props.item.kondisi }}</td>
              <td class="text-xs-left">{{ props.item.jumlahtingkat }}</td>
              <td class="text-xs-left">{{ props.item.jumlahrijek }}</td>
              <td class="text-xs-left">{{ props.item.jenisrijek }}</td>
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
      { text: "No Basket", value: "nobasket" },
      { text: "ID Basket", value: "idbasket" },
      { text: "Kondisi", value: "kondisi" },
      { text: "Jumlah Tingkat", value: "jumlahtingkat" },
      { text: "Jumlah Rijek", value: "jumlahrijek" },
      { text: "Jenis Rijek", value: "jenisrijek" },
      { text: "Clear", value: "" }
    ],
    nobasket: "",
    idbasket: "",
    kondisi: "",
    jumlahtingkat: "",
    jumlahrijek: "",
    jenisrijek: "",

    Datas: []
  }),
  methods: {
    addData() {
      if (this.nobasket.trim() === "" && this.idbasket.trim() === "" && this.kondisi.trim() === "" && this.jumlahtingkat.trim() === "" && this.jumlahrijek.trim() === "" && this.jenisrijek.trim() === "") {
        alert("Data tidak boleh kosong!");
      } else {
        this.Datas.push({
          nobasket: this.nobasket,
          idbasket: this.idbasket,
          kondisi: this.kondisi,
          jumlahtingkat: this.jumlahtingkat,
          jumlahrijek: this.jumlahrijek,
          jenisrijek: this.jenisrijek
        });
        this.nobasket = "";
        this.idbasket = "";
        this.kondisi = "";
        this.jumlahtingkat = "";
        this.jumlahrijek = "";
        this.jenisrijek = "";
      }
    },
    removeData(id) {
      this.Datas.splice(id, 1);
    },
    clear() {
      this.nobasket = "";
      this.idbasket = "";
      this.kondisi = "";
      this.jumlahtingkat = "";
      this.jumlahrijek = "";
      this.jenisrijek = "";
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