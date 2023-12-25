<template>
  <v-card>
    <v-row justify="center">
      <v-col cols="12" class="ma-15">
        <v-col cols="12">
          <v-card-title>nof found</v-card-title>
          <v-btn style="width: 300px; height: 50px" color="blue" @click="back"
            >go to homr</v-btn
          >
        </v-col>
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
import { useCounterStore } from "@/stores/index";
import { mapActions } from "pinia";
export default {
  data: () => ({
    express_name: "",
    restaurantType: "",
    restaurantTell: "",
  }),

  methods: {
    ...mapActions(useCounterStore, ["nextRouter"]),
    back() {
      if (!localStorage.getItem("ueser-info")) {
        this.nextRouter("signin");
      } else {
        this.nextRouter("home");
      }
    },
  },
};
</script>
