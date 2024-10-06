<template>
  <div class="movie-table"></div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';

import axios from 'axios';

const tableDataMovie = ref([]);
const tableDataTV = ref([]);
const tableTabActive = ref('movie');

onBeforeMount(() => {
  // Promise.all([getMovies(1), getTv(1)])
  //   .then((movieResponse) => {
  //     tableDataMovie.value = movieResponse[0]?.data?.results;
  //     tableDataTV.value = movieResponse[1]?.data?.results;
  //   })
  //   .catch((e) => {
  //     if (axios.isCancel(e)) return;
  //   });
});
</script>

<style lang="scss" src="./DashBoardTable.scss"></style>
