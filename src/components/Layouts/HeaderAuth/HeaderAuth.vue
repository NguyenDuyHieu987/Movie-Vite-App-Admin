<template>
  <header class="header-bar-auth">
    <div class="left-header">
      <div class="logo">
        <RouterLink :to="{ path: '/' }">
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
    </div>

    <div class="right-header">
      <a
        class="main-page-btn click-active"
        :href="APP_URL"
        target="_blank"
      >
        Đi tới Trang chính
      </a>
    </div>
  </header>
</template>

<script setup lang="ts">
import { getImage } from '@/services/image';
import { useAuthStore } from '@/stores';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const authStore = useAuthStore();
const { isLogin } = storeToRefs(authStore);
const route = useRoute();
const APP_URL = ref<string>(import.meta.env.VITE_APP_URL);

onMounted(() => {});
</script>

<style lang="scss" src="./HeaderAuth.scss"></style>
<!-- <style lang="scss">
@import url('./HeaderAuth.scss');
</style> -->
