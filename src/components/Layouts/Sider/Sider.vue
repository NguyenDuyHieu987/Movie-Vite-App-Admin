<template>
  <a-layout-sider
    v-model:collapsed="collapsed"
    width="var(--sider-width)"
    collapsed-width="var(--sider-collapsed-width)"
    class="sider-bar"
    :class="{ 'open-fixed': openSiderBarFixed, scrolled: siderScrolled }"
    collapsible
    :default-collapsed="true"
    @collapse="handleCollapse"
  >
    <header class="sider-header">
      <div class="logo-header">
        <div
          v-if="!collapsed"
          class="logo"
        >
          <RouterLink to="/">
            <img
              :src="getImage('logo.png', 'logo', { w: 45 })"
              alt=""
              :height="30"
              :width="30"
              preload
            />
            <span> PhimHay247</span>
          </RouterLink>
        </div>

        <button
          class="menu-btn click-active"
          :class="{
            show: true
          }"
          @click="store.toogleSidebar()"
        >
          <MenuUnfoldLeft
            v-if="!collapsed"
            width="2rem"
            height="2rem"
          />
          <MenuUnfoldRight
            v-else
            width="2rem"
            height="2rem"
          />
        </button>
      </div>

      <div
        v-if="isLogin"
        class="user-header"
      >
        <div
          v-if="!collapsed || openSiderBarFixed"
          class="avatar-box"
        >
          <img
            class="avatar"
            :src="getUserAvatar(userAccount?.avatar)"
            loading="lazy"
            alt=""
            preload
          />
        </div>

        <div>
          <h4 v-if="!collapsed || openSiderBarFixed">
            {{ userAccount?.username }}
          </h4>

          <el-tooltip
            v-else
            :title="userAccount?.username"
            :content="userAccount?.username"
            popper-class="popper-tooltip"
            placement="right"
          >
            <div class="user-name-short">
              <h4>
                {{ userAccount?.username?.slice(0, 2).toUpperCase() }}
              </h4>
            </div>
          </el-tooltip>
        </div>
      </div>
    </header>

    <TheMenu />

    <template #trigger>
      <footer
        :title="collapsed ? 'Mở sidebar' : 'Đóng sidebar'"
        class="sider-footer click-active"
      >
        <div :class="['trigger-collapse', { collapsed: collapsed }]">
          <ChevronRightDouble
            v-if="collapsed"
            width="2rem"
            height="2rem"
            fill="currentColor"
          />

          <ChevronLeftDouble
            v-else
            width="2rem"
            height="2rem"
            fill="currentColor"
          />

          <span
            v-if="collapsed && openSiderBarFixed"
            class="title-trigger-collapse open"
          >
            Mở
          </span>
          <span
            v-else-if="!collapsed"
            class="title-trigger-collapse collapsed"
          >
            Đóng
          </span>
        </div>
      </footer>
    </template>
  </a-layout-sider>
</template>

<script setup lang="ts">
import { MenuOutlined } from '@ant-design/icons-vue';
import MenuUnfoldLeft from '@/assets/svgs/icons/menu-unfold-left-fill.svg?component';
import MenuUnfoldRight from '@/assets/svgs/icons/menu-unfold-right-fill.svg?component';
import ChevronLeftDouble from '@/assets/svgs/icons/chevron-left-double.svg?component';
import ChevronRightDouble from '@/assets/svgs/icons/chevron-right-double.svg?component';

// import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons-vue';
import { TheMenu } from '@/components/Layouts';
// import TheMenu from '@/components/Layouts/TheMenu/TheMenu.vue';
import { getImage, getUserAvatar } from '@/services/image';
import { storeToRefs } from 'pinia';
import { useLocalStorage } from '@vueuse/core';
import { useAuthStore, useStore } from '@/stores';
import { useRoute, useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import { APP, STORAGE } from '@/common';

const store = useStore();
const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const { collapsed, openSiderBarFixed } = storeToRefs(store);
const { isLogin, userAccount } = storeToRefs(authStore);
const siderScrolled = ref<boolean>(false);
// const isCollapsed = computed<boolean>(
//   () =>
//     collapsed.value ||
//     APP.PAGES_COLLAPSED_SIDEBAR.includes(route.meta.key as string)
// );

const appStorageStates = useLocalStorage(STORAGE.APP_STATES.KEY, {
  [STORAGE.APP_STATES.COLLAPSED_SIDEBAR]: false
});

onMounted(() => {});

router.afterEach((to: any, from: any, next: any) => {
  if (
    APP.PAGES_COLLAPSED_SIDEBAR.includes(to.meta.key as string) &&
    !store.collapsed
  ) {
    store.collapsed = true;
  }
  // next();
});

const handleCollapse = () => {
  // if (store.collapsed == true) {
  //   store.collapsed = false;
  //   store.openSiderBarFixed = false;
  // } else {
  //   store.collapsed = true;
  //   store.openSiderBarFixed = false;
  // }
};
</script>

<style lang="scss" src="./Sider.scss"></style>
<!-- <style lang="scss">
@import url('./Sider.scss');
</style> -->
