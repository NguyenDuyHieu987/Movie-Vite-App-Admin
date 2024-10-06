<template>
  <div class="manage-movie-container">
    <div class="header-table">
      <h2>Danh sách Phim lẻ</h2>

      <!-- <RouterLink :to="{ path: '/addmovie' }"> -->
      <a-button
        class="add-btn"
        type="primary"
        @click="onClickAddBtn"
      >
        <template #icon>
          <PlusIcon
            width="1.8rem"
            height="1.8rem"
            fill="currentColor"
          />
        </template>
        Thêm phim
      </a-button>
      <!-- </RouterLink> -->
    </div>
    <div class="movie-table">
      <a-table
        class="ant-table-striped"
        :row-class-name="
          (_record: any, index: number) =>
            index % 2 === 1 ? 'table-striped' : null
        "
        :data-source="dataMovie"
        :columns="columns"
        :row-key="(record: any) => record.id"
        :loading="loading"
        :scroll="{
          y: '75vh',
          x: 900
        }"
        bordered
        sticky
        filterSearch
      >
        <!-- :pagination="{ pageSize: pageSizeTable, onChange: onChangePage }" -->
        <!-- @change="onChangeTable" -->
        <template #bodyCell="{ column, text, value, record, index }">
          <template v-if="column.dataIndex === 'no'">
            {{ index + 1 }}
          </template>
          <template v-if="column.dataIndex === 'original_language'">
            {{ getCountryByOriginalLanguage(value, store.allCountries)?.name }}
          </template>
          <template v-if="column.dataIndex === 'genres'">
            {{ Array?.from(value, (x: genre) => x.name).join(', ') }}
          </template>
          <template v-if="column.dataIndex === 'views'">
            {{ value.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, '.') }}
          </template>
          <template v-if="column.dataIndex === 'vip'">
            <a-tag
              v-if="value == 3"
              color="#f50"
            >
              {{ value }}
            </a-tag>
            <a-tag
              v-else-if="value == 2"
              color="#fcd500"
            >
              {{ value }}
            </a-tag>
            <a-tag
              v-else-if="value == 1"
              color="#108ee9"
            >
              {{ value }}</a-tag
            >
            <a-tag
              v-else
              color="#87d068"
            >
              Free
            </a-tag>
          </template>
          <template v-if="column.dataIndex === 'action'">
            <!-- <RouterLink
              class="underline"
              :to="`/YourAccount/invoices/${record?.id}`"
            >
              Chi tiết
            </RouterLink>
            <a-button
              type="link"
              @click="modalUploadVideoVisible = true"
            >
              Upload video
            </a-button> -->

            <el-dropdown>
              <span class="el-dropdown-link">
                <el-button type="primary">
                  Actions
                  <el-icon class="el-icon--right"><arrow-down /></el-icon>
                </el-button>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <!-- <el-dropdown-item>Chi tiết</el-dropdown-item> -->
                  <el-dropdown-item @click="onClickEditMovie(record)">
                    Chỉnh sửa
                  </el-dropdown-item>
                  <el-dropdown-item @click="onClickUploadVideo(record)">
                    Upload video
                  </el-dropdown-item>
                  <el-dropdown-item
                    @click="onClickDeleteVideo(record)"
                    class="menu-delete-video"
                  >
                    Xóa video
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </template>
      </a-table>

      <el-dialog
        class="add-movie-dialog"
        v-model="modalAddVisible"
        :title="modalAddTitle"
        align-center
        style="min-width: 600px"
      >
        <!-- width="500" -->
        <a-form
          ref="formRef"
          name="movie-form"
          class="movie-form"
          :model="formAddMovie"
          hideRequiredMark
        >
          <!-- @finish="handleFinish" -->

          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item
                label="Tên phim"
                name="name"
                :rules="[
                  {
                    required: true,
                    message: 'Vui lòng nhập tên phim!',
                    trigger: ['change', 'blur']
                  }
                ]"
              >
                <a-input
                  v-model:value="formAddMovie.name"
                  placeholder="Tên phim..."
                  allow-clear
                >
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="Tên phim gốc"
                name="original_name"
                :rules="[
                  {
                    required: true,
                    message: 'Vui lòng nhập tên phim gốc!',
                    trigger: ['change', 'blur']
                  }
                ]"
              >
                <a-input
                  v-model:value="formAddMovie.original_name"
                  placeholder="Tên phim gốc..."
                  allow-clear
                >
                </a-input>
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item
                label="Thể loại"
                name="genres"
                :rules="[
                  {
                    required: true,
                    message: 'Vui lòng nhập thể loaại!',
                    trigger: ['change', 'blur']
                  }
                ]"
              >
                <!-- <el-select
                  v-model="formAddMovie.genres"
                  multiple
                  filterable
                  clearable
                  :allow-create="false"
                  default-first-option
                  :reserve-keyword="false"
                  placeholder="Thể loại..."
                  size="large"
                >
                  <el-option
                    v-for="(item, index) in store.allGenres"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name"
                  />
                </el-select> -->
                <a-select
                  v-model:value="formAddMovie.genres"
                  mode="multiple"
                  placeholder="Thể loại..."
                  :options="
                    store.allGenres.map((item: any) => ({
                      value: JSON.stringify({
                        id: item.id,
                        name: item.name,
                        name_vietsub: item.name_vietsub,
                        short_name: item.short_name
                      }),
                      label: item.name
                    }))
                  "
                  allowClear
                  size="large"
                ></a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="Ngày phát hành"
                name="release_date"
                :rules="[
                  {
                    required: true,
                    message: 'Vui lòng nhập ngày phát hành!',
                    trigger: ['change', 'blur']
                  }
                ]"
              >
                <a-date-picker
                  v-model:value="formAddMovie.release_date"
                  placeholder="Ngày phát hành..."
                  style="width: 100%"
                  allowClear
                  size="large"
                />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item
                label="Quốc gia"
                name="original_language"
                :rules="[
                  {
                    required: true,
                    message: 'Vui lòng nhập quốc gia!',
                    trigger: ['change', 'blur']
                  }
                ]"
              >
                <a-select
                  v-model:value="formAddMovie.original_language"
                  placeholder="Quốc gia.."
                  :options="
                    store.allCountries.map((item: any) => ({
                      value: item.iso_639_1,
                      label: item.name
                    }))
                  "
                  allowClear
                  size="large"
                ></a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="Trạng thái"
                name="status"
                :rules="[
                  {
                    required: true,
                    message: 'Vui lòng nhập trạng thái!',
                    trigger: ['change', 'blur']
                  }
                ]"
              >
                <!-- <a-input
                  v-model:value="formAddMovie.status"
                  placeholder="Trạng thái..."
                  allow-clear
                >
                </a-input> -->

                <a-select v-model:value="formAddMovie.status">
                  <a-select-option value="Released">Released</a-select-option>
                  <a-select-option value="Post Production">
                    Post Production
                  </a-select-option>
                  <a-select-option value="In Production">
                    In Production
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>

          <a-row>
            <a-col :span="24">
              <a-form-item
                label="Tóm tắt"
                name="overview"
                :rules="[
                  {
                    required: false,
                    message: 'Vui lòng nhập tóm tắt!',
                    trigger: ['change', 'blur']
                  }
                ]"
              >
                <a-textarea
                  v-model:value="formAddMovie.overview"
                  placeholder="Tóm tắt..."
                  allow-clear
                  :auto-size="{ minRows: 3, maxRows: 6 }"
                >
                </a-textarea>
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="16">
            <a-col :span="8">
              <a-form-item
                label="Kinh phí sản xuất"
                name="budget"
                :rules="[
                  {
                    required: true,
                    message: 'Vui lòng nhập Kinh phí sản xuất',
                    trigger: ['change', 'blur']
                  }
                ]"
              >
                <!-- <a-input-number
                  v-model:value="formAddMovie.budget"
                  :min="0"
                  :step="1000"
                  style="width: 100%"
                /> -->
                <el-input-number
                  v-model="formAddMovie.budget"
                  :min="0"
                  :step="1000"
                  size="large"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item
                label="Doanh thu"
                name="revenue"
                :rules="[
                  {
                    required: true,
                    message: 'Vui lòng nhập doanh thu!',
                    trigger: ['change', 'blur']
                  }
                ]"
              >
                <el-input-number
                  v-model="formAddMovie.revenue"
                  :min="0"
                  :step="1000"
                  size="large"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item
                label="Vip"
                name="vip"
                :rules="[
                  {
                    required: true,
                    message: 'Vui lòng nhập vip!',
                    trigger: ['change', 'blur']
                  }
                ]"
              >
                <a-select v-model:value="formAddMovie.vip">
                  <a-select-option value="0">Free</a-select-option>
                  <a-select-option value="1">1</a-select-option>
                  <a-select-option value="2">2</a-select-option>
                  <a-select-option value="3">3</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item
                label="Poster"
                name="poster_path"
                :rules="[
                  {
                    required: true,
                    message: 'Vui lòng chọn ảnh Poster!',
                    trigger: ['change', 'blur']
                  }
                ]"
              >
                <div class="upload-image">
                  <input
                    type="file"
                    @change="(e) => handleChangeUploadImage(e, 'poster')"
                  />
                  <img
                    v-if="formAddMovie.poster_path"
                    :src="formAddMovie.poster_path"
                    class="poster-image"
                  />
                </div>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="Backdrop"
                name="backdrop_path"
                :rules="[
                  {
                    required: true,
                    message: 'Vui lòng chọn ảnh backdrop!',
                    trigger: ['change', 'blur']
                  }
                ]"
              >
                <div class="upload-image">
                  <input
                    type="file"
                    @change="(e) => handleChangeUploadImage(e, 'backdrop')"
                  />
                  <img
                    v-if="formAddMovie.backdrop_path"
                    :src="formAddMovie.backdrop_path"
                    class="backdrop-image"
                  />
                </div>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="modalAddVisible = false">Đóng</el-button>
            <el-button
              v-if="isEdit"
              type="primary"
              @click="onSubmitFormEdit"
              :loading="loadingAdd"
            >
              Lưu
            </el-button>
            <el-button
              v-else
              type="primary"
              @click="onSubmitFormAdd"
              :loading="loadingAdd"
            >
              Thêm
            </el-button>
          </div>
        </template>
      </el-dialog>

      <el-dialog
        class="upload-video-dialog"
        v-model="modalUploadVideoVisible"
        title="Upload video"
        align-center
        style="min-width: 600px"
        :before-close="onBeforeCloseModalUploadVideo"
      >
        <!-- width="500" -->
        <a-form
          ref="formVidRef"
          name="movie-form"
          class="movie-form"
          :model="formUploadVideo"
          hideRequiredMark
        >
          <!-- @finish="handleFinishUploadVideo" -->
          <a-row>
            <a-col :span="24">
              <a-form-item
                label="Video"
                name="file_upload"
                :rules="[
                  {
                    required: true,
                    message: 'Vui lòng chọn video!',
                    trigger: ['change', 'blur']
                  }
                ]"
              >
                <div class="upload-video">
                  <input
                    type="file"
                    @change="handleChangeUploadVideo"
                  />
                  <!-- <video
                    v-if="formUploadVideo.file_upload"
                    :src="formUploadVideo.file_upload"
                    class="video-upload-preview"
                  /> -->
                </div>
                <div class="progress-upload">
                  <div v-if="formUploadVideo.percent_upload > 0">
                    <p>Upoading</p>
                    <a-progress
                      title="Upload video"
                      :percent="formUploadVideo.percent_upload"
                    />
                  </div>
                  <div v-if="formUploadVideo.percent_chunking > 0">
                    <p>Chunking</p>
                    <a-progress
                      title="Chia nhỏ video"
                      :percent="formUploadVideo.percent_chunking"
                    />
                  </div>
                </div>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button
              @click="modalUploadVideoVisible = false"
              :disabled="loadingUploadVideo || loadingChunkingVideo"
              >Đóng
            </el-button>
            <el-button
              type="primary"
              @click="onUploadVideo"
              :loading="loadingUploadVideo || loadingChunkingVideo"
            >
              Upload
            </el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import PlusIcon from '@/assets/svgs/icons/plus.svg?component';
import { onBeforeMount, reactive, ref } from 'vue';
import { viewFormatter } from '@/utils';
import { useStore } from '@/stores';
import type {
  TableColumnType,
  FormInstance,
  UploadChangeParam,
  UploadProps as AUploadProps
} from 'ant-design-vue';
import { getImage, uploadImage, uploadArrayImage } from '@/services/image';
import { getCountryByOriginalLanguage } from '@/services/country';
import {
  CreateMovie,
  getAllMovie,
  UpdateVideo,
  UpdateVideoPath,
  DeleteVideo
} from '@/services/movie';
import type { MovieForm, genre } from '@/types';
import { ElNotification, ElMessageBox } from 'element-plus';
import { ArrowDown } from '@element-plus/icons-vue';
import type { UploadProps as ElUploadProps } from 'element-plus';
import { MESSAGE } from '@/common';
import { uploadVideo } from '@/services/video';
import { Socket, io } from 'socket.io-client';
import dayjs from 'dayjs';

const formRef = ref<FormInstance>();
const formVidRef = ref<FormInstance>();
const store = useStore();
const dataMovie = ref<any[]>([]);
const page = ref<number>(1);
const pageSizeTable = ref<number>(20);
const pageSize = ref<number>(-1);
const total = ref<number>(0);
const loading = ref<boolean>(false);
const loadingUpload = ref<boolean>(false);
const columns: TableColumnType[] = [
  {
    title: 'STT',
    dataIndex: 'no',
    sorter: true,
    width: '70px'
  },
  {
    title: 'ID',
    dataIndex: 'id',
    width: 200
  },
  {
    title: 'Tên phim',
    dataIndex: 'name',
    width: 200,
    sorter: true
  },
  {
    title: 'Tên phim gốc',
    dataIndex: 'original_name',
    width: 200,
    sorter: true
  },
  {
    title: 'Quốc gia',
    dataIndex: 'original_language',
    sorter: true,
    width: 120
  },
  {
    title: 'Ngaày phát haành',
    dataIndex: 'release_date',
    sorter: true,
    width: 150
  },
  {
    title: 'Thể laại',
    dataIndex: 'genres',
    sorter: true,
    width: 200
  },
  {
    title: 'Lượt xem',
    dataIndex: 'views',
    sorter: true,
    width: 150
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    sorter: true,
    width: 200
  },
  {
    title: 'Vip',
    dataIndex: 'vip',
    sorter: true,
    width: 100
  },
  {
    title: 'Hành động',
    dataIndex: 'action',
    width: 200
  }
];
const modalAddVisible = ref<boolean>(false);
const modalUploadVideoVisible = ref<boolean>(false);
const formAddMovie = reactive({
  id: '',
  name: '',
  original_name: '',
  genres: [],
  original_language: null,
  release_date: '',
  overview: '',
  status: 'Released',
  budget: 0,
  revenue: 0,
  vip: '0',
  poster_path: '',
  poster_file: null,
  backdrop_path: '',
  backdrop_file: null
});
const formUploadVideo = reactive({
  movieId: '',
  type: '',
  file_upload: null,
  percent_upload: 0,
  percent_chunking: 0
});
const modalAddTitle = ref<string>('Thêm mới phim');
const isEdit = ref<boolean>(false);
const currentEditMovie = ref<MovieForm>();
const loadingAdd = ref<boolean>(false);
const disabledAdd = ref<boolean>(true);
const loadingUploadVideo = ref<boolean>(false);
const loadingChunkingVideo = ref<boolean>(false);
const socket = ref<Socket>();

loading.value = true;

getAllMovie(page.value, pageSize.value)
  .then((response) => {
    dataMovie.value = response?.results;
    page.value = response.page;
    pageSize.value = response.page_size;
    total.value = response.total;
  })
  .catch((e) => {})
  .finally(() => {
    loading.value = false;
  });

// const onChangeTable = (
//   pagination,
//   filters,
//   sorter,
//   { action, currentDataSource }
// ) => {};

const onChangePage = (page: number, pageSize: number) => {
  pageSizeTable.value = pageSize;
};

function getBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

const handleChangeUploadImage = async (e: any, type: string) => {
  const rawFile = e.target.files[0]!;

  const isJpgOrPng =
    rawFile.type === 'image/jpeg' || rawFile.type === 'image/png';

  if (!isJpgOrPng) {
    ElNotification.error({
      title: MESSAGE.STATUS.FAILED,
      message: 'Bạn chỉ có thể upload JPG, PNG file!',
      duration: MESSAGE.DURATION.DEFAULT
    });
    return false;
  }

  if (rawFile.size / 1024 / 1024 > 2) {
    ElNotification.error({
      title: MESSAGE.STATUS.FAILED,
      message: 'Ảnh phải có dung lượng nhỏ hơn 5MB!',
      duration: MESSAGE.DURATION.DEFAULT
    });
    return false;
  }

  formAddMovie[`${type}_path`] = URL.createObjectURL(rawFile!);
  // formAddMovie[`${type}_path`] = await getBase64(rawFile);
  formAddMovie[`${type}_file`] = rawFile;

  return true;
};

const onClickAddBtn = () => {
  isEdit.value = false;
  modalAddTitle.value = 'Thêm mới phim';
  resetFeild();
  modalAddVisible.value = true;
};

const onSubmitFormAdd = () => {
  if (!formRef.value) return;

  formRef.value
    .validateFields()
    .then(async (values) => {
      loadingAdd.value = true;

      // uploadArrayImage([
      //   { folder: 'poster', file: formAddMovie.poster_file! },
      //   { folder: 'backdrop', file: formAddMovie.backdrop_file! }
      // ]);
      const filePoster = await uploadImage(
        'poster',
        formAddMovie.poster_file!
      ).catch((e) => {
        loadingAdd.value = false;
      });
      if (!filePoster?.success) {
        ElNotification.error({
          title: MESSAGE.STATUS.FAILED,
          message: 'Upload ảnh poster thất bại!',
          duration: MESSAGE.DURATION.DEFAULT
        });
        return;
      }
      const fileBackdrop = await uploadImage(
        'backdrop',
        formAddMovie.backdrop_file!
      ).catch((e) => {
        loadingAdd.value = false;
      });
      if (!fileBackdrop?.success) {
        ElNotification.error({
          title: MESSAGE.STATUS.FAILED,
          message: 'Upload ảnh backdrop thất bại!',
          duration: MESSAGE.DURATION.DEFAULT
        });
        return;
      }
      values.poster_path = filePoster.file.filename;
      values.dominant_poster_color = filePoster.file.dominant_poster_color;
      values.backdrop_path = fileBackdrop.file.filename;
      values.dominant_backdrop_color =
        fileBackdrop.file.dominant_backdrop_color;
      values.genres = values.genres.map((genre) => JSON.parse(genre));
      CreateMovie(values)
        .then((response) => {
          if (response?.success) {
            ElNotification.success({
              title: MESSAGE.STATUS.SUCCESS,
              message: 'Thêm mới phim thành công!',
              duration: MESSAGE.DURATION.DEFAULT
            });
          } else {
            ElNotification.error({
              title: MESSAGE.STATUS.FAILED,
              message: 'Thêm mới phim thất bại!',
              duration: MESSAGE.DURATION.DEFAULT
            });
          }
        })
        .catch((e) => {
          ElNotification.error({
            title: MESSAGE.STATUS.FAILED,
            message: 'Thêm mới phim thất bại!',
            duration: MESSAGE.DURATION.DEFAULT
          });
        })
        .finally(() => {
          loadingAdd.value = false;
          modalAddVisible.value = false;
          resetFeild();
        });

      // formRef.value.resetFields();
    })
    .catch((e) => {})
    .finally(() => {});
};

const handleChangeUploadVideo = (e: any) => {
  const rawFile = e.target.files[0]!;

  formUploadVideo.file_upload = rawFile;
};

onBeforeMount(() => {
  socket.value = io(
    import.meta.env.PROD
      ? import.meta.env.VITE_SERVER_VIDEO_URL
      : import.meta.env.VITE_SERVER_VIDEO_URL_DEV
  );

  socket.value.on('upload-video-progress', (data) => {
    loadingChunkingVideo.value = true;
    formUploadVideo.percent_chunking = Math.round(data.percent);
    if (formUploadVideo.percent_chunking == 100) {
      loadingChunkingVideo.value = false;
    }
  });
});

const onClickUploadVideo = (movie: any) => {
  formUploadVideo.movieId = movie.id;
  formUploadVideo.type = movie.media_type == 'movie' ? 'feature' : 'television';
  formUploadVideo.file_upload = null;
  formUploadVideo.percent_upload = 0;
  formUploadVideo.percent_chunking = 0;

  modalUploadVideoVisible.value = true;
};

const onUploadVideo = () => {
  if (!formVidRef.value) return;

  formVidRef.value
    .validateFields()
    .then(async (values) => {
      loadingUploadVideo.value = true;

      // const response = await uploadVideo(values.file_upload).catch((e) => {
      //   loadingUploadVideo.value = false;
      // });

      const response = await uploadVideo(
        formUploadVideo.type,
        values.file_upload,
        socket.value!,
        (e) => {
          if (e.lengthComputable) {
            const percentComplete = Math.round((e.loaded / e.total) * 100);
            formUploadVideo.percent_upload = +percentComplete.toFixed(2);
          }
        }
      ).catch((e) => {
        loadingUploadVideo.value = false;
      });

      // console.log(response);

      if (response?.success) {
        UpdateVideoPath(formUploadVideo.movieId, response.video_path)
          .then((response) => {
            if (response?.success) {
              ElNotification.success({
                title: MESSAGE.STATUS.SUCCESS,
                message: 'Upload video thành công!',
                duration: MESSAGE.DURATION.DEFAULT
              });
            } else {
              ElNotification.error({
                title: MESSAGE.STATUS.FAILED,
                message: 'Upload video thất bại!',
                duration: MESSAGE.DURATION.DEFAULT
              });
            }
          })
          .catch((e) => {
            ElNotification.error({
              title: MESSAGE.STATUS.FAILED,
              message: 'Upload video thất bại!',
              duration: MESSAGE.DURATION.DEFAULT
            });
          })
          .finally(() => {
            loadingUploadVideo.value = false;
            modalUploadVideoVisible.value = false;
          });
      } else {
        ElNotification.error({
          title: MESSAGE.STATUS.FAILED,
          message: 'Upload video thất bại!',
          duration: MESSAGE.DURATION.DEFAULT
        });
        return;
      }

      // const formData = new FormData();
      // formData.append('video', values.file_upload);

      // const xhr = new XMLHttpRequest();

      // // Update progress bar
      // xhr.upload.addEventListener('progress', function (e) {
      //   if (e.lengthComputable) {
      //     const percentComplete = (e.loaded / e.total) * 100;
      //     formUploadVideo.percent_upload = +percentComplete.toFixed(2);
      //   }
      // });

      // xhr.addEventListener('load', function () {
      //   if (xhr.status === 200) {
      //     ElNotification.success({
      //       title: MESSAGE.STATUS.SUCCESS,
      //       message: 'Upload video thành công!',
      //       duration: MESSAGE.DURATION.DEFAULT
      //     });
      //   } else {
      //     ElNotification.error({
      //       title: MESSAGE.STATUS.FAILED,
      //       message: 'Upload video thất bại!',
      //       duration: MESSAGE.DURATION.DEFAULT
      //     });
      //   }
      //   loadingUploadVideo.value = false;
      // });

      // xhr.addEventListener('error', function () {
      //   ElNotification.error({
      //     title: MESSAGE.STATUS.FAILED,
      //     message: 'Upload video thất bại!',
      //     duration: MESSAGE.DURATION.DEFAULT
      //   });
      //   loadingUploadVideo.value = false;
      // });

      // xhr.open(
      //   'POST',
      //   `${import.meta.env.VITE_MEDIA_API_GATEWAY_DEV}/video/upload`
      // );
      // xhr.send(formData);
    })
    .catch((e) => {})
    .finally(() => {});
};

const onBeforeCloseModalUploadVideo = (done: () => void) => {
  if (loadingUploadVideo.value || loadingChunkingVideo.value) {
    ElMessageBox.confirm(
      'Bạn đang trong quá trình upload video bạn có chắc muốn đóng không?',
      {
        title: 'Cảnh báo!',
        confirmButtonText: 'Có',
        cancelButtonText: 'Không'
      }
    )
      .then(() => {
        done();
      })
      .catch(() => {
        // catch error
      });
  } else {
    done();
  }
};

const resetFeild = () => {
  formAddMovie.id = '';
  formAddMovie.name = '';
  formAddMovie.original_name = '';
  formAddMovie.genres = [];
  formAddMovie.original_language = null;
  formAddMovie.release_date = '';
  formAddMovie.overview = '';
  formAddMovie.status = 'Released';
  formAddMovie.budget = 0;
  formAddMovie.revenue = 0;
  formAddMovie.vip = '0';
  formAddMovie.poster_path = '';
  formAddMovie.poster_file = null;
  formAddMovie.backdrop_path = '';
  formAddMovie.backdrop_file = null;
};

const onClickEditMovie = (movie: any) => {
  isEdit.value = true;
  currentEditMovie.value = movie;
  modalAddTitle.value = 'Chỉnh sửa phim';

  formAddMovie.id = movie.id;
  formAddMovie.name = movie.name;
  formAddMovie.original_name = movie.original_name;
  formAddMovie.genres = movie.genres.map((item) => {
    const genre = store.allGenres.find((g) => g.id == item.id)!;
    return JSON.stringify({
      id: genre.id,
      name: genre.name,
      name_vietsub: genre.name_vietsub,
      short_name: genre.short_name
    });
  });

  formAddMovie.original_language = movie.original_language;
  formAddMovie.release_date = dayjs(movie.release_date, 'YYYY-MM-DD');
  formAddMovie.overview = movie.overview;
  formAddMovie.status = movie.status;
  formAddMovie.budget = movie.budget;
  formAddMovie.revenue = movie.revenue;
  formAddMovie.vip = movie.vip?.toString() || '0';
  formAddMovie.poster_path = getImage(movie.poster_path, 'poster', { w: 250 });
  formAddMovie.backdrop_path = getImage(movie.backdrop_path, 'backdrop', {
    h: 250
  });

  modalAddVisible.value = true;
};

const onSubmitFormEdit = () => {
  if (!formRef.value) return;

  formRef.value
    .validateFields()
    .then(async (values) => {
      loadingAdd.value = true;

      if (formAddMovie.poster_file) {
        const filePoster = await uploadImage(
          'poster',
          formAddMovie.poster_file!
        ).catch((e) => {
          loadingAdd.value = false;
        });
        if (!filePoster?.success) {
          ElNotification.error({
            title: MESSAGE.STATUS.FAILED,
            message: 'Upload ảnh poster thất bại!',
            duration: MESSAGE.DURATION.DEFAULT
          });
          return;
        }
        values.poster_path = filePoster.file.filename;
        values.dominant_poster_color = filePoster.file.dominant_poster_color;
      } else {
        values.poster_path = currentEditMovie.value?.poster_path;
        values.dominant_poster_color =
          currentEditMovie.value?.dominant_poster_color;
      }

      if (formAddMovie.backdrop_file) {
        const fileBackdrop = await uploadImage(
          'backdrop',
          formAddMovie.backdrop_file!
        ).catch((e) => {
          loadingAdd.value = false;
        });
        if (!fileBackdrop?.success) {
          ElNotification.error({
            title: MESSAGE.STATUS.FAILED,
            message: 'Upload ảnh backdrop thất bại!',
            duration: MESSAGE.DURATION.DEFAULT
          });
          return;
        }

        values.backdrop_path = fileBackdrop.file.filename;
        values.dominant_backdrop_color =
          fileBackdrop.file.dominant_backdrop_color;
      } else {
        values.backdrop_path = currentEditMovie.value?.backdrop_path;
        values.dominant_backdrop_color =
          currentEditMovie.value?.dominant_backdrop_color;
      }

      values.genres = values.genres.map((genre) => JSON.parse(genre));
      values.id = formAddMovie.id;
      UpdateVideo(values)
        .then((response) => {
          if (response?.success) {
            ElNotification.success({
              title: MESSAGE.STATUS.SUCCESS,
              message: 'Chỉnh sửa phim thành công!',
              duration: MESSAGE.DURATION.DEFAULT
            });
          } else {
            ElNotification.error({
              title: MESSAGE.STATUS.FAILED,
              message: 'Chỉnh sửa phim thất bại!',
              duration: MESSAGE.DURATION.DEFAULT
            });
          }
        })
        .catch((e) => {
          ElNotification.error({
            title: MESSAGE.STATUS.FAILED,
            message: 'Chỉnh sửa phim thất bại!',
            duration: MESSAGE.DURATION.DEFAULT
          });
        })
        .finally(() => {
          loadingAdd.value = false;
          modalAddVisible.value = false;
          resetFeild();
        });

      // formRef.value.resetFields();
    })
    .catch((e) => {})
    .finally(() => {});
};

const onClickDeleteVideo = (movie: any) => {
  ElMessageBox.confirm('Bạn có chắc muốn xóa video này không?', {
    title: 'Thông báo!',
    confirmButtonText: 'Có',
    cancelButtonText: 'Không'
  })
    .then(() => {
      DeleteVideo(movie.id)
        .then((response) => {
          if (response?.success) {
            ElNotification.success({
              title: MESSAGE.STATUS.SUCCESS,
              message: 'Xóa phim thành công!',
              duration: MESSAGE.DURATION.DEFAULT
            });
          } else {
            ElNotification.error({
              title: MESSAGE.STATUS.FAILED,
              message: 'Xóa phim thất bại!',
              duration: MESSAGE.DURATION.DEFAULT
            });
          }
        })
        .catch((e) => {
          ElNotification.error({
            title: MESSAGE.STATUS.FAILED,
            message: 'Xóa phim thất bại!',
            duration: MESSAGE.DURATION.DEFAULT
          });
        })
        .finally(() => {
          loadingAdd.value = false;
          modalAddVisible.value = false;
          resetFeild();
        });
    })
    .catch(() => {
      // catch error
    });
};
</script>

<style lang="scss" src="./ManageMoviePage.scss"></style>
