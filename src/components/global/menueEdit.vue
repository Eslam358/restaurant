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
                  v-model="state.menue_name"
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
                  v-model="state.menue_Type"
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
            :loading="loading"
            @click="validate_test"
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
<script setup>
import axios from "axios";
import useVuelidate from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";
import { reactive, computed } from "vue";
import { useCounterStore } from "@/stores/index";
// import { mapActions } from "pinia";
import { ref, inject, onMounted } from "vue";
const dialog = ref(false);
const snackbar = ref(false);
const loading = ref(false);
const text = ref("");
const timeout = ref(3000);
const menue_item = ref("menue_item");
const restaurant_id = ref(-1);
// const menue_name = ref("");
// const menue_Type = ref("");
const menu_id = ref(0);
const colorr = ref("");

const counter = useCounterStore();

console.log("timeout", timeout.value);
console.log("menue_item", menue_item);
const state = reactive({
  menue_name: "",
  menue_Type: "",
  read: false,
});

const rules = computed(() => {
  return {
    menue_name: { required, minLength: minLength(3) },
    menue_Type: { required, minLength: minLength(3) },
  };
});
const v$ = useVuelidate(rules, state);
// getloction >----------------------------------

const EditMenueArr = async () => {
  let data = {
    menue_name: state.menue_name,
    menue_Type: state.menue_Type,
    color: colorr.value,
    restaurant_id: restaurant_id.value,
  };
  let recwst = await axios.put(
    `http://localhost:3000/menue/${menu_id.value}`,
    data
  );
  console.log("data", data);
  console.log(recwst.status);
  if (recwst.status == 200) {
    console.log("goodloction");
    await counter.getMenueArr(restaurant_id.value);
    (snackbar.value = true), (text.value = "this nenue is done");
    state.menue_name = "";
    state.menue_Type = "";
    colorr.value = "";
    restaurant_id.value = 0;
    menu_id.value = 0;
    dialog.value = false;
  } else {
    console.log("no no");
  }
  loading.value = false;
};

const validate_test = () => {
  v$.value.$validate();
  if (!v$.value.$error) {
    loading.value = true;
    EditMenueArr();
  } else {
    (snackbar.value = true), (text.value = "Novalidations");
  }
};
const emitter = inject("emitter");
onMounted(() => {
  emitter.on("menue_Edit", (data) => {
    console.log(data);
    dialog.value = true;
    state.menue_name = data.menue_name;
    state.menue_Type = data.menue_Type;

    colorr.value = data.color;
    restaurant_id.value = data.restaurant_id;
    menu_id.value = data.id;
  });
});
</script>

<style>
.location .v-messages__message {
  color: red;
}
</style>
