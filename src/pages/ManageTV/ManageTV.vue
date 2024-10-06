<template>
  <div class="manage-movie-container">
    <div class="header-table">
      <h2>Quản lý phim: Phim bộ</h2>

      <el-tooltip
        effect="dark"
        content="Thêm phim"
        placement="right"
      >
        <RouterLink :to="{ path: '/addtv' }">
          <el-button
            type="primary"
            :icon="PlusOutlined"
            circle
            size="large"
          />
        </RouterLink>
      </el-tooltip>
    </div>
    <!-- <TVTable /> -->
  </div>
</template>

<script setup lang="ts">
import TVTable from '@/components/TVTable/TVTable.vue';
import { PlusOutlined } from '@ant-design/icons-vue';
</script>

<style lang="scss" src="./ManageTVPage.scss"></style>
