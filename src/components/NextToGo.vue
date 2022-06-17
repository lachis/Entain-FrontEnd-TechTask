<script setup lang="ts">
import axios from "axios";
import { ref, onMounted, watch } from "vue";
import { reactive } from "vue";
import type { NextToGoDataModel } from "@/shared/response.model";
const state = ref<NextToGoDataModel>({
    next_to_go_ids: [],
    race_summaries: {},
  },
);



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
  baseURL: "https://api.neds.com.au/rest/v1/racing/?method=nextraces&count=10",
  timeout: 1000,
});

instance
  .get("")
  .then((response) => {
    state.value.data = response.data.data;

    console.warn(response);
  })
  .catch((error) => {});

setInterval(() => {
  const d = state.value.data.race_summaries;
  state.value.data.race_summaries = {};
  state.value.data.race_summaries = d;
}, 1000);

function toDateTime(seconds: number): Date {
  const t = new Date(1970, 0, 1); // Epoch
  t.setSeconds(seconds);
  return t;
}

watch(selected, (newSelected) => {});

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
    <option v-for="option in categories" :value="option.id">
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
      <tr v-for="item in state.data.race_summaries">
        <td>
          {{ item.meeting_name }}
        </td>
        <td>
          {{ item.race_number }}
        </td>
        <td>{{ countdown(item.advertised_start.seconds) }} seconds</td>
      </tr>
    </tbody>
  </table>
</template>
