<template>
  <globalData></globalData>
  <div class="home" style="margin-top: -30px">
    <v-card elevation="0">
      <v-row class="align-center pt-3">
        <v-col class="mx-0">
          <v-sheet>
            <v-chip class="ma-2" color="pink" label text-color="white">
              <v-icon start icon="mdi-label"></v-icon>
              total-locction: {{ locationArr.length }}
            </v-chip>
          </v-sheet>
        </v-col>
        <v-spacer></v-spacer>
        <v-col>
          <v-sheet>
            <v-btn color="yellow" @click="oppen_location(-1, false)"
              >add locaton
            </v-btn>
          </v-sheet>
        </v-col>
      </v-row>

      <v-card v-if="!locationArr" color="red">
        <v-card-title> No restaurant and No locction</v-card-title>
      </v-card>
      <v-card
        v-for="(data, i) in locationArr"
        :key="i"
        :color="data.color ? data.color : 'blue'"
        class="ma-2"
      >
        <v-card-title>
          {{ data.name }}
        </v-card-title>
        <v-card-subtitle>{{ data.location }}</v-card-subtitle>
        <v-card-text class="d-flex align-center justify-space-between">
          <v-btn
            @click="
              $router.push({
                name: 'restaurant',
                params: { location: data.name },
              })
            "
            color="orange"
            >veiw restaurant</v-btn
          >
          <!-- :color="restaurant[data.id] ? 'red' : 'green'" -->
          <v-chip label elevation="5">
            <v-icon start icon="mdi-label"></v-icon>
            <strong>
              {{ restaurant[data.id] ? restaurant[data.id] : 0 }}</strong
            >
          </v-chip>
          <!-- variant="outlined" -->
          <v-sheet :color="data.color ? data.color : 'blue'">
            <v-btn
              variant="text"
              color="purple"
              @click="oppen_location(data, true)"
              icon="mdi-wrench"
            ></v-btn>
            <v-btn
              @click="delet_loction(data.id)"
              color="error"
              variant="text"
              icon="mdi-delete"
            >
            </v-btn>
          </v-sheet>
        </v-card-text>
      </v-card>
    </v-card>
  </div>
  <locationA></locationA>
</template>

<script>
import locationA from "@/components/global/locationGl.vue";
import globalData from "@/components/global/globlData.vue";
import { useCounterStore } from "@/stores/index";
import { mapActions, mapState } from "pinia";
export default {
  name: "HomeView",
  data() {
    return {
      restaurant: [],
    };
  },
  components: {
    locationA,
    globalData,
  },
  computed: {
    ...mapState(useCounterStore, ["data_user", "locationArr", "restaurantArr"]),
  },
  inject: ["emitter"],
  methods: {
    oppen_location(data, edit) {
      this.emitter.emit("location_fun", {
        location: data,
        edit,
      });
    },
    ...mapActions(useCounterStore, [
      "nextRouter",
      "add_localstorge",
      "get_data",
      "delet_loction",
      "getloction",
      "getrestaurant",
    ]),
  },
  async mounted() {
    let A = JSON.parse(localStorage.getItem("ueser-info"));
    if (!localStorage.getItem("ueser-info")) {
      this.data_user = {};
      this.nextRouter("signin");
    } else {
      await this.get_data(A.email, A.pass);
      if (this.$router.options.history.state.back == "/signup") {
        this.add_localstorge(this.data_user);
      }
      //     async beforeRouteUpdate(to, from) {
      //   // react to route changes...
      //   this.userData = await fetchUser(to.params.id)
      // },
      await this.getloction();
      for (const key in this.locationArr) {
        await this.getrestaurant(this.locationArr[key].id);
        this.restaurant[this.locationArr[key].id] = this.restaurantArr.length;
        console.log(this.restaurant[this.locationArr[key].id]);
      }
    }
  },
};
</script>
