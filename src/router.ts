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
      layout: { name: 'default', component: DefaultLayout }
    }
  },
  {
    name: 'manage-movie',
    path: '/manage-movie',
    component: () => import('./pages/ManageMovie/ManageMovie.vue'),
    meta: {
      name: 'manage-movie',
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
          layout: { name: 'default', component: DefaultLayout }
        }
      },
      {
        name: 'manage-tv-episodes',
        path: 'episodes/:id',
        component: () => import('./pages/ManageTV/ListEpisode/ListEpisode.vue'),
        meta: {
          name: 'manage-tv-episodes',
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
      layout: { name: 'default', component: DefaultLayout }
    }
  },
  {
    name: 'manage-year',
    path: '/manage-year',
    component: () => import('./pages/ManageGenre/ManageGenre.vue'),
    meta: {
      name: 'manage-year',
      layout: { name: 'default', component: DefaultLayout }
    }
  },
  {
    name: 'manage-country',
    path: '/manage-country',
    component: () => import('./pages/ManageGenre/ManageGenre.vue'),
    meta: {
      name: 'manage-country',
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
