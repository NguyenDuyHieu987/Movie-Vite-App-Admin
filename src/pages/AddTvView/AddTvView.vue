<template>
  <el-page-header @back="$router.go(-1)">
    <template #icon>
      <ArrowLeftOutlined />
    </template>
    <template #title>
      <p style="font-size: 1.6rem">Quay lại</p>
    </template>
    <div class="add-tv">
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        label-position="top"
        status-icon
        :rules="rules"
        label-width="120px"
        class="add-tv-form"
      >
        <el-row :gutter="20">
          <el-col :span="12" :xs="{ span: 24 }">
            <el-form-item label="Id: " prop="id" label-position="top">
              <span>{{ ruleForm.id }}</span>
              <el-button
                style="margin-left: 20px"
                type="plain"
                @click="ruleForm.id = nanoid()"
              >
                Tạo Id
              </el-button>
            </el-form-item>
            <el-row :gutter="20">
              <el-col :span="10" :xs="{ span: 12 }">
                <el-form-item label="Tên phim" prop="name">
                  <el-input
                    v-model="ruleForm.name"
                    type="text"
                    autocomplete="off"
                    placeholder="Tên phim"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="10" :xs="{ span: 12 }">
                <el-form-item label="Tên phim gốc" prop="original_name">
                  <el-input
                    v-model="ruleForm.original_name"
                    type="text"
                    autocomplete="off"
                    placeholder="Tên phim gốc"
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
          </el-col>
        </el-row>
        <el-form-item class="footer-form">
          <el-button @click="resetForm" type="danger" plain> Hủy </el-button>
          <el-button
            type="primary"
            @click="submitForm"
            :disabled="isDisabledBtnSubmit"
          >
            Thêm phim
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-page-header>
</template>

<script>
import { ArrowLeftOutlined, UploadOutlined } from '@ant-design/icons-vue';
// import { Plus } from '@element-plus/icons-vue';
import axios from 'axios';
import { onBeforeMount, reactive, ref, computed, h } from 'vue';
import { ElMessage } from 'element-plus';
import {
  getAllGenre,
  getAllNational,
  getAllYear,
  addPoster,
  addBackdrop,
  addTv,
} from '@/services/MovieService';
import { notification } from 'ant-design-vue';
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons-vue';
// import { v4 as uuidv4 } from 'uuid';
// const customId = require('custom-id');
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('1234567890', 6);

export default {
  components: { ArrowLeftOutlined },
  setup() {
    const genres = ref([]);
    const years = ref([]);
    const countries = ref([]);
    const ruleFormRef = ref({});
    const ruleForm = reactive({
      // id: customId({ name: '01234', email: '56789', randomLength: 2 }),
      id: nanoid(),
      name: '',
      original_name: '',
      original_language: '',
      first_air_date: '',
      last_air_date: '',
      genres: [],
      overview: '',
      number_of_episodes: 0,
      episode_run_time: 0,
      views: 0,
      status: '',
      poster: null,
      backdrop: null,
    });

    const isDisabledBtnSubmit = computed(() => {
      return (
        ruleForm.name == '' ||
        ruleForm.original_name == '' ||
        ruleForm.original_language == '' ||
        ruleForm.first_air_date == '' ||
        ruleForm.last_air_date == '' ||
        ruleForm.genres.length == 0 ||
        ruleForm.overview == '' ||
        ruleForm.number_of_episodes == 0 ||
        ruleForm.episode_run_time == 0 ||
        // ruleForm.views == 0 ||
        ruleForm.status == '' ||
        ruleForm.poster == null ||
        ruleForm.backdrop == null
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
    });

    const handlePosterSuccess = (response) => {
      if (response.raw.type !== 'image/jpeg') {
        ElMessage.error('Image must be JPG format!');
        return false;
      } else if (response.raw.size / 1024 / 1024 > 2) {
        ElMessage.error('Image size can not exceed 2MB!');
        return false;
      }
      ruleForm.poster = response;
    };

    const handleBackdropSuccess = (response) => {
      if (response.raw.type !== 'image/jpeg') {
        ElMessage.error('Ảnh phải là kiểu JPG!');
        return false;
      } else if (response.raw.size / 1024 / 1024 > 2) {
        ElMessage.error('Ảnh không được vượt quá 2MB!');
        return false;
      }
      ruleForm.backdrop = response;
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
      ruleForm.poster = null;
    };
    const handleBackdropRemove = () => {
      ruleForm.backdrop = null;
    };

    const resetForm = () => {
      ruleForm.title = '';
      ruleForm.original_title = '';
      ruleForm.original_language = '';
      ruleForm.release_date = '';
      ruleForm.genres = [];
      ruleForm.overview = '';
      ruleForm.budget = 0;
      ruleForm.revenue = 0;
      ruleForm.runtime = 0;
      ruleForm.views = 0;
      ruleForm.status = '';
      ruleForm.poster = null;
      ruleForm.backdrop = null;
    };

    const submitForm = () => {
      const genresList = ruleForm.genres.map(
        (item) =>
          (item = {
            id: item,
            name: genres.value.find((item1) => item == item1.id).name,
          })
      );

      addTv(ruleForm, genresList)
        .then((response) => {
          if (response.data?.success == true) {
            notification.open({
              message: 'Thông báo',
              description: `Thêm phim thành công!`,
              icon: () =>
                h(CheckCircleFilled, {
                  style: 'color: green',
                }),
            });

            if (ruleForm.poster != null) {
              addPoster(ruleForm.poster)
                .then((response) => {
                  console.log(response.data);
                  if (response.data.success == true) {
                    notification.open({
                      message: 'Thông báo',
                      description: `Thêm Poster thành công!`,
                      icon: () =>
                        h(CheckCircleFilled, {
                          style: 'color: green',
                        }),
                    });
                  } else {
                    if (response.data?.already == true) {
                      notification.open({
                        message: 'Thông báo',
                        description: `Tên Poster đã tồn tại!`,
                        icon: () =>
                          h(CloseCircleFilled, {
                            style: 'color: red',
                          }),
                      });
                    } else {
                      notification.open({
                        message: 'Thông báo',
                        description: `Thêm Poster thất bại!`,
                        icon: () =>
                          h(CloseCircleFilled, {
                            style: 'color: red',
                          }),
                      });
                    }
                  }
                })
                .catch((e) => {
                  if (axios.isCancel(e)) return;
                });
            }

            if (ruleForm.backdrop != null) {
              addBackdrop(ruleForm.backdrop)
                .then((response) => {
                  if (response.data.success == true) {
                    notification.open({
                      message: 'Thông báo',
                      description: `Thêm Backdrop thành công!`,
                      icon: () =>
                        h(CheckCircleFilled, {
                          style: 'color: green',
                        }),
                    });
                  } else {
                    if (response.data?.already == true) {
                      notification.open({
                        message: 'Thông báo',
                        description: `Tên Backdrop đã tồn tại!`,
                        icon: () =>
                          h(CloseCircleFilled, {
                            style: 'color: red',
                          }),
                      });
                    } else {
                      notification.open({
                        message: 'Thông báo',
                        description: `Thêm Backdrop thất bại!`,
                        icon: () =>
                          h(CloseCircleFilled, {
                            style: 'color: red',
                          }),
                      });
                    }
                  }
                })
                .catch((e) => {
                  if (axios.isCancel(e)) return;
                });
            }
          } else {
            if (response.data?.already == true) {
              notification.open({
                message: 'Thông báo',
                description: `Mã phim đã tồn tại!`,
                icon: () =>
                  h(CloseCircleFilled, {
                    style: 'color: red',
                  }),
              });
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

    return {
      UploadOutlined,
      ruleFormRef,
      ruleForm,
      isDisabledBtnSubmit,
      genres,
      years,
      countries,
      nanoid,
      handlePosterSuccess,
      handleBackdropSuccess,
      handleUploadProgress,
      handlePosterRemove,
      handleBackdropRemove,
      submitForm,
      resetForm,
    };
  },
};
</script>

<style lang="scss" src="./AddTvView.scss" scoped></style>
