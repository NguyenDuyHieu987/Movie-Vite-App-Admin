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
    path: '/',
    component: () => import('./pages/DashBoard/DashBoard.vue'),
    meta: {
      name: 'home',
      layout: { name: 'default', component: DefaultLayout }
    }
  },
  {
    path: '/manage-movie',
    component: () => import('./pages/ManageMovie/ManageMovie.vue'),
    meta: {
      name: 'manage-movie',
      layout: { name: 'default', component: DefaultLayout }
    }
  },
  {
    path: '/manage-tv',
    component: () => import('./pages/ManageTV/ManageTV.vue'),
    meta: {
      name: 'manage-tv',
      layout: { name: 'default', component: DefaultLayout }
    }
  },
  // {
  //   path: '/search',
  //   component: () => import('./pages/Search/Search.vue')
  // },
  {
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
