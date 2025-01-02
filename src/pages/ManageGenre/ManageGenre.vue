<template>
  <div class="manage-genre-container">
    <div class="header-table">
      <h2>Danh sách Thể loại</h2>

      <!-- <RouterLink :to="{ path: '/addgenre' }"> -->

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
        Thêm thể loại
      </a-button>

      <!-- </RouterLink> -->
    </div>

    <div class="table-tools">
      <a-input-search
        class="search-genre"
        v-model:value="searchValue"
        placeholder="Nhập têm thể loại để tìm kiếm..."
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
          Xóa thể loại
        </a-button>
      </div>
    </div>

    <div class="genre-table">
      <a-table
        class="ant-table-striped table-app-bg-header"
        :row-class-name="
          (_record: any, index: number) =>
            index % 2 === 1 ? 'table-striped' : null
        "
        :data-source="dataGenre"
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
                  <el-dropdown-item @click="onClickEditGenre(record)">
                    Chỉnh sửa
                  </el-dropdown-item>
                  <el-dropdown-item
                    @click="onClickDeleteGenre(record)"
                    class="menu-delete-genre"
                  >
                    Xóa thể loại
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </template>
      </a-table>

      <el-dialog
        class="add-genre-dialog"
        v-model="modalAddVisible"
        :title="modalAddTitle"
        align-center
        style="min-width: 600px"
      >
        <!-- width="500" -->
        <a-form
          ref="formRef"
          name="genre-form"
          class="genre-form"
          :model="formAddGenre"
          hideRequiredMark
        >
          <!-- @finish="handleFinish" -->

          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item
                label="Tên thể loại"
                name="name"
                :rules="[
                  {
                    required: true,
                    message: 'Vui lòng nhập tên thể loại!',
                    trigger: ['change', 'blur']
                  }
                ]"
              >
                <a-input
                  v-model:value="formAddGenre.name"
                  placeholder="Tên thể loại..."
                  allow-clear
                >
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="Tên Tiếng Việt"
                name="name_vietsub"
                :rules="[
                  {
                    required: true,
                    message: 'Vui lòng nhập tên Tiếng Việt!',
                    trigger: ['change', 'blur']
                  }
                ]"
              >
                <a-input
                  v-model:value="formAddGenre.name_vietsub"
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
                  v-model:value="formAddGenre.short_name"
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
  getAllGenre,
  CreateGenre,
  UpdateGenre,
  DeleteGenre,
  DeleteMultipleGenre,
  SearchGenre
} from '@/services/genres';
import type { genre } from '@/types';
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
const dataGenre = ref<any[]>([]);
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
    title: 'Tên thể loại',
    dataIndex: 'name',
    width: 200,
    sorter: true,
    fixed: 'left'
  },
  {
    title: 'Tên Tiếng Việt',
    dataIndex: 'name_vietsub',
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
const formAddGenre = reactive({
  id: '',
  name: '',
  name_vietsub: '',
  short_name: ''
});
const modalAddTitle = ref<string>('Thêm mới thể loại');
const isEdit = ref<boolean>(false);
const currentEditGenre = ref<genre>();
const loadingAdd = ref<boolean>(false);
const disabledAdd = ref<boolean>(true);
const searchValue = ref<string>('');
const selectedRowKeys = ref<string[] | number[]>([]);
const hasSelected = computed(() => selectedRowKeys.value.length > 0);

const getData = () => {
  loading.value = true;

  getAllGenre()
    .then((response) => {
      dataGenre.value = response?.results;
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
  modalAddTitle.value = 'Thêm mới thể loại';
  resetFeild();
  modalAddVisible.value = true;
};

const onSubmitFormAdd = () => {
  if (!formRef.value) return;

  formRef.value
    .validateFields()
    .then(async (values) => {
      loadingAdd.value = true;

      CreateGenre(values as genre)
        .then((response) => {
          if (response?.success) {
            ElNotification.success({
              title: MESSAGE.STATUS.SUCCESS,
              message: 'Thêm mới thể loại thành công!',
              duration: MESSAGE.DURATION.DEFAULT
            });
          } else {
            ElNotification.error({
              title: MESSAGE.STATUS.FAILED,
              message: 'Thêm mới thể loại thất bại!',
              duration: MESSAGE.DURATION.DEFAULT
            });
          }
        })
        .catch((e) => {
          ElNotification.error({
            title: MESSAGE.STATUS.FAILED,
            message: 'Thêm mới thể loại thất bại!',
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
  formAddGenre.id = '';
  formAddGenre.name = '';
  formAddGenre.name_vietsub = '';
  formAddGenre.short_name = '';
};

const onClickEditGenre = (genre: any) => {
  isEdit.value = true;
  currentEditGenre.value = genre;
  modalAddTitle.value = 'Chỉnh sửa thể loại';

  formAddGenre.id = genre.id;
  formAddGenre.name = genre.name;
  formAddGenre.name_vietsub = genre.name_vietsub;
  formAddGenre.short_name = genre.short_name;

  modalAddVisible.value = true;
};

const onSubmitFormEdit = () => {
  if (!formRef.value) return;

  formRef.value
    .validateFields()
    .then(async (values) => {
      loadingAdd.value = true;

      values.id = formAddGenre.id;

      UpdateGenre(values as genre)
        .then((response) => {
          if (response?.success) {
            ElNotification.success({
              title: MESSAGE.STATUS.SUCCESS,
              message: 'Chỉnh sửa thể loại thành công!',
              duration: MESSAGE.DURATION.DEFAULT
            });
          } else {
            ElNotification.error({
              title: MESSAGE.STATUS.FAILED,
              message: 'Chỉnh sửa thể loại thất bại!',
              duration: MESSAGE.DURATION.DEFAULT
            });
          }
        })
        .catch((e) => {
          ElNotification.error({
            title: MESSAGE.STATUS.FAILED,
            message: 'Chỉnh sửa thể loại thất bại!',
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

const onClickDeleteGenre = (genre: any) => {
  ElMessageBox.confirm('Bạn có chắc muốn xóa thể loại này không?', {
    title: 'Thông báo!',
    confirmButtonText: 'Có',
    cancelButtonText: 'Không'
  })
    .then(() => {
      DeleteGenre(genre.id)
        .then((response) => {
          if (response?.success) {
            ElNotification.success({
              title: MESSAGE.STATUS.SUCCESS,
              message: 'Xóa thể loại thành công!',
              duration: MESSAGE.DURATION.DEFAULT
            });
          } else {
            ElNotification.error({
              title: MESSAGE.STATUS.FAILED,
              message: 'Xóa thể loại thất bại!',
              duration: MESSAGE.DURATION.DEFAULT
            });
          }
        })
        .catch((e) => {
          ElNotification.error({
            title: MESSAGE.STATUS.FAILED,
            message: 'Xóa thể loại thất bại!',
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

  SearchGenre(searchQuery.trim())
    .then((response) => {
      dataGenre.value = response?.results;
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
  ElMessageBox.confirm('Bạn có chắc muốn xóa các thể loại này không?', {
    title: 'Thông báo!',
    confirmButtonText: 'Có',
    cancelButtonText: 'Không'
  })
    .then(() => {
      DeleteMultipleGenre(selectedRowKeys.value)
        .then((response) => {
          if (response?.success) {
            ElNotification.success({
              title: MESSAGE.STATUS.SUCCESS,
              message: 'Xóa thể loại thành công!',
              duration: MESSAGE.DURATION.DEFAULT
            });
          } else {
            ElNotification.error({
              title: MESSAGE.STATUS.FAILED,
              message: 'Xóa thể loại thất bại!',
              duration: MESSAGE.DURATION.DEFAULT
            });
          }
        })
        .catch((e) => {
          ElNotification.error({
            title: MESSAGE.STATUS.FAILED,
            message: 'Xóa thể loại thất bại!',
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

<style lang="scss" src="./ManageGenre.scss"></style>
