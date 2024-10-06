<template>
  <!-- :disabled="!authStore.isOpenRequireAuthDialog"  -->
  <!-- <Teleport to="#append-to"> -->
  <div class="require-auth">
    <ClientOnly>
      <el-dialog
        v-model="authStore.isOpenRequireAuthDialog"
        class="require-auth-dialog"
        :width="600"
        align-center
        center
        append-to="#append-to"
        :show-close="false"
      >
        <template #header>
          <CloseBtn
            class="transparent"
            @click="authStore.isOpenRequireAuthDialog = false"
          />
        </template>

        <a-result
          title="Bạn cần đăng nhập để sử dụng chức năng này"
          status="403"
        >
        </a-result>

        <template #footer>
          <RouterLink
            :to="{ path: '/signup' }"
            @click="authStore.isOpenRequireAuthDialog = false"
          >
            <a-button
              type="text"
              size="large"
              class="default"
            >
              Đăng ký
            </a-button>
          </RouterLink>
          <RouterLink
            :to="{ path: '/login' }"
            @click="authStore.isOpenRequireAuthDialog = false"
          >
            <a-button
              type="text"
              size="large"
              class="gradient"
            >
              Đăng nhập
            </a-button>
          </RouterLink>
        </template>
      </el-dialog>
    </ClientOnly>

    <!-- v-model:visible="authStore.isOpenRequireAuthDialog" -->
    <!-- <a-modal
        class="require-auth-dialog"
        v-model:open="authStore.isOpenRequireAuthDialog"
        :width="600"
        centered
        :closable="true"
      >
        <template #closeIcon>
          <CloseBtn
            class="transparent"
            @click="authStore.isOpenRequireAuthDialog = false"
          />
        </template>
  
        <a-result title="Bạn cần đăng nhập để sử dụng chức năng này" status="403">
        </a-result>
  
        <template #footer>
          <RouterLink
            :to="{ path: '/signup' }"
            @click="authStore.isOpenRequireAuthDialog = false"
          >
            <a-button type="text" size="large" class="default">
              Đăng ký
            </a-button>
          </RouterLink>
          <RouterLink
            :to="{ path: '/login' }"
            @click="authStore.isOpenRequireAuthDialog = false"
          >
            <a-button type="text" size="large" class="default gradient">
              Đăng nhập
            </a-button>
          </RouterLink>
        </template>
      </a-modal> -->
  </div>
  <!-- </Teleport> -->
</template>

<script setup lang="ts">
// import { CloseBtn } from '@/components/Button';
import CloseBtn from '@/components/Button/CloseBtn/CloseBtn.vue';
import { useAuthStore } from '@/stores';

const authStore = useAuthStore();
</script>

<style lang="scss" src="./RequireAuthDialog.scss"></style>
<!-- <style lang="scss">
@import url('./RequireAuthDialog.scss');
</style> -->
