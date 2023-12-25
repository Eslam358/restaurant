<template>
  <globalData> </globalData>
  <div class="home mt-10">
    <div
      style="display: flex; justify-content: space-between; align-items: center"
    >
      <v-btn class="ml-5" color="blue">{{
        restaurantArr.length ? restaurantArr.length : 0
      }}</v-btn>
      <v-btn @click="oppen_restaurant" class="mr-5" color="orange"
        >Add restaurant</v-btn
      >
    </div>

    <v-card>
      <v-card class="ma-5" v-if="!restaurantArr.length" color="red">
        <v-card-title> No restaurant </v-card-title>
      </v-card>
      <v-row>
        <v-col cols="6" v-for="(data, i) in restaurantArr" :key="i">
          <v-card :color="data.color ? data.color : 'blue'" class="ma-3">
            <v-card-title>Name: {{ data.restaurant_name }} </v-card-title>

            <v-card-text
              class="pa-3"
              style="
                display: flex;
                justify-content: space-between;
                align-items: center;
              "
            >
              <p>Type: {{ data.restaurantType }}</p>
              <p>phone: {{ data.restaurantTell }}</p>
            </v-card-text>
            <v-card-text style="text-align: start"
              >Address: {{ data.restaurantAdress }}
            </v-card-text>
            <v-card-text>
              <v-card-text v-if="menue[data.id]" class="pa-0">
                <v-autocomplete
                  v-if="Object.keys(menue[data.id]).length > 0"
                  :items="menue[data.id]"
                  color="blue-grey-lighten-2"
                  item-title="menue_name"
                  item-value="menue_name"
                  label="Search menu"
                >
                  <template v-slot:item="{ props, item }">
                    <v-list-item
                      v-bind="props"
                      :title="item?.raw?.menue_name"
                      :value="item?.raw?.id"
                      @click="
                        $router.push({
                          name: 'items',
                          params: {
                            restaurant: data.restaurant_name,
                            location: datalocation.name,
                            mene: item?.raw?.menue_name,
                          },
                          query: { id: item?.raw?.id },
                        })
                      "
                    ></v-list-item>
                  </template>
                </v-autocomplete>
              </v-card-text>
              <v-card-text class="pa-0" v-if="menue[data.id]">
                <v-autocomplete
                  v-if="Object.keys(menue[data.id]).length == 0"
                  color="blue-grey-lighten-2"
                  disabled
                  label="No Data search"
                >
                </v-autocomplete>
              </v-card-text>
            </v-card-text>
            <v-card-text class="pt-0 d-flex align-center justify-space-between">
              <v-badge
                v-if="menue[data.id]"
                :content="Object.keys(menue[data.id]).length"
                floating
              >
                <v-btn
                  @click="
                    $router.push({
                      name: 'mene',
                      params: {
                        restaurant: data.restaurant_name,
                        location: datalocation.name,
                      },
                      query: { id: data.id },
                    })
                  "
                  class="ml-5"
                  color="yelow"
                  >veiw menue
                </v-btn>
              </v-badge>

              <!-- ------------------------------------------------ -->
              <v-sheet :color="data.color ? data.color : 'blue'">
                <v-btn
                  variant="text"
                  @click="oppen_restaurantEdit(data)"
                  color="purple"
                  icon="mdi-wrench"
                ></v-btn>

                <v-btn
                  color="error"
                  variant="text"
                  @click="delet_restaurant(data.id, datalocation.id)"
                  icon="mdi-delete"
                >
                </v-btn>
              </v-sheet>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </div>
  <restauAdd></restauAdd>
</template>

<script>
import restauAdd from "@/components/global/restauAdd.vue";
import globalData from "@/components/global/globlData.vue";

import axios from "axios";
import { useCounterStore } from "@/stores/index";
import { mapActions, mapState } from "pinia";
export default {
  name: "HomeView",
  data() {
    return {
      datalocation: {},
      menue: [],
    };
  },
  components: {
    restauAdd,
    globalData,
  },
  computed: {
    ...mapState(useCounterStore, ["restaurantArr", "MenueArr"]),
  },
  inject: ["emitter"],
  methods: {
    oppen_restaurant() {
      this.emitter.emit("restaurant_fun", this.datalocation);
    },
    oppen_restaurantEdit(data_rest) {
      this.emitter.emit("restaurantEdit_fun", data_rest);
    },
    ...mapActions(useCounterStore, [
      "nextRouter",
      "delet_restaurant",
      "getrestaurant",
      "getMenueArr",
    ]),
    async get_loction_Data() {
      let A = JSON.parse(localStorage.getItem("ueser-info"));
      // this.find = "";
      await axios
        .get(
          `http://localhost:3000/location?userid=${A.id}&name=${this.$route.params.location}`
        )
        .then((a) => {
          if (a.data.length > 0 && a.status == 200) {
            this.datalocation = a.data[0];
          } else {
            console.log("error not find this.location");
          }
        })
        .catch((error) => {
          // handle error
          console.log(error);
        });
    },
  },
  async mounted() {
    // let A = JSON.parse(localStorage.getItem("ueser-info"));
    if (!localStorage.getItem("ueser-info")) {
      this.data_user = {};
      this.nextRouter("signin");
    } else {
      await this.get_loction_Data();
      await this.getrestaurant(this.datalocation.id);
      console.log(this.restaurantArr);
      for (const key in this.restaurantArr) {
        await this.getMenueArr(this.restaurantArr[key].id);
        this.menue[this.restaurantArr[key].id] = this.MenueArr;
        console.log(this.MenueArr);
        console.log(this.MenueArr.length);
        console.log(this.restaurantArr[key].id);
      }
    }
  },
};
</script>
