import {
  createMemoryHistory,
  createRouter as _createRouter,
  createWebHistory
} from 'vue-router';
import DefaultLayout from './layouts/default.vue';
import AuthLayout from './layouts/auth.vue';
import DashBoard from './pages/DashBoard/DashBoard.vue';

const routes = [
  {
    name: 'home',
    path: '/',
    component: () => import('./pages/DashBoard/DashBoard.vue'),
    meta: {
      name: 'home',
      name_vietsub: 'Trang chủ',
      layout: { name: 'default', component: DefaultLayout }
    }
  },
  {
    path: '/manage-mod',
    children: [
      {
        name: 'manage-mod',
        path: '',
        component: () => import('./pages/ManageMod/ManageMod.vue'),
        meta: {
          name: 'manage-mod',
          name_vietsub: 'Quản lý danh mục',
          layout: { name: 'default', component: DefaultLayout }
        }
      },
      {
        name: 'manage-modlist',
        path: '/manage-modlist',
        component: () =>
          import('./pages/ManageMod/ManageModList/ManageModList.vue'),
        meta: {
          name: 'manage-modlist',
          name_vietsub: 'Quản lý dữ liệu danh mục',
          layout: { name: 'default', component: DefaultLayout }
        }
      }
    ]
  },
  {
    name: 'manage-broadcast',
    path: '/manage-broadcast',
    component: () => import('./pages/ManageBroadcast/ManageBroadcast.vue'),
    meta: {
      name: 'manage-broadcast',
      name_vietsub: 'Quản lý phát sóng',
      layout: { name: 'default', component: DefaultLayout }
    }
  },
  {
    name: 'manage-movie',
    path: '/manage-movie',
    component: () => import('./pages/ManageMovie/ManageMovie.vue'),
    meta: {
      name: 'manage-movie',
      name_vietsub: 'Quản lý phim lẻ',
      layout: { name: 'default', component: DefaultLayout }
    }
  },
  {
    path: '/manage-tv',
    children: [
      {
        name: 'manage-tv',
        path: '',
        component: () => import('./pages/ManageTV/ManageTV.vue'),
        meta: {
          name: 'manage-tv',
          name_vietsub: 'Quản lý phim bộ',
          layout: { name: 'default', component: DefaultLayout }
        }
      },
      {
        name: 'manage-tv-episodes',
        path: 'episodes/:id',
        component: () => import('./pages/ManageTV/ListEpisode/ListEpisode.vue'),
        meta: {
          name: 'manage-tv-episodes',
          name_vietsub: 'Quản lý tập',
          layout: { name: 'default', component: DefaultLayout }
        }
      }
    ]
  },
  {
    name: 'manage-genre',
    path: '/manage-genre',
    component: () => import('./pages/ManageGenre/ManageGenre.vue'),
    meta: {
      name: 'manage-genre',
      name_vietsub: 'Quản lý thể loại',
      layout: { name: 'default', component: DefaultLayout }
    }
  },
  {
    name: 'manage-year',
    path: '/manage-year',
    component: () => import('./pages/ManageYear/ManageYear.vue'),
    meta: {
      name: 'manage-year',
      name_vietsub: 'Quản lý năm',
      layout: { name: 'default', component: DefaultLayout }
    }
  },
  {
    name: 'manage-country',
    path: '/manage-country',
    component: () => import('./pages/ManageCountry/ManageCountry.vue'),
    meta: {
      name: 'manage-country',
      name_vietsub: 'Quản lý quốc gia',
      layout: { name: 'default', component: DefaultLayout }
    }
  },
  {
    name: 'manage-user',
    path: '/manage-user',
    component: () => import('./pages/ManageUser/ManageUser.vue'),
    meta: {
      name: 'manage-user',
      name_vietsub: 'Quản lý người dùng',
      layout: { name: 'default', component: DefaultLayout }
    }
  },
  {
    name: 'login',
    path: '/login',
    component: () => import('./pages/Login/Login.vue'),
    meta: {
      layout: { name: 'auth', component: AuthLayout }
    }
  }
];

// const pages = import.meta.glob('./pages/*.vue')

// const routes = Object.keys(pages).map(filePath => {
//     const route = filePath.match(/\.\/pages(.*)\.vue$/)[1]

//     return {
//         path: route === '/index' ? '/' : route,
//         component: pages[filePath],
//     }
// })

export function createRouter() {
  return _createRouter({
    history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
    routes
  });
}
