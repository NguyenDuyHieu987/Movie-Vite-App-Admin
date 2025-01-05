import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createRouter } from './router';
import App from './App.vue';
import 'ant-design-vue/dist/reset.css';
import Antd from 'ant-design-vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import 'swiper/css';
import '@/assets/style/fonts/GoogleFonts.css';
import '@/assets/style/globalStyle/overwrite/antdv/antdv.scss';
import '@/assets/style/globalStyle/overwrite/element/element.scss';
import './main.scss';
import { loadUser } from './middleware/loadUser';
import { startLoadingApp, endLoadingApp } from './middleware/loading';

const router = createRouter();

router.beforeEach(loadUser);
router.beforeEach(startLoadingApp);
router.afterEach(endLoadingApp);

const app = createApp(App);

app.use(router).use(createPinia()).use(Antd).use(ElementPlus);

router.isReady().then(() => {
  app.mount('#app');
});
