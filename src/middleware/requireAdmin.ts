import { useAuthStore, useStore } from '@/stores';
import axios from 'axios';
import { h } from 'vue';
import { notification } from 'ant-design-vue';
import { CloseCircleFilled } from '@ant-design/icons-vue';

export default function requireAdmin(to, from, next) {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (store.state.isLogin) {
      if (to.matched.some((record) => record.meta.requiresAdmin)) {
        // if (store.state?.role == 'admin') {
        //   next();
        // } else {
        //   next({ path: '/404' });
        // }
        // getUserToken({
        //   user_token: getWithExpiry('userAccount')?.user_token,
        // })
        //   .then((accountResponse) => {
        //     if (accountResponse.data?.isLogin == true) {
        //       if (accountResponse.data.result?.role == 'admin') {
        //         store.state.isLogin = true;
        //         store.state.userAccount = accountResponse.data?.result;
        //         store.state.role = accountResponse?.data?.result?.role;
        //         next();
        //       } else {
        //         window.localStorage.removeItem('userAccount');
        //         window.localStorage.removeItem('userToken');
        //         window.localStorage.removeItem('remember');
        //         window.localStorage.removeItem('isLogin');
        //         store.state.userAccount = {};
        //         store.state.role = 'normal';
        //         store.state.isLogin = false;
        //         next({ path: '/404' });
        //       }
        //     } else {
        //       window.localStorage.removeItem('userAccount');
        //       window.localStorage.removeItem('userToken');
        //       window.localStorage.removeItem('remember');
        //       window.localStorage.removeItem('isLogin');
        //       store.state.userAccount = {};
        //       store.state.role = 'normal';
        //       store.state.isLogin = false;
        //       next({ path: '/login' });
        //     }
        //   })
        //   .catch((e) => {
        //     notification.open({
        //       message: 'Failed!',
        //       description: 'Some thing went wrong.',
        //       icon: () =>
        //         h(CloseCircleFilled, {
        //           style: 'color: red',
        //         }),
        //     });
        //     if (axios.isCancel(e)) return;
        //   });
      } else {
        next();
      }
    } else {
      next({ path: '/login' });
    }
  } else {
    next();
  }
}
