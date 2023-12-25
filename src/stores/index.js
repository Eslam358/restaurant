// stores/counter.js
import { defineStore } from "pinia";
import router from "@/router";
import axios from "axios";
export const useCounterStore = defineStore("counter", {
  state: () => {
    return {
      count: 0,
      data_user: [],
      locationArr: [],
      restaurantArr: [],
      MenueArr: [],
      ArrItems: [],
    };
  },
  // could also be defined as
  // state: () => ({ count: 0 })
  actions: {
    // ----------------------- localStorage -------------------------
    add_localstorge(data) {
      localStorage.setItem("ueser-info", JSON.stringify(data));
    },
    // ----------------------- nextRouter -------------------------
    nextRouter(nameRoute) {
      router.push({ name: nameRoute });
    },
    // ........................get_data..............................
    // get_data
    async get_data(email, pass) {
      await axios
        .get(`http://localhost:3000/users?email=${email}&pass=${pass}`)
        .then((a) => {
          if (a.data.length > 0 && a.status == 200) {
            this.data_user = a.data[0];
          } else {
            this.data_user = {};
          }
        })
        .catch((error) => {
          // handle error
          console.log(error);
        });
    },
    // ........................post..............................
    // add restaurant
    async add_restaurant(id, data) {
      await axios
        // .put(`http://localhost:3000/users/${id}`, data)
        .patch(`http://localhost:3000/users/${id}`, data)
        .then((a) => {
          console.log(a.status);
          console.log(a);
          console.log("RRRRRRR");
        })
        .catch((error) => {
          // handle error
          console.log("rrrrrr");
          console.log(error);
        });
    },
    // -------------------------------------------

    // <<<<<---------------------< test  >---------------------------------->>>>
    // <<<<<---------------------< delet getloction  >---------------------------------->>>>

    async delet_loction(id) {
      let recwst = await axios.delete(`http://localhost:3000/location/${id}`);
      console.log(recwst.status);
      if (recwst.status == 200) {
        console.log("delet loction");
        await this.getloction();
      } else {
        console.log("no delet");
      }
    },

    // <<<<<---------------------< getloction  >---------------------------------->>>>
    async getloction() {
      this.dialog = false;
      let A = JSON.parse(localStorage.getItem("ueser-info"));
      await axios
        .get(`http://localhost:3000/location?userid=${A.id}`)
        .then((a) => {
          if (a.data.length > 0 && a.status == 200) {
            console.log("find");
            this.locationArr = a.data;
          } else {
            console.log("not find");
          }
        })
        .catch(() => {});
    },
    // <<<<<---------------------< getloction  >---------------------------------->>>>
    async getrestaurant(location_id) {
      this.dialog = false;
      let A = JSON.parse(localStorage.getItem("ueser-info"));
      await axios
        .get(
          `http://localhost:3000/restaurant?userid=${A.id}&location_id=${location_id}`
        )
        .then((a) => {
          if (a.data.length > 0 && a.status == 200) {
            console.log("find");
            this.restaurantArr = a.data;

            return 555;
          } else {
            console.log("not find");
            this.restaurantArr = {};
            return 0;
          }
        })
        .catch(() => {});
    },
    // <<<<<---------------------<end getloction  >---------------------------------->>>>
    // <<<<<---------------------< delet restaurnt  >---------------------------------->>>>

    async delet_restaurant(restaurant_id, location_id) {
      let recwst = await axios.delete(
        `http://localhost:3000/restaurant/${restaurant_id}`
      );
      console.log(recwst.status);
      if (recwst.status == 200) {
        console.log("delet restaurant");
        this.getrestaurant(location_id);
      } else {
        console.log("no delet");
      }
    },
    // <<<<<---------------------<end restaurnt  >---------------------------------->>>>
    // <<<<<---------------------< start Menue  >---------------------------------->>>>
    async getMenueArr(restaurant_id) {
      await axios
        .get(`http://localhost:3000/menue?restaurant_id=${restaurant_id}`)
        .then((a) => {
          if (a.data.length > 0 && a.status == 200) {
            console.log("find-getMenueArr");
            this.MenueArr = a.data;
          } else {
            console.log("not find-getMenueArr");
            this.MenueArr = {};
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // <<<<<---------------------< delet Menue  >---------------------------------->>>>

    async delet_Menue(menu_id, restaurant_id) {
      let recwst = await axios.delete(`http://localhost:3000/menue/${menu_id}`);
      console.log(recwst.status);
      if (recwst.status == 200) {
        console.log("delet restaurant");
        this.getMenueArr(restaurant_id);
      } else {
        console.log("no delet");
      }
    },
    // <<<<<---------------------< end Menue  >---------------------------------->>>>
    // <<<<<---------------------< start Menue  >---------------------------------->>>>
    async get_Items(menu_id) {
      this.dialog = false;
      await axios
        .get(`http://localhost:3000/item?menu_id=${menu_id}`)
        .then((a) => {
          if (a.data.length > 0 && a.status == 200) {
            console.log("find");
            this.ArrItems = a.data;
            console.log(this.ArrItems);
          } else {
            console.log("not find");
            this.ArrItems = [];
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // <<<<<---------------------< delet Menue  >---------------------------------->>>>

    async delet_Items(Item_id, menu_id) {
      let recwst = await axios.delete(`http://localhost:3000/item/${Item_id}`);
      console.log(recwst.status);
      if (recwst.status == 200) {
        console.log("delet restaurant");
        this.get_Items(menu_id);
      } else {
        console.log("no delet");
      }
    },
    // <<<<<---------------------< delet Menue  >---------------------------------->>>>
    // <<<<<---------------------< end Menue  >---------------------------------->>>>
  },
});
