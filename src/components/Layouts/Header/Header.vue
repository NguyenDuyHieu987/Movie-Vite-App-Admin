<template>
  <header
    class="header-bar"
    :class="{ scrolled: store.headerScrolled }"
  >
    <div class="header-bar-container">
      <div class="left-header">
        <div class="nav-tabs-view">
          <RouterLink
            v-for="(item, index) in store.tabsView"
            :key="index"
            :index="index"
            class="nav-tabs-view-item"
            :title="item.name"
            :class="{ active: item.route.path == route.fullPath }"
            :to="item.route.fullPath"
          >
            <span class="search-query">
              {{ item.name }}
            </span>
            <XCircle
              v-if="store.tabsView.length > 1"
              class="remove-icon"
              width="1.2rem"
              height="1.2rem"
              fill="currentColor"
              @click.prevent="store.removeTabview(item.route)"
            />
          </RouterLink>
        </div>
      </div>

      <div class="right-header">
        <div
          v-if="props.layout == 'default'"
          class="search-header-box"
        >
          <a-input-search
            v-model:value="valueInput"
            class="search-header"
            placeholder="Nhập nội dung muốn tìm kiếm..."
            size="large"
            allow-clear
            bordered
            :loading="false"
            @change="handleChangeInput(valueInput)"
            @search="handleSearch"
            @focus="handleFoucusSearchInput"
            @blur="handleBlurSearchInput"
          >
            <template #enterButton>
              <el-tooltip
                content="Tìm kiếm"
                effect="dark"
                placement="bottom"
                popper-class="popper-tooltip"
                :offset="22"
              >
                <MagnifyingGlass
                  class="fa-magnifying-glass"
                  width="1.8rem"
                  height="1.8rem"
                  fill="currentColor"
                />
              </el-tooltip>
            </template>
          </a-input-search>

          <!-- <SearchDropdown
          v-model:dataSearch="dataSearch"
          v-model:dataTopSearch="dataTopSearch"
          v-model:dataSearchHistory="dataSearchHistory"
          v-model:isShowSearchResults="isShowSearchResults"
          v-model:isFocusSearchInput="isFocusSearchInput"
          v-model:valueInput="valueInput"
          :loadingSearch="loadingSearch"
          :loadingTopSearch="loadingTopSearch"
        /> -->
        </div>
        <el-skeleton
          :loading="loadingUser"
          animated
        >
          <template #template>
            <el-skeleton-item
              v-for="(item, index) in 2"
              :key="index"
              :index="index"
              class="menu-item skeleton"
              variant="button"
            />
          </template>

          <template #default>
            <ul class="menu-header">
              <li class="menu-item search-mobile">
                <SearchMobile
                  v-model:valueInput="valueInput"
                  v-model:loading="loadingSearch"
                  @change="handleChangeInput(valueInput)"
                  @search="handleSearch"
                />
              </li>

              <li
                v-if="isLogin"
                class="menu-item notification"
                :show-timeout="0"
                :hide-timeout="0"
              >
                <Notification />
              </li>

              <li class="menu-item account">
                <DropdownAccount />
              </li>

              <!-- <li
                  v-else
                  class="menu-item login-header"
                >
                  <RouterLink to="/login">
                    <UserCircle
                      width="2.3rem"
                      height="2.3rem"
                      fill="currentColor"
                    />
                    <span> Đăng Nhập</span>
                  </RouterLink>
                </li> -->
            </ul>
          </template>
        </el-skeleton>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import XCircle from '@/assets/svgs/icons/x-circle.svg?component';
import MagnifyingGlass from '@/assets/svgs/icons/magnifying-glass.svg?component';
// import UserCircle from '@/assets/svgs/icons/user-circle.svg?component';

// import {
//   DropdownAccount,
//   Notification,
//   // SearchCard,
//   SearchDropdown,
//   SearchMobile
// } from '@/components/Layouts/Header';
// import DropdownAccount from '@/components/Layouts/Header/DropdownAccount/DropdownAccount.vue';
// import Notification from '@/components/Layouts/Header/Notification/Notification.vue';
// import SearchDropdown from '@/components/Layouts/Header/SearchDropdown/SearchDropdown.vue';
// import SearchMobile from '@/components/Layouts/Header/SearchMobile/SearchMobile.vue';
import { getImage } from '@/services/image';
import {
  getDaTaSearch,
  getDaTaSearchHistory,
  getDaTaSearchInHistory,
  getDaTaTopSearch
} from '@/services/search';
import { storeToRefs } from 'pinia';
import type { AppLayout } from '@/types';
import { useAuthStore, useStore } from '@/stores';
import { useRoute, useRouter } from 'vue-router';
import { onMounted, ref, watchEffect } from 'vue';

const props = withDefaults(
  defineProps<{ layout?: AppLayout; hideSearch?: boolean }>(),
  {
    layout: 'default',
    hideSearch: false
  }
);

const store = useStore();
const authStore = useAuthStore();
const { isLogin, loadingUser } = storeToRefs(authStore);
const router = useRouter();
const route = useRoute();
const dataSearch = ref<any[]>([]);
const dataTopSearch = ref<any[]>([]);
const dataSearchHistory = ref<any[]>([]);
const dataSearchInHistory = ref<any[]>([]);
const dataSearchInTopSearch = ref<any[]>([]);
const page = ref<number>(1);
const loadingSearch = ref<boolean>(false);
const loadingSearchHistory = ref<boolean>(false);
const loadingTopSearch = ref<boolean>(false);
const isShowSearchResults = ref<boolean>(false);
const isShowSearch = ref<boolean>(false);
const debounce = ref<any>();
const valueInput = ref<string>(route.query?.q as string);
const isFocusSearchInput = ref<boolean>(false);

const getData = async () => {
  // if (authStore.isLogin) {
  loadingSearchHistory.value = true;

  getDaTaSearchHistory(1, 10)
    .then((response) => {
      dataSearchHistory.value = response?.results;
      store.dataSearchHistory = response?.results;
    })
    .catch((e) => {})
    .finally(() => {
      loadingSearchHistory.value = false;
    });
  // }

  loadingTopSearch.value = true;

  getDaTaTopSearch(1, 10)
    .then((response) => {
      loadingTopSearch.value = response?.results;
    })
    .catch((e) => {})
    .finally(() => {
      loadingTopSearch.value = false;
    });
};

getData();

onMounted(() => {
  isShowSearch.value = true;

  let lastScrollTop = 0;

  window.addEventListener('scroll', () => {
    const st = window.scrollY || document.documentElement.scrollTop;

    if (st > lastScrollTop) {
      // downscroll code
      if (window.scrollY >= 65) {
        store.headerScrolled = true;
      } else if (window.scrollY == 0) {
        store.headerScrolled = false;
      }
    } else if (st < lastScrollTop) {
      // upscroll code
      if (window.scrollY == 0) {
        store.headerScrolled = false;
      }
    }

    lastScrollTop = st <= 0 ? 0 : st;
  });
});

watchEffect(() => {
  valueInput.value = route.query?.q as string;
});

const handleChangeInput = (query: string) => {
  if (query?.length > 0) {
    loadingSearch.value = true;

    clearTimeout(debounce.value);
    debounce.value = setTimeout(async () => {
      if (authStore.isLogin) {
        await getDaTaSearchInHistory(query, 1, 10)
          .then((response) => {
            dataSearchInHistory.value = response?.results;
          })
          .catch((e) => {})
          .finally(() => {});
      }

      getDaTaSearch(query, page.value, 10)
        .then((response) => {
          // dataSearch.value = response?.results;

          dataSearch.value = [
            ...dataSearchInHistory.value,
            ...response!.results
          ];

          if (
            dataSearch.value.length > 0 &&
            document.activeElement &&
            isFocusSearchInput.value == false
          ) {
            isFocusSearchInput.value = true;
          }
        })
        .catch((e) => {})
        .finally(() => {
          loadingSearch.value = false;
          isShowSearchResults.value = true;
        });

      // navigateTo(
      //   `/search?q=${query?.replaceAll(' ', '+')}`
      //   // query: { q: query?.replaceAll(' ', '+') },
      // );
    }, 50);
    // }, 700);
  } else {
    clearTimeout(debounce.value);

    // navigateTo({ path: '/' });

    dataSearch.value = [];
    isShowSearchResults.value = false;
  }
};

const handleSearch = (value: string) => {
  if (value.length > 0) {
    router.push(
      `/search?q=${value?.replaceAll(' ', '+')}`
      // query: { q: value?.replaceAll(' ', '+') },
    );

    // valueInput.value = '';
    isFocusSearchInput.value = false;
  }
};

const handleFoucusSearchInput = async (e: any) => {
  isFocusSearchInput.value = true;

  if (valueInput.value?.length > 0 && dataSearch.value.length == 0) {
    // loadingSearch.value = true;

    getDaTaSearch(valueInput.value, page.value, 10)
      .then((response) => {
        dataSearch.value = response.data?.results;
      })
      .catch((e) => {})
      .finally(() => {
        loadingSearch.value = false;
        isShowSearchResults.value = true;
      });
  }
};

const handleBlurSearchInput = (e: any) => {
  isFocusSearchInput.value = false;
};
</script>

<style lang="scss" src="./Header.scss"></style>
<!-- <style lang="scss">
@import url('./Header.scss');
</style> -->
