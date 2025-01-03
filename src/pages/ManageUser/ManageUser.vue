<template>
  <div class="manage-user-container">
    <div class="header-table">
      <h2>Danh sách Người dùng</h2>

      <!-- <RouterLink :to="{ path: '/adduser' }"> -->

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
        Thêm người dùng
      </a-button>

      <!-- </RouterLink> -->
    </div>

    <div class="table-tools">
      <a-input-search
        class="search-user"
        v-model:value="searchValue"
        placeholder="Nhập têm người dùng để tìm kiếm..."
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
          Xóa người dùng
        </a-button>
      </div>
    </div>

    <div class="user-table">
      <a-table
        class="ant-table-striped table-app-bg-header"
        :row-class-name="
          (_record: any, index: number) =>
            index % 2 === 1 ? 'table-striped' : null
        "
        :data-source="dataAccount"
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
          <template v-if="column.dataIndex === 'role'">
            {{ _.capitalize(value) }}
          </template>
          <template v-if="column.dataIndex === 'auth_type'">
            {{ _.capitalize(value) }}
          </template>
          <template v-if="column.dataIndex === 'avatar'">
            <div class="avatar-box">
              <img
                :width="100"
                :height="100"
                :src="getUserAvatar(value)"
              />
            </div>
          </template>
          <template v-if="column.dataIndex === 'status'">
            <a-tag
              v-if="value == 'active'"
              color="green"
            >
              Hoạt động
            </a-tag>
            <a-tag
              v-else-if="value == 'banned'"
              color="magenta"
            >
              Bị ban
            </a-tag>
            <a-tag
              v-else-if="value == 'deleted'"
              color="red"
            >
              Đã xóa
            </a-tag>
          </template>
          <template v-if="column.dataIndex === 'created_at'">
            {{
              dayjs(value)
                // .local()
                // .utc()
                .format('DD/MM/YYYY hh:mm A')
            }}
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
                  <el-dropdown-item @click="onClickEditAccount(record)">
                    Chỉnh sửa
                  </el-dropdown-item>
                  <el-dropdown-item
                    @click="onClickDeleteAccount(record)"
                    class="menu-delete-user"
                  >
                    Xóa người dùng
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </template>
      </a-table>

      <el-dialog
        class="add-user-dialog"
        v-model="modalAddVisible"
        :title="modalAddTitle"
        align-center
        style="min-width: 600px"
      >
        <!-- width="500" -->
        <a-form
          ref="formRef"
          name="user-form"
          class="user-form"
          :model="formAddAccount"
          hideRequiredMark
        >
          <!-- @finish="handleFinish" -->

          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item
                label="Tên tài khoản"
                name="username"
                :rules="[
                  {
                    required: true,
                    message: 'Vui lòng nhập tên tài khoản!',
                    trigger: ['change', 'blur']
                  }
                ]"
              >
                <a-input
                  v-model:value="formAddAccount.username"
                  placeholder="Tên tài khoản..."
                  allow-clear
                >
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="Họ và tên"
                name="full_name"
                :rules="[
                  {
                    required: true,
                    message: 'Vui lòng nhập họ và tên',
                    trigger: ['change', 'blur']
                  }
                ]"
              >
                <a-input
                  v-model:value="formAddAccount.full_name"
                  placeholder="Họ và tên..."
                  allow-clear
                >
                </a-input>
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item
                label="Email"
                name="email"
                :rules="[
                  {
                    required: true,
                    message: 'Vui lòng nhập email!',
                    trigger: ['change', 'blur']
                  },
                  {
                    message:
                      'Vui lòng nhập đúng định dạng email (vd: ...@gmail.com)!',
                    pattern: new RegExp(
                      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
                    ),
                    trigger: ['change', 'blur']
                  }
                ]"
              >
                <a-input
                  v-model:value="formAddAccount.email"
                  placeholder="Email..."
                  allow-clear
                >
                </a-input>
              </a-form-item>
            </a-col>

            <a-col :span="12">
              <a-form-item
                label="Xác thực băng"
                name="auth_type"
                :rules="[
                  {
                    required: true,
                    message: 'Vui lòng chọn phương thức xác thực!',
                    trigger: ['change', 'blur']
                  }
                ]"
              >
                <a-select v-model:value="formAddAccount.auth_type">
                  <a-select-option value="email">Email</a-select-option>
                  <a-select-option value="google">Google</a-select-option>
                  <a-select-option value="facebook">Facebook</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="16">
            <a-col :span="8">
              <a-form-item
                label="Quyền"
                name="role"
                :rules="[
                  {
                    required: true,
                    message: 'Vui lòng nhập quyền!',
                    trigger: ['change', 'blur']
                  }
                ]"
              >
                <a-select v-model:value="formAddAccount.role">
                  <a-select-option value="normal">Normal</a-select-option>
                  <a-select-option value="admin">Admin</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :span="8">
              <a-form-item
                label="Xác thực băng"
                name="avatar"
                :rules="[
                  {
                    required: true,
                    message: 'Vui lòng chọn phương thức xác thực!',
                    trigger: ['change', 'blur']
                  }
                ]"
              >
                <el-input-number
                  v-model="formAddAccount.avatar"
                  :min="1"
                  :max="10"
                  :step="1"
                  size="large"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>

            <a-col :span="8">
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
                <a-select v-model:value="formAddAccount.status">
                  <a-select-option value="active">Hoạt động</a-select-option>
                  <a-select-option value="banned">Bị ban</a-select-option>
                  <a-select-option value="deleted">Đã xóa</a-select-option>
                </a-select>
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
  getAllAccount,
  CreateAccount,
  UpdateAccount,
  DeleteAccount,
  DeleteMultipleAccount,
  SearchAccount
} from '@/services/account';
import { getUserAvatar } from '@/services/image';
import type { user } from '@/types';
import { ElNotification, ElMessageBox } from 'element-plus';
import { ArrowDown } from '@element-plus/icons-vue';
import { MESSAGE } from '@/common';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import _ from 'lodash';

dayjs.extend(utc);

const formRef = ref<FormInstance>();
const formVidRef = ref<FormInstance>();
const inputPosterFile = ref<HTMLInputElement | null>();
const inputBackdropFile = ref<HTMLInputElement | null>();
const inputVideoFile = ref<HTMLInputElement | null>();
const utils = useUtils();
const store = useStore();
const dataAccount = ref<any[]>([]);
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
    title: 'Tên tài khoản',
    dataIndex: 'username',
    width: 150,
    sorter: true,
    fixed: 'left'
  },
  {
    title: 'Họ và tên',
    dataIndex: 'full_name',
    width: 200,
    sorter: true
  },
  {
    title: 'Email',
    dataIndex: 'email',
    sorter: true,
    width: 200
  },
  {
    title: 'Quyền',
    dataIndex: 'role',
    sorter: true,
    width: 120
  },
  {
    title: 'Ảnh đại diện',
    dataIndex: 'avatar',
    sorter: true,
    width: 150
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    sorter: true,
    width: 150
  },
  {
    title: 'Xác thực bằng',
    dataIndex: 'auth_type',
    sorter: true,
    width: 120
  },
  {
    title: 'Ngày tạo',
    dataIndex: 'created_at',
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
const modalAddVisible = ref<boolean>(false);
const modalUploadVideoVisible = ref<boolean>(false);
const formAddAccount = reactive({
  id: '',
  username: '',
  full_name: '',
  email: '',
  role: 'normal',
  auth_type: 'email',
  status: 'active',
  avatar: 1
});
const modalAddTitle = ref<string>('Thêm mới người dùng');
const isEdit = ref<boolean>(false);
const currentEditAccount = ref<user>();
const loadingAdd = ref<boolean>(false);
const disabledAdd = ref<boolean>(true);
const searchValue = ref<string>('');
const selectedRowKeys = ref<string[] | number[]>([]);
const hasSelected = computed(() => selectedRowKeys.value.length > 0);

const getData = () => {
  loading.value = true;

  getAllAccount()
    .then((response) => {
      dataAccount.value = response?.results;
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
  modalAddTitle.value = 'Thêm mới người dùng';
  resetFeild();
  modalAddVisible.value = true;
};

const onSubmitFormAdd = () => {
  if (!formRef.value) return;

  formRef.value
    .validateFields()
    .then(async (values) => {
      loadingAdd.value = true;

      CreateAccount(values as user)
        .then((response) => {
          if (response?.success) {
            ElNotification.success({
              title: MESSAGE.STATUS.SUCCESS,
              message: 'Thêm mới người dùng thành công!',
              duration: MESSAGE.DURATION.DEFAULT
            });
          } else {
            ElNotification.error({
              title: MESSAGE.STATUS.FAILED,
              message: response?.message || 'Thêm mới người dùng thất bại!',
              duration: MESSAGE.DURATION.DEFAULT
            });
          }
        })
        .catch((e) => {
          ElNotification.error({
            title: MESSAGE.STATUS.FAILED,
            message: 'Thêm mới người dùng thất bại!',
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
  formAddAccount.id = '';
  formAddAccount.username = '';
  formAddAccount.full_name = '';
  formAddAccount.email = '';
  formAddAccount.auth_type = 'email';
  formAddAccount.role = 'normal';
  formAddAccount.status = 'active';
  formAddAccount.avatar = 1;
};

const onClickEditAccount = (account: any) => {
  isEdit.value = true;
  currentEditAccount.value = account;
  modalAddTitle.value = 'Chỉnh sửa người dùng';

  formAddAccount.id = account.id;
  formAddAccount.username = account.username;
  formAddAccount.email = account.email;
  formAddAccount.full_name = account.full_name;
  formAddAccount.auth_type = account.auth_type;
  formAddAccount.role = account.role;
  formAddAccount.status = account.status;
  formAddAccount.avatar = isNaN(account.avatar) ? 1 : account.avatar;

  modalAddVisible.value = true;
};

const onSubmitFormEdit = () => {
  if (!formRef.value) return;

  formRef.value
    .validateFields()
    .then(async (values) => {
      loadingAdd.value = true;

      values.id = formAddAccount.id;

      UpdateAccount(values as user)
        .then((response) => {
          if (response?.success) {
            ElNotification.success({
              title: MESSAGE.STATUS.SUCCESS,
              message: 'Chỉnh sửa người dùng thành công!',
              duration: MESSAGE.DURATION.DEFAULT
            });
          } else {
            ElNotification.error({
              title: MESSAGE.STATUS.FAILED,
              message: response?.message || 'Chỉnh sửa người dùng thất bại!',
              duration: MESSAGE.DURATION.DEFAULT
            });
          }
        })
        .catch((e) => {
          ElNotification.error({
            title: MESSAGE.STATUS.FAILED,
            message: 'Chỉnh sửa người dùng thất bại!',
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

const onClickDeleteAccount = (genre: any) => {
  ElMessageBox.confirm('Bạn có chắc muốn xóa người dùng này không?', {
    title: 'Thông báo!',
    confirmButtonText: 'Có',
    cancelButtonText: 'Không'
  })
    .then(() => {
      DeleteAccount(genre.id)
        .then((response) => {
          if (response?.success) {
            ElNotification.success({
              title: MESSAGE.STATUS.SUCCESS,
              message: 'Xóa người dùng thành công!',
              duration: MESSAGE.DURATION.DEFAULT
            });
          } else {
            ElNotification.error({
              title: MESSAGE.STATUS.FAILED,
              message: 'Xóa người dùng thất bại!',
              duration: MESSAGE.DURATION.DEFAULT
            });
          }
        })
        .catch((e) => {
          ElNotification.error({
            title: MESSAGE.STATUS.FAILED,
            message: 'Xóa người dùng thất bại!',
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

  SearchAccount(searchQuery.trim())
    .then((response) => {
      dataAccount.value = response?.results;
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
  ElMessageBox.confirm('Bạn có chắc muốn xóa các người dùng này không?', {
    title: 'Thông báo!',
    confirmButtonText: 'Có',
    cancelButtonText: 'Không'
  })
    .then(() => {
      DeleteMultipleAccount(selectedRowKeys.value)
        .then((response) => {
          if (response?.success) {
            ElNotification.success({
              title: MESSAGE.STATUS.SUCCESS,
              message: 'Xóa người dùng thành công!',
              duration: MESSAGE.DURATION.DEFAULT
            });
          } else {
            ElNotification.error({
              title: MESSAGE.STATUS.FAILED,
              message: 'Xóa người dùng thất bại!',
              duration: MESSAGE.DURATION.DEFAULT
            });
          }
        })
        .catch((e) => {
          ElNotification.error({
            title: MESSAGE.STATUS.FAILED,
            message: 'Xóa người dùng thất bại!',
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

<style lang="scss" src="./ManageUser.scss"></style>
