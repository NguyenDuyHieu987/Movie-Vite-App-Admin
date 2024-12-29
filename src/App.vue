<template>
  <a-app>
    <!-- <a-extract-style> -->
    <div class="app-wrapper">
      <div id="append-to" />
      <div id="preview-modal" />

      <a-config-provider
        :theme="{
          token: {
            // colorPrimary: '#008ddf',
            fontFamily:
              'Roboto, Noto Sans, Mulish, Source Sans 3, Plus Jakarta Sans, Nunito Sans, sans-serif'
            // fontSize: 15,
            // lineHeight: 1.5,
            // borderRadius: 2,
            // borderRadiusLG: 5
          }
        }"
      />

      <!-- <ClientOnly>
      <vue-progress-bar
        style="
          background: linear-gradient(
            90deg,
            var(--loading-progress-bar1),
            var(--loading-progress-bar2),
            var(--loading-progress-bar3)
          );
        "
      />
    </ClientOnly> -->

      <!-- <NuxtLoadingIndicator
      color="linear-gradient(90deg, var(--loading-progress-bar1), var(--loading-progress-bar2))"
      :height="3"
      :throttle="300"
      :duration="2000"
    /> -->

      <div
        v-show="route.meta.layout?.name != 'auth' && authStore.loadingUser"
        class="loading-initial-app"
      >
        <div class="loading-initial-app-container">
          <img
            src="/images/film-reel.png"
            alt=""
            width="48"
            height="48"
          />
          <div class="logo">
            <a
              class="animated"
              href="#"
            >
              Phimhay247
            </a>
          </div>
        </div>
      </div>

      <LoadingApp />
      <RequireAuthDialog />
      <NetworkChecker />

      <!-- :is="route.meta?.layout?.component" -->
      <!-- <KeepAlive :exclude="[]"> -->
      <component :is="route.meta?.layout?.component">
        <RouterView v-slot="{ Component }">
          <KeepAlive
            :max="10"
            :exclude="notCacheList"
          >
            <component :is="Component" />
          </KeepAlive>

          <el-backtop
            class="app-back-top click-active"
            :visibility-height="600"
            @click="onBackTop"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="2.5rem"
              height="2.5rem"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                d="m4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8l-8 8z"
              />
            </svg>
          </el-backtop>
        </RouterView>
      </component>
      <!-- </KeepAlive> -->
    </div>
    <!-- </a-extract-style> -->
  </a-app>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import { LoadingApp } from 'components/Loading';
import { RequireAuthDialog } from 'components/RequireAuth';
import { NetworkChecker } from 'components/NetworkChecker';
import { useAuthStore } from '@/stores';

// const runtimeConfig = useRuntimeConfig();

// useHead({
//   titleTemplate: (title) => {
//     return title
//       ? `${title} ${runtimeConfig.public.titleSeparator?.toString()} ${runtimeConfig.public.siteName?.toString()}`
//       : runtimeConfig.public.siteName;
//   }
// });

let notCacheList = ref<string[]>(['manage-tv-episodes']);

const authStore = useAuthStore();
const route = useRoute();

onMounted(() => {
  // window.history.scrollRestoration = 'auto';
  screen.orientation.addEventListener('change', () => {
    if (!route.meta?.zoomOut) {
      return;
    }

    const windowWidth: number = screen.availWidth;
    const windowHeight: number = screen.availHeight;

    const bodyStyle = document.body.style as any;

    if (windowWidth <= 1000) {
      const zoomLevel = windowWidth / windowHeight;

      bodyStyle.zoom = zoomLevel;
    } else {
      bodyStyle.zoom = 1;
    }
  });

  // window.addEventListener('orientationchange', (e: any) => {
  //   if (!route.meta?.zoomOut) {
  //     return;
  //   }

  //   const windowWidth: number = screen.availWidth;
  //   const windowHeight: number = screen.availHeight;

  //   const bodyStyle = document.body.style as any;

  //   if (windowWidth <= 1000) {
  //     const zoomLevel = windowWidth / windowHeight;

  //     bodyStyle.zoom = zoomLevel;
  //   } else {
  //     bodyStyle.zoom = 1;
  //   }
  // });

  // new ResizeObserver((entries) => {
  //   console.log(entries);
  //   for (const entry of entries) {
  //     console.log(
  //       'Kích thước đã thay đổi:',
  //       entry.target.clientWidth,
  //       entry.target.clientHeight
  //     );
  //   }
  // }).observe(document.body);
});

const onBackTop = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'instant'
  });
};
</script>

<style lang="scss" src="assets/style/app.scss"></style>
<!-- <style lang="scss">
@import url('assets/style/app.scss');
</style> -->
