<template>
  <div class="w-full">
    <div class="upload">
      <div class="upload-card">
        <!--图片-->
        <div class="upload-card-item" :style="getCSSProperties" v-for="(item, index) in  imgList" :key="index">
          <div class="upload-card-item-info">
            <div class="img-box">
              <!-- <img :src="img?getImgUrl(img):''" /> -->
              <img :src="item?getImgUrl(item):''" />
            </div>
            <div class="img-box-actions">
              <n-icon size="18" class="mx-2 action-icon" @click="preview(item)">
                <EyeOutlined />
              </n-icon>
              <n-icon size="18" class="mx-2 action-icon" @click="remove(index)">
                <DeleteOutlined />
              </n-icon>
            </div>
          </div>
        </div>

        <!--上传图片-->
        <div class="upload-card-item upload-card-item-select-picture" :style="getCSSProperties"
          v-if="imgList.length < $props.maxNumber">
          <n-spin :show="imgshow">
            <n-upload v-bind="$props" :file-list-style="{ display: 'none' }" @before-upload="beforeUpload"
              @finish="finish">
              <div class="flex flex-col justify-center">
                <n-icon size="30" class="m-auto">
                  <PlusOutlined />
                </n-icon>
              </div>
            </n-upload>
          </n-spin>

        </div>
        <n-space>
          <n-alert title="提示" type="info" v-if="helpText" class="flex w-full">
            {{ helpText }}
          </n-alert>
        </n-space>
      </div>
    </div>
  </div>

  <!--预览图片-->
  <n-modal v-model:show="showModal" preset="card" title="预览" :bordered="false" :style="{ width: '520px' }">
    <img :src="previewUrl" />
  </n-modal>
</template>

<script lang="ts">
  import { defineComponent, toRefs, reactive, computed, watch, ref } from 'vue';
  import { EyeOutlined, DeleteOutlined, PlusOutlined } from '@vicons/antd';
  import { basicProps } from './props';
  import { useMessage, useDialog } from 'naive-ui';
  import { ResultEnum } from '@/enums/httpEnum';
  import componentSetting from '@/settings/componentSetting';
  import { useGlobSetting } from '@/hooks/setting';
  import { isString } from '@/utils/is';

  const globSetting = useGlobSetting();

  export default defineComponent({
    name: 'BasicUpload',

    components: { EyeOutlined, DeleteOutlined, PlusOutlined },
    props: {
      ...basicProps,
    },
    emits: ['uploadChange', 'delete'],
    setup(props, { emit }) {
      const getCSSProperties = computed(() => {
        let widthProp
          if(props.widthtype=="%"){
            widthProp = `${props.width}%`
          }else{
            widthProp = `${props.width}px`
          }
          return {
            width:widthProp,
            height: `${props.height}px`,
          };
      });

      const message = useMessage();
      const dialog = useDialog();

      const state :any = reactive({
        imgshow: false,
        showModal: false,
        previewUrl: '',
        img: undefined,
        imgList: []
      });

      //赋值默认图片显示
      watch(
        () => props.value,
        () => {
          state.img = props.value
        },
        { immediate: true }
      );

      //预览
      function preview(url: string) {
        state.showModal = true;
        state.previewUrl = url;
      }

      //删除
      function remove(index:number) {
        dialog.info({
          title: '提示',
          content: '你确定要删除吗？',
          positiveText: '确定',
          negativeText: '取消',
          onPositiveClick: () => {
            if(props.maxNumber==1){ //兼容旧版
              state.img = "";
              state.imgList.splice(index, 1);
              emit('uploadChange', state.img);
              emit('delete', state.img);
            }else{ //删除指定排序目标
              state.imgList.splice(index, 1);
              emit('uploadChange', index);
              emit('delete', index);
            }
          },
          onNegativeClick: () => {},
        });
      }

      //组装完整图片地址
      function getImgUrl(url: string): string {
        const { imgUrl } = globSetting;
        return /(^http|https:\/\/)/g.test(url) ? url : `${imgUrl}${url}`;
      }

      function checkFileType(fileType: string) {
        return componentSetting.upload.fileType.includes(fileType);
      }

      //上传之前
      function beforeUpload({ file }) {
        const fileInfo = file.file;
        const { maxSize, accept } = props;
        const acceptRef = (isString(accept) && accept.split(',')) || [];

        // 设置最大值，则判断
        if (maxSize && fileInfo.size / 1024 / 1024 >= maxSize) {
          message.error(`上传文件最大值不能超过${maxSize}M`);
          return false;
        }

        // 设置类型,则判断
        const fileType = componentSetting.upload.fileType;
        if (acceptRef.length > 0 && !checkFileType(fileInfo.type)) {
          message.error(`只能上传文件类型为${fileType.join(',')}`);
          return false;
        }
        state.imgshow = true
        return true;
      }

      //上传结束
      function finish({ event: Event }) {
        const res = eval('(' + Event.target.response + ')');
        const infoField = componentSetting.upload.apiSetting.infoField;
        const { code } = res;
        const messages = res.msg || res.message || '上传失败';
        const result = res[infoField];
        //成功
        if (code === ResultEnum.SUCCESS) {
          // let imgUrl: string = getImgUrl(result.url);
         // state.img = result.url
          state.imgList.push(result.url)
          emit('uploadChange', result.url);
          state.imgshow = false
          // console.log(state.imgList.length < props.maxNumber)
          // state.imgshow = !state.imgList.length < props.maxNumber
        } else{ 
          message.error(messages);
          //state.imgshow = false
        }
        
      }

      return {
        ...toRefs(state),
        finish,
        preview,
        remove,
        beforeUpload,
        getCSSProperties,
        getImgUrl
      };
    },
  });
</script>

<style lang="less">
.upload {
  width: 100%;
  overflow: hidden;

  .n-upload-trigger {
    display: block;
  }

  &-card {
    width: auto;
    height: auto;
    display: flex;
    flex-wrap: wrap;
    align-items: center;

    &-item {
      margin: 0 8px 8px 0;
      position: relative;
      padding: 8px;
      border: 1px solid #d9d9d9;
      border-radius: 2px;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;

      &:hover {
        background: 0 0;

        .upload-card-item-info::before {
          opacity: 1;
        }

        &-info::before {
          opacity: 1;
        }
      }

      &-info {
        position: relative;
        height: 100%;
        width: 100%;
        padding: 0;
        overflow: hidden;

        &:hover {
          .img-box-actions {
            opacity: 1;
          }
        }

        &::before {
          position: absolute;
          z-index: 1;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          opacity: 0;
          transition: all 0.3s;
          content: ' ';
        }

        .img-box {
          position: relative;
          //padding: 8px;
          //border: 1px solid #d9d9d9;
          border-radius: 2px;
        }

        .img-box-actions {
          position: absolute;
          top: 50%;
          left: 50%;
          z-index: 10;
          white-space: nowrap;
          transform: translate(-50%, -50%);
          opacity: 0;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: space-between;

          &:hover {
            background: 0 0;
          }

          .action-icon {
            color: rgba(255, 255, 255, 0.85);

            &:hover {
              cursor: pointer;
              color: #fff;
            }
          }
        }
      }
    }

    &-item-select-picture {
      border: 1px dashed #d9d9d9;
      border-radius: 2px;
      cursor: pointer;
      background: #fafafa;
      color: #666;

      .upload-title {
        color: #666;
      }
    }
  }
}
</style>
