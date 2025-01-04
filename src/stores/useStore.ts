import { computed, ref, watch } from 'vue';
import {
  useBreakpoints,
  useDark,
  useColorMode,
  useLocalStorage
} from '@vueuse/core';
import { defineStore } from 'pinia';

import type { country, genre, TabView, user, year } from '@/types';
import { APP, STORAGE } from '@/common';
import { useRoute, useRouter, type RouteLocationNormalized } from 'vue-router';

const breakpoints = useBreakpoints({
  desktop: APP.COLLAPSED_SIDEBAR_WIDTH
});

const appStorageStates = useLocalStorage(STORAGE.APP_STATES.KEY, {
  [STORAGE.APP_STATES.COLLAPSED_SIDEBAR]: false,
  [STORAGE.APP_STATES.URL_LOGIN_BACK]: '/'
});

export const useStore = defineStore('store', () => {
  // const { system, store } = useColorMode();

  // const currentColorMode = computed(() =>
  //   store.value === 'auto' ? system.value : store.value
  // );

  const isDark = useDark({
    selector: 'html',
    attribute: 'class',
    valueDark: 'dark',
    valueLight: 'light'
  });

  const router = useRouter();
  const route = useRoute();

  const collapsedDevice = breakpoints.smaller('desktop');

  const collapsed = ref<boolean>(collapsedDevice.value);
  const openSiderBarFixed = ref<boolean>(false);
  const headerScrolled = ref<boolean>(false);
  const openDrawer = ref<boolean>(false);
  const modalVisible = ref<boolean>(false);
  const breadCrumbValue = ref<string>('');
  const loadingApp = ref<boolean>(false);
  const loadingUser = ref<boolean>(true);
  const tabsView = ref<TabView[]>([]);
  const dataSearchHistory = ref<any[]>([]);
  const allGenres = ref<genre[]>([]);
  const allCountries = ref<country[]>([]);
  const allYears = ref<year[]>([]);
  const urlLoginBack = computed<string>(() =>
    appStorageStates.value[STORAGE.APP_STATES.URL_LOGIN_BACK].toString()
  );

  watch(collapsed, (newVal, oldVal) => {
    appStorageStates.value[STORAGE.APP_STATES.COLLAPSED_SIDEBAR] = newVal;

    if (oldVal) {
      openSiderBarFixed.value = false;
    } else {
      if (openSiderBarFixed.value == true) {
        openSiderBarFixed.value = false;
      }
    }
  });

  watch(
    () => route,
    () => {
      if (
        APP.PAGES_COLLAPSED_SIDEBAR.includes(route.meta.key as string) &&
        !collapsed.value
      ) {
        collapsed.value = true;
      }

      if (
        (!tabsView.value.some(
          (item) => item.route.fullPath == route.fullPath
        ) ||
          tabsView.value.length == 0) &&
        route.meta.name
      ) {
        const tabView = { ...route, matched: [], meta: { ...route.meta } };
        tabsView.value.push({
          name: route.meta.name_vietsub as string,
          route: tabView
        });
      }
    },
    { immediate: true, deep: true }
  );

  const removeTabview = (r: RouteLocationNormalized) => {
    if (tabsView.value.length == 1) return;

    tabsView.value.map((item, index) => {
      if (item.route.fullPath == r.fullPath) {
        const oldIndex = index;
        const oldCount = tabsView.value.length;
        tabsView.value.splice(index, 1);
        if (r.fullPath == route.fullPath) {
          if (oldIndex == oldCount - 1) {
            router.push({
              path: tabsView.value[index - 1].route.fullPath
            });
          } else {
            router.push({
              path: tabsView.value[index].route.fullPath
            });
          }
        }

        return;
      }
    });
  };

  const updateTabview = (fullPath: string, name: string) => {
    for (const item of tabsView.value) {
      if (item.route.fullPath == fullPath) {
        item.name = name;
        break;
      }
    }
  };

  const toogleSidebar = () => {
    collapsed.value = !collapsed.value;
  };

  const toogleDrawer = () => {
    openDrawer.value = !openDrawer.value;
  };

  const loadingAppInstance = {
    start: () => {
      loadingApp.value = true;
      document.body.classList.toggle('loading-mask');
    },
    finish: () => {
      loadingApp.value = false;
      document.body.classList.toggle('loading-mask');
    }
  };

  return {
    isDark,
    breadCrumbValue,
    collapsed,
    tabsView,
    openSiderBarFixed,
    headerScrolled,
    openDrawer,
    modalVisible,
    loadingApp,
    loadingUser,
    loadingAppInstance,
    dataSearchHistory,
    allGenres,
    allCountries,
    allYears,
    urlLoginBack,
    updateTabview,
    removeTabview,
    toogleSidebar,
    toogleDrawer
  };
});
