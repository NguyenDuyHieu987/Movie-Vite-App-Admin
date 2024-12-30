<template>
  <el-dropdown
    trigger="hover"
    popper-class="header account"
    placement="bottom-end"
    :show-timeout="0"
  >
    <span
      class="el-dropdown-link account"
      aria-label="dropdown-account"
    >
      <!-- class="el-icon--right" -->
      <!-- <el-icon>
        <UserOutlined
          class="user-outlined"
          width="1.5rem"
          height="1.5rem"
          fill="currentColor"
        />

        <Caret
          width="1.5rem"
          height="1.5rem"
          fill="currentColor"
        />
      </el-icon> -->

      <div class="user-avatar">
        <img
          v-if="isLogin"
          class="avatar"
          :src="getUserAvatar(userAccount?.avatar)"
          alt=""
          preload
        />
        <img
          v-else
          class="avatar"
          :src="getImage(`common_user_avatar.png`, 'user_avatar', { w: 50 })"
          alt=""
          preload
        />
      </div>
    </span>

    <template #dropdown>
      <el-dropdown-menu class="dropdown-account">
        <el-dropdown-item v-if="isLogin">
          <RouterLink
            class="your-account"
            to="/YourAccount"
          >
            <span class="account-username">Tài khoản</span>
            <br />
            <span class="account-email">
              {{ userAccount?.email }}
            </span>
          </RouterLink>
        </el-dropdown-item>

        <el-dropdown-item v-if="!isLogin">
          <RouterLink to="/login"> Đăng nhập</RouterLink>
        </el-dropdown-item>

        <el-dropdown-item
          v-else
          @click="handleLogout"
        >
          <span>Đăng xuất</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
// import Caret from '@/assets/svgs/icons/caret.svg?component';
// import UserOutlined from '@/assets/svgs/icons/user-outlined.svg?component';

import { getImage, getUserAvatar } from '@/services/image';
import { useAuthStore } from '@/stores';
import { useUtils } from '@/utils';
import { storeToRefs } from 'pinia';
import { process } from 'std-env';
import { ref } from 'vue';

const utils = useUtils();
const authStore = useAuthStore();
const { isLogin, userAccount, role } = storeToRefs(authStore);
const ADMIN_WEBSITE_URL = ref(import.meta.env.ADMIN_WEBSITE_URL);

const handleLogout = () => {
  authStore.logOut();
};
</script>

<style lang="scss" src="./DropdownAccount.scss"></style>
<!-- <style lang="scss">
@import url('./DropdownAccount.scss');
</style> -->
