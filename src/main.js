import { createApp } from "vue";
import App from "./App.vue";
const app = createApp(App);
import router from "./router";
// import store from "./store";
import { createPinia } from "pinia";
const pinia = createPinia();
//mitt
import mitt from "mitt";
const emitter = mitt();

// Vuetify
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const vuetify = createVuetify({
  components,
  directives,
});

// app.config.globalProperties.emitter = emitter;
app
  .use(pinia)
  .provide("emitter", emitter)
  .use(vuetify)
  .use(router)
  .mount("#app");

// .provide("emitter", emitter)
