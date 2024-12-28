import { createPinia } from 'pinia';
import { createRouter } from './router';
import 'ant-design-vue/dist/reset.css';
import Antd from 'ant-design-vue';
import ElementPlus from 'element-plus';
import VueProgressBar from '@aacassandra/vue3-progressbar';
import 'element-plus/dist/index.css';
import 'swiper/css';
import '@/assets/style/fonts/GoogleFonts.css';
import '@/assets/style/globalStyle/overwrite/antdv/antdv.scss';
import '@/assets/style/globalStyle/overwrite/element/element.scss';
import './main.scss';
import { createApp } from './mainSSR';
import { loadUser } from './middleware/loadUser';

const progressBarOptions = {
  color: 'var(--loading-progress-bar)',
  failedColor: 'red',
  thickness: '3px',
  transition: {
    speed: '0.2s',
    opacity: '0.6s',
    termination: 300
  },
  autoRevert: true,
  location: 'top',
  inverse: false
};

const router = createRouter();

router.beforeEach(loadUser);

const { app } = createApp();

app
  .use(router)
  .use(VueProgressBar, progressBarOptions)
  .use(createPinia())
  .use(Antd)
  .use(ElementPlus);

router.isReady().then(() => {
  app.mount('#app');
});
