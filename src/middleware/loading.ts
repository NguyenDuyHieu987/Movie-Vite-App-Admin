import { useAuthStore } from '@/stores';
import { loading } from '@/utils/loading';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

export const startLoadingApp = async (to, from, next) => {
  NProgress.configure({ showSpinner: false });
  NProgress.start();
  //   if (!window.existLoading) {
  //     loading.show();
  //     window.existLoading = true;
  //   }

  //   if (to.meta?.layout?.name != 'auth') {
  //     const authStore = useAuthStore();
  //     if (from.matched?.length == 0 && window.existLoading) {
  //       await authStore.loadUser();
  //     } else {
  //       if (!authStore.isLogin) next({ path: '/login' });
  //     }
  //   }

  next();
};

export const endLoadingApp = () => {
  //   if (window.existLoading) {
  //     loading.hide();
  //   }
  NProgress.done();
};
