<template>
  <div class="page-container padding-content">
    <div class="manage-year-container">
      <div class="header-table">
        <h2>Danh sách Năm</h2>

        <!-- <RouterLink :to="{ path: '/addyear' }"> -->

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
          Thêm năm
        </a-button>

        <!-- </RouterLink> -->
      </div>

      <div class="table-tools">
        <a-input-search
          class="search-year"
          v-model:value="searchValue"
          placeholder="Nhập têm năm để tìm kiếm..."
          enter-button="Tìm kiếm"
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
            Xóa năm
          </a-button>
        </div>
      </div>

      <div class="year-table">
        <a-table
          class="ant-table-striped table-app-bg-header"
          :row-class-name="
            (_record: any, index: number) =>
              index % 2 === 1 ? 'table-striped' : null
          "
          :data-source="dataYear"
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
            <template v-if="column.dataIndex === 'action'">
              <!-- <RouterLink
                class="underline"
                :to="`/YourAccount/invoices/${record?._id}`"
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
                    <el-dropdown-item @click="onClickEditYear(record)">
                      Chỉnh sửa
                    </el-dropdown-item>
                    <el-dropdown-item
                      @click="onClickDeleteYear(record)"
                      class="menu-delete-year"
                    >
                      <el-text type="danger">Xóa năm</el-text>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </template>
        </a-table>

        <el-dialog
          class="add-year-dialog"
          v-model="modalAddVisible"
          :title="modalAddTitle"
          align-center
          style="min-width: 600px"
        >
          <!-- width="500" -->
          <a-form
            ref="formRef"
            name="year-form"
            class="year-form"
            :model="formAddYear"
            hideRequiredMark
          >
            <!-- @finish="handleFinish" -->

            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item
                  label="Tên năm"
                  name="name"
                  :rules="[
                    {
                      required: true,
                      message: 'Vui lòng nhập tên năm!',
                      trigger: ['change', 'blur']
                    }
                  ]"
                >
                  <a-input
                    v-model:value="formAddYear.name"
                    placeholder="Tên năm..."
                    allow-clear
                  >
                  </a-input>
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
  getAllYear,
  CreateYear,
  UpdateYear,
  DeleteYear,
  DeleteMultipleYear,
  SearchYear
} from '@/services/year';
import type { year } from '@/types';
import { ElNotification, ElMessageBox } from 'element-plus';
import { ArrowDown } from '@element-plus/icons-vue';
import { MESSAGE } from '@/common';

const formRef = ref<FormInstance>();
const formVidRef = ref<FormInstance>();
const inputPosterFile = ref<HTMLInputElement | null>();
const inputBackdropFile = ref<HTMLInputElement | null>();
const inputVideoFile = ref<HTMLInputElement | null>();
const utils = useUtils();
const store = useStore();
const dataYear = ref<any[]>([]);
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
    width: '20px',
    fixed: 'left'
  },
  // {
  //   title: 'ID',
  //   dataIndex: 'id',
  //   width: 200,
  // },
  {
    title: 'Tên năm',
    dataIndex: 'name',
    width: 200,
    sorter: true
  },
  {
    title: 'Hành động',
    dataIndex: 'action',
    width: 50,
    fixed: 'right'
  }
];
const modalAddVisible = ref<boolean>(false);
const modalUploadVideoVisible = ref<boolean>(false);
const formAddYear = reactive({
  _id: '',
  name: '',
  english_name: '',
  short_name: ''
});
const modalAddTitle = ref<string>('Thêm mới năm');
const isEdit = ref<boolean>(false);
const currentEditYear = ref<year>();
const loadingAdd = ref<boolean>(false);
const disabledAdd = ref<boolean>(true);
const searchValue = ref<string>('');
const selectedRowKeys = ref<string[] | number[]>([]);
const hasSelected = computed(() => selectedRowKeys.value.length > 0);

const getData = () => {
  loading.value = true;

  getAllYear()
    .then((response) => {
      dataYear.value = response?.results;
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
  modalAddTitle.value = 'Thêm mới năm';
  resetFeild();
  modalAddVisible.value = true;
};

const onSubmitFormAdd = () => {
  if (!formRef.value) return;

  formRef.value
    .validateFields()
    .then(async (values) => {
      loadingAdd.value = true;

      CreateYear(values as year)
        .then((response) => {
          if (response?.success) {
            ElNotification.success({
              title: MESSAGE.STATUS.SUCCESS,
              message: 'Thêm mới năm thành công!',
              duration: MESSAGE.DURATION.DEFAULT
            });
          } else {
            ElNotification.error({
              title: MESSAGE.STATUS.FAILED,
              message: response?.message || 'Thêm mới năm thất bại!',
              duration: MESSAGE.DURATION.DEFAULT
            });
          }
        })
        .catch((e) => {
          ElNotification.error({
            title: MESSAGE.STATUS.FAILED,
            message: 'Thêm mới năm thất bại!',
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
  formAddYear._id = '';
  formAddYear.english_name = '';
  formAddYear.name = '';
  formAddYear.short_name = '';

  if (formRef.value) formRef.value.clearValidate();
};

const onClickEditYear = (year: any) => {
  isEdit.value = true;
  currentEditYear.value = year;
  modalAddTitle.value = 'Chỉnh sửa năm';

  formAddYear._id = year._id;
  formAddYear.english_name = year.english_name;
  formAddYear.name = year.name;
  formAddYear.short_name = year.short_name;

  if (formRef.value) formRef.value.clearValidate();

  modalAddVisible.value = true;
};

const onSubmitFormEdit = () => {
  if (!formRef.value) return;

  formRef.value
    .validateFields()
    .then(async (values) => {
      loadingAdd.value = true;

      values._id = formAddYear._id;

      UpdateYear(values as year)
        .then((response) => {
          if (response?.success) {
            ElNotification.success({
              title: MESSAGE.STATUS.SUCCESS,
              message: 'Chỉnh sửa năm thành công!',
              duration: MESSAGE.DURATION.DEFAULT
            });
          } else {
            ElNotification.error({
              title: MESSAGE.STATUS.FAILED,
              message: response?.message || 'Chỉnh sửa năm thất bại!',
              duration: MESSAGE.DURATION.DEFAULT
            });
          }
        })
        .catch((e) => {
          ElNotification.error({
            title: MESSAGE.STATUS.FAILED,
            message: 'Chỉnh sửa năm thất bại!',
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

const onClickDeleteYear = (year: any) => {
  ElMessageBox.confirm('Bạn có chắc muốn xóa năm này không?', {
    title: 'Thông báo!',
    confirmButtonText: 'Có',
    cancelButtonText: 'Không'
  })
    .then(() => {
      DeleteYear(year._id)
        .then((response) => {
          if (response?.success) {
            ElNotification.success({
              title: MESSAGE.STATUS.SUCCESS,
              message: 'Xóa năm thành công!',
              duration: MESSAGE.DURATION.DEFAULT
            });
          } else {
            ElNotification.error({
              title: MESSAGE.STATUS.FAILED,
              message: 'Xóa năm thất bại!',
              duration: MESSAGE.DURATION.DEFAULT
            });
          }
        })
        .catch((e) => {
          ElNotification.error({
            title: MESSAGE.STATUS.FAILED,
            message: 'Xóa năm thất bại!',
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

  SearchYear(searchQuery.trim())
    .then((response) => {
      dataYear.value = response?.results;
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
  ElMessageBox.confirm('Bạn có chắc muốn xóa các năm này không?', {
    title: 'Thông báo!',
    confirmButtonText: 'Có',
    cancelButtonText: 'Không'
  })
    .then(() => {
      DeleteMultipleYear(selectedRowKeys.value)
        .then((response) => {
          if (response?.success) {
            ElNotification.success({
              title: MESSAGE.STATUS.SUCCESS,
              message: 'Xóa năm thành công!',
              duration: MESSAGE.DURATION.DEFAULT
            });
          } else {
            ElNotification.error({
              title: MESSAGE.STATUS.FAILED,
              message: 'Xóa năm thất bại!',
              duration: MESSAGE.DURATION.DEFAULT
            });
          }
        })
        .catch((e) => {
          ElNotification.error({
            title: MESSAGE.STATUS.FAILED,
            message: 'Xóa năm thất bại!',
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

<style lang="scss" src="./ManageYear.scss"></style>
