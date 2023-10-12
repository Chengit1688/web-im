<template>
  <n-modal id="basic-modal" v-model:show="showModal" :show-icon="false" :closable = "false"  preset="dialog" title="用户信息" style="width: 60%">
    <n-spin :show="show">
      <n-form :model="formParams" ref="formRef" :label-width="0">
        <div style="display: flex; justify-content: end">
          <n-button type="info" v-if="formParams.is_privilege==2" @click="handlePrivilege" size="small">设为特权用户 </n-button>
          <n-button type="info" v-else @click="handleDelete" size="small">取消特权用户 </n-button>
          <n-button type="primary" class="ml-2" @click="handlePas" size="small">修改密码</n-button>
          <n-button type="success" class="ml-2" @click="handleEdit" size="small" >编辑资料 </n-button>
          <n-button type="success" class="ml-2" @click="handleEditBalance" size="small"> 余额调整 </n-button>
          <n-button type="success" class="ml-2" @click="handleEditPay" size="small"> 支付密码 </n-button>
          <n-button type="error" class="ml-2" size="small" @click="clearChat"> 清除客户端聊天记录</n-button>
        </div>
        <div style="display: flex; padding: 10px 0" class="mt-5">
          <div style="width: 50%">
            用户昵称:
            {{ formParams.nick_name }}
          </div>
          <div>
            用户账号:
            {{ formParams.account }}
          </div>
        </div>
        <div style="display: flex; padding: 10px 0">
          <div style="width: 50%">
            手机号码:
            {{ formParams.phone_number }}
          </div>
          <div>
            性别:
            {{ formParams.gender == 1 ? '男' : '女' }}
          </div>
        </div>
        <div style="display: flex; padding: 10px 0">
          <div style="width: 50%">
            年龄:
            {{ formParams.age }}
          </div>
          <div>
            当前在线状态:
            {{ formParams.online == 1 ? '在线' : '离线' }}
          </div>
        </div>
        <div style="display: flex; padding: 10px 0">
          <div style="width: 50%">
            个性签名:
            <n-ellipsis style="max-width: 240px">
              {{ formParams.signatures }}
            </n-ellipsis>
          </div>
          <div>
            账户余额:
            {{ formParams.balance }}
          </div>
        </div>
        <div style="display: flex; padding: 10px 0">
          <div style="width: 50%">
            注册时间:
            {{
              formParams.register_time
                ? formatToDateTime(new Date(formParams.register_time * 1000), 'yyyy-MM-dd HH:mm:ss')
                : '-'
            }}
          </div>
          <div>
            最后登录IP:
            {{ formParams.login_ip }}
          </div>
        </div>
      </n-form>
      <BasicTable
        :columns="logColumns"
        :request="loadDataTable"
        :row-key="(row) => row.id"
        ref="actionRef"
        :showRight="false"
      />
    </n-spin>
    <template #action>
      <n-space>
        <n-button @click="() => (showModal = false)">取消</n-button>
        <n-button type="info" :loading="formBtnLoading" @click="handelClose">确定</n-button>
      </n-space>
    </template>
  </n-modal>
  <editPassword ref="editPasswordModalShow" @childToParent="childToParent" :info="info" />
  <editUserInfo ref="editUserInfoModalShow" @childToParent="childToParent" :info="info" />
  <editpay ref="editpayModalShow" @childToParent="childToParent" :info="info" />
  <editBalance ref="editBalanceModalShow" @childToParent="childToParent" :info="info" />
</template>
<script lang="ts" setup>
  import { ref, reactive, unref } from 'vue';
  import { formatToDateTime } from '@/utils/dateUtil';
  import { getUserDetails ,clearMessage,addPrivilege,deletePrivilege,getLoginHistory} from '@/api/user';
  import { useDialog, useMessage } from 'naive-ui';
  import {logColumns} from "../columns"
  import editPassword from './editPassword.vue';
  import editUserInfo from './editUserInfo.vue'; 
  import editpay from './editpay.vue';
  import editBalance from './editBalance.vue';
  import { BasicTable} from '@/components/Table';
  const message = useMessage();
  const formBtnLoading = ref(false);
  const dialog = useDialog();
  const emit = defineEmits(['childToParent']);
  const editPasswordModalShow = ref();
  const editUserInfoModalShow = ref();
  const editpayModalShow = ref();
  const editBalanceModalShow = ref();
  const show = ref(true);
  const showModal = ref(false);
  const formParams = reactive({
    account: undefined,
    register_time: undefined,
    nick_name: undefined,
    balance: undefined,
    login_ip: undefined,
    phone_number: undefined,
    gender: undefined,
    online: undefined,
    age: undefined,
    signatures: undefined,
    is_privilege: undefined,
  });
  const info = ref({
    userId: '',
    nick_name: '',
    phone_number: '',
    age: '',
    signatures: '',
  });
  const userId = ref('');

  const childToParent = () => {
    getUserDetailsHttp()
  };
  async function openModal(row) {
    Object.assign(unref(formParams), {
      account: undefined,
      register_time: undefined,
      nick_name: undefined,
      balance: undefined,
      login_ip: undefined,
      phone_number: undefined,
      gender: undefined,
      status: undefined,
      age: undefined,
      signatures: undefined,
      is_privilege: undefined,
    });
    showModal.value = true;
    userId.value = row.user_id;
    getUserDetailsHttp()
  }
  async function getUserDetailsHttp (){
    let params = {
      user_id: userId.value,
    };
    show.value = true;
    try {
      const data = await getUserDetails(params);
      Object.assign(unref(formParams), data);
      show.value = false;
    } catch (error: any) {
      message.error(error.message);
    }
  }
  const loadDataTable = async () => { // table 请求配置
    return  await getLoginHistory({user_id:userId.value})
  };
  defineExpose({
    openModal,
  });
  function handelClose(){
    showModal.value = false;
  }
  //修改密码
  function handlePas() {
    editPasswordModalShow.value.openModal();
    info.value.userId = userId.value;
  }
  //余额调整
  function handleEditBalance() {
    editBalanceModalShow.value.openModal();
    info.value.userId = userId.value;
  }
  //修改支付密码
  function handleEditPay() {
    editpayModalShow.value.openModal();
    info.value.userId = userId.value;
  }
  // 设为特权用户
  function handlePrivilege(){
    const privilege =  dialog.info({
      title: '提示',
      content: `是否设为特权用户？`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        privilege.loading = true
        let params = {
          user_id: userId.value,
        }
        try {
          await addPrivilege(params)
          getUserDetailsHttp()
          message.success(`设置成功`);
        } catch (error:any) {
          message.error(error.message)
        } 
      }
    });
  }
  // 设取消权用户
  function handleDelete() {
    dialog.info({
      title: '提示',
      content: `是否取消特权用户？`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        let params = {
          user_id: userId.value,
        }
        try {
          await deletePrivilege(params)
          getUserDetailsHttp()
          message.success('取消成功');
        } catch (error:any) {
          message.error(error.message)
        }
      }
    });
  }
  // 清空群聊天记录
  function clearChat(){
   const clear =  dialog.info({
      title: '提示',
      content: `是否清除全部客户端聊天记录？`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        clear.loading = true
        let params = {
          // 1 清除用户全部聊天记录
          // 2 清除指定群全部群成员聊天记录
          // 3 清除全部用户全部聊天记录
          type:1,
          target_id:userId.value
        }
        try {
          await clearMessage(params)
          message.success(`清空成功`);
        } catch (error:any) {
          message.error(error.message)
        } 
      }
    });
  }
  // 编辑用户信息
  function handleEdit() {
    editUserInfoModalShow.value.openModal();
    info.value.userId = userId.value;
    Object.assign(info.value,formParams)
  }
</script>
