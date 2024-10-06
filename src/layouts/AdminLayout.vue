<template>
  <a-layout>
    <Header />
    <a-layout :class="[$store.state.collapsed ? 'expand' : '', 'body-content']">
      <Sider />
      <a-layout>
        <BreadCrumb />
        <a-layout-content class="container">
          <slot />
        </a-layout-content>
        <Footer />
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<script>
import { ref } from 'vue';
import Header from '@/components/Admin/Header/Header.vue';
import Sider from '@/components/Admin/Sider/Sider.vue';
import Footer from '@/components/Admin/Footer/Footer.vue';
import BreadCrumb from '@/components/Admin/BreadCrumb/BreadCrumb.vue';

export default {
  components: {
    Header,
    Sider,
    BreadCrumb,
    Footer,
  },
  data() {
    return {
      selectedKeys1: ref(['2']),
      selectedKeys2: ref(['1']),
      collapsed: ref(false),
      openKeys: ref(['sub1']),
    };
  },
};
</script>
<style lang="scss" scoped>
.body-content {
  margin-left: var(--sider-width);
  min-height: calc(100vh - var(--header-height));
  margin-top: var(--header-height);
  transition: all 0.2s;
}

.body-content.expand {
  margin-left: var(--sider-collapsed-width);
}

.ant-layout-content.container {
  // min-height: calc(100vh - 130px);
  padding: 15px 20px;
  background-color: var(--background-admin-color);
}

@media (prefers-color-scheme: dark) {
  .ant-layout-content {
    // background-color: var(--background-content-color);
  }
}

@media only screen and (max-width: 900px) {
  .ant-layout-content.container {
    padding: 15px 15px;
  }
}
</style>
