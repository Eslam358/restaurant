<template>
  <v-row>
    <v-dialog v-model="dialog" persistent width="800">
      <form @submit.prevent="onSubmit">
        <v-card>
          <v-card-title>
            <span class="text-h5">User Profile</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row class="location">
                <v-col cols="12">
                  <v-text-field
                    class="mb-0"
                    v-model="Loction_name"
                    label="Loction name*"
                    persistent-hint
                    :hint="
                      v$.Loction_name.$error
                        ? v$.Loction_name.$errors[0].$message
                        : ''
                    "
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    class="mb-0"
                    persistent-hint
                    v-model="location"
                    :hint="
                      v$.location.$error
                        ? v$.Loction_name.$errors[0].$message
                        : ''
                    "
                    label="location*"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
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

            <v-btn color="blue-darken-1" variant="text" @click="validate_test">
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </form>
    </v-dialog>
  </v-row>
</template>
<script>
import axios from "axios";
import { useCounterStore } from "@/stores/index";
import { mapActions } from "pinia";
import useVuelidate from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";
export default {
  data: () => ({
    v$: useVuelidate(),
    dialog: false,
    locationArr: [],
    Loction_name: "",
    location: "",
    colorLoction: "",
    location_id: -1,
    colorr: "",
    edit: false,
  }),
  validations() {
    return {
      // name: { required, minLength: minLength(8) },
      Loction_name: { required, minLength: minLength(3) },
      location: { required, minLength: minLength(8) },
    };
  },
  methods: {
    ...mapActions(useCounterStore, ["getloction"]),
    // <<<<<---------------------< test validate  >---------------------------------->>>>
    validate_test() {
      this.v$.$validate();
      if (!this.v$.$error) {
        console.log("validations");
        this.test();
      } else {
        console.log("No  validations");
        console.log(!this.v$.$error);
      }
    },
    // <<<<<---------------------< test getloction  >---------------------------------->>>>
    async test() {
      let A = JSON.parse(localStorage.getItem("ueser-info"));
      this.dialog = false;
      let data = {
        name: this.Loction_name,
        location: this.location,
        color: this.colorr,
        userid: A.id,
      };
      // this.find = "";
      await axios
        .get(
          `http://localhost:3000/location?userid=${A.id}&name=${this.Loction_name}`
        )
        .then((a) => {
          if (a.data.length > 0 && a.status == 200) {
            // this.find = "find";
            if (this.edit && a.data[0].id == this.location_id) {
              data.id = this.location_id;
              this.edit_loction(this.location_id, data);
              console.log("edit");
            }
            console.log("find");
          } else {
            console.log("not find");
            if (!this.edit) {
              this.add_loction(data);
              // this.find = "unfind";
            } else {
              data.id = this.location_id;
              this.edit_loction(this.location_id, data);
            }
          }
        })
        .catch(() => {
          // handle error
          // console.log(error);
        });
    },
    // <<<<<---------------------< add getloction  >---------------------------------->>>>

    async add_loction(data) {
      let A = JSON.parse(localStorage.getItem("ueser-info"));
      console.log(A);
      let recwst = await axios.post(" http://localhost:3000/location", data);
      console.log(recwst.status);
      if (recwst.status == 201) {
        console.log("good edit");
        await this.getloction();
      } else {
        console.log("no no");
      }
    },
    // <<<<<---------------------< edit_loction  >---------------------------------->>>>
    async edit_loction(id, data) {
      let recwst = await axios.put(
        `http://localhost:3000/location/${id}`,
        data
      );
      console.log(recwst.status);
      if (recwst.status == 200) {
        console.log("delet loction");
        await this.getloction();
      } else {
        console.log("no delet");
      }
    },
  },
  inject: ["emitter"],
  mounted() {
    this.emitter.on("location_fun", (data) => {
      this.dialog = true;
      this.location_id = data.location.id;
      if (data.edit) {
        this.Loction_name = data.location.name;
        this.location = data.location.location;
        this.colorr = data.location.color;
      }
      this.edit = data.edit;
    });
  },
};
</script>

<style>
.location .v-messages__message {
  color: red;
}
</style>

<!-- <template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent width="1024">
      <template v-slot:activator="{ props }">
        <v-btn color="primary" v-bind="props"> Open Dialog </v-btn>
      </template> 
      <v-card>
        <v-card-title>
          <span class="text-h5">User Profile</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field label="Legal first name*" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  label="Legal middle name"
                  hint="example of helper text only on focus"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  label="Legal last name*"
                  hint="example of persistent helper text"
                  persistent-hint
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field label="Email*" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Password*"
                  type="password"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  :items="['0-17', '18-29', '30-54', '54+']"
                  label="Age*"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-autocomplete
                  :items="[
                    'Skiing',
                    'Ice hockey',
                    'Soccer',
                    'Basketball',
                    'Hockey',
                    'Reading',
                    'Writing',
                    'Coding',
                    'Basejump',
                  ]"
                  label="Interests"
                  multiple
                ></v-autocomplete>
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
          <v-btn color="blue-darken-1" variant="text" @click="dialog = false">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template> -->
