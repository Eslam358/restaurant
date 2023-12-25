<template>
  <v-row>
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
                  label="category"
                  v-model="category"
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
                  v-model="quantities"
                  label="item quantities*"
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

    quantities: 0,
    description: "",
    category: "",
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
    id: -1,
  }),

  methods: {
    ...mapActions(useCounterStore, ["get_Items"]),
    // <<<<<---------------------< test item  >---------------------------------->>>>
    async test() {
      this.loading = true;

      this.Edit_item(this.id);
    },
    // <<<<<---------------------< add item  >---------------------------------->>>>

    async Edit_item(id) {
      let data = {
        name: this.name,
        description: this.description,
        price: this.prise,
        category: this.category,
        quantities: this.quantities,
        menue_name: this.menue_name,
        menu_id: this.$route.query.id,
      };

      let recwst = await axios.put(`http://localhost:3000/item/${id}`, data);
      console.log(recwst.status);
      if (recwst.status == 200) {
        console.log("good loction");

        await this.get_Items(this.$route.query.id);
        (this.snackbar = true), (this.loading = false);
        this.dialog = false;
        this.name = "";
        this.description = "";
        this.prise = "";
        this.menue_name = "";
        this.category = "";
        this.quantities = 0;
        this.id = -1;
      } else {
        console.log("no no");
      }
    },
  },
  inject: ["emitter"],
  beforeMount() {
    this.emitter.on("item_Edit", (data) => {
      this.dialog = true;
      this.name = data.name;
      this.description = data.description;
      this.prise = data.price;
      this.menue_name = data.menue_name;
      this.category = data.category;
      this.quantities = data.quantities;
      this.id = data.id;
    });
  },
};
</script>

<style></style>
