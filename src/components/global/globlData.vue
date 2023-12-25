<template>
  <v-card style="position: fixed; top: 0; z-index: 1; width: 100%">
    <v-row>
      <v-col cols="3" class="px-0">
        <v-card-text
          class=""
          style="
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: baseline;
          "
        >
          <v-chip class="" color="primary" label>
            <v-icon start icon="mdi-account-circle-outline"></v-icon>
            {{ data.name }}
          </v-chip>

          <v-chip class="ml-2 mt-5" v-if="$route.params.location"
            >location: {{ $route.params.location }}</v-chip
          >
        </v-card-text>
      </v-col>
      <v-col cols="6">
        <v-card-text>
          <v-autocomplete
            v-model:search="search"
            @click="getrestaurant"
            auto-select-first
            item-title="restaurant_name"
            item-value="restaurant_name"
            :items="restaurantArr"
            class="flex-full-width globa"
            density="comfortable"
            item-props
            menu-icon=""
            placeholder="Search All restaurant "
            prepend-inner-icon="mdi-magnify"
            rounded
            theme="light"
            variant="solo"
          >
            <template v-slot:item="{ props, item }">
              <v-list-item style="border-bottom: 1px solid #999" v-bind="props">
                <v-list-item-action>
                  <v-btn
                    :color="item?.raw?.color ? item?.raw?.color : 'blue'"
                    @click="
                      getloctionbyId(
                        item?.raw?.location_id,
                        item?.raw?.id,
                        item?.raw?.restaurant_name
                      )
                    "
                  >
                    view munu</v-btn
                  >
                  <v-spacer></v-spacer>
                  <v-sheet>
                    <v-btn
                      variant="text"
                      @click="oppen_restaurantEdit(item?.props)"
                      color="purple"
                      icon="mdi-wrench"
                    ></v-btn>

                    <v-btn
                      color="error"
                      variant="text"
                      @click="
                        delet_res_shor(item?.raw?.id, item?.raw?.location_id)
                      "
                      icon="mdi-delete"
                    >
                    </v-btn>
                    <v-btn
                      size="15"
                      :color="item?.raw?.color ? item?.raw?.color : 'blue'"
                      icon=""
                    >
                    </v-btn>
                  </v-sheet>
                </v-list-item-action>
              </v-list-item>
            </template>
          </v-autocomplete> </v-card-text
      ></v-col>
      <v-col cols="3" class="px-0">
        <v-card-text
          class=""
          style="
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: end;
          "
        >
          <v-btn
            style="text-transform: none"
            variant="text"
            color="red"
            @click="dialog = true"
            >log aut</v-btn
          >

          <v-chip class="mt-3 ml-2" v-if="$route.params.restaurant"
            >restaurant: {{ $route.params.restaurant }}</v-chip
          >
        </v-card-text>
      </v-col>
    </v-row>
  </v-card>
  <v-dialog
    v-model="dialog"
    persistent
    width="auto"
    transition="dialog-top-transition"
  >
    <v-card>
      <v-card-text
        class="px-10 pb-10"
        style="border: 5px solid rgb(0, 225, 255)"
      >
        <v-card-title class="pb-8">are you shore log out?</v-card-title>
        <v-card-text>
          <v-btn
            style="text-transform: none"
            class="px-10"
            block
            active
            @click="dialog = false"
            >cancel</v-btn
          >
        </v-card-text>
        <v-card-text>
          <v-btn
            style="text-transform: none"
            class="px-10"
            color="black"
            block
            @click="clearloc"
            >log aut</v-btn
          >
        </v-card-text>
      </v-card-text>
    </v-card>
  </v-dialog>
  <v-dialog
    v-model="dialogdelet"
    persistent
    width="auto"
    transition="dialog-top-transition"
  >
    <v-card>
      <v-card-text
        class="px-10 pb-10"
        style="border: 5px solid rgb(255, 0, 179)"
      >
        <v-card-title class="pb-8">are you shore Delet?</v-card-title>
        <v-card-text>
          <v-btn
            style="text-transform: none"
            class="px-10"
            block
            active
            @click="dialogdelet = false"
            >cancel</v-btn
          >
        </v-card-text>
        <v-card-text>
          <v-btn
            style="text-transform: none"
            class="px-10"
            color="black"
            block
            @click="delet_res"
            >Delete restaurant</v-btn
          >
        </v-card-text>
      </v-card-text>
    </v-card>
  </v-dialog>
  <v-card class="ma-15"></v-card>
  <restauEdit></restauEdit>
</template>

<script>
import axios from "axios";
import { useCounterStore } from "@/stores/index";
import { mapActions } from "pinia";
import restauEdit from "@/components/global/restauEdit.vue";
export default {
  name: "HomeView",
  data() {
    return {
      data: {},
      search: "",
      dialog: false,
      dialogdelet: false,
      locationdata: [],
      restaurantArr: [],
      restaurant_id_delet: -1,
      user: JSON.parse(localStorage.getItem("ueser-info")),
    };
  },
  components: {
    restauEdit,
  },
  inject: ["emitter"],
  methods: {
    delet_res_shor(id) {
      (this.dialogdelet = true), (this.restaurant_id_delet = id);
    },
    delet_res() {
      this.delet_restaurant(this.restaurant_id_delet);
      this.dialogdelet = false;
    },
    ...mapActions(useCounterStore, ["delet_restaurant"]),
    clearloc() {
      localStorage.clear();
      this.dialog = false;
      this.$router.push({ name: "signin" });
    },
    oppen_restaurantEdit(data_rest) {
      console.log(data_rest);
      this.emitter.emit("restaurantEdit_fun", data_rest);
    },
    async getrestaurant() {
      let A = JSON.parse(localStorage.getItem("ueser-info"));
      await axios
        .get(`http://localhost:3000/restaurant?userid=${A.id}`)
        .then((a) => {
          if (a.data.length > 0 && a.status == 200) {
            console.log("find");
            this.restaurantArr = a.data;
          }
        })
        .catch(() => {});
    },
    async getloctionbyId(location_id, restaurant_id, restaurant_name) {
      console.log(location_id);
      await axios
        .get(`http://localhost:3000/location/${location_id}`)
        .then((a) => {
          if (a.data.name && a.status == 200) {
            console.log("find");
            this.$router.push({
              name: "mene",
              params: {
                restaurant: restaurant_name,
                location: a.data.name,
              },
              query: { id: restaurant_id },
            });
            this.search = "";
          } else {
            console.log("not find");
          }
        })
        .catch(() => {});
    },
  },

  mounted() {
    if (localStorage.getItem("ueser-info")) {
      this.data = JSON.parse(localStorage.getItem("ueser-info"));
      this.getrestaurant();
    }
  },
};
</script>
<style>
.globa .v-input__details {
  display: none !important;
}
</style>
