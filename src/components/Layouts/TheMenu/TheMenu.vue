<template>
  <el-menu
    :collapse="openSiderBarFixed || props.noCollapse ? false : collapsed"
    :default-openeds="state.openKeys"
    :default-active="state.selectedKeys"
    class="menu-sider-bar"
    theme="dark"
    popper-effect="dark"
    background-color="transparent"
    text-color="var(--menu-text-color)"
    active-text-color="var(--menu-active-text-color)"
    :collapseTransition="false"
    :router="true"
    :unique-opened="true"
    :show-timeout="0"
    :hide-timeout="0"
  >
    <el-menu-item index="/">
      <el-icon> <HomeOutlined /></el-icon>

      <template #title>
        <RouterLink to="/">Trang chủ</RouterLink>
      </template>
    </el-menu-item>

    <el-menu-item index="/manage-broadcast">
      <el-icon>
        <BroadcastOnHome
          width="1.5rem"
          height="1.5rem"
          fill="currentColor"
        />
      </el-icon>

      <template #title>
        <RouterLink to="/manage-broadcast">Quản lý phát sóng</RouterLink>
      </template>
    </el-menu-item>

    <el-sub-menu
      index="/discover/movie"
      popperClass="sub-menu-popper"
    >
      <template #title>
        <el-icon>
          <VideoCamera
            width="1.5rem"
            height="1.5rem"
            fill="currentColor"
          />
        </el-icon>
        <span>Quản lý phim</span>
      </template>

      <el-menu-item index="/manage-movie">
        <!-- <el-icon>
          <VideoCamera
            width="1.5rem"
            height="1.5rem"
            fill="currentColor"
          />
        </el-icon> -->

        <template #title>
          <RouterLink to="/manage-movie">Phim lẻ</RouterLink>
        </template>
      </el-menu-item>

      <el-menu-item index="/manage-tv">
        <!-- <el-icon>
          <MovieReel
            width="1.5rem"
            height="1.5rem"
            fill="currentColor"
          />
        </el-icon> -->

        <template #title>
          <RouterLink to="/manage-tv">Phim bộ</RouterLink>
        </template>
      </el-menu-item>
    </el-sub-menu>

    <el-menu-item index="/manage-genre">
      <el-icon>
        <ListIcon
          width="1.5rem"
          height="1.5rem"
          fill="currentColor"
        />
      </el-icon>

      <template #title>
        <RouterLink to="/manage-genre">Quản lý thể loại</RouterLink>
      </template>
    </el-menu-item>

    <el-menu-item index="/manage-year">
      <el-icon>
        <CalendarDays
          width="1.5rem"
          height="1.5rem"
          fill="currentColor"
        />
      </el-icon>

      <template #title>
        <RouterLink to="/manage-year">Quản lý năm</RouterLink>
      </template>
    </el-menu-item>

    <el-menu-item index="/manage-country">
      <el-icon>
        <Globe
          width="1.5rem"
          height="1.5rem"
          fill="currentColor"
        />
      </el-icon>

      <template #title>
        <RouterLink to="/manage-country">Quản lý quốc gia</RouterLink>
      </template>
    </el-menu-item>

    <el-menu-item index="/manage-user">
      <el-icon>
        <UsersIcon
          width="1.5rem"
          height="1.5rem"
          fill="currentColor"
        />
      </el-icon>

      <template #title>
        <RouterLink to="/manage-user">Quản lý người dùng</RouterLink>
      </template>
    </el-menu-item>
  </el-menu>
</template>

<script setup lang="ts">
import { HomeOutlined } from '@ant-design/icons-vue';
import BroadcastOnHome from '@/assets/svgs/icons/broadcast-on-home.svg?component';
import VideoCamera from '@/assets/svgs/icons/video-camera.svg?component';
import UsersIcon from '@/assets/svgs/icons/users.svg?component';
import MovieReel from '@/assets/svgs/icons/movie-reel.svg?component';
import Light from '@/assets/svgs/icons/light.svg?component';
import ListIcon from '@/assets/svgs/icons/list.svg?component';
import CalendarDays from '@/assets/svgs/icons/calendar-days.svg?component';
import Globe from '@/assets/svgs/icons/globe.svg?component';
import ClockRotateLeft from '@/assets/svgs/icons/clock-rotate-left.svg?component';
import PlaylistPlay from '@/assets/svgs/icons/playlist-play.svg?component';
import RankingStar from '@/assets/svgs/icons/ranking-star.svg?component';
import VipPrivilege from '@/assets/svgs/icons/vip-privilege.svg?component';

import { storeToRefs } from 'pinia';

import type { country, genre, year } from '@/types';
import { getAllCountry } from '@/services/country';
import { getAllGenre } from '@/services/genres';
import { getAllYear } from '@/services/year';
import { useRoute } from 'vue-router';
import { useUtils } from '@/utils';
import { onBeforeMount, reactive, ref, watchEffect } from 'vue';
import { useStore } from '@/stores';

const props = defineProps<{
  noCollapse?: boolean | false;
}>();

const route = useRoute();
const utils = useUtils();
const store = useStore();
const { collapsed, openSiderBarFixed } = storeToRefs(store);

const state = reactive<{
  selectedKeys: string;
  openKeys: string[];
}>({
  selectedKeys: route.path,
  openKeys: [route.path]
});
const genres = ref<genre[]>([]);
const years = ref<year[]>([]);
const countries = ref<country[]>([]);

const getData = async () => {
  Promise.all([await getAllGenre(), await getAllYear(), await getAllCountry()])
    .then((response) => {
      genres.value = response[0]?.results;

      years.value = response[1]?.results.sort((a: year, b: year) => {
        return +b.name.slice(-4) - +a.name.slice(-4);
      });

      countries.value = response[2]?.results;

      store.allGenres = response[0]?.results;
      store.allYears = response[1]?.results.sort((a: year, b: year) => {
        return +b.name.slice(-4) - +a.name.slice(-4);
      });
      store.allCountries = response[2]?.results;
    })
    .catch((e) => {});
};

// getData();

if (store.allGenres?.length == 0) {
  getAllGenre().then((response) => {
    genres.value = response.results;
    store.allGenres = response.results;
  });
} else {
  genres.value = store.allGenres;
}

if (store.allYears?.length == 0) {
  getAllYear().then((response) => {
    const dataResponse = response.results.sort((a: year, b: year) => {
      return +b.name.slice(-4) - +a.name.slice(-4);
    });
    years.value = response.results;
    store.allYears = dataResponse;
  });
} else {
  years.value = store.allYears;
}

if (store.allCountries?.length == 0) {
  getAllCountry().then((response) => {
    countries.value = response.results;
    store.allCountries = response.results;
  });
} else {
  countries.value = store.allCountries;
}

watchEffect(() => {
  if (route.path) {
    state.selectedKeys = route.path;
    state.openKeys = [route.path];
  }
});
</script>

<style lang="scss" src="./TheMenu.scss"></style>
<!-- <style lang="scss">
@import url('./TheMenu.scss');
</style> -->
