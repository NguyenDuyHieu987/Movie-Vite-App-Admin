import { createRouter, createWebHistory } from 'vue-router';
// import { getWithExpiry } from '@/untils/LocalStorage';
import AdminLayout from '@/layouts/AdminLayout.vue';
import AuthLayout from '@/layouts/AuthLayout.vue';
import requireAdmin from '@/middleware/requireAdmin';

const routes = [
  // =============Admin==============
  {
    path: '/',
    name: 'dashboard',
    meta: {
      layout: { name: 'admin', component: AdminLayout },
      requiresAdmin: true,
      requiresAuth: true
    },
    component: () =>
      import(
        /* webpackChunkName: "dashboard" */ '../views/Admin/DashBoard/DashBoardView.vue'
      ),
    beforeEnter: (to, from, next) => {
      requireAdmin(to, from, next);
    }
  },
  {
    path: '/managefilm/movie',
    name: 'managemovie',
    meta: {
      layout: { name: 'admin', component: AdminLayout },
      requiresAdmin: true,
      requiresAuth: true
    },
    component: () =>
      import(
        /* webpackChunkName: "addmovie" */ '../views/Admin/ManageMovieView/ManageMovieView.vue'
      ),
    children: [],
    beforeEnter: (to, from, next) => {
      requireAdmin(to, from, next);
    }
  },
  {
    path: '/managefilm/movie/add',
    name: 'addmovie',
    meta: {
      layout: { name: 'admin', component: AdminLayout },
      requiresAdmin: true,
      requiresAuth: true
    },
    component: () =>
      import(
        /* webpackChunkName: "addmovie" */ '../views/Admin/AddMovieView/AddMovieView.vue'
      ),
    beforeEnter: (to, from, next) => {
      requireAdmin(to, from, next);
    }
  },
  {
    path: '/managefilm/movie/:id/edit',
    name: 'editmovie',
    meta: {
      layout: { name: 'admin', component: AdminLayout },
      requiresAdmin: true,
      requiresAuth: true
    },
    component: () =>
      import(
        /* webpackChunkName: "editmovie" */ '../views/Admin/EditMovieView/EditMovieView.vue'
      ),
    beforeEnter: (to, from, next) => {
      requireAdmin(to, from, next);
    }
  },
  {
    path: '/managefilm/tv',
    name: 'managetv',
    meta: {
      layout: { name: 'admin', component: AdminLayout },
      requiresAdmin: true,
      requiresAuth: true
    },
    component: () =>
      import(
        /* webpackChunkName: "addmovie" */ '../views/Admin/ManageTVView/ManageTVView.vue'
      ),
    beforeEnter: (to, from, next) => {
      requireAdmin(to, from, next);
    }
  },
  {
    path: '/managefilm/tv/add',
    name: 'addtv',
    meta: {
      layout: { name: 'admin', component: AdminLayout },
      requiresAdmin: true,
      requiresAuth: true
    },
    component: () =>
      import(
        /* webpackChunkName: "addmovie" */ '../views/Admin/AddTvView/AddTvView.vue'
      ),
    beforeEnter: (to, from, next) => {
      requireAdmin(to, from, next);
    }
  },
  {
    path: '/managefilm/tv/:id/edit',
    name: 'edittv',
    meta: {
      layout: { name: 'admin', component: AdminLayout },
      requiresAdmin: true,
      requiresAuth: true
    },
    component: () =>
      import(
        /* webpackChunkName: "editmovie" */ '../views/Admin/EditTvView/EditTvView.vue'
      ),
    beforeEnter: (to, from, next) => {
      requireAdmin(to, from, next);
    }
  },
  // =============Auth==============
  {
    path: '/login',
    name: 'login',
    meta: {
      layout: { name: 'auth', component: AuthLayout }
    },
    component: () =>
      import(
        /* webpackChunkName: "login" */ '../views/Admin/LoginView/LoginView.vue'
      )
  },
  {
    // path: "*",
    path: '/404',
    name: '404',
    meta: {
      layout: { name: 'default', component: AdminLayout }
    },
    component: () =>
      import(
        /* webpackChunkName: "NotFound" */ '../views/Admin/Error404View/Error404View.vue'
      )
  },
  {
    path: '/:catchAll(.*)',
    redirect: '404'
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

// router.beforeEach((to, from, next) => {
//   requireAdmin(to, from, next);
// });

export default router;
