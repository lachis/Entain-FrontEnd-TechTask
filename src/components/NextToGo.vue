<script setup lang="ts">
import type { DropdownOption } from "@/shared/DropdownOption";
import type { RaceSummary } from "@/shared/RaceSummary";
import type { ResponseModel } from "@/shared/ResponseModel";
import axios from "axios";
import { ref, shallowRef, watch } from "vue";

const categories: DropdownOption[] = [
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

const selected = ref<DropdownOption>({
  name: "Greyhound Racing",
  id: "9daef0d7-bf3c-4f50-921d-8e818c60fe61",
});

const requestState = shallowRef<ResponseModel>({});
const selectedState = ref<RaceSummary[]>([]);

const instance = axios.create({
  baseURL: "https://api.neds.com.au/rest/v1/racing/?method=nextraces&count=20",
  timeout: 1000,
});

fetch();

watch(selected, (newVal: DropdownOption, oldVal: DropdownOption) => {
  if (newVal === oldVal) {
    return;
  }

  update(newVal);
});

watch(requestState, () => {
  update(selected.value);
});

// Used for triggering countdown updates
setInterval(() => {
  if (selectedState.value === undefined || selectedState.value === undefined)
    return;

  const newVal = selectedState.value.map((rs: RaceSummary) => {
    rs.countdownSeconds = updateCountdown(rs.advertised_start.seconds);
    return rs;
  });
  selectedState.value = newVal;
}, 1000);

// watcher for triggering new fetch when a record is -1.00 minute 
watch(selectedState, (newVal) => {
  const os = newVal.filter((rs) => {
    if (rs.countdownSeconds <= -60) {
      return false;
    }

    return true;
  });

  if (os.length < newVal.length) {
    fetch();
  }
});

// used for fetching data from API
function fetch() {
  instance.get("").then((response) => {
    const arr: ResponseModel = {};
    Object.values(response.data.data.race_summaries)
      .sort((a: any, b: any) => {
        return a.advertised_start.seconds > b.advertised_start.seconds ? 1 : 0;
      })
      .forEach((rs: any) => {
        if (!arr[rs.category_id]) {
          arr[rs.category_id] = [];
        }
        arr[rs.category_id].push(rs);
      });

    requestState.value = arr;
  });
}

// Fired by watchers to correctly populate selectedState
function update(option: DropdownOption) {
  let templateArray: any[] = [];

  templateArray = [];
  requestState.value[option.id].forEach((val: RaceSummary) => {
    if (templateArray.length === 5) {
      return;
    }

    if (val.advertised_start.seconds) {
      val.countdownSeconds = updateCountdown(val.advertised_start.seconds);
    }

    templateArray.push(val);
  });

  selectedState.value = templateArray;
}

// assists with populating the countdownSeconds property, ideally would exist on the RaceSummary object
function updateCountdown(seconds: number): number {
  const now = Math.floor(Date.now() / 1000);
  const countdown = seconds - now;
  return countdown;
}

// Assists with rendering the countdown in the template
function countdown(input: number): string {
  if (input < 0 && input > -10) {
    return `-0:0${Math.abs(input)}`;
  } else if (input < 0 && input <= -10) {
    return `-0:${Math.abs(input)}`;
  }

  const minutes = Math.floor(input / 60);
  const seconds = input - minutes * 60;

  let fmtSeconds = "";
  if (seconds < 10) {
    fmtSeconds = `0${seconds}`;
  } else {
    fmtSeconds = `${seconds}`;
  }

  return `${minutes}:${fmtSeconds}`;
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
        <th>Will begin in (Minutes)</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in selectedState">
        <td>
          {{ item.meeting_name }}
        </td>
        <td style="text-align: right">
          {{ item.race_number }}
        </td>
        <td style="text-align: right">
          {{ countdown(item.countdownSeconds) }}
        </td>
      </tr>
    </tbody>
  </table>
</template>
