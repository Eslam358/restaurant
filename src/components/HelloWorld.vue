<template></template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      name: "",
      title: "",
      age: "",
    };
  },
  methods: {
    oppen_location() {
      this.emitter.emit("location_fun");
    },
    async sent() {
      let recwst = await axios.post("http://localhost:3000/posts", {
        name: this.name,
        title: this.title,
        age: this.age,
      });
      console.log("hhhhhhhhhhhhh");
      console.log(recwst.status);
      if (recwst.status == 201) {
        console.log("good");
      } else {
        console.log("no no");
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
<!-- :rules="[
(value) => !!value || 'Required.',
(value) =>
  (value && value.length >= 3) || 'Min 3 characters',
]" -->

{ "name": "eslam", "id": 18, "email": "rrryyhhjj@ee.chww", "location": [ {
"name": "Canada", "restaurant": [ { "name": "restaurant_Canada_1", "type": [ {
"name": "brecfast", "mnue": [ { "name": "age", "price": 53 }, { "name":
"chease", "price": 40 }, { "name": "fool", "price": 30 } ] }, { "name": "denar",
"mnue": [ { "name": "denarage", "price": 153 }, { "name": "denarchease",
"price": 240 }, { "name": "denarfool", "price": 130 } ] }, { "name": "lanch",
"mnue": [ { "name": "lanchage", "price": 553 }, { "name": "lanchchease",
"price": 490 }, { "name": "lanchfool", "price": 308 } ] } ] }, { "name":
"restaurant_Canada_2", "type": [ { "name": "brecfast2", "mnue": [ { "name":
"age2", "price": 53 }, { "name": "chease2", "price": 40 }, { "name": "fool2",
"price": 30 } ] }, { "name": "denar2", "mnue": [ { "name": "denarage2", "price":
153 }, { "name": "denarchease2", "price": 240 }, { "name": "denarfool2",
"price": 130 } ] }, { "name": "lanch2", "mnue": [ { "name": "lanchage2",
"price": 553 }, { "name": "lanchchease2", "price": 490 }, { "name":
"lanchfool2", "price": 308 } ] } ] } ] }, { "name": "Australia", "restaurant": [
{ "name": "restaurant_Australia_1", "type": [ { "name": "brecfast", "mnue": [ {
"name": "age", "price": 53 }, { "name": "chease", "price": 40 }, { "name":
"fool", "price": 30 } ] }, { "name": "denar", "mnue": [ { "name": "denarage",
"price": 153 }, { "name": "denarchease", "price": 240 }, { "name": "denarfool",
"price": 130 } ] }, { "name": "lanch", "mnue": [ { "name": "lanchage", "price":
553 }, { "name": "lanchchease", "price": 490 }, { "name": "lanchfool", "price":
308 } ] } ] }, { "name": "restaurant_Australia_2", "type": [ { "name":
"brecfast2", "mnue": [ { "name": "age2", "price": 53 }, { "name": "chease2",
"price": 40 }, { "name": "fool2", "price": 30 } ] }, { "name": "denar2", "mnue":
[ { "name": "denarage2", "price": 153 }, { "name": "denarchease2", "price": 240
}, { "name": "denarfool2", "price": 130 } ] }, { "name": "lanch2", "mnue": [ {
"name": "lanchage2", "price": 553 }, { "name": "lanchchease2", "price": 490 }, {
"name": "lanchfool2", "price": 308 } ] } ] } ] } ] }
