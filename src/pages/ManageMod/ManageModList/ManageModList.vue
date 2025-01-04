<template>
  <div class="manage-modlist-container">
    <div class="header-table">
      <h2>Danh sách Dữ liệu danh mục</h2>

      <!-- <RouterLink :to="{ path: '/addmodlist' }"> -->

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
        Thêm danh mục
      </a-button>

      <!-- </RouterLink> -->
    </div>

    <div class="table-tools">
      <a-input-search
        class="search-modlist"
        v-model:value="searchValue"
        placeholder="Nhập têm danh mục để tìm kiếm..."
        enter-button="Tìm kiếm"
        @search="onSearch"
      />

      <div class="right-actions">
        <a-select
          v-model:value="filterType"
          :options="optionsModType"
          @select="selectTypeMod"
          style="width: 100px"
        >
        </a-select>
        <a-button
          class="reset-btn"
          type="primary"
          @click="
            () => {
              filterType = 'all';
              getData();
            }
          "
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
          Xóa danh mục
        </a-button>
      </div>
    </div>

    <div class="modlist-table">
      <a-table
        class="ant-table-striped table-app-bg-header"
        :row-class-name="
          (_record: any, index: number) =>
            index % 2 === 1 ? 'table-striped' : null
        "
        :data-source="dataModList"
        :columns="columns"
        :row-key="(record: any) => record._id"
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
          <template v-if="column.dataIndex === 'modData.name'">
            {{ record.modData.name }}
          </template>
          <template v-if="column.dataIndex === 'movieData.name'">
            {{ record.movieData.name }}
          </template>
          <template v-if="column.dataIndex === 'movieData.media_type'">
            {{ record.movieData.media_type == 'movie' ? 'Phim lẻ' : null }}
            {{ record.movieData.media_type == 'tv' ? 'Phim bộ' : null }}
          </template>
          <template v-if="column.dataIndex === 'action'">
            <!-- <RouterLink
              class="underline"
              :to="`/YourModList/invoices/${record?.id}`"
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
                  <el-dropdown-item @click="onClickEditModList(record)">
                    Chỉnh sửa
                  </el-dropdown-item>
                  <el-dropdown-item
                    @click="onClickDeleteModList(record)"
                    class="menu-delete-modlist"
                  >
                    <el-text type="danger">Xóa danh mục</el-text>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </template>
      </a-table>

      <el-dialog
        class="add-modlist-dialog"
        v-model="modalAddVisible"
        :title="modalAddTitle"
        align-center
        style="min-width: 800px"
      >
        <!-- width="500" -->
        <a-form
          ref="formRef"
          name="modlist-form"
          class="modlist-form"
          :model="formAddModList"
          hideRequiredMark
        >
          <!-- @finish="handleFinish" -->

          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item
                label="Loại danh mục"
                name="modId"
                :rules="[
                  {
                    required: true,
                    message: 'Vui lòng chọn loại danh mục!',
                    trigger: ['change', 'blur']
                  }
                ]"
              >
                <a-select
                  v-model:value="formAddModList.modId"
                  :options="optionsMod"
                  @select="selectMod"
                >
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>

          <a-row>
            <a-col :span="24">
              <a-input-search
                class="search-movie"
                v-model:value="searchMovieValue"
                placeholder="Nhập têm phim để tìm kiếm..."
                enter-button="Tìm kiếm"
                @search="onSearchMovie"
                style="width: 350px; margin-bottom: 15px"
              />

              <a-table
                class="ant-table-striped table-app-bg-header"
                :row-class-name="
                  (_record: any, index: number) =>
                    index % 2 === 1 ? 'table-striped' : null
                "
                :data-source="dataMovie"
                :columns="columnsMovie"
                :row-key="(record: any) => record.id"
                :loading="loadingMovie"
                :scroll="{
                  y: '75vh',
                  x: 900
                }"
                bordered
                sticky
                :row-selection="{
                  selectedRowKeys: formAddModList.listMovieId,
                  onChange: onSelectChangeMovie
                }"
              >
                <!-- :pagination="{ pageSize: pageSizeTable, onChange: onChangePage }" -->
                <!-- @change="onChangeTable" -->
                <template #bodyCell="{ column, text, value, record, index }">
                  <template v-if="column.dataIndex === 'no'">
                    {{ index + 1 }}
                  </template>
                </template>
              </a-table>
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
  getAllModList,
  CreateModList,
  UpdateModList,
  DeleteModList,
  DeleteMultipleModList,
  SearchModList
} from '@/services/modList';
import { getUserAvatar } from '@/services/image';
import type { modList } from '@/types';
import { ElNotification, ElMessageBox } from 'element-plus';
import { ArrowDown } from '@element-plus/icons-vue';
import { MESSAGE } from '@/common';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import _, { last } from 'lodash';
import { getAllMod } from '@/services/mods';
import { GetAllMovie, SearchMovie } from '@/services/movie';

dayjs.extend(utc);

const formRef = ref<FormInstance>();
const formVidRef = ref<FormInstance>();
const inputPosterFile = ref<HTMLInputElement | null>();
const inputBackdropFile = ref<HTMLInputElement | null>();
const inputVideoFile = ref<HTMLInputElement | null>();
const utils = useUtils();
const store = useStore();
const dataMod = ref<any[]>([]);
const dataModList = ref<any[]>([]);
const dataMovie = ref<any[]>([]);
const page = ref<number>(1);
const pageSizeTable = ref<number>(20);
const pageSize = ref<number>(-1);
const total = ref<number>(0);
const loading = ref<boolean>(false);
const loadingMovie = ref<boolean>(false);
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
    title: 'Tên danh mục',
    dataIndex: 'modData.name',
    width: 150,
    sorter: true,
    fixed: 'left'
  },
  {
    title: 'Tên phim',
    dataIndex: 'movieData.name',
    width: 200,
    sorter: true
  },
  {
    title: 'Loại phim',
    dataIndex: 'movieData.media_type',
    sorter: true,
    width: 200
  },
  {
    title: 'Hành động',
    dataIndex: 'action',
    width: 150,
    fixed: 'right'
  }
];
const columnsMovie: TableColumnType[] = [
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
    title: 'Tên phim',
    dataIndex: 'name',
    width: 200,
    sorter: true,
    fixed: 'left'
  },
  {
    title: 'Tên phim gốc',
    dataIndex: 'original_name',
    width: 200,
    sorter: true
  }
];
const modalAddVisible = ref<boolean>(false);
const modalUploadVideoVisible = ref<boolean>(false);
const formAddModList = reactive<{
  _id: string;
  id: string;
  listMovieId: string[] | number[];
  modId: string;
}>({
  _id: '',
  id: '',
  listMovieId: [],
  modId: ''
});
const modalAddTitle = ref<string>('Thêm mới danh mục');
const isEdit = ref<boolean>(false);
const currentEditModList = ref<modList>();
const loadingAdd = ref<boolean>(false);
const disabledAdd = ref<boolean>(true);
const searchValue = ref<string>('');
const searchMovieValue = ref<string>('');
const optionsModType = ref<
  { label: string; value: string; disabled: boolean }[]
>([]);
const optionsMod = ref<{ label: string; value: string; disabled: boolean }[]>(
  []
);
const filterType = ref<string>('all');
const selectedMediaType = ref<string>('all');
const selectedRowKeys = ref<string[] | number[]>([]);
const hasSelected = computed(() => selectedRowKeys.value.length > 0);

const getData = () => {
  loading.value = true;

  getAllModList(filterType.value, page.value, pageSize.value)
    .then((response) => {
      dataModList.value = response?.results;
    })
    .catch((e) => {})
    .finally(() => {
      loading.value = false;
    });
};

const getDataMovie = () => {
  loadingMovie.value = true;

  GetAllMovie(selectedMediaType.value, 1, -1)
    .then((response) => {
      dataMovie.value = response?.results;
    })
    .catch((e) => {})
    .finally(() => {
      loadingMovie.value = false;
    });
};

getAllMod()
  .then((response) => {
    dataMod.value = response?.results;
    optionsMod.value = dataMod.value.map((item) => ({
      label: `${item.name}`,
      value: item.id,
      disabled: false
    }));

    optionsModType.value = dataMod.value.map((item) => ({
      label: `${item.name}`,
      value: item.type,
      disabled: false
    }));

    optionsModType.value.unshift({
      label: 'Tất cả',
      value: 'all',
      disabled: false
    });
  })
  .catch((e) => {})
  .finally(() => {});

getData();
getDataMovie();

// const onChangeTable = (
//   pagination,
//   filters,
//   sorter,
//   { action, currentDataSource }
// ) => {};

const selectMod = (value: string) => {
  selectedMediaType.value = dataMod.value.find(
    (item) => item.id == value
  ).media_type;
  getDataMovie();
};

const selectTypeMod = (value: string) => {
  getData();
};

const onChangePage = (page: number, pageSize: number) => {
  pageSizeTable.value = pageSize;
};

const onClickAddBtn = () => {
  isEdit.value = false;
  modalAddTitle.value = 'Thêm mới danh mục';
  resetFeild();
  modalAddVisible.value = true;
};

const onSubmitFormAdd = () => {
  if (!formRef.value) return;

  formRef.value
    .validateFields()
    .then(async (values) => {
      loadingAdd.value = true;

      values.listMovieId = formAddModList.listMovieId;

      CreateModList(values as modList)
        .then((response) => {
          if (response?.success) {
            ElNotification.success({
              title: MESSAGE.STATUS.SUCCESS,
              message: 'Thêm mới danh mục thành công!',
              duration: MESSAGE.DURATION.DEFAULT
            });
          } else {
            ElNotification.error({
              title: MESSAGE.STATUS.FAILED,
              message: response?.message || 'Thêm mới danh mục thất bại!',
              duration: MESSAGE.DURATION.DEFAULT
            });
          }
        })
        .catch((e) => {
          ElNotification.error({
            title: MESSAGE.STATUS.FAILED,
            message: 'Thêm mới danh mục thất bại!',
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
  formAddModList._id = '';
  formAddModList.id = '';
  formAddModList.listMovieId = [];
  formAddModList.modId = '';
};

const onClickEditModList = (modList: any) => {
  isEdit.value = true;
  currentEditModList.value = modList;
  modalAddTitle.value = 'Chỉnh sửa danh mục';

  formAddModList._id = modList._id;
  formAddModList.id = modList.movieData.id;
  formAddModList.listMovieId = [modList.movieData.id];
  formAddModList.modId = modList.modId;

  modalAddVisible.value = true;
};

const onSubmitFormEdit = () => {
  if (!formRef.value) return;

  formRef.value
    .validateFields()
    .then(async (values) => {
      loadingAdd.value = true;

      values._id = formAddModList._id;
      values.listMovieId = formAddModList.listMovieId;
      values.id = formAddModList.listMovieId[0];

      UpdateModList(values as modList)
        .then((response) => {
          if (response?.success) {
            ElNotification.success({
              title: MESSAGE.STATUS.SUCCESS,
              message: 'Chỉnh sửa danh mục thành công!',
              duration: MESSAGE.DURATION.DEFAULT
            });
          } else {
            ElNotification.error({
              title: MESSAGE.STATUS.FAILED,
              message: response?.message || 'Chỉnh sửa danh mục thất bại!',
              duration: MESSAGE.DURATION.DEFAULT
            });
          }
        })
        .catch((e) => {
          ElNotification.error({
            title: MESSAGE.STATUS.FAILED,
            message: 'Chỉnh sửa danh mục thất bại!',
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

const onClickDeleteModList = (modList: any) => {
  ElMessageBox.confirm('Bạn có chắc muốn xóa danh mục này không?', {
    title: 'Thông báo!',
    confirmButtonText: 'Có',
    cancelButtonText: 'Không'
  })
    .then(() => {
      DeleteModList(modList._id)
        .then((response) => {
          if (response?.success) {
            ElNotification.success({
              title: MESSAGE.STATUS.SUCCESS,
              message: 'Xóa danh mục thành công!',
              duration: MESSAGE.DURATION.DEFAULT
            });
          } else {
            ElNotification.error({
              title: MESSAGE.STATUS.FAILED,
              message: 'Xóa danh mục thất bại!',
              duration: MESSAGE.DURATION.DEFAULT
            });
          }
        })
        .catch((e) => {
          ElNotification.error({
            title: MESSAGE.STATUS.FAILED,
            message: 'Xóa danh mục thất bại!',
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

  SearchModList(
    searchQuery.trim(),
    filterType.value,
    page.value,
    pageSize.value
  )
    .then((response) => {
      dataModList.value = response?.results;
      page.value = response.page;
      // pageSize.value = response.page_size;
      total.value = response.total;
    })
    .catch((e) => {})
    .finally(() => {
      loading.value = false;
    });
};

const onSearchMovie = (searchQuery: string) => {
  if (!searchQuery) return;

  loadingMovie.value = true;

  SearchMovie(selectedMediaType.value, searchQuery.trim(), 1, -1)
    .then((response) => {
      dataMovie.value = response?.results;
    })
    .catch((e) => {})
    .finally(() => {
      loadingMovie.value = false;
    });
};

const onSelectChange = (selectedRowKeys1: string[] | number[]) => {
  selectedRowKeys.value = selectedRowKeys1;
};

const onSelectChangeMovie = (selectedRowKeys1: string[] | number[]) => {
  if (isEdit.value && selectedRowKeys1.length > 1) {
    selectedRowKeys1.shift();
  }

  formAddModList.listMovieId = selectedRowKeys1;
};

const onClickDeleteBtn = () => {
  ElMessageBox.confirm('Bạn có chắc muốn xóa các danh mục này không?', {
    title: 'Thông báo!',
    confirmButtonText: 'Có',
    cancelButtonText: 'Không'
  })
    .then(() => {
      DeleteMultipleModList(selectedRowKeys.value)
        .then((response) => {
          if (response?.success) {
            ElNotification.success({
              title: MESSAGE.STATUS.SUCCESS,
              message: 'Xóa danh mục thành công!',
              duration: MESSAGE.DURATION.DEFAULT
            });
          } else {
            ElNotification.error({
              title: MESSAGE.STATUS.FAILED,
              message: 'Xóa danh mục thất bại!',
              duration: MESSAGE.DURATION.DEFAULT
            });
          }
        })
        .catch((e) => {
          ElNotification.error({
            title: MESSAGE.STATUS.FAILED,
            message: 'Xóa danh mục thất bại!',
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

<style lang="scss" src="./ManageModList.scss"></style>
