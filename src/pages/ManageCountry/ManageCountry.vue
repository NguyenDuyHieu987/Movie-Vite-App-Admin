<template>
  <div class="page-container padding-content">
    <div class="manage-country-container">
      <div class="header-table">
        <h2>Danh sách Quốc gia</h2>

        <!-- <RouterLink :to="{ path: '/addcountry' }"> -->

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
          Thêm quốc gia
        </a-button>

        <!-- </RouterLink> -->
      </div>

      <div class="table-tools">
        <a-input-search
          class="search-country"
          v-model:value="searchValue"
          placeholder="Nhập têm quốc gia để tìm kiếm..."
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
            Xóa quốc gia
          </a-button>
        </div>
      </div>

      <div class="country-table">
        <a-table
          class="ant-table-striped table-app-bg-header"
          :row-class-name="
            (_record: any, index: number) =>
              index % 2 === 1 ? 'table-striped' : null
          "
          :data-source="dataCountry"
          :columns="columns"
          :row-key="(record: any) => record.iso_639_1"
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
                :to="`/YourAccount/invoices/${record?.iso_639_1}`"
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
                    <el-dropdown-item @click="onClickEditCountry(record)">
                      Chỉnh sửa
                    </el-dropdown-item>
                    <el-dropdown-item
                      @click="onClickDeleteCountry(record)"
                      class="menu-delete-country"
                    >
                      <el-text type="danger">Xóa quốc gia</el-text>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </template>
        </a-table>

        <el-dialog
          class="add-country-dialog"
          v-model="modalAddVisible"
          :title="modalAddTitle"
          align-center
          style="min-width: 600px"
        >
          <!-- width="500" -->
          <a-form
            ref="formRef"
            name="country-form"
            class="country-form"
            :model="formAddCountry"
            hideRequiredMark
          >
            <!-- @finish="handleFinish" -->

            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item
                  label="Tên quốc gia"
                  name="english_name"
                  :rules="[
                    {
                      required: true,
                      message: 'Vui lòng nhập tên quốc gia!',
                      trigger: ['change', 'blur']
                    }
                  ]"
                >
                  <a-input
                    v-model:value="formAddCountry.english_name"
                    placeholder="Tên quốc gia..."
                    allow-clear
                  >
                  </a-input>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  label="Tên Tiếng Việt"
                  name="name"
                  :rules="[
                    {
                      required: true,
                      message: 'Vui lòng nhập tên Tiếng Việt!',
                      trigger: ['change', 'blur']
                    }
                  ]"
                >
                  <a-input
                    v-model:value="formAddCountry.name"
                    placeholder="Tên Tiếng Việt..."
                    allow-clear
                  >
                  </a-input>
                </a-form-item>
              </a-col>
            </a-row>

            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item
                  label="Tên rút gọn"
                  name="short_name"
                  :rules="[
                    {
                      required: true,
                      message: 'Vui lòng nhập tên rút gọn!',
                      trigger: ['change', 'blur']
                    }
                  ]"
                >
                  <a-input
                    v-model:value="formAddCountry.short_name"
                    placeholder="Tên rút gọn..."
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
  getAllCountry,
  CreateCountry,
  UpdateCountry,
  DeleteCountry,
  DeleteMultipleCountry,
  SearchCountry
} from '@/services/country';
import type { country } from '@/types';
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
const dataCountry = ref<any[]>([]);
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
    title: 'Tên quốc gia',
    dataIndex: 'english_name',
    width: 200,
    sorter: true,
    fixed: 'left'
  },
  {
    title: 'Tên Tiếng Việt',
    dataIndex: 'name',
    width: 200,
    sorter: true
  },
  {
    title: 'Tên rút gọn',
    dataIndex: 'short_name',
    sorter: true,
    width: 120
  },
  {
    title: 'Hành động',
    dataIndex: 'action',
    width: 100,
    fixed: 'right'
  }
];
const modalAddVisible = ref<boolean>(false);
const modalUploadVideoVisible = ref<boolean>(false);
const formAddCountry = reactive({
  iso_639_1: '',
  name: '',
  english_name: '',
  short_name: ''
});
const modalAddTitle = ref<string>('Thêm mới quốc gia');
const isEdit = ref<boolean>(false);
const currentEditCountry = ref<country>();
const loadingAdd = ref<boolean>(false);
const disabledAdd = ref<boolean>(true);
const searchValue = ref<string>('');
const selectedRowKeys = ref<string[] | number[]>([]);
const hasSelected = computed(() => selectedRowKeys.value.length > 0);

const getData = () => {
  loading.value = true;

  getAllCountry()
    .then((response) => {
      dataCountry.value = response?.results;
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
  modalAddTitle.value = 'Thêm mới quốc gia';
  resetFeild();
  modalAddVisible.value = true;
};

const onSubmitFormAdd = () => {
  if (!formRef.value) return;

  formRef.value
    .validateFields()
    .then(async (values) => {
      loadingAdd.value = true;

      CreateCountry(values as country)
        .then((response) => {
          if (response?.success) {
            ElNotification.success({
              title: MESSAGE.STATUS.SUCCESS,
              message: 'Thêm mới quốc gia thành công!',
              duration: MESSAGE.DURATION.DEFAULT
            });
          } else {
            ElNotification.error({
              title: MESSAGE.STATUS.FAILED,
              message: response?.message || 'Thêm mới quốc gia thất bại!',
              duration: MESSAGE.DURATION.DEFAULT
            });
          }
        })
        .catch((e) => {
          ElNotification.error({
            title: MESSAGE.STATUS.FAILED,
            message: 'Thêm mới quốc gia thất bại!',
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
  formAddCountry.iso_639_1 = '';
  formAddCountry.english_name = '';
  formAddCountry.name = '';
  formAddCountry.short_name = '';
};

const onClickEditCountry = (country: any) => {
  isEdit.value = true;
  currentEditCountry.value = country;
  modalAddTitle.value = 'Chỉnh sửa quốc gia';

  formAddCountry.iso_639_1 = country.iso_639_1;
  formAddCountry.english_name = country.english_name;
  formAddCountry.name = country.name;
  formAddCountry.short_name = country.short_name;

  modalAddVisible.value = true;
};

const onSubmitFormEdit = () => {
  if (!formRef.value) return;

  formRef.value
    .validateFields()
    .then(async (values) => {
      loadingAdd.value = true;

      values.iso_639_1 = formAddCountry.iso_639_1;

      UpdateCountry(values as country)
        .then((response) => {
          if (response?.success) {
            ElNotification.success({
              title: MESSAGE.STATUS.SUCCESS,
              message: 'Chỉnh sửa quốc gia thành công!',
              duration: MESSAGE.DURATION.DEFAULT
            });
          } else {
            ElNotification.error({
              title: MESSAGE.STATUS.FAILED,
              message: response?.message || 'Chỉnh sửa quốc gia thất bại!',
              duration: MESSAGE.DURATION.DEFAULT
            });
          }
        })
        .catch((e) => {
          ElNotification.error({
            title: MESSAGE.STATUS.FAILED,
            message: 'Chỉnh sửa quốc gia thất bại!',
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

const onClickDeleteCountry = (country: any) => {
  ElMessageBox.confirm('Bạn có chắc muốn xóa quốc gia này không?', {
    title: 'Thông báo!',
    confirmButtonText: 'Có',
    cancelButtonText: 'Không'
  })
    .then(() => {
      DeleteCountry(country.iso_639_1)
        .then((response) => {
          if (response?.success) {
            ElNotification.success({
              title: MESSAGE.STATUS.SUCCESS,
              message: 'Xóa quốc gia thành công!',
              duration: MESSAGE.DURATION.DEFAULT
            });
          } else {
            ElNotification.error({
              title: MESSAGE.STATUS.FAILED,
              message: 'Xóa quốc gia thất bại!',
              duration: MESSAGE.DURATION.DEFAULT
            });
          }
        })
        .catch((e) => {
          ElNotification.error({
            title: MESSAGE.STATUS.FAILED,
            message: 'Xóa quốc gia thất bại!',
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

  SearchCountry(searchQuery.trim())
    .then((response) => {
      dataCountry.value = response?.results;
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
  ElMessageBox.confirm('Bạn có chắc muốn xóa các quốc gia này không?', {
    title: 'Thông báo!',
    confirmButtonText: 'Có',
    cancelButtonText: 'Không'
  })
    .then(() => {
      DeleteMultipleCountry(selectedRowKeys.value)
        .then((response) => {
          if (response?.success) {
            ElNotification.success({
              title: MESSAGE.STATUS.SUCCESS,
              message: 'Xóa quốc gia thành công!',
              duration: MESSAGE.DURATION.DEFAULT
            });
          } else {
            ElNotification.error({
              title: MESSAGE.STATUS.FAILED,
              message: 'Xóa quốc gia thất bại!',
              duration: MESSAGE.DURATION.DEFAULT
            });
          }
        })
        .catch((e) => {
          ElNotification.error({
            title: MESSAGE.STATUS.FAILED,
            message: 'Xóa quốc gia thất bại!',
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

<style lang="scss" src="./ManageCountry.scss"></style>
