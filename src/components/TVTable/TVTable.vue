<template>
  <div class="tv-table">
    <el-table
      v-loading="loading"
      element-loading-text="Đang tải dữ liệu..."
      :data="tableDataTV"
      style="width: 100%"
      table-layout="fixed"
      :border="true"
      height="80vh"
      :lazy="true"
      :fit="true"
    >
      <el-table-column
        fixed
        label="STT"
        :width="60"
        :min-width="60"
        type="index"
        header-align="center"
        align="center"
      />
      <el-table-column
        fixed
        prop="id"
        label="Id"
        :width="100"
      />
      <el-table-column
        prop="name"
        label="Tên phim"
      />
      <el-table-column
        prop="original_name"
        label="Tên phim gốc"
      />
      <el-table-column
        label="Quốc gia"
        prop="original_language"
      >
        <template #default="props">
          {{
            getLanguage(props.row?.original_language, $store.state.allCountries)
              ?.name
              ? getLanguage(
                  props.row?.original_language,
                  $store.state.allCountries
                )?.name
              : ''
          }}
        </template>
      </el-table-column>
      <el-table-column
        prop="first_air_date"
        label="Ngày phát hành"
      />
      <el-table-column
        prop="last_air_date"
        label="Ngày ra tập mới nhất"
      />

      <el-table-column
        prop="genres"
        label="Thể loại"
      >
        <template #default="props">
          {{ Array?.from(props.row?.genres, (x) => x.name).join(', ') }}
        </template>
      </el-table-column>
      <el-table-column
        label="Xem thêm"
        type="expand"
        :width="100"
        class="view-more"
      >
        <template #default="props">
          <p class="season">
            <strong>Phần: </strong
            >{{ 'Phần: ' + props.row?.last_episode_to_air?.season_number }}
          </p>
          <p class="overview">
            <strong>Nội dung: </strong>{{ props.row?.overview }}
          </p>
          <p class="vote_average">
            <strong>Điểm trung bình: </strong
            >{{ props.row?.vote_average.toFixed(2) }}
          </p>
          <p class="vote_count">
            <strong>Số lượt vote: </strong>{{ props.row?.vote_count }}
          </p>
          <p class="status">
            <strong>Trạng thái: </strong>{{ props.row?.status }}
          </p>
          <p class="episode_run_time">
            <strong>Thời lượng trên tập: </strong
            >{{
              Array.isArray(props.row?.episode_run_time)
                ? props.row?.episode_run_time[0] + ' Phút' || 0 + ' Phút'
                : props.row?.episode_run_time + ' Phút'
            }}
          </p>
          <p class="number_of_episodes">
            <strong>Số tập: </strong
            >{{ props.row?.number_of_episodes + ' Tập' }}
          </p>
          <p class="views">
            <strong>Lượt xem: </strong
            >{{ viewFormatter(props.row?.views) + ' lượt xem' }}
          </p>
          <p class="last_episode_to_air">
            <strong>Tập mới nhất: </strong
            >{{ 'Tập ' + props.row?.last_episode_to_air?.episode_number }}
          </p>
        </template>
      </el-table-column>
      <el-table-column
        prop="image"
        label="Ảnh"
        align="center"
      >
        <el-table-column
          prop="poster"
          label="Poster"
          :width="130"
          align="center"
        >
          <template #default="props">
            <div class="image-container">
              <el-image
                class="poster"
                :src="getPoster(props.row.poster_path)"
                :preview="false"
                loading="lazy"
              ></el-image>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="backdrop"
          label="Backdrop"
          :width="300"
          align="center"
        >
          <template #default="props">
            <div class="image-container">
              <el-image
                class="backdrop"
                :src="getBackdrop(props.row.backdrop_path)"
                :preview="false"
                loading="lazy"
              ></el-image>
            </div>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="Thao tác"
        align="center"
        :width="170"
      >
        <template #default="props">
          <el-dropdown trigger="click">
            <el-button type="primary">
              Các thao tác
              <el-icon class="el-icon--right">
                <ArrowDown />
              </el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <router-link
                    :to="{
                      name: 'edittv',
                      params: { id: props.row.id }
                    }"
                  >
                    <el-button link>Cập nhật phim</el-button>
                  </router-link>
                </el-dropdown-item>
                <el-dropdown-item>
                  <router-link
                    :to="{
                      name: 'edittv',
                      params: { id: props.row.id }
                    }"
                  >
                    <el-button link>Đổi ảnh</el-button>
                  </router-link>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button
                    link
                    type="danger"
                    >Xóa phim</el-button
                  >
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-button
      style="width: 100%"
      @click="$router.push({ name: 'addtv' })"
      size="large"
    >
      Thêm phim
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import {
  getTv,
  getLanguage,
  getPoster,
  getBackdrop
} from '@/services/MovieService';
import axios from 'axios';
import { ArrowDown } from '@element-plus/icons-vue';
import { viewFormatter } from '@/utils';

const tableDataTV = ref([]);
const tableTabActive = ref('movie');
const loading = ref(false);

onBeforeMount(() => {
  loading.value = true;

  getTv(1)
    .then((movieResponse) => {
      tableDataTV.value = movieResponse?.data?.results;
      setTimeout(() => {
        loading.value = false;
      }, 2000);
    })
    .catch((e) => {
      loading.value = false;

      if (axios.isCancel(e)) return;
    });
});
</script>

<style lang="scss" scoped src="./TVTable.scss"></style>
