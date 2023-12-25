<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent width="804">
      <v-card class="location">
        <v-card-title>
          <span class="text-h5"> Add menu</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="menue_name"
                  label="menue name*"
                  persistent-hint
                  :hint="
                    v$.menue_name.$error
                      ? v$.menue_name.$errors[0].$message
                      : ''
                  "
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label=" menue Type"
                  v-model="menue_Type"
                  persistent-hint
                  :hint="
                    v$.menue_Type.$error
                      ? v$.menue_Type.$errors[0].$message
                      : ''
                  "
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
    loading: false,
    text: "",
    timeout: 3000,
    menue_name: "",
    menue_Type: "",
    menue_item: 0,
    restaurant_id: 0,
    colorr: "",
  }),
  validations() {
    return {
      // name: { required, minLength: minLength(8) },
      menue_name: { required, minLength: minLength(3) },
      menue_Type: { required, minLength: minLength(3) },
    };
  },
  methods: {
    ...mapActions(useCounterStore, ["getMenueArr"]),
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
    // <<<<<---------------------< test getloction  >---------------------------------->>>>
    async test() {
      // this.find = "";
      await axios
        .get(
          `http://localhost:3000/menue?restaurant_id=${this.restaurant_id}&menue_name=${this.menue_name}`
        )
        .then((a) => {
          if (a.data.length > 0 && a.status == 200) {
            // this.find = "find";
            console.log("find");
            (this.snackbar = true), (this.text = "this restaurant is existing");
            this.loading = false;
            // this.location_Data = a.data[0];
          } else {
            this.addMenueArr();
          }
        })
        .catch((error) => {
          // handle error
          console.log(error);
        });
    },
    // <<<<<---------------------< add getloction  >---------------------------------->>>>

    async addMenueArr() {
      let data = {
        menue_name: this.menue_name,
        menue_Type: this.menue_Type,
        color: this.colorr,
        restaurant_id: this.restaurant_id,
      };

      let recwst = await axios.post(" http://localhost:3000/menue", data);
      console.log(recwst.status);
      if (recwst.status == 201) {
        console.log("good loction");
        await this.getMenueArr(this.restaurant_id);
        (this.snackbar = true), (this.text = "this restaurant is done");
        this.menue_name = "";
        this.menue_Type = "";
        this.colorr = "";
        this.restaurant_id = 0;
        this.dialog = false;
      } else {
        (this.snackbar = true), (this.text = "this restaurant isnot done");
      }
      this.loading = false;
    },
  },
  inject: ["emitter"],
  mounted() {
    this.emitter.on("menue_fun", (data) => {
      this.dialog = true;
      this.restaurant_id = data;
    });
  },
};
</script>

<style>
.location .v-messages__message {
  color: red;
}
</style>
