RaceSummaryRaceSummaries<script setup lang="ts">
import axios from "axios";
import { ref, onMounted, watch, watchEffect, shallowRef } from "vue";
import { reactive } from "vue";
import type { RaceSummary, ResponseModel, ResponseModel2 } from "@/shared/response.model";
const state = shallowRef<ResponseModel>({ });

const state2 = shallowRef<ResponseModel2>({ });

const selectedState =  shallowRef<ResponseModel>({});

// reactive state
const categories = [
  {
    name: "Greyhound Racing",
    id: "9daef0d7-bf3c-4f50-921d-8e818c60fe61",
  },
  {
    name: "Harness Racing",
    id: "161d9be2-e909-4326-8c2c-35ed71fb460b",
  },
  {
    name: "Horse Racing",
    id: "4a2788f8-e825-4d36-9894-efd4baf1cfae",
  },
];

const selected = ref({
  name: "Greyhound Racing",
  id: "9daef0d7-bf3c-4f50-921d-8e818c60fe61",
});

const instance = axios.create({
  baseURL: "https://api.neds.com.au/rest/v1/racing/?method=nextraces&count=20",
  timeout: 1000,
});

instance
  .get("")
  .then((response) => {
    state.value = response.data.data.race_summaries;
    // console.warn(state.value);
    const arr: ResponseModel2 = { };
    Object
    .values(response.data.data.race_summaries)
    .forEach((rs: any) => {
        if (!arr[rs.category_id]) {
          arr[rs.category_id] = [];
        }
        arr[rs.category_id].push(rs);
    });

    state2.value = arr;


    // console.warn(arr);

    // console.warn(state.value);
// state2 = response.data.data.race_summaries;
    // console.warn(response);

  })
  .catch((error) => {});

setInterval(() => {
  const d = state.value;
  state.value =  {};
  state.value= d;
}, 1000);


function toDateTime(seconds: number): Date {
  const t = new Date(1970, 0, 1); // Epoch
  t.setSeconds(seconds);
  return t;
}

watch(selected, (newSelected) => {

})

// watchEffect(() => {
//   const newSelected = selected.value;
//   const filterState = state2;
//   console.warn(filterState);
//   // const newSelectedState = filterState.filter((f, i) => {
//   //   return f.category_id === newSelected.id;
//   // });
//   // state.value = newSelectedState;
// })



function countdown(input: number): string {
  const now = Math.floor(Date.now() / 1000);
  const time = input - now;
  const minutes = Math.floor(time / 60);
  const seconds = time - minutes * 60;

  return `${minutes}:${seconds}`;
}
</script>

<template>
  <select v-model="selected">
    <option v-for="option in categories" :value="option">
      {{ option.name }}
    </option>
  </select>

  <table>
    <thead>
      <tr>
        <th>Meeting Name</th>
        <th>Race Number</th>
        <th>Will begin in...</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="item in state"> 
      <tr v-if="item.category_id === selected.id">
        <td>
          {{ item.meeting_name }}
        </td>
        <td>
          {{ item.race_number }}
        </td>
        <td>{{ countdown(item.advertised_start.seconds) }} seconds</td>
      </tr>
      </template>
    </tbody>
  </table>
</template>
