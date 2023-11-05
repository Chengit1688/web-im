<template>
  <n-modal
    style="width: 900px"
    id="basic-modal"
    v-model:show="showModal"
    :show-icon="false"
    preset="dialog"
    title="红包配置"
  >
    <n-form :model="formParams" :rules="rules" ref="formRef" :label-width="120" class="py-4">
      <div style="display: flex; margin-bottom: 20px">
        <div
          style="
            flex: 1;
            border: 1px dashed #ddd;
            padding: 20px;
            background: #f1f1f1;
            border-radius: 8px;
          "
        >
          <n-form-item label="红包类型" path="mine_type">
            <n-select
              v-model:value="formParams.mine_type"
              placeholder="请选择红包类型"
              :options="redTypeList"
            />
          </n-form-item>

          <n-form-item
            style="margin-top: 0; margin-bottom: 0"
            label="红包最小金额"
            path="mine5_min"
          >
            <n-input-number
              style="width: 100%"
              v-model:value="formParams.mine5_min"
              placeholder="最小金额"
              min="0"
            />
          </n-form-item>
          <n-form-item
            style="margin-top: 0; margin-bottom: 0"
            label="红包最大金额"
            path="mine5_max"
          >
            <n-input-number
              v-model:value="formParams.mine5_max"
              placeholder="最大金额"
              style="width: 100%"
              :min="formParams.mine5_min"
            />
          </n-form-item>

          <div class="award-list">
            <div class="award-title">
              <div style="display: flex; align-items: center; margin-bottom: 10px">
                <p>雷配置</p>
                <n-button type="primary" class="ml-5" @click="addConfig">
                  <template #icon>
                    <n-icon>
                      <PlusCircleOutlined />
                    </n-icon>
                  </template>
                  新增配置
                </n-button>
              </div>

              <div class="award-item" v-for="(item, index) in formParams.mine_info" :key="index">
                <n-form-item
                  class="form-item1"
                  style="margin-top: 0; margin-bottom: 0"
                  label=""
                  :path="`mine_info[${index}].name`"
                  :rule="{
                    required: true,
                    message: `请输入雷名称`,
                    trigger: ['input', 'blur'],
                  }"
                >
                  <n-input v-model:value="item.name" placeholder="请输入雷名称" />
                </n-form-item>
                <n-form-item
                  class="form-item1"
                  style="margin-top: 0; margin-bottom: 0"
                  label=""
                  :path="`mine_info[${index}].multiple`"
                  :rule="{
                    required: true,
                    message: `请输入赔付倍数`,
                    trigger: ['input', 'blur'],
                  }"
                >
                  <n-input-number v-model:value="item.multiple" placeholder="请输入赔付倍数" />
                </n-form-item>
                <n-form-item
                  class="form-item1"
                  style="margin-top: 0; margin-bottom: 0"
                  label=""
                  :path="`mine_info[${index}].number`"
                  :rule="{
                    required: true,
                    message: `请输入中雷数`,
                    trigger: ['input', 'blur'],
                  }"
                >
                  <n-input-number min="0" v-model:value="item.number" placeholder="请输入中雷数" />
                </n-form-item>
                <n-form-item
                  class="form-item1"
                  style="margin-top: 0; margin-bottom: 0"
                  label=""
                  :path="`mine_info[${index}].probability`"
                  :rule="{
                    required: true,
                    message: `请输入概率`,
                    trigger: ['input', 'blur'],
                  }"
                >
                  <n-input-number
                    v-model:value="item.probability"
                    placeholder="请输入概率"
                    min="0"
                    max="100"
                  />
                </n-form-item>
                <div>
                  <n-button type="error" @click="() => formParams.mine_info.splice(index, 1)">
                    删除
                  </n-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </n-form>

    <template #action>
      <n-space>
        <n-button @click="() => (showModal = false)">取消</n-button>
        <n-button type="info" :loading="formBtnLoading" @click="confirmForm">确定</n-button>
      </n-space>
    </template>
  </n-modal>
</template>
<script lang="ts" setup>
  const $message = window['$message'];
  import { reactive, ref, unref } from 'vue';
  import { addRedpackGroupMine } from '@/api/finance';
  import { useMessage } from 'naive-ui';
  import { PlusCircleOutlined } from '@vicons/antd';

  const showModal = ref(false);
  const formBtnLoading = ref(false);
  const formRef = ref<any>(null);
  function openModal(record: any) {
    showModal.value = true;
  }

  const redTypeList = [
    {
      label: '5包红包',
      value: '51-5',
    },
    {
      label: '7包红包',
      value: '7-7',
    },
    {
      label: '9包红包',
      value: '9-9',
    },
  ];

  const redLeiList = [
    {
      label: '1雷',
      value: 1,
    },
    {
      label: '2雷',
      value: 2,
    },
    {
      label: '3雷',
      value: 3,
    },
    {
      label: '4雷',
      value: 4,
    },
    {
      label: '5雷',
      value: 5,
    },
  ];

  const rules: any = {
    mine_type: [
      {
        required: true,
        trigger: ['change'],
        message: '请选择类型',
      },
    ],
    mine5_min: [
      {
        required: true,
        trigger: ['input', 'blur'],
        message: '请输入最小金额',
      },
    ],
    mine5_max: [
      {
        required: true,
        trigger: ['input', 'blur'],
        message: '请输入最大金额',
      },
    ],
  };

  const confirmForm = () => {
    formRef.value?.validate(async (errors) => {
      if (!errors) {
        //
        addRedpackGroupMine({
          ...formParams,
        }).then((res) => {
          console.log(res);
        });
      } else {
        console.log(errors);
      }
    });
  };

  const formParams = reactive({
    mine_type: undefined,
    mine5_min: undefined,
    mine5_max: undefined,
    mine_info: [
      {
        name: undefined,
        multiple: undefined,
        number: undefined,
        probability: undefined,
      },
    ] as any,
  });

  defineExpose({
    openModal,
  });

  function addConfig() {
    formParams.mine_info.push({
      name: undefined,
      multiple: undefined,
      number: undefined,
      probability: undefined,
    });
  }
</script>

<style>
  .award-item {
    display: flex;
    justify-content: space-between;
  }
  .form-item1 {
    display: block;
    flex: 1;
    margin-right: 10px;
  }
</style>
