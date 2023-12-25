<template>
  <globalData></globalData>

  <div class="home pt-10">
    <div
      style="
        display: flex;
        justify-content: space-between;
        padding: 0 15px 0 5px;
      "
    >
      <v-btn class="ml-5" color="blue ">{{
        Object.keys(MenueArr).length
      }}</v-btn>

      <v-btn @click="add_menu" class="ml-5" color="green">Add Menue</v-btn>
    </div>
    <v-card>
      <v-card class="ma-5" v-if="Object.keys(MenueArr).length == 0" color="red">
        <v-card-title> No Menue </v-card-title>
      </v-card>
      <v-card
        v-for="(data, i) in MenueArr"
        :key="i"
        :color="data.color ? data.color : 'green'"
        class="ma-3"
      >
        <v-card-title>menue: {{ data.menue_name }} {{ data.id }}</v-card-title>
        <v-card-title>menue Type {{ data.menue_Type }} </v-card-title>
        <v-card-text style="display: flex; justify-content: space-between">
          <!-- v-if="menue[data.id]" -->
          <!-- :content="Object.keys(menue[data.id]).length" -->
          <!-- v-if="ArrItems[data.id]" -->
          <!-- :content="ArrItems[data.id].length ? ArrItems[data.id].length : 0" -->
          <!-- <v-card>
            data.restaurant_name
            {{ data.restaurant_name }} $route.params.restaurant
            {{ $route.params.restaurant }}
            <br />
            $route.params.restaurant {{ $route.params.restaurant }}
            <br />
            datalocation.name: {{ datalocation.name }}
            <br />
            $route.params.location {{ $route.params.location }}
            <br />
            data.menue_name: {{ data.menue_name }}
            <br />
            data.id: {{ data.id }}
          </v-card> -->
          <v-badge floating :content="item_id[data.id]">
            <v-btn
              class="ml-5"
              color="yelow"
              @click="
                $router.push({
                  name: 'items',
                  params: {
                    restaurant: $route.params.restaurant,
                    location: $route.params.location,
                    mene: data.menue_name,
                  },
                  query: { id: data.id },
                })
              "
              >veiw items</v-btn
            >
          </v-badge>
          <!-- <v-spacer></v-spacer> -->
          <v-sheet :color="data.color ? data.color : 'green'">
            <v-btn
              variant="text"
              @click="Edit_menu(data)"
              color="purple"
              icon="mdi-wrench"
            ></v-btn>

            <v-btn
              color="error"
              variant="text"
              @click="delet_Menue(data.id, $route.query.id)"
              icon="mdi-delete"
            >
            </v-btn>
          </v-sheet>
        </v-card-text>
      </v-card>
    </v-card>
  </div>
  <!-- <locationA></locationA> -->
  <menueEdit></menueEdit>
  <menueAdd></menueAdd>
</template>

<script>
// import axios from "axios";
// import locationA from "@/components/global/locationGl.vue";
import globalData from "@/components/global/globlData.vue";
import menueEdit from "@/components/global/menueEdit.vue";
import menueAdd from "@/components/global/menuAdd.vue";
import { useCounterStore } from "@/stores/index";
import { mapActions, mapState } from "pinia";
export default {
  data() {
    return {
      item_id: [],
    };
  },
  components: {
    // locationA,
    globalData,
    menueEdit,
    menueAdd,
  },
  computed: {
    ...mapState(useCounterStore, ["data_user", "MenueArr", "ArrItems"]),
  },
  inject: ["emitter"],
  methods: {
    add_menu() {
      this.emitter.emit("menue_fun", this.$route.query.id);
    },
    Edit_menu(data) {
      this.emitter.emit("menue_Edit", data);
    },
    ...mapActions(useCounterStore, [
      "nextRouter",
      "getMenueArr",
      "delet_Menue",
      "get_Items",
    ]),
  },
  watch: {
    $route: {
      async handler() {
        await this.getMenueArr(this.$route.query.id);
        console.log(this.MenueArr);
      },
      deep: true,
    },
  },
  async mounted() {
    if (!localStorage.getItem("ueser-info")) {
      this.nextRouter("signin");
    } else {
      await this.getMenueArr(this.$route.query.id);
      console.log(this.MenueArr);
      for (const key in this.MenueArr) {
        await this.get_Items(this.MenueArr[key].id);
        this.item_id[this.MenueArr[key].id] = this.ArrItems.length;
      }
    }
  },
};
</script>
// async get_loction_Data() { // this.dialog = false; // let A =
JSON.parse(localStorage.getItem("ueser-info")); // // this.find = ""; // await
axios // .get( //
`http://localhost:3000/location?userid=${A.id}&name=${this.$route.params.location}`
// ) // .then((a) => { // if (a.data.length > 0 && a.status == 200) { // //
this.find = "find"; // console.log("find location data"); // this.datalocation =
a.data[0]; // } else { // console.log("not find"); // // this.add_loction(); //
// this.find = "unfind"; // } // }) // .catch(() => { // // handle error // //
console.log(error); // }); // },
