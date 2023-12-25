<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent width="804">
      <v-card class="location">
        <v-card-title>
          <span class="text-h5"> location: {{ restaurant_name }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="restaurant_name"
                  label="restaurant name*"
                  persistent-hint
                  :hint="
                    v$.restaurant_name.$error
                      ? v$.restaurant_name.$errors[0].$message
                      : ''
                  "
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="restaurant Type"
                  v-model="restaurantType"
                  persistent-hint
                  :hint="
                    v$.restaurantType.$error
                      ? v$.restaurantType.$errors[0].$message
                      : ''
                  "
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="restaurant Adress *"
                  v-model="restaurantAdress"
                  persistent-hint
                  :hint="
                    v$.restaurantAdress.$error
                      ? v$.restaurantAdress.$errors[0].$message
                      : ''
                  "
                ></v-text-field>
              </v-col>

              <v-col cols="6">
                <v-text-field
                  label="phone number"
                  type="numbers"
                  v-model="restaurantTell"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  type="color"
                  v-model="colorr"
                  label="color*"
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
            color="blue-darken-1"
            variant="text"
            @click="validate_test"
            :loading="loading"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
  <v-snackbar v-model="snackbar" :timeout="timeout">
    {{ text }}

    <template v-slot:actions>
      <v-btn color="blue" variant="text" @click="snackbar = false">
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>
<script>
import axios from "axios";
import useVuelidate from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";
import { useCounterStore } from "@/stores/index";
import { mapActions } from "pinia";
export default {
  data: () => ({
    v$: useVuelidate(),
    dialog: false,
    snackbar: false,
    text: "",
    timeout: 3000,
    loading: false,
    restaurant_name: "",
    restaurantType: "",
    restaurantTell: "",
    restaurantAdress: "",
    location_id: -1,
    colorr: "",
    data: [],
  }),
  validations() {
    return {
      // name: { required, minLength: minLength(8) },
      restaurant_name: { required, minLength: minLength(3) },
      restaurantType: { required, minLength: minLength(3) },
      restaurantAdress: { required, minLength: minLength(5) },
    };
  },
  methods: {
    ...mapActions(useCounterStore, ["getloction", "getrestaurant"]),
    // <<<<<---------------------< test validate  >---------------------------------->>>>
    validate_test() {
      this.v$.$validate();
      if (!this.v$.$error) {
        this.loading = true;
        this.add_restaurant();
      } else {
        console.log("No  validations");
        (this.snackbar = true), (this.text = "No  validations");
      }
    },
    // <<<<<---------------------< test getloction  >---------------------------------->>>>

    // <<<<<---------------------< add getloction  >---------------------------------->>>>

    async add_restaurant() {
      let A = JSON.parse(localStorage.getItem("ueser-info"));
      console.log(A);
      this.data = {
        restaurant_name: this.restaurant_name,
        restaurantType: this.restaurantType,
        restaurantTell: this.restaurantTell,
        restaurantAdress: this.restaurantAdress,
        color: this.colorr,
        location_id: this.location_id,
        userid: A.id,
      };

      let recwst = await axios.put(
        ` http://localhost:3000/restaurant/${this.restauranId}`,
        this.data
      );
      console.log(recwst.status);
      if (recwst.status == 200) {
        console.log("good loction");
        await this.getrestaurant(this.location_id);
        (this.snackbar = true), (this.text = " Edit is Success");
      } else {
        (this.snackbar = true), (this.text = " Edit is not done");
      }
      this.loading = false;
      this.dialog = false;
    },
  },
  inject: ["emitter"],
  mounted() {
    this.emitter.on("restaurantEdit_fun", (data) => {
      this.dialog = true;
      this.location_id = data.location_id;

      this.restauranId = data.id;

      this.restaurant_name = data.restaurant_name;
      this.restaurantType = data.restaurantType;
      this.restaurantTell = data.restaurantTell;
      this.restaurantAdress = data.restaurantAdress;
      this.colorr = data.color;
    });
  },
};
</script>

<style>
.location .v-messages__message {
  color: red;
}
</style>
