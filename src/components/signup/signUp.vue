<template>
  <v-card class="card-signup" style="width: 300px; height: 400px; margin: auto">
    <form
      onsubmit="av"
      class="form-signup"
      style="
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        height: 350px;
        box-shadow: 0px 0px 2px #333;
        border-radius: 5px;
        margin-bottom: 15px;
      "
    >
      <h2>sign up</h2>
      <v-card-text>
        <input type="text" v-model="state.name" placeholder="full name" />
        <p class="pa-0 mt-0" v-if="v$.name.$error">
          {{ v$.name.$errors[0].$message }}
        </p>
      </v-card-text>
      <v-card-text>
        <input
          type="email"
          v-model="state.email"
          name=""
          id=""
          placeholder="email"
          @change="test"
        />
        <p class="pa-0 mt-0" v-if="read && !v$.email.$error">
          this email is done
        </p>
        <p class="pa-0 mt-0" v-if="v$.email.$error">
          {{ v$.email.$errors[0].$message }}
        </p>
      </v-card-text>
      <v-card-text>
        <input
          type="password"
          v-model="state.pass"
          placeholder="password"
          name=""
          id=""
        />
        <p class="pa-0 mt-0" v-if="v$.pass.$error">
          {{ v$.pass.$errors[0].$message }}
        </p>
      </v-card-text>
      <v-card-text>
        <button @click="signin" type="button" value="">sent</button>
      </v-card-text>
    </form>
    <!-- <v-btn block color="blue" @click="fun((nor = 'signin'))">sign in</v-btn> -->
    <v-btn block color="blue" @click="nextRouter('signin')">sign in</v-btn>
  </v-card>
</template>

<script>
// import { mapActions } from "vuex";
// import useCounterSt from "@/stores/index";
import { useCounterStore } from "@/stores/index";
import { mapActions } from "pinia";
import axios from "axios";
import useVuelidate from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";
import { reactive, computed } from "vue";

export default {
  data() {
    return {
      read: false,
    };
  },
  setup() {
    const state = reactive({
      pass: "",
      email: "",
      name: "",
      read: false,
    });
    const rules = computed(() => {
      return {
        email: { required, email },
        pass: { required, minLength: minLength(6) },
        name: { required, minLength: minLength(6) },
      };
    });
    const v$ = useVuelidate(rules, state);
    return {
      state,
      v$,
    };
  },
  name: "signUp",
  methods: {
    // <<<<<---------------------< test  >---------------------------------->>>>
    async test() {
      this.read = false;
      await axios
        .get(`http://localhost:3000/users?email=${this.state.email}`)
        .then((a) => {
          if (a.data[0].email == this.state.email) this.read = true;
        })
        .catch(() => {
          // handle error
          // console.log(error);
        });
    },
    // <<<<<---------------------< test  >---------------------------------->>>>
    async sent() {
      let data = {
        name: this.state.name,
        pass: this.state.pass,
        email: this.state.email,
      };
      if (!this.read) {
        let recwst = await axios.post("http://localhost:3000/users", data);
        console.log(recwst.status);
        if (recwst.status == 201) {
          console.log("good");
          this.add_localstorge(data);
          this.nextRouter("home");
        } else {
          console.log("no no");
        }
      }
    },
    // <<<<<---------------------< signin  >---------------------------------->>>>
    signin() {
      console.log(this.state.pass);
      this.v$.$validate();
      if (!this.v$.$error) {
        console.log("validations");
        this.sent();
      } else {
        console.log("No  validations");
        console.log(!this.v$.$error);
      }
    },
    ...mapActions(useCounterStore, [
      "nextRouter",
      "add_localstorge",
      "add_restaurant",
    ]),
  },
  mounted() {
    if (localStorage.getItem("ueser-info")) {
      this.nextRouter("home");
    }
  },
};
</script>

<style>
.form-signup input {
  padding: 10px;
  /* background-color: aqua; */
  box-shadow: 0px 0px 3px #444;
  outline: none;
  border-radius: 5px;
  width: 250px;
}
.form-signup input[type="data"] {
  width: 215px;
}
.form-signup button {
  padding: 12px 52px;
  box-shadow: 0 0 5px;
  border-radius: 10px;
  background-color: #dcebeb1a;
}
.form-signup h2 {
  padding: 10px;
}
.card-signup p {
  font-size: 10px;
  color: rgb(226, 104, 104);
  position: absolute;
}
</style>
