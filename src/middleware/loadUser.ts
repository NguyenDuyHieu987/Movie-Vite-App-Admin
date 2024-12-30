import { useAuthStore } from '@/stores';
let isInitialLoad = true;

export const loadUser = (to, from, next) => {
  if (to.meta?.layout?.name != 'auth') {
    const authStore = useAuthStore();
    if (from.matched?.length == 0 && isInitialLoad) {
      authStore.loadUser();
      isInitialLoad = false;
    } else {
      if (!authStore.isLogin) next({ path: '/login' });
    }
  }

  next();
};
