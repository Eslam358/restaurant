<template>
  <globlData></globlData>

  <div class="home pt-15">
    <v-card>
      <v-card-text style="text-align: end" class="py-1">
        <v-btn @click="Add_item" class="ml-5" color="red">Add item</v-btn>
      </v-card-text>
      <v-card class="ma-5" v-if="!ArrItems.length" color="red">
        <v-card-title> No Data </v-card-title>
      </v-card>
      <v-row class="px-3">
        <v-col cols="4" class="" v-for="(data, i) in ArrItems" :key="i">
          <v-card elevation="5">
            <v-card-title> {{ data.name }} </v-card-title>
            <v-card-text class="pb-0 d-flex justify-space-between align-center">
              <v-card-text class="text-start"
                >category: <strong> {{ data.category }}</strong></v-card-text
              >

              <v-card-text class="text-end"
                >price: <strong>{{ data.price }} $ </strong></v-card-text
              >
            </v-card-text>
            <v-card-text
              class="pt-0 text-start"
              style="height: 100px; overflow: auto"
              >{{ data.description }}</v-card-text
            >
            <v-divider></v-divider>
            <v-card-text class="py-0 d-flex justify-space-between align-center">
              <v-card-text class="text-start"
                >quantities: <strong> {{ data.quantities }}</strong>
              </v-card-text>

              <v-sheet class="text-end">
                <v-btn
                  variant="text"
                  @click="item_Edit(data)"
                  icon="mdi-wrench"
                ></v-btn>

                <v-btn
                  variant="text"
                  @click="delet_Items(data.id, this.$route.query.id)"
                  icon="mdi-delete"
                >
                </v-btn>
              </v-sheet>
              <!-- <v-btn @click="delet_Items(data.id)" class="ml-15" variant="outlined" -->
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </div>
  <itemedit></itemedit>
  <itemAdd></itemAdd>
</template>

<script>
import itemedit from "@/components/global/itemEdit.vue";
import itemAdd from "@/components/global/itemAdd.vue";
import globlData from "@/components/global/globlData.vue";
import { useCounterStore } from "@/stores/index";
import { mapActions, mapState } from "pinia";
export default {
  name: "HomeView",
  data() {
    return {
      datalocation: {},
    };
  },
  components: {
    itemedit,
    itemAdd,
    globlData,
  },
  computed: {
    ...mapState(useCounterStore, ["data_user", "restaurantArr", "ArrItems"]),
  },
  inject: ["emitter"],
  methods: {
    Add_item() {
      this.emitter.emit("item_fun");
    },
    item_Edit(data) {
      this.emitter.emit("item_Edit", data);
    },
    ...mapActions(useCounterStore, ["nextRouter", "get_Items", "delet_Items"]),
  },
  async mounted() {
    // let A = JSON.parse(localStorage.getItem("ueser-info"));
    if (!localStorage.getItem("ueser-info")) {
      this.data_user = {};
      this.nextRouter("signin");
    } else {
      await this.get_Items(this.$route.query.id);
      console.log(this.ArrItems.length);
    }
  },
};
</script>
