import { useAuthStore } from '@/stores';
// let isInitialLoad = true;

const authStore = useAuthStore();

export const loadUser = async (to, from, next) => {
  if (to.meta?.layout?.name != 'auth' && from.meta?.layout?.name != 'auth') {
    if (from.matched?.length == 0 && !window.initialLoad) {
      authStore.loadUser();
      window.initialLoad = true;
    } else {
      if (!authStore.isLogin) next({ path: '/login' });
    }
  }

  next();
};
