<template>
  <div class="list-episode-container">
    <div class="header-table">
      <div>
        <h2>Danh sách tập - Phim: {{ dataMovie?.name }}</h2>
      </div>

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
        Thêm tập
      </a-button>

      <!-- </RouterLink> -->
    </div>

    <div class="table-tools">
      <a-input-search
        class="search-episode"
        v-model:value="searchValue"
        placeholder="Nhập têm phim để tìm kiếm..."
        enter-button="Tìm kiếm"
        size="large"
        @search="onSearch"
      />

      <a-button
        class="add-btn"
        type="primary"
        danger
        @click="onClickDeleteBtn"
        :disabled="!hasSelected"
      >
        <template #icon>
          <DeleteSweepIcon
            width="1.8rem"
            height="1.8rem"
            fill="currentColor"
          />
        </template>
        Xóa tập
      </a-button>
    </div>

    <div class="episode-table">
      <a-table
        class="ant-table-striped"
        :row-class-name="
          (_record: any, index: number) =>
            index % 2 === 1 ? 'table-striped' : null
        "
        :data-source="dataEpisodes"
        :columns="columns"
        :row-key="(record: any) => record.id"
        :loading="loading"
        :scroll="{
          y: '75vh',
          x: 900
        }"
        bordered
        sticky
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange
        }"
      >
        <!-- :pagination="{ pageSize: pageSizeTable, onChange: onChangePage }" -->
        <!-- @change="onChangeTable" -->
        <template #bodyCell="{ column, text, value, record, index }">
          <template v-if="column.dataIndex === 'no'">
            {{ index + 1 }}
          </template>
          <template v-if="column.dataIndex === 'episode_type'">
            {{ value }}
          </template>
          <template v-if="column.dataIndex === 'air_date'">
            {{ dayjs(value).format('DD/MM/YYYY') }}
          </template>
          <template v-if="column.dataIndex === 'views'">
            {{ value.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, '.') }}
          </template>
          <template v-if="column.dataIndex === 'runtime'">
            {{ utils.dateTimeFormater.convertSeconds(value) }}
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
                  <el-dropdown-item @click="onClickEditEpisode(record)">
                    Chỉnh sửa
                  </el-dropdown-item>
                  <el-dropdown-item @click="onClickUploadVideo(record)">
                    Upload video
                  </el-dropdown-item>
                  <el-dropdown-item
                    @click="onClickDeleteEpisode(record)"
                    class="menu-delete-video"
                  >
                    Xóa tập
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </template>
      </a-table>

      <el-dialog
        class="add-episode-dialog"
        v-model="modalAddVisible"
        :title="modalAddTitle"
        align-center
        style="min-width: 600px"
      >
        <!-- width="500" -->
        <a-form
          ref="formRef"
          name="episode-form"
          class="episode-form"
          :model="formAddEpisode"
          hideRequiredMark
        >
          <!-- @finish="handleFinish" -->

          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item
                label="Tên tập"
                name="name"
                :rules="[
                  {
                    required: true,
                    message: 'Vui lòng nhập tên tập!',
                    trigger: ['change', 'blur']
                  }
                ]"
              >
                <a-input
                  v-model:value="formAddEpisode.name"
                  placeholder="Tên tập..."
                  allow-clear
                >
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="Loại tập"
                name="episode_type"
                :rules="[
                  {
                    required: true,
                    message: 'Vui lòng nhập loại tập!',
                    trigger: ['change', 'blur']
                  }
                ]"
              >
                <!-- <a-input
                  v-model:value="formAddEpisode.episode_type"
                  placeholder="Loại tập..."
                  allow-clear
                >
                </a-input> -->
                <a-select v-model:value="formAddEpisode.episode_type">
                  <a-select-option value="standard">Tiêu chuẩn</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item
                label="Tập"
                name="episode_number"
                :rules="[
                  {
                    required: true,
                    message: 'Vui lòng nhập tập',
                    trigger: ['change', 'blur']
                  }
                ]"
              >
                <!-- <a-input-number
                  v-model:value="formAddEpisode.episode_number"
                  :min="1"
                  :step="1"
                  style="width: 100%"
                /> -->
                <el-input-number
                  v-model="formAddEpisode.episode_number"
                  :min="1"
                  :step="1"
                  size="large"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="Ngày phát hành"
                name="air_date"
                :rules="[
                  {
                    required: true,
                    message: 'Vui lòng nhập ngày phát hành!',
                    trigger: ['change', 'blur']
                  }
                ]"
              >
                <a-date-picker
                  v-model:value="formAddEpisode.air_date"
                  placeholder="Ngày phát hành..."
                  style="width: 100%"
                  allowClear
                  size="large"
                />
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
                  v-model:value="formAddEpisode.overview"
                  placeholder="Tóm tắt..."
                  allow-clear
                  :auto-size="{ minRows: 3, maxRows: 6 }"
                >
                </a-textarea>
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="16">
            <a-col :span="12">
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
                <a-select v-model:value="formAddEpisode.vip">
                  <a-select-option value="0">Free</a-select-option>
                  <a-select-option value="1">1</a-select-option>
                  <a-select-option value="2">2</a-select-option>
                  <a-select-option value="3">3</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="Ảnh tĩnh"
                name="still_path"
                :rules="[
                  {
                    required: true,
                    message: 'Vui lòng chọn ảnh tĩnh!',
                    trigger: ['change', 'blur']
                  }
                ]"
              >
                <div class="upload-image">
                  <input
                    ref="inputStillFile"
                    type="file"
                    accept="image/*"
                    @change="(e) => handleChangeUploadImage(e, 'still')"
                  />
                  <img
                    v-if="formAddEpisode.still_path"
                    :src="formAddEpisode.still_path"
                    class="still-image"
                  />
                </div>
              </a-form-item>
            </a-col>
            <a-col :span="12"> </a-col>
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
                    ref="inputVideoFile"
                    type="file"
                    accept="video/*"
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
import DeleteSweepIcon from '@/assets/svgs/icons/delete-sweep.svg?component';
import { onBeforeMount, reactive, ref, computed } from 'vue';
import { useUtils, viewFormatter } from '@/utils';
import { useStore } from '@/stores';
import type {
  TableColumnType,
  FormInstance,
  UploadChangeParam,
  UploadProps as AUploadProps
} from 'ant-design-vue';
import { getImage, uploadImage, uploadArrayImage } from '@/services/image';
import { getCountryByOriginalLanguage } from '@/services/country';
import { getMovieByType_Id } from '@/services/movie';
import {
  getListEpisode,
  CreateEpisode,
  UpdateVideo,
  UpdateVideoUpload,
  DeleteEpisode,
  DeleteMultipleEpisode,
  SearchEpisode
} from '@/services/episode';
import type { EpisodeForm, genre } from '@/types';
import { ElNotification, ElMessageBox } from 'element-plus';
import { ArrowDown } from '@element-plus/icons-vue';
import type { UploadProps as ElUploadProps } from 'element-plus';
import { MESSAGE } from '@/common';
import { uploadVideo } from '@/services/video';
import { Socket, io } from 'socket.io-client';
import dayjs from 'dayjs';
import { useRoute, useRouter } from 'vue-router';

defineOptions({
  name: 'manage-tv-episodes'
});

const formRef = ref<FormInstance>();
const formVidRef = ref<FormInstance>();
const inputStillFile = ref<HTMLInputElement | null>();
const inputVideoFile = ref<HTMLInputElement | null>();
const utils = useUtils();
const router = useRouter();
const route = useRoute();
const store = useStore();
const dataEpisodes = ref<any[]>([]);
const dataMovie = ref<any>();
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
    width: '70px',
    fixed: 'left'
  },
  // {
  //   title: 'ID',
  //   dataIndex: 'id',
  //   width: 200
  // },
  {
    title: 'Tên tập',
    dataIndex: 'name',
    width: 200,
    sorter: true,
    fixed: 'left'
  },
  {
    title: 'Tập',
    dataIndex: 'episode_number',
    width: 100,
    sorter: true
  },
  {
    title: 'Loại tập',
    dataIndex: 'episode_type',
    width: 200,
    sorter: true
  },
  {
    title: 'Ngày phát hành',
    dataIndex: 'air_date',
    sorter: true,
    width: 150
  },
  {
    title: 'Lượt xem',
    dataIndex: 'views',
    sorter: true,
    width: 150
  },
  {
    title: 'Thời lượng',
    dataIndex: 'runtime',
    sorter: true,
    width: 150
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
    width: 150,
    fixed: 'right'
  }
];
const modalAddVisible = ref<boolean>(false);
const modalUploadVideoVisible = ref<boolean>(false);
const formAddEpisode = reactive({
  id: '',
  season_id: '',
  series_id: '',
  name: '',
  episode_type: 'standard',
  episode_number: 1,
  air_date: '',
  overview: '',
  vip: '0',
  still_path: '',
  still_file: null
});
const formUploadVideo = reactive({
  episodeId: '',
  type: '',
  file_upload: null,
  percent_upload: 0,
  percent_chunking: 0
});
const modalAddTitle = ref<string>('Thêm mới tập');
const isEdit = ref<boolean>(false);
const currentEditMovie = ref<EpisodeForm>();
const loadingAdd = ref<boolean>(false);
const disabledAdd = ref<boolean>(true);
const loadingUploadVideo = ref<boolean>(false);
const loadingChunkingVideo = ref<boolean>(false);
const searchValue = ref<string>('');
const socket = ref<Socket>();
const selectedRowKeys = ref<string[] | number[]>([]);
const hasSelected = computed(() => selectedRowKeys.value.length > 0);
const movieId = computed<string>((): string => route.params?.id as string);

const getData = async () => {
  loading.value = true;

  getListEpisode(
    dataMovie.value.id,
    dataMovie.value.season_id,
    page.value,
    pageSize.value
  )
    .then((response) => {
      dataEpisodes.value = response?.results;
      page.value = response.page;
      // pageSize.value = response.page_size;
      total.value = response.total_episode;
    })
    .catch((e) => {})
    .finally(() => {
      loading.value = false;
    });
};

getMovieByType_Id('tv', movieId.value)
  .then((response) => {
    dataMovie.value = response;

    getData();
  })
  .catch((e) => {})
  .finally(() => {});

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

  if (type == 'still') {
    formAddEpisode[`${type}_path`] = URL.createObjectURL(rawFile!);
    // formAddEpisode[`${type}_path`] = await getBase64(rawFile);
    formAddEpisode[`${type}_file`] = rawFile;
  }

  return true;
};

const onClickAddBtn = () => {
  isEdit.value = false;
  modalAddTitle.value = 'Thêm mới tập';
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
      //   { folder: 'poster', file: formAddEpisode.poster_file! },
      //   { folder: 'backdrop', file: formAddEpisode.backdrop_file! }
      // ]);
      const fileStill = await uploadImage(
        'still',
        formAddEpisode.still_file!
      ).catch((e) => {
        loadingAdd.value = false;
      });
      if (!fileStill?.success) {
        ElNotification.error({
          title: MESSAGE.STATUS.FAILED,
          message: 'Upload ảnh tĩnh thất bại!',
          duration: MESSAGE.DURATION.DEFAULT
        });
        return;
      }
      values.movie_id = dataMovie.value.id;
      values.season_id = dataMovie.value.season_id;
      values.series_id = dataMovie.value.series_id;
      values.still_path = fileStill.file.filename;
      values.dominant_still_color = fileStill.file.dominant_still_color;
      CreateEpisode(values as EpisodeForm)
        .then((response) => {
          if (response?.success) {
            ElNotification.success({
              title: MESSAGE.STATUS.SUCCESS,
              message: 'Thêm mới tập thành công!',
              duration: MESSAGE.DURATION.DEFAULT
            });
          } else {
            ElNotification.error({
              title: MESSAGE.STATUS.FAILED,
              message: 'Thêm mới tập thất bại!',
              duration: MESSAGE.DURATION.DEFAULT
            });
          }
        })
        .catch((e) => {
          ElNotification.error({
            title: MESSAGE.STATUS.FAILED,
            message: 'Thêm mới tập thất bại!',
            duration: MESSAGE.DURATION.DEFAULT
          });
        })
        .finally(() => {
          loadingAdd.value = false;
          modalAddVisible.value = false;
          resetFeild();
          getData();
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

const onClickUploadVideo = (episode: any) => {
  if (inputVideoFile.value) {
    inputVideoFile.value.value = '';
  }
  formUploadVideo.episodeId = episode.id;
  formUploadVideo.type = 'television';
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
        (e: any) => {
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
        UpdateVideoUpload(formUploadVideo.episodeId, {
          duration: response.file.duration,
          video_path: response.video_path
        })
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
  formAddEpisode.id = '';
  formAddEpisode.name = '';
  formAddEpisode.episode_type = '';
  formAddEpisode.air_date = '';
  formAddEpisode.overview = '';
  formAddEpisode.episode_number = 0;
  formAddEpisode.vip = '0';
  formAddEpisode.still_path = '';
  formAddEpisode.still_file = null;
  if (inputStillFile.value) {
    inputStillFile.value!.value = '';
  }
};

const onClickEditEpisode = (episode: any) => {
  isEdit.value = true;
  currentEditMovie.value = episode;
  modalAddTitle.value = 'Chỉnh sửa tập';

  formAddEpisode.id = episode.id;
  formAddEpisode.name = episode.name;
  formAddEpisode.episode_type = episode.episode_type;
  // formAddEpisode.air_date = dayjs(episode.air_date).format('YYYY-MM-DD');
  formAddEpisode.air_date = dayjs(episode.air_date, 'YYYY-MM-DD');
  formAddEpisode.overview = episode.overview;
  formAddEpisode.episode_number = episode.episode_number;
  formAddEpisode.vip = episode.vip?.toString() || '0';
  formAddEpisode.still_path = getImage(episode.still_path, 'still', {
    w: 250
  });

  modalAddVisible.value = true;
};

const onSubmitFormEdit = () => {
  if (!formRef.value) return;

  formRef.value
    .validateFields()
    .then(async (values) => {
      loadingAdd.value = true;

      if (formAddEpisode.still_file) {
        const filePoster = await uploadImage(
          'still',
          formAddEpisode.still_file!
        ).catch((e) => {
          loadingAdd.value = false;
        });
        if (!filePoster?.success) {
          ElNotification.error({
            title: MESSAGE.STATUS.FAILED,
            message: 'Upload ảnh tĩnh thất bại!',
            duration: MESSAGE.DURATION.DEFAULT
          });
          return;
        }
        values.still_path = filePoster.file.filename;
        values.dominant_still_color = filePoster.file.dominant_still_color;
      } else {
        values.still_path = currentEditMovie.value?.still_path;
        values.dominant_still_color =
          currentEditMovie.value?.dominant_still_color;
      }

      values.id = formAddEpisode.id;
      values.air_date = formAddEpisode.air_date.format('YYYY-MM-DD');
      UpdateVideo(values as EpisodeForm)
        .then((response) => {
          if (response?.success) {
            ElNotification.success({
              title: MESSAGE.STATUS.SUCCESS,
              message: 'Chỉnh sửa tập thành công!',
              duration: MESSAGE.DURATION.DEFAULT
            });
          } else {
            ElNotification.error({
              title: MESSAGE.STATUS.FAILED,
              message: 'Chỉnh sửa tập thất bại!',
              duration: MESSAGE.DURATION.DEFAULT
            });
          }
        })
        .catch((e) => {
          ElNotification.error({
            title: MESSAGE.STATUS.FAILED,
            message: 'Chỉnh sửa tập thất bại!',
            duration: MESSAGE.DURATION.DEFAULT
          });
        })
        .finally(() => {
          loadingAdd.value = false;
          modalAddVisible.value = false;
          resetFeild();
          getData();
        });

      // formRef.value.resetFields();
    })
    .catch((e) => {})
    .finally(() => {});
};

const onClickDeleteEpisode = (episode: any) => {
  ElMessageBox.confirm('Bạn có chắc muốn xóa tập này không?', {
    title: 'Thông báo!',
    confirmButtonText: 'Có',
    cancelButtonText: 'Không'
  })
    .then(() => {
      DeleteEpisode(episode.id)
        .then((response) => {
          if (response?.success) {
            ElNotification.success({
              title: MESSAGE.STATUS.SUCCESS,
              message: 'Xóa tập thành công!',
              duration: MESSAGE.DURATION.DEFAULT
            });
          } else {
            ElNotification.error({
              title: MESSAGE.STATUS.FAILED,
              message: 'Xóa tập thất bại!',
              duration: MESSAGE.DURATION.DEFAULT
            });
          }
        })
        .catch((e) => {
          ElNotification.error({
            title: MESSAGE.STATUS.FAILED,
            message: 'Xóa tập thất bại!',
            duration: MESSAGE.DURATION.DEFAULT
          });
        })
        .finally(() => {
          resetFeild();
          getData();
        });
    })
    .catch(() => {
      // catch error
    });
};

const onSearch = (searchQuery: string) => {
  if (!searchQuery || !dataMovie.value) return;

  loading.value = true;

  SearchEpisode(
    dataMovie.value.id,
    dataMovie.value.season_id,
    searchQuery.trim(),
    page.value,
    pageSize.value
  )
    .then((response) => {
      dataEpisodes.value = response?.results;
      page.value = response.page;
      // pageSize.value = response.page_size;
      total.value = response.total;
    })
    .catch((e) => {})
    .finally(() => {
      loading.value = false;
    });
};

const onSelectChange = (selectedRowKeys1: string[] | number[]) => {
  selectedRowKeys.value = selectedRowKeys1;
};

const onClickDeleteBtn = () => {
  ElMessageBox.confirm('Bạn có chắc muốn xóa các tập này không?', {
    title: 'Thông báo!',
    confirmButtonText: 'Có',
    cancelButtonText: 'Không'
  })
    .then(() => {
      DeleteMultipleEpisode(selectedRowKeys.value)
        .then((response) => {
          if (response?.success) {
            ElNotification.success({
              title: MESSAGE.STATUS.SUCCESS,
              message: 'Xóa tập thành công!',
              duration: MESSAGE.DURATION.DEFAULT
            });
          } else {
            ElNotification.error({
              title: MESSAGE.STATUS.FAILED,
              message: 'Xóa tập thất bại!',
              duration: MESSAGE.DURATION.DEFAULT
            });
          }
        })
        .catch((e) => {
          ElNotification.error({
            title: MESSAGE.STATUS.FAILED,
            message: 'Xóa tập thất bại!',
            duration: MESSAGE.DURATION.DEFAULT
          });
        })
        .finally(() => {
          selectedRowKeys.value = [];
          resetFeild();
          getData();
        });
    })
    .catch(() => {
      // catch error
    });
};
</script>

<style lang="scss" src="./ListEpisode.scss"></style>
