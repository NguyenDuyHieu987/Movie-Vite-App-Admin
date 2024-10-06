<template>
  <el-page-header @back="$router.go(-1)">
    <template #icon>
      <ArrowLeftOutlined />
    </template>
    <template #title>
      <p style="font-size: 1.6rem">Quay lại</p>
    </template>
    <div class="edit-tv">
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        label-position="top"
        status-icon
        :rules="rules"
        label-width="120px"
        class="edit-tv-info-form"
      >
        <h3 class="title">Thông tin phim</h3>
        <el-row :gutter="20">
          <el-col :span="12" :xs="{ span: 24 }">
            <el-row :gutter="20">
              <el-col :span="10" :xs="{ span: 12 }">
                <el-form-item label="Tên phim" prop="name">
                  <el-input
                    v-model="ruleForm.name"
                    type="text"
                    autocomplete="off"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="10" :xs="{ span: 12 }">
                <el-form-item label="Tên phim gốc" prop="original_name">
                  <el-input
                    v-model="ruleForm.original_name"
                    type="text"
                    autocomplete="off"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="10" :xs="{ span: 12 }">
                <el-form-item label="Thể loại" prop="genres">
                  <el-select
                    v-model="ruleForm.genres"
                    placeholder="Chọn thể loại"
                    style="width: 450px"
                    multiple
                    :clearable="true"
                  >
                    <el-option
                      v-for="(item, index) in genres"
                      :index="index"
                      :key="item?.id"
                      :value="item.id"
                      :label="item?.name_vietsub"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="10" :xs="{ span: 12 }">
                <el-form-item label="Quốc gia" prop="original_language">
                  <el-select
                    ref="select"
                    v-model="ruleForm.original_language"
                    placeholder="Chọn quốc gia"
                  >
                    <el-option
                      v-for="(item, index) in countries"
                      :index="index"
                      :key="item?.iso_639_1"
                      :value="item?.iso_639_1"
                      :label="item?.name"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="10" :xs="{ span: 12 }">
                <el-form-item label="Số lượng tập" prop="number_of_episodes">
                  <el-input-number
                    v-model="ruleForm.number_of_episodes"
                    :step="1"
                    step-strictly
                  />
                </el-form-item>
              </el-col>
              <el-col :span="10" :xs="{ span: 12 }">
                <el-form-item
                  label="Thời lượng trên tập (phút)"
                  prop="episode_run_time"
                >
                  <el-input-number
                    v-model="ruleForm.episode_run_time"
                    :step="1"
                    step-strictly
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>

          <el-col :span="12" :xs="{ span: 24 }">
            <el-row :gutter="20">
              <el-col :span="10" :xs="{ span: 12 }">
                <el-form-item label="Ngày phát hình" prop="first_air_date">
                  <el-date-picker
                    v-model="ruleForm.first_air_date"
                    type="date"
                    placeholder="Chọn ngày"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="10" :xs="{ span: 12 }">
                <el-form-item label="Ngày ra tập mới nhất" prop="last_air_date">
                  <el-date-picker
                    v-model="ruleForm.last_air_date"
                    type="date"
                    placeholder="Chọn ngày"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="24" :lg="{ span: 15 }">
                <el-form-item label="Nội dung" prop="overview">
                  <el-input
                    v-model="ruleForm.overview"
                    :autosize="{ minRows: 2, maxRows: 4 }"
                    type="textarea"
                    placeholder="Nhập nội dung phim"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="10" :xs="{ span: 12 }">
                <el-form-item label="Lượt xem" prop="views">
                  <a-input-number
                    v-model:value="ruleForm.views"
                    :min="0"
                    :step="1"
                    :formatter="
                      (value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    "
                    :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
                    style="width: 200px"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="10" :xs="{ span: 12 }">
                <el-form-item label="Trạng thái" prop="status">
                  <el-select
                    ref="select"
                    v-model="ruleForm.status"
                    placeholder="Chọn trạng thái"
                  >
                    <el-option value="Hoàn thành" label="Hoàn thành" />
                    <el-option
                      value="Đang tiến thành"
                      label="Đang tiến thành"
                    />
                    <el-option
                      value="Chưa hoàn thành"
                      label="Chưa hoàn thành"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>

        <el-form-item class="footer-form">
          <el-button @click="resetForm" type="danger" plain> Hủy </el-button>
          <el-button
            type="primary"
            @click="submitForm"
            :disabled="isDisabledBtnSubmit"
          >
            Cập nhật phim
          </el-button>
        </el-form-item>
      </el-form>

      <el-form
        ref="ruleFormRef"
        :model="ruleFormImg"
        label-position="top"
        status-icon
        :rules="rules"
        label-width="120px"
        class="edit-tv-image-form"
      >
        <h3 class="title">Đổi hình ảnh</h3>
        <el-row :gutter="20">
          <el-col :span="12" :xs="{ span: 24 }">
            <el-form-item class="image-form-item" label="Chọn Poster">
              <el-upload
                action="#"
                list-type="picture"
                :auto-upload="false"
                :on-change="handlePosterSuccess"
                :before-remove="handlePosterRemove"
                :limit="1"
                accept="image/jpeg"
              >
                <el-button :icon="UploadOutlined">Click để chọn ảnh</el-button>
              </el-upload>
            </el-form-item>

            <el-button
              type="primary"
              :disabled="ruleFormImg.poster == null"
              @click="handleChangePoster"
            >
              Đổi Poster
            </el-button>
          </el-col>
          <el-col :span="12" :xs="{ span: 24 }">
            <el-form-item class="image-form-item" label="Chọn Backdrop">
              <el-upload
                action="#"
                list-type="picture"
                :auto-upload="false"
                :on-change="handleBackdropSuccess"
                :before-remove="handleBackdropRemove"
                :limit="1"
                accept="image/jpeg"
              >
                <el-button :icon="UploadOutlined">Click để chọn ảnh</el-button>
              </el-upload>
            </el-form-item>

            <el-button
              type="primary"
              :disabled="ruleFormImg.backdrop == null"
              @click="handleChangeBackdrop"
            >
              Đổi Backdrop
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </el-page-header>
</template>
<script>
import { ArrowLeftOutlined, UploadOutlined } from '@ant-design/icons-vue';
// import { Plus } from '@element-plus/icons-vue';
import axios from 'axios';
import { onBeforeMount, reactive, ref, h, computed } from 'vue';
import { ElMessage } from 'element-plus';
import {
  getAllGenre,
  getAllNational,
  getAllYear,
  getTvById,
  editPoster,
  editBackdrop,
  editTvById,
} from '@/services/MovieService';
import { useRoute } from 'vue-router';
import { notification } from 'ant-design-vue';
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons-vue';

export default {
  components: { ArrowLeftOutlined },
  setup() {
    const route = useRoute();
    const dataMovie = ref([]);
    const genres = ref([]);
    const years = ref([]);
    const countries = ref([]);
    const ruleFormRef = ref({});
    const ruleForm = reactive({
      name: '',
      original_name: '',
      original_language: '',
      first_air_date: '',
      last_air_date: '',
      genres: [],
      overview: '',
      number_of_episodes: 0,
      episode_run_time: 60,
      views: 0,
      status: '',
    });
    const ruleFormImg = reactive({
      poster: null,
      backdrop: null,
    });

    const isDisabledBtnSubmit = computed(() => {
      return (
        ruleForm.name == dataMovie.value.name &&
        ruleForm.original_name == dataMovie.value.original_name &&
        ruleForm.original_language == dataMovie.value.original_language &&
        ruleForm.first_air_date == dataMovie.value.first_air_date &&
        ruleForm.last_air_date == dataMovie.value.last_air_date &&
        ruleForm.genres.toString() ==
          Array.from(dataMovie.value.genres, (item) => item.id).toString() &&
        ruleForm.overview == dataMovie.value.overview &&
        ruleForm.views == dataMovie.value.views &&
        ruleForm.number_of_episodes == dataMovie.value.number_of_episodes &&
        ruleForm.episode_run_time ==
          (Array.isArray(dataMovie.value.episode_run_time)
            ? dataMovie.value.episode_run_time[0] || 0
            : dataMovie.value.episode_run_time) &&
        ruleForm.status == dataMovie.value.status
      );
    });

    onBeforeMount(() => {
      Promise.all([getAllGenre(), getAllYear(), getAllNational()])
        .then((res) => {
          genres.value = res[0].data;
          years.value = res[1].data.sort(function (a, b) {
            return +b.name.slice(-4) - +a.name.slice(-4);
          });
          countries.value = res[2].data;
        })
        .catch((e) => {
          if (axios.isCancel(e)) return;
        });

      getTvById(route.params.id)
        .then((response) => {
          dataMovie.value = response.data;
          ruleForm.name = response.data.name;
          ruleForm.original_name = response.data.original_name;
          ruleForm.original_language = response.data.original_language;
          ruleForm.first_air_date = response.data.first_air_date;
          ruleForm.last_air_date = response.data.last_air_date;
          ruleForm.genres = Array.from(response.data.genres, (item) => item.id);
          ruleForm.overview = response.data.overview;
          ruleForm.views = response.data.views;
          ruleForm.number_of_episodes = response.data.number_of_episodes;
          ruleForm.episode_run_time = Array.isArray(
            response.data.episode_run_time
          )
            ? response.data.episode_run_time[0] || 0
            : response.data.episode_run_time;
          ruleForm.status = response.data.status;
        })
        .catch((e) => {
          if (axios.isCancel(e)) return;
        });
    });

    const handlePosterSuccess = (response) => {
      if (response.raw.type !== 'image/jpeg') {
        ElMessage.error('Image must be JPG format!');
        return false;
      } else if (response.raw.size / 1024 / 1024 > 2) {
        ElMessage.error('Image size can not exceed 2MB!');
        return false;
      }
      ruleFormImg.poster = response;
    };

    const handleBackdropSuccess = (response) => {
      if (response.raw.type !== 'image/jpeg') {
        ElMessage.error('Ảnh phải là kiểu JPG!');
        return false;
      } else if (response.raw.size / 1024 / 1024 > 2) {
        ElMessage.error('Ảnh không được vượt quá 2MB!');
        return false;
      }
      ruleFormImg.backdrop = response;
    };

    const handleUploadProgress = (response) => {
      if (response.raw.type !== 'image/jpeg') {
        ElMessage.error('Image must be JPG format!');
        return false;
      } else if (response.raw.size / 1024 / 1024 > 2) {
        ElMessage.error('Image size can not exceed 2MB!');
        return false;
      }
    };

    const handlePosterRemove = () => {
      ruleFormImg.poster = null;
    };
    const handleBackdropRemove = () => {
      ruleFormImg.backdrop = null;
    };

    const resetForm = () => {
      ruleForm.name = dataMovie.value.name;
      ruleForm.original_name = dataMovie.value.original_name;
      ruleForm.original_language = dataMovie.value.original_language;
      ruleForm.first_air_date = dataMovie.value.first_air_date;
      ruleForm.last_air_date = dataMovie.value.last_air_date;
      ruleForm.genres = Array.from(dataMovie.value.genres, (item) => item.id);
      ruleForm.overview = dataMovie.value.overview;
      ruleForm.views = dataMovie.value.views;
      ruleForm.number_of_episodes = dataMovie.value.number_of_episodes;
      ruleForm.episode_run_time = dataMovie.value.episode_run_time;
      ruleForm.status = dataMovie.value.status;
    };

    const submitForm = () => {
      const genresList = ruleForm.genres.map(
        (item) =>
          (item = {
            id: item,
            name: genres.value.find((item1) => item == item1.id).name,
          })
      );

      editTvById(route.params.id, ruleForm, genresList)
        .then((response) => {
          if (response.data?.success == true) {
            dataMovie.value = response.data.result;

            setTimeout(() => {
              notification.open({
                message: 'Thông báo',
                description: `Cập nhật phim thành công!`,
                icon: () =>
                  h(CheckCircleFilled, {
                    style: 'color: green',
                  }),
              });
            }, 500);
          } else {
            notification.open({
              message: 'Thông báo',
              description: `Cập nhật phim thất bại!`,
              icon: () =>
                h(CloseCircleFilled, {
                  style: 'color: red',
                }),
            });
          }
        })
        .catch((e) => {
          notification.open({
            message: 'Thông báo',
            description: `Cập nhật phim thất bại!`,
            icon: () =>
              h(CloseCircleFilled, {
                style: 'color: red',
              }),
          });
          if (axios.isCancel(e)) return;
        });
    };

    const handleChangePoster = () => {
      if (ruleFormImg.poster != null) {
        editPoster(dataMovie.value.poster_path, ruleFormImg.poster)
          .then((response) => {
            console.log(response.data);
            if (response.data.success == true) {
              notification.open({
                message: 'Thông báo',
                description: `Cập nhật Poster thành công!`,
                icon: () =>
                  h(CheckCircleFilled, {
                    style: 'color: green',
                  }),
              });
            } else {
              notification.open({
                message: 'Thông báo',
                description: `Cập nhật Poster thất bại!`,
                icon: () =>
                  h(CloseCircleFilled, {
                    style: 'color: red',
                  }),
              });
            }
          })
          .catch((e) => {
            if (axios.isCancel(e)) return;
          });
      }
    };

    const handleChangeBackdrop = () => {
      if (ruleFormImg.backdrop != null) {
        editBackdrop(dataMovie.value.backdrop_path, ruleFormImg.backdrop)
          .then((response) => {
            if (response.data.success == true) {
              notification.open({
                message: 'Thông báo',
                description: `Cập nhật Backdrop thành công!`,
                icon: () =>
                  h(CheckCircleFilled, {
                    style: 'color: green',
                  }),
              });
            } else {
              notification.open({
                message: 'Thông báo',
                description: `Cập nhật Backdrop thất bại!`,
                icon: () =>
                  h(CloseCircleFilled, {
                    style: 'color: red',
                  }),
              });
            }
          })
          .catch((e) => {
            if (axios.isCancel(e)) return;
          });
      }
    };

    return {
      dataMovie,
      UploadOutlined,
      isDisabledBtnSubmit,
      ruleFormRef,
      ruleFormImg,
      ruleForm,
      genres,
      years,
      countries,
      handlePosterSuccess,
      handleBackdropSuccess,
      handleUploadProgress,
      handlePosterRemove,
      handleBackdropRemove,
      handleChangePoster,
      handleChangeBackdrop,
      submitForm,
      resetForm,
    };
  },
};
</script>

<style scoped lang="scss" src="./EditTvView.scss"></style>
