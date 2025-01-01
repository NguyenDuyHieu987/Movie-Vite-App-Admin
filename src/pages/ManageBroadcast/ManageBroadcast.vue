<template>
  <div class="manage-broadcast-container">
    <div class="header-table">
      <h2>Danh sách Buổi phát sóng</h2>

      <!-- <RouterLink :to="{ path: '/addbroadcast' }"> -->

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
        Thêm buổi phát sóng
      </a-button>

      <!-- </RouterLink> -->
    </div>

    <div class="table-tools">
      <a-input-search
        class="search-broadcast"
        v-model:value="searchValue"
        placeholder="Nhập têm buổi phát sóng để tìm kiếm..."
        enter-button="Tìm kiếm"
        size="large"
        @search="onSearch"
      />

      <div class="right-actions">
        <a-button
          class="reset-btn"
          type="primary"
          @click="getData"
        >
          <template #icon>
            <SvgoDirectorySync
              width="1.8rem"
              height="1.8rem"
              fill="currentColor"
            />
          </template>
          Làm mới
        </a-button>

        <a-button
          class="delete-multiple-btn"
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
          Xóa buổi phát sóng
        </a-button>
      </div>
    </div>

    <div class="broadcast-table">
      <a-table
        class="ant-table-striped table-app-bg-header"
        :row-class-name="
          (_record: any, index: number) =>
            index % 2 === 1 ? 'table-striped' : null
        "
        :data-source="dataBroadcast"
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
          <template v-if="column.dataIndex === 'movieData.name'">
            {{ record.movieData.name }}
          </template>
          <template v-if="column.dataIndex === 'release_time'">
            {{
              dayjs(value)
                // .local()
                // .utc()
                .format('DD/MM/YYYY hh:mm A')
            }}
          </template>
          <template v-if="column.dataIndex === 'number_of_interactions'">
            {{ value.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, '.') }}
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
                  <el-dropdown-item @click="onClickEditBroadcast(record)">
                    Chỉnh sửa
                  </el-dropdown-item>
                  <el-dropdown-item
                    @click="onClickDeleteBroadcast(record)"
                    class="menu-delete-broadcast"
                  >
                    Xóa buổi phát sóng
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </template>
      </a-table>

      <el-dialog
        class="add-broadcast-dialog"
        v-model="modalAddVisible"
        :title="modalAddTitle"
        align-center
        style="min-width: 600px"
      >
        <!-- width="500" -->
        <a-form
          ref="formRef"
          name="broadcast-form"
          class="broadcast-form"
          :model="formAddBroadcast"
          hideRequiredMark
        >
          <!-- @finish="handleFinish" -->

          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item
                label="Tên buổi phát sóng"
                name="name"
                :rules="[
                  {
                    required: true,
                    message: 'Vui lòng nhập tên buổi phát sóng!',
                    trigger: ['change', 'blur']
                  }
                ]"
              >
                <a-input
                  v-model:value="formAddBroadcast.name"
                  placeholder="Tên buổi phát sóng..."
                  allow-clear
                >
                </a-input>
              </a-form-item>
            </a-col>

            <a-col :span="12">
              <a-form-item
                label="Ngày phát sóng"
                name="release_time"
                :rules="[
                  {
                    required: true,
                    message: 'Vui lòng nhập ngày phát sóng!',
                    trigger: ['change', 'blur']
                  }
                ]"
              >
                <!-- <a-time-picker
                  v-model:value="formAddBroadcast.release_time"
                  placeholder="Ngày phát sóng..."
                  use12-hours
                  format="h:mm:ss A"
                  style="width: 100%"
                  allowClear
                  size="large"
                /> -->
                <el-date-picker
                  v-model="formAddBroadcast.release_time"
                  type="datetime"
                  placeholder="Ngày phát sóng..."
                  :shortcuts="shortcutsReleaseTime"
                  style="width: 100%"
                  size="large"
                  format="YYYY/MM/DD hh:mm:ss A"
                  date-format="YYYY-MM-DD"
                  time-format="hh:mm:ss A"
                />
                <!-- value-format="YYYY-MM-DD hh:mm:ss A" -->
              </a-form-item>
            </a-col>
          </a-row>

          <a-row>
            <a-col :span="24">
              <a-form-item
                label="Mô tả"
                name="description"
                :rules="[
                  {
                    required: false,
                    message: 'Vui lòng nhập mô tả!',
                    trigger: ['change', 'blur']
                  }
                ]"
              >
                <a-textarea
                  v-model:value="formAddBroadcast.description"
                  placeholder="Mô tả..."
                  allow-clear
                  :auto-size="{ minRows: 3, maxRows: 6 }"
                >
                </a-textarea>
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
    </div>
  </div>
</template>

<script setup lang="ts">
import PlusIcon from '@/assets/svgs/icons/plus.svg?component';
import SvgoDirectorySync from '@/assets/svgs/icons/directory-sync.svg?component';
import DeleteSweepIcon from '@/assets/svgs/icons/delete-sweep.svg?component';
import { onBeforeMount, reactive, ref, computed } from 'vue';
import { useUtils } from '@/utils';
import { useStore } from '@/stores';
import type { TableColumnType, FormInstance } from 'ant-design-vue';
import {
  getAllBroadcast,
  CreateBroadcast,
  UpdateBroadcast,
  DeleteBroadcast,
  DeleteMultipleBroadcast,
  SearchBroadcast
} from '@/services/broadcast';
import type { Broadcast } from '@/types';
import { ElNotification, ElMessageBox } from 'element-plus';
import { ArrowDown } from '@element-plus/icons-vue';
import { MESSAGE } from '@/common';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const formRef = ref<FormInstance>();
const formVidRef = ref<FormInstance>();
const inputPosterFile = ref<HTMLInputElement | null>();
const inputBackdropFile = ref<HTMLInputElement | null>();
const inputVideoFile = ref<HTMLInputElement | null>();
const utils = useUtils();
const store = useStore();
const dataBroadcast = ref<any[]>([]);
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
  //   width: 200,
  // },
  {
    title: 'Tên buổi phát sóng',
    dataIndex: 'name',
    width: 200,
    sorter: true
  },
  {
    title: 'Mô tả',
    dataIndex: 'description',
    width: 200,
    sorter: true
  },
  {
    title: 'Tên phim',
    dataIndex: 'movieData.name',
    width: 200,
    sorter: true
  },
  {
    title: 'Thời gian phát sóng',
    dataIndex: 'release_time',
    width: 200,
    sorter: true
  },
  {
    title: 'Số tương tác',
    dataIndex: 'number_of_interactions',
    width: 200,
    sorter: true
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
const formAddBroadcast = reactive({
  id: '',
  movie_id: '',
  episode_id: '',
  name: '',
  description: '',
  release_time: ''
});
const modalAddTitle = ref<string>('Thêm mới buổi phát sóng');
const isEdit = ref<boolean>(false);
const currentEditBroadcast = ref<Broadcast>();
const loadingAdd = ref<boolean>(false);
const disabledAdd = ref<boolean>(true);
const searchValue = ref<string>('');
const selectedRowKeys = ref<string[] | number[]>([]);
const hasSelected = computed(() => selectedRowKeys.value.length > 0);

const shortcutsReleaseTime = [
  {
    text: 'Hôm nay',
    value: new Date()
  },
  {
    text: 'Ngày mai',
    value: () => {
      const date = new Date();
      date.setDate(date.getDate() + 1);
      return date;
    }
  },
  {
    text: '2 ngày sau',
    value: () => {
      const date = new Date();
      date.setDate(date.getDate() + 2);
      return date;
    }
  },
  {
    text: '3 ngày sau',
    value: () => {
      const date = new Date();
      date.setDate(date.getDate() + 3);
      return date;
    }
  }
];

const getData = () => {
  loading.value = true;

  getAllBroadcast(page.value, pageSize.value)
    .then((response) => {
      dataBroadcast.value = response?.results;
    })
    .catch((e) => {})
    .finally(() => {
      loading.value = false;
    });
};

getData();

// const onChangeTable = (
//   pagination,
//   filters,
//   sorter,
//   { action, currentDataSource }
// ) => {};

const onChangePage = (page: number, pageSize: number) => {
  pageSizeTable.value = pageSize;
};

const onClickAddBtn = () => {
  isEdit.value = false;
  modalAddTitle.value = 'Thêm mới buổi phát sóng';
  resetFeild();
  modalAddVisible.value = true;
};

const onSubmitFormAdd = () => {
  if (!formRef.value) return;

  formRef.value
    .validateFields()
    .then(async (values) => {
      loadingAdd.value = true;

      values.release_time = dayjs(formAddBroadcast.release_time)
        // .local()
        // .utc()
        .format('YYYY-MM-DDTHH:mm:ssZ');

      CreateBroadcast(values as Broadcast)
        .then((response) => {
          if (response?.success) {
            ElNotification.success({
              title: MESSAGE.STATUS.SUCCESS,
              message: 'Thêm mới buổi phát sóng thành công!',
              duration: MESSAGE.DURATION.DEFAULT
            });
          } else {
            ElNotification.error({
              title: MESSAGE.STATUS.FAILED,
              message: response?.message || 'Thêm mới buổi phát sóng thất bại!',
              duration: MESSAGE.DURATION.DEFAULT
            });
          }
        })
        .catch((e) => {
          ElNotification.error({
            title: MESSAGE.STATUS.FAILED,
            message: 'Thêm mới buổi phát sóng thất bại!',
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

onBeforeMount(() => {});

const resetFeild = () => {
  formAddBroadcast.id = '';
  formAddBroadcast.movie_id = '';
  formAddBroadcast.episode_id = '';
  formAddBroadcast.name = '';
  formAddBroadcast.description = '';
  formAddBroadcast.release_time = '';
};

const onClickEditBroadcast = (broadcast: any) => {
  isEdit.value = true;
  currentEditBroadcast.value = broadcast;
  modalAddTitle.value = 'Chỉnh sửa buổi phát sóng';

  formAddBroadcast.id = broadcast.id;
  formAddBroadcast.movie_id = broadcast.movie_id;
  formAddBroadcast.episode_id = broadcast.episode_id;
  formAddBroadcast.name = broadcast.name;
  formAddBroadcast.description = broadcast.description;
  formAddBroadcast.release_time = dayjs(broadcast.release_time)
    // .local()
    // .utc()
    // .format('YYYY-MM-DDTHH:mm:ssZ');
    .format('YYYY-MM-DD hh:mm:ss A');

  modalAddVisible.value = true;
};

const onSubmitFormEdit = () => {
  if (!formRef.value) return;

  formRef.value
    .validateFields()
    .then(async (values) => {
      loadingAdd.value = true;

      values.id = formAddBroadcast.id;
      values.release_time = dayjs(formAddBroadcast.release_time)
        // .local()
        // .utc()
        .format('YYYY-MM-DDTHH:mm:ssZ');

      UpdateBroadcast(values as Broadcast)
        .then((response) => {
          if (response?.success) {
            ElNotification.success({
              title: MESSAGE.STATUS.SUCCESS,
              message: 'Chỉnh sửa buổi phát sóng thành công!',
              duration: MESSAGE.DURATION.DEFAULT
            });
          } else {
            ElNotification.error({
              title: MESSAGE.STATUS.FAILED,
              message:
                response?.message || 'Chỉnh sửa buổi phát sóng thất bại!',
              duration: MESSAGE.DURATION.DEFAULT
            });
          }
        })
        .catch((e) => {
          ElNotification.error({
            title: MESSAGE.STATUS.FAILED,
            message: 'Chỉnh sửa buổi phát sóng thất bại!',
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

const onClickDeleteBroadcast = (broadcast: any) => {
  ElMessageBox.confirm('Bạn có chắc muốn xóa buổi phát sóng này không?', {
    title: 'Thông báo!',
    confirmButtonText: 'Có',
    cancelButtonText: 'Không'
  })
    .then(() => {
      DeleteBroadcast(broadcast.id)
        .then((response) => {
          if (response?.success) {
            ElNotification.success({
              title: MESSAGE.STATUS.SUCCESS,
              message: 'Xóa buổi phát sóng thành công!',
              duration: MESSAGE.DURATION.DEFAULT
            });
          } else {
            ElNotification.error({
              title: MESSAGE.STATUS.FAILED,
              message: 'Xóa buổi phát sóng thất bại!',
              duration: MESSAGE.DURATION.DEFAULT
            });
          }
        })
        .catch((e) => {
          ElNotification.error({
            title: MESSAGE.STATUS.FAILED,
            message: 'Xóa buổi phát sóng thất bại!',
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
  if (!searchQuery) return;

  loading.value = true;

  SearchBroadcast(searchQuery.trim())
    .then((response) => {
      dataBroadcast.value = response?.results;
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
  ElMessageBox.confirm('Bạn có chắc muốn xóa các buổi phát sóng này không?', {
    title: 'Thông báo!',
    confirmButtonText: 'Có',
    cancelButtonText: 'Không'
  })
    .then(() => {
      DeleteMultipleBroadcast(selectedRowKeys.value)
        .then((response) => {
          if (response?.success) {
            ElNotification.success({
              title: MESSAGE.STATUS.SUCCESS,
              message: 'Xóa buổi phát sóng thành công!',
              duration: MESSAGE.DURATION.DEFAULT
            });
          } else {
            ElNotification.error({
              title: MESSAGE.STATUS.FAILED,
              message: 'Xóa buổi phát sóng thất bại!',
              duration: MESSAGE.DURATION.DEFAULT
            });
          }
        })
        .catch((e) => {
          ElNotification.error({
            title: MESSAGE.STATUS.FAILED,
            message: 'Xóa buổi phát sóng thất bại!',
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

<style lang="scss" src="./ManageBroadcast.scss"></style>
