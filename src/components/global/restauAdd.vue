<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent width="804">
      <v-card class="location">
        <v-card-title>
          <span class="text-h5"> location: {{ location_Data.name }}</span>
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
    location_Data: {},
    colorr: "",
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
    ...mapActions(useCounterStore, ["getrestaurant"]),
    // <<<<<---------------------< test validate  >---------------------------------->>>>
    validate_test() {
      this.v$.$validate();
      if (!this.v$.$error) {
        this.loading = true;
        this.test();
      } else {
        (this.snackbar = true), (this.text = "No  validations");
      }
    },
    // <<<<<---------------------< test restaurant  >---------------------------------->>>>
    async test() {
      this.dialog = false;
      // this.find = "";
      await axios
        .get(
          `http://localhost:3000/restaurant?location_id=${this.location_Data.id}&restaurant_name=${this.restaurant_name}`
        )
        .then((a) => {
          if (a.data.length > 0 && a.status == 200) {
            // this.find = "find";
            console.log("find");
            (this.snackbar = true), (this.text = "this restaurant is existing");
            this.loading = false;
            // this.location_Data = a.data[0];
          } else {
            this.add_restaurant();
          }
        })
        .catch(() => {
          // handle error
          // console.log(error);
        });
    },
    // <<<<<---------------------< add restaurant  >---------------------------------->>>>

    async add_restaurant() {
      this.dialog = false;
      let A = JSON.parse(localStorage.getItem("ueser-info"));
      console.log(A);
      let data = {
        restaurant_name: this.restaurant_name,
        restaurantType: this.restaurantType,
        restaurantTell: this.restaurantTell,
        restaurantAdress: this.restaurantAdress,
        color: this.colorr,
        location_id: this.location_Data.id,
        userid: A.id,
      };

      let recwst = await axios.post(" http://localhost:3000/restaurant", data);
      console.log(recwst.status);
      if (recwst.status == 201) {
        console.log("good loction");
        await this.getrestaurant(this.location_Data.id);
        (this.snackbar = true), (this.text = "this restaurant is done");
      } else {
        console.log("no no");
      }
      this.loading = false;
    },
  },
  inject: ["emitter"],
  mounted() {
    this.emitter.on("restaurant_fun", (data) => {
      this.dialog = true;
      this.location_Data = data;
    });
  },
};
</script>

<style>
.location .v-messages__message {
  color: red;
}
</style>
