<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent>
      <v-card>
        <v-card-title>
          <!-- <span class="text-h5">User Profile</span> -->
          <span class="text-h5"> Add new Ietm</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="name"
                  label="item name*"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-autocomplete
                  :items="items"
                  v-model="categories"
                  label="categories"
                  clearable
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="prise"
                  label="item prise*"
                  type="number"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="category"
                  label="item category*"
                  type="number"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="item description"
                  v-model="description"
                  hint="example of helper text only on focus"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="dialog = false">
            Close
          </v-btn>
          <v-btn
            :loading="loading"
            color="blue-darken-1"
            variant="text"
            @click="test"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import axios from "axios";

import { useCounterStore } from "@/stores/index";
import { mapActions } from "pinia";
export default {
  data: () => ({
    dialog: false,
    snackbar: false,
    loading: false,
    name: "",
    prise: "",
    description: "",
    category: "",
    categories: "",
    items: [
      "Appetizers",
      "Main Courses",
      "Desserts",
      "Salads",
      "Beverages",
      "Sandwiches",
      "Soups",
      "Pizzas",
      "Seafood",
      "Vegetarian",
    ],
  }),

  methods: {
    ...mapActions(useCounterStore, ["get_Items"]),
    // <<<<<---------------------< test item  >---------------------------------->>>>
    async test() {
      this.loading = true;
      await axios
        .get(
          `http://localhost:3000/item?menu_id=${this.$route.query.id}&name=${this.name}`
        )
        .then((a) => {
          if (a.data.length > 0 && a.status == 200) {
            console.log("find");
          } else {
            console.log("not find");
            this.add_item(this.$route.query.id);
            // this.find = "unfind";
          }
        })
        .catch(() => {
          // handle error
          // console.log(error);
        });
    },
    // <<<<<---------------------< add item  >---------------------------------->>>>

    async add_item() {
      let A = JSON.parse(localStorage.getItem("ueser-info"));
      console.log(A);
      let data = {
        name: this.name,
        categories: this.categories,
        description: this.description,
        price: this.prise,
        menue_name: this.menue_name,
        menu_id: this.$route.query.id,
        category: this.category,
        userid: A.id,
      };

      let recwst = await axios.post(" http://localhost:3000/item", data);
      console.log(recwst.status);
      if (recwst.status == 201) {
        console.log("good loction");

        await this.get_Items(this.$route.query.id);
        (this.snackbar = true), (this.loading = false);
        this.dialog = false;
      } else {
        console.log("no no");
      }
    },
  },
  inject: ["emitter"],
  beforeMount() {
    this.emitter.on("item_fun", () => {
      this.dialog = true;
    });
  },
};
</script>

<style></style>
