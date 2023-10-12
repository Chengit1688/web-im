<template>
    <n-modal
      id="basic-modal"
      v-model:show="showModal"
      :show-icon="false"
      preset="dialog"
      title="成员列表"
      style="width: 1300px"
    >
      <n-card :bordered="false" class="proCard">
        <BasicTable
          :columns="subordinateColumns"
          :request="loadDataTable"
          :row-key="(row) => row.id"
          ref="actionRef"
          :actionColumn="actionColumn"
        >
        </BasicTable>
      </n-card>
    </n-modal>
    <subordinateModal  ref="subordinateModalShow" ></subordinateModal>
  </template>
  <script lang="ts" setup>
    import {ref, reactive, h } from 'vue';
    import { BasicTable,TableAction } from '@/components/Table';
    import subordinateModal from "./subordinate.vue"
    import { getOperatorMemberList } from '@/api/perations';
    import {  useForm } from '@/components/Form/index';
    
    import moren from '@/assets/images/moren.png';
import { NImage } from 'naive-ui';
import { formatUrl } from '@/utils';

    const subordinateColumns = ref([
   
  {
    title: '头像',
    key: 'face_url',
    align: 'center',
    render(row) {
      return h(NImage, {
        style: 'border-radius: 3px;height:34px;',
        height: 34,
        width: 34,
        src: row.face_url ? formatUrl(row.face_url) : moren,
      });
    },
  },
  {
    title: '用户ID',
    key: 'user_id',
    align: 'center',
    width: 120,
  },

  {
    title: '账号',
    key: 'account',
    align: 'center',
    width: 150,
  },
  {
    title: '昵称',
    key: 'nick_name',
    align: 'center',
  },
  {
    title: '手机号',
    key: 'phone_number',
    align: 'center',
  },
  {
    title: '性别',
    key: 'gender',
    align: 'center',
    render : (row) => { row.gender === 1 ? '男': '女'}
  },
  // {
  //   title: '注册时间',
  //   key: 'created_at',
  //   align: 'center',
  //   render: (row) =>
  //     row.created_at
  //       ? formatToDateTime(new Date(row.created_at * 1000), 'yyyy-MM-dd HH:mm:ss')
  //       : '-',
  // },
    ])


    const actionRef = ref(); // 表格ref
    const userId = ref('')
    const shopId = ref<any>()
    const showModal = ref(false);
    const subordinateModalShow = ref<any>()
    const formParams = reactive<any>({ // form 表单
       
    });
    const loadDataTable = async (res) => { // table 请求配置
      
   
        let params = {
          shop_id: shopId.value,
        ...res,
        }
        return await getOperatorMemberList(params)
      }
    const actionColumn = [
    {
      title: '操作',
      key: 'action',
      dataIndex: 'action',
      align: 'center',
      width: 150,
      render(record) {
        return h(TableAction as any, {
          style: 'text',
          actions: createActions(record),
        });
      },
    },
]
function createActions(record:any) {
    return [
    //   {
    //     label: '编辑',
    //     type: 'primary',
    //     onClick: ()=>{
    //         Object.assign(formModel,{
            
    //         })
    //     },
    //     // 根据业务控制是否显示 isShow 和 auth 是并且关系
    //     ifShow: () => {
    //       return true;
    //     },
    //   },

      {
        label: '下级成员',
        type: 'primary',
        onClick: showSubordinateModal.bind(null, record),
        ifShow: () => {
          return true;
        },
      },
    ];
  }
   
    const info = ref({
      userId:""
    });
   
  
    const [register, {}] = useForm({
      gridProps: { xGap: '12' },
      labelWidth: 80,

    });

    function showSubordinateModal(row){
      subordinateModalShow.value.openModal({
        ...row,
        shopId: shopId.value
      })
    }
  
    function openModal (row){
       
      userId.value = row.user_id
      shopId.value = row.shop_id
      showModal.value = true
      
    }
   
   
    defineExpose({
      openModal,
    });
  </script>
  