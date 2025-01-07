<template>
  <div class="login">
    <div class="login-container">
      <div class="login-form-container">
        <a-form
          :model="formLogin"
          name="login-form"
          class="login-form"
          hideRequiredMark
          @finish="handleLogin"
        >
          <h1 class="title-login gradient-title-default">
            <span> Đăng nhập </span>
          </h1>

          <a-form-item
            label="Tài khoản"
            name="username"
            :rules="[
              {
                required: true,
                message: 'Vui lòng nhập email!',
                trigger: ['change', 'blur']
              },
              {
                message:
                  'Vui lòng nhập đúng định dạng email (vd: ...@gmail.com)!',
                pattern: new RegExp(
                  /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
                ),
                trigger: ['change', 'blur']
              }
            ]"
          >
            <a-input
              v-model:value="formLogin.username"
              placeholder="Email..."
            >
              <template #prefix>
                <UserOutlined />
              </template>
            </a-input>
          </a-form-item>

          <a-form-item
            label="Mật khẩu"
            name="password"
            :rules="[
              {
                required: true,
                message: 'Vui lòng nhập mật khẩu!',
                trigger: ['change', 'blur']
              }
              // {
              //   message: 'Mật khẩu phải có ít nhất 6 ký tụ!',
              //   min: 6,
              //   trigger: ['change', 'blur'],
              // },
            ]"
            has-feedback
          >
            <a-input-password
              v-model:value="formLogin.password"
              placeholder="Mật khẩu..."
            >
              <template #prefix>
                <LockOutlined />
              </template>
            </a-input-password>
          </a-form-item>

          <a-form-item
            class="remember-me"
            name="remember-me"
          >
            <a-checkbox v-model:checked="formLogin.rememberMe">
              Ghi nhớ tôi
            </a-checkbox>
            <RouterLink
              class="forgot-password-btn click-active"
              to="/ForgotPassword"
            >
              Quên mật khẩu?
            </RouterLink>
          </a-form-item>

          <a-form-item
            class="submit"
            name="submit"
          >
            <a-button
              class="login-form-button"
              html-type="submit"
              size="large"
              :loading="loadingLogin"
              :disabled="disabled"
            >
              Đăng nhập
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import FacebookIcon from '@/assets/svgs/icons/facebook.svg?component';
import GoogleIcon from '@/assets/svgs/icons/google.svg?component';

import { LockOutlined, UserOutlined } from '@ant-design/icons-vue';
import { useLocalStorage } from '@vueuse/core';
import { ElNotification } from 'element-plus';

import { LogIn, loginFacebook, loginGoogle } from '@/services/authentication';
import { useStore, useAuthStore } from '@/stores';
import { useUtils } from '@/utils';
import { useRoute, useRouter } from 'vue-router';
import { computed, onBeforeMount, onMounted, reactive, ref } from 'vue';
import { MESSAGE, STORAGE, TOKEN } from '@/common';

// definePageMeta({
//   layout: 'auth',
//   pageTransition: {
//     name: 'slide-top',
//     appear: true
//   }
// });

const store = useStore();
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const utils = useUtils();
const loadingLogin = ref<boolean>(false);
const loadingFacebookLogin = ref<boolean>(false);
const loadingGoogleLogin = ref<boolean>(false);
const formLogin = reactive<any>({
  username: '',
  password: '',
  rememberMe: true
});
const tokenClient = ref<any>();
const disabled = computed<boolean>((): boolean => {
  return !(utils.isEmailValid(formLogin.username) && formLogin.password);
});
const appStorageStates = useLocalStorage(STORAGE.APP_STATES.KEY, {
  [STORAGE.APP_STATES.URL_LOGIN_BACK]: '/'
});

const reset = () => {
  formLogin.username = '';
  formLogin.password = '';
  formLogin.rememberMe = false;
};

onBeforeMount(() => {
  appStorageStates.value[STORAGE.APP_STATES.URL_LOGIN_BACK] = router.options
    .history.state?.back
    ? ['/signup'].some((item) =>
        router.options.history.state?.back.toLowerCase().startsWith(item)
      )
      ? '/'
      : router.options.history.state.back
    : '/';
});

onMounted(async () => {});

const handleLogin = () => {
  if (loadingLogin.value) return;

  loadingLogin.value = true;

  LogIn({
    email: formLogin.username,
    // password: utils.encryptPassword(formLogin.password),
    password: formLogin.password
  })
    .then((response) => {
      if (response?.isLogin == true) {
        if (response?.result.role != 'admin') {
          ElNotification.error({
            title: MESSAGE.STATUS.FAILED,
            message: 'Tài khoản của bạn không có quyền để đăng nhâp.',
            duration: MESSAGE.DURATION.DEFAULT
          });
          return;
        }

        authStore.userAccount = response?.result;

        if (response?.subscription) {
          authStore.subscription = response.subscription;
        }

        utils.localStorage.setWithExpiry(
          TOKEN.NAME.USER_TOKEN,
          response.headers.get('Authorization'),
          TOKEN.OFFSET.USER_TOKEN
        );

        // navigateTo({ path: '/' });

        router.push({ path: store.urlLoginBack });

        reset();
      } else if (response?.isNotExist == true) {
        ElNotification.error({
          title: MESSAGE.STATUS.FAILED,
          message: 'Tài khoản không tồi tại.',
          duration: MESSAGE.DURATION.DEFAULT
        });
      } else if (response?.isWrongPassword == true) {
        ElNotification.error({
          title: MESSAGE.STATUS.FAILED,
          message: 'Sai tài khoản hoặc mật khẩu.',
          duration: MESSAGE.DURATION.DEFAULT
        });
      }
    })
    .catch((e) => {
      ElNotification.error({
        title: MESSAGE.STATUS.BROKE,
        message: MESSAGE.STATUS.BROKE_MESSAGE,
        duration: MESSAGE.DURATION.DEFAULT
      });
    })
    .finally(() => {
      loadingLogin.value = false;
    });
};
</script>

<style lang="scss" src="./LoginPage.scss"></style>
<!-- <style lang="scss">
@import url('./LoginPage.scss');
</style> -->
