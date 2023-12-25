<template>
  <v-card
    class="card-sign-in"
    style="width: 300px; height: 350px; margin: auto"
  >
    <form
      onsubmit="av"
      class="form-signup"
      style="
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        height: 300px;
        box-shadow: 0px 0px 2px #333;
        border-radius: 5px;
        margin-bottom: 15px;
      "
    >
      <h2>sign In</h2>
      <v-card-text>
        <input
          v-model="email"
          @change="test"
          type="email"
          name=""
          id=""
          placeholder="email"
        />
        <p class="pa-0 mt-0" v-if="v$.email.$error">
          {{ v$.email.$errors[0].$message }}
        </p>
        <p
          class="pa-0 mt-0"
          style="color: green"
          v-if="!v$.email.$error && find == 'find'"
        >
          this email is find
        </p>
        <p class="pa-0 mt-0" v-if="!v$.email.$error && find == 'unfind'">
          this email is unfind
        </p>
      </v-card-text>
      <v-card-text>
        <input
          v-model="pass"
          type="password"
          placeholder="password"
          name=""
          id=""
        />
        <p class="pa-0 mt-0" v-if="v$.pass.$error">
          {{ v$.pass.$errors[0].$message }}
        </p>
        <p class="pa-0 mt-0" v-if="!v$.pass.$error && findpass == 'rong'">
          this password is rong
        </p>
      </v-card-text>
      <v-card-text>
        <button @click="signup" type="button" value="">sent</button>
      </v-card-text>
    </form>
    <!-- <v-btn block color="blue" @click="fun((nor = 'signup'))">sign up</v-btn> -->
    <v-btn block color="blue" @click="nextRouter('signup')">sign up</v-btn>
  </v-card>
</template>

<script>
// import { mapActions } from "vuex";
// import useCounterSt from "@/stores/index";
import { useCounterStore } from "@/stores/index";
import { mapActions } from "pinia";
import axios from "axios";
import useVuelidate from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
export default {
  name: "signIn",
  data() {
    return {
      v$: useVuelidate(),
      // name: "",
      pass: "",
      email: "",
      find: "",
      findpass: "",
    };
  },
  validations() {
    return {
      // name: { required, minLength: minLength(8) },
      pass: { required },
      email: { required, email },
    };
  },
  methods: {
    async test() {
      this.find = "";
      await axios
        .get(`http://localhost:3000/users?email=${this.email}`)
        .then((a) => {
          if (a.data.length > 0 && a.status == 200) {
            this.find = "find";
          } else {
            this.find = "unfind";
          }
        })
        .catch(() => {
          // handle error
          // console.log(error);
        });
    },

    async sent() {
      await axios
        .get(
          `http://localhost:3000/users?email=${this.email}&pass=${this.pass}`
        )
        .then((a) => {
          if (a.data.length > 0 && a.status == 200) {
            console.log("this is good");
            this.add_localstorge(a.data[0]);
            this.nextRouter("home");
          } else {
            console.log("this is bad");
            if (this.find == "find") {
              this.findpass = "rong";
            }
          }
        })
        .catch((error) => {
          // handle error
          console.log(error);
        });
    },

    signup() {
      this.v$.$validate();
      if (!this.v$.$error) {
        console.log("validations");
        this.sent();
      } else {
        console.log("No  validations");
        console.log(!this.v$.$error);
      }
    },

    // ...mapActions(["fun"]),
    ...mapActions(useCounterStore, ["nextRouter", "add_localstorge"]),
  },
  mounted() {
    // localStorage.clear();
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
}
.form-signup input[type="date"] {
  width: 215px !important;
}
.form-signup button {
  margin: 10px;
  padding: 12px 52px;
  box-shadow: 0 0 5px;
  border-radius: 10px;
  background-color: #dcebeb1a;
}
.card-sign-in p {
  font-size: 10px;
  color: rgb(226, 104, 104);
  position: absolute;
}
.form-signup h2 {
  padding: 10px;
}
</style>
