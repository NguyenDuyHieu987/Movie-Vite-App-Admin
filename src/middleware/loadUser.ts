import { useAuthStore } from '@/stores';

export const loadUser = (to, from, next) => {
  if (to.meta?.layout?.name != 'auth') {
    const authStore = useAuthStore();

    if (from.matched?.length == 0) {
      authStore.loadUser();
    } else {
      if (!authStore.isLogin) next({ path: '/login' });
    }
  }

  next();
};
