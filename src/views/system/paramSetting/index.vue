<template>
  <n-card :bordered="false" class="proCard">
    <n-table striped>
      <thead>
        <tr>
          <th>设置项</th>
          <th>内容</th>
          <th>说明</th>
        </tr>
      </thead>
      <tbody>
        <!-- 输入框 -->
        <tr>
          <td>单IP注册数</td>
          <td>
            <n-input-group>
              <n-input-number
                placeholder="请输入单IP注册数"
                :precision="0"
                min="0"
                max="10000"
                v-model:value="formParams.ip_reg_limit_count"
                style="width: 100%"
              />
              <n-button type="primary" @click="confirmForm('button', 1)" :loading="index == 1">
                保存
              </n-button>
            </n-input-group>
          </td>
          <td>默认1000，单IP最多可注册账号上限；0表示不做限制，最大值10000</td>
        </tr>
        <tr>
          <td>IP限制时长（天）</td>
          <td>
            <n-input-group>
              <n-input-number
                placeholder="请输入IP限制时长"
                min="0"
                max="10000"
                v-model:value="formParams.ip_reg_limit_time"
                style="width: 100%"
              />
              <n-button type="primary" @click="confirmForm('button', 2)" :loading="index == 2">
                保存
              </n-button>
            </n-input-group>
          </td>
          <td>默认100，达到单IP注册数上限后，需等待x天才能再次注册；0表示不做限制，最大值10000</td>
        </tr>
        <tr>
          <td>每日签到限额</td>
          <td>
            <n-input-group>
              <n-input-number
                placeholder="请输入每日签到限额"
                min="0"
                max="10000"
                v-model:value="formParams.sign_award"
                style="width: 100%"
              />
              <n-button type="primary" @click="confirmForm('button', 2)" :loading="index == 12">
                保存
              </n-button>
            </n-input-group>
          </td>
          <td>默认值为0，数值为单日签到最大奖励额度</td>
        </tr>
        <tr>
          <td>单设备注册数</td>
          <td>
            <n-input-group>
              <n-input-number
                placeholder="请输入单设备注册数"
                :precision="0"
                min="0"
                max="10000"
                v-model:value="formParams.device_reg_limit"
                style="width: 100%"
              />
              <n-button type="primary" @click="confirmForm('button', 3)" :loading="index == 3">
                保存
              </n-button>
            </n-input-group>
          </td>
          <td>默认1000，一个设备最多可注册账号上限，最大值10000</td>
        </tr>
        <tr>
          <td>群人数上限</td>
          <td>
            <n-input-group>
              <n-input-number
                placeholder="请输入群人数上限"
                :precision="0"
                min="0"
                max="10000"
                v-model:value="formParams.group_limit"
                style="width: 100%"
              />
              <n-button type="primary" @click="confirmForm('button', 4)" :loading="index == 4">
                保存
              </n-button>
            </n-input-group>
          </td>
          <td>默认2000，群人数上限值，最大值10000</td>
        </tr>

        <tr>
          <td>通讯录好友数上限</td>
          <td>
            <n-input-group>
              <n-input-number
                placeholder="通讯录好友数上限"
                :precision="0"
                min="0"
                max="10000"
                v-model:value="formParams.contacts_friend_limit"
                style="width: 100%"
              />
              <n-button type="primary" @click="confirmForm('button', 5)" :loading="index == 5">
                保存
              </n-button>
            </n-input-group>
          </td>
          <td>默认2000，通讯录好友数上限值，最大值10000</td>
        </tr>
        <tr>
          <td>新加入群聊显示历史消息数</td>
          <td>
            <n-input-group>
              <n-input-number
                placeholder="请输入新加入群聊显示历史消息数"
                :precision="0"
                min="0"
                max="10000"
                v-model:value="formParams.show_group_history_chat_num"
                style="width: 100%"
              />
              <n-button type="primary" @click="confirmForm('button', 13)" :loading="index == 13">
                保存
              </n-button>
            </n-input-group>
          </td>
          <td>默认0，新加入群聊显示历史消息数</td>
        </tr>
        <tr>
          <td>用户最大可创建的群数量</td>
          <td>
            <n-input-group>
              <n-input-number
                placeholder="请输入用户最大可创建的群数量"
                :precision="0"
                min="0"
                max="10000"
                v-model:value="formParams.create_group_limit"
                style="width: 100%"
              />
              <n-button type="primary" @click="confirmForm('button', 6)" :loading="index == 6">
                保存
              </n-button>
            </n-input-group>
          </td>
          <td>默认1000，用户最大可创建的群数量，最大值10000</td>
        </tr>
        <!-- <tr>
          <td>群聊用户发言间隔</td>
          <td>
            <n-input-group>
              <n-input-number placeholder="请输入群聊用户发言间隔" :precision="0" min="0" max="10000" v-model:value="formParams.group_send_limit" style="width:100%"/>
              <n-button type="primary"  @click="confirmForm('button',7)" :loading="index==7">
                保存
              </n-button>
            </n-input-group>
          </td>
          <td>默认0，不受限制；设置后除群主和群管理员，普通群成员在x秒内只允许说一句话，最大值10000</td>
        </tr> -->

        <tr>
          <td>用户ID前缀</td>
          <td>
            <n-input-group>
              <n-input
                placeholder="请输入用户ID前缀"
                maxlength="5"
                show-count
                v-model:value="formParams.user_id_prefix"
              />
              <n-button type="primary" @click="confirmForm('button', 8)" :loading="index == 8">
                保存
              </n-button>
            </n-input-group>
          </td>
          <td>默认用户ID的前缀</td>
        </tr>
        <tr>
          <td>文件大小</td>
          <td>
            <n-input-group>
              <n-input-number
                placeholder="请输入文件大小值"
                :precision="0"
                min="0"
                max="1000"
                v-model:value="formParams.file_size_limit"
                style="width: 100%"
              />
              <n-button type="primary" @click="confirmForm('button', 10)" :loading="index == 9">
                保存
              </n-button>
            </n-input-group>
          </td>
          <td>默认100，发送文件/图片/视频等附件的最大值，最大值1000</td>
        </tr>
        <tr>
          <td>历史记录保留时间</td>
          <td>
            <n-input-group>
              <n-input-number
                placeholder="请输入历史记录保留时间"
                :precision="0"
                min="0"
                max="180"
                v-model:value="formParams.history_time"
                style="width: 100%"
              />
              <n-button type="primary" @click="confirmForm('button', 10)" :loading="index == 10">
                保存
              </n-button>
            </n-input-group>
          </td>
          <td>默认30天，清空x天之前的历史记录，最大值180</td>
        </tr>
        <tr>
          <td>普通用户撤回消息时间</td>
          <td>
            <n-input-group>
              <n-input-number
                placeholder="请输入历史记录保留时间"
                :precision="0"
                min="0"
                max="600"
                v-model:value="formParams.revoke_time"
                style="width: 100%"
              />
              <n-button type="primary" @click="confirmForm('button', 11)" :loading="index == 11">
                保存
              </n-button>
            </n-input-group>
          </td>
          <td
            >默认0，不受限制，一直有撤回功能。填入大于0的时间，普通会员可以撤回设置的x秒内发送的信息，取值范围0-600秒</td
          >
        </tr>
        <!-- 开关 -->
        <tr>
          <td>普通用户添加普通用户</td>
          <td>
            <n-switch
              :value="formParams.is_member_add_friend"
              :checked-value="1"
              :unchecked-value="2"
              @update:value="confirmForm('switch', 'is_member_add_friend')"
            >
              <template #checked> 开 </template>
              <template #unchecked> 关 </template>
            </n-switch>
          </td>
          <td> 默认关闭，普通用户不能添加普通用户；打开后，普通用户能添加普通用户 </td>
        </tr>
        <tr>
          <td>普通加普通好友验证</td>
          <td>
            <n-switch
              :value="formParams.is_add_normal_verify"
              :checked-value="1"
              :unchecked-value="2"
              @update:value="confirmForm('switch', 'is_add_normal_verify')"
            >
              <template #checked> 开 </template>
              <template #unchecked> 关 </template>
            </n-switch>
          </td>
          <td>
            默认开启，普通用户添加普通用户，需要进行好友验证；关闭后，直接添加，不需要进行好友验证
          </td>
        </tr>
        <tr>
          <td>普通用户添加特权用户</td>
          <td>
            <n-switch
              :value="formParams.is_normal_add_privilege"
              :checked-value="1"
              :unchecked-value="2"
              @update:value="confirmForm('switch', 'is_normal_add_privilege')"
            >
              <template #checked> 开 </template>
              <template #unchecked> 关 </template>
            </n-switch>
          </td>
          <td> 默认关闭，普通用户不可创建群聊；开启后普通用户可创建群聊 </td>
        </tr>
        <tr>
          <td>普通用户加特权好友验证</td>
          <td>
            <n-switch
              :value="formParams.is_add_privilege_verify"
              :checked-value="1"
              :unchecked-value="2"
              @update:value="confirmForm('switch', 'is_add_privilege_verify')"
            >
              <template #checked> 开 </template>
              <template #unchecked> 关 </template>
            </n-switch>
          </td>
          <td> 默认开启，普通用户添加特权用户，需要进行好友验证；关闭后，直接添加，不需要进行 </td>
        </tr>
        <tr>
          <td>特权用户加好友验证</td>
          <td>
            <n-switch
              :value="formParams.is_privilege_add_verify"
              :checked-value="1"
              :unchecked-value="2"
              @update:value="confirmForm('switch', 'is_privilege_add_verify')"
            >
              <template #checked> 开 </template>
              <template #unchecked> 关 </template>
            </n-switch>
          </td>
          <td> 默认开启，普通用户添加特权用户，需要进行好友验证；关闭后，直接添加，不需要进行 </td>
        </tr>
        <tr>
          <td>普通用户删除好友</td>
          <td>
            <n-switch
              :value="formParams.is_member_del_friend"
              :checked-value="1"
              :unchecked-value="2"
              @update:value="confirmForm('switch', 'is_member_del_friend')"
            >
              <template #checked> 开 </template>
              <template #unchecked> 关 </template>
            </n-switch>
          </td>
          <td> 默认关闭，普通用户不可删除好友；开启后普通用户可删除好友 </td>
        </tr>
        <tr>
          <td>普通用户创建群聊</td>
          <td>
            <n-switch
              :value="formParams.is_member_add_group"
              :checked-value="1"
              :unchecked-value="2"
              @update:value="confirmForm('switch', 'is_member_add_group')"
            >
              <template #checked> 开 </template>
              <template #unchecked> 关 </template>
            </n-switch>
          </td>
          <td> 默认关闭，普通用户不可创建群聊；开启后普通用户可创建群聊 </td>
        </tr>

        <tr>
          <td>普通用户加入群聊</td>
          <td>
            <n-switch
              :value="formParams.is_normal_join_group"
              :checked-value="1"
              :unchecked-value="2"
              @update:value="confirmForm('switch', 'is_normal_join_group')"
            >
              <template #checked> 开 </template>
              <template #unchecked> 关 </template>
            </n-switch>
          </td>
          <td> 默认打开，普通用户可加入群聊；关闭后，普通用户不可加入群聊 </td>
        </tr>
        <tr>
          <td>普通用户消息群发</td>
          <td>
            <n-switch
              :value="formParams.is_normal_mul_send"
              :checked-value="1"
              :unchecked-value="2"
              @update:value="confirmForm('switch', 'is_normal_mul_send')"
            >
              <template #checked> 开 </template>
              <template #unchecked> 关 </template>
            </n-switch>
          </td>
          <td> 默认关闭，普通用户不能进行消息群发；开启后，普通用户可以进行消息群发 </td>
        </tr>
        <tr>
          <td>注册入口</td>
          <td>
            <n-switch
              :value="formParams.is_open_register"
              :checked-value="1"
              :unchecked-value="2"
              @update:value="confirmForm('switch', 'is_open_register')"
            >
              <template #checked> 开 </template>
              <template #unchecked> 关 </template>
            </n-switch>
          </td>
          <td> 默认开启，显示注册入口；关闭后不显示注册入口 </td>
        </tr>

        <tr>
          <td>是否显示用户状态</td>
          <td>
            <n-switch
              :value="formParams.is_show_member_status"
              :checked-value="1"
              :unchecked-value="2"
              @update:value="confirmForm('switch', 'is_show_member_status')"
            >
              <template #checked> 开 </template>
              <template #unchecked> 关 </template>
            </n-switch>
          </td>
          <td> 默认开启，显示对方在线状态；关闭后不显示对方在线状态 </td>
        </tr>

        <tr>
          <td>普通用户显示对方IP和地址</td>
          <td>
            <n-switch
              :disabled="formParams.is_show_member_status == 2"
              :value="formParams.is_normal_see_address"
              :checked-value="1"
              :unchecked-value="2"
              @update:value="confirmForm('switch', 'is_normal_see_address')"
            >
              <template #checked> 开 </template>
              <template #unchecked> 关 </template>
            </n-switch>
          </td>
          <td> 默认关闭，普通用户不显示对方的IP和地址；开启后普通用户显示对方的IP和地址 </td>
        </tr>
        <tr>
          <td>普通用户显示好友ID</td>
          <td>
            <n-switch
              :value="formParams.is_normal_see_id"
              :checked-value="1"
              :unchecked-value="2"
              @update:value="confirmForm('switch', 'is_normal_see_id')"
            >
              <template #checked> 开 </template>
              <template #unchecked> 关 </template>
            </n-switch>
          </td>
          <td> 默认关闭，普通用户不能查看好友的用户ID；开启后普通用户能看到好友的用户ID </td>
        </tr>
        <tr>
          <td>是否开启用户已读状态</td>
          <td>
            <n-switch
              :value="formParams.is_msg_read_status"
              :checked-value="1"
              :unchecked-value="2"
              @update:value="confirmForm('switch', 'is_msg_read_status')"
            >
              <template #checked> 开 </template>
              <template #unchecked> 关 </template>
            </n-switch>
          </td>
          <td> 默认开启，显示信息已读/未读；关闭后不显示信息已读/未读状态 </td>
        </tr>

        <tr>
          <td>红包入口</td>
          <td>
            <n-switch
              :value="formParams.is_open_redpack"
              :checked-value="1"
              :unchecked-value="2"
              @update:value="confirmForm('switch', 'is_open_redpack')"
            >
              <template #checked> 开 </template>
              <template #unchecked> 关 </template>
            </n-switch>
          </td>
          <td> 默认开启，显示发红包入口；关闭后不显示发红包入口 </td>
        </tr>

        <tr>
          <td>允许发送个人红包</td>
          <td>
            <n-switch
              :value="formParams.is_open_redpack_single"
              :checked-value="1"
              :unchecked-value="2"
              @update:value="confirmForm('switch', 'is_open_redpack_single')"
            >
              <template #checked> 开 </template>
              <template #unchecked> 关 </template>
            </n-switch>
          </td>
          <td> 默认开启，可发送个人红包；关闭后不能发送个人红包 </td>
        </tr>

        <tr>
          <td>语音电话入口</td>
          <td>
            <n-switch
              :value="formParams.is_open_voice_call"
              :checked-value="1"
              :unchecked-value="2"
              @update:value="confirmForm('switch', 'is_open_voice_call')"
            >
              <template #checked> 开 </template>
              <template #unchecked> 关 </template>
            </n-switch>
          </td>
          <td> 默认开启，显示语音电话入口；关闭后不显示语音电话入口 </td>
        </tr>

        <tr>
          <td>视频电话入口</td>
          <td>
            <n-switch
              :value="formParams.is_open_camera_call"
              :checked-value="1"
              :unchecked-value="2"
              @update:value="confirmForm('switch', 'is_open_camera_call')"
            >
              <template #checked> 开 </template>
              <template #unchecked> 关 </template>
            </n-switch>
          </td>
          <td> 默认开启，显示视频电话入口；关闭后不显示视频电话入口 </td>
        </tr>
        <tr>
          <td>是否显示撤回消息</td>
          <td>
            <n-switch
              :value="formParams.is_show_revoke"
              :checked-value="1"
              :unchecked-value="2"
              @update:value="confirmForm('switch', 'is_show_revoke')"
            >
              <template #checked> 开 </template>
              <template #unchecked> 关 </template>
            </n-switch>
          </td>
          <td> 默认开启，是否显示撤回消息 </td>
        </tr>
        <tr>
          <td>是否开启oss</td>
          <td>
            <n-switch
              :value="formParams.is_oss_open"
              :checked-value="1"
              :unchecked-value="2"
              @update:value="confirmForm('switch', 'is_oss_open')"
            >
              <template #checked> 开 </template>
              <template #unchecked> 关 </template>
            </n-switch>
          </td>
          <td> 默认开启，是否开启oss </td>
        </tr>
        <tr>
          <td>是否开启发现页-新闻</td>
          <td>
            <n-switch
              :value="formParams.is_open_news"
              :checked-value="1"
              :unchecked-value="2"
              @update:value="confirmForm('switch', 'is_open_news')"
            >
              <template #checked> 开 </template>
              <template #unchecked> 关 </template>
            </n-switch>
          </td>
          <td> 默认开启，是否开启发现页-新闻</td>
        </tr>
        <tr>
          <td>是否开启发现页-签到</td>
          <td>
            <n-switch
              :value="formParams.is_open_sign"
              :checked-value="1"
              :unchecked-value="2"
              @update:value="confirmForm('switch', 'is_open_sign')"
            >
              <template #checked> 开 </template>
              <template #unchecked> 关 </template>
            </n-switch>
          </td>
          <td> 默认开启，是否开启发现页-新闻</td>
        </tr>
        <tr>
          <td>是否开启发现页-吃喝玩乐</td>
          <td>
            <n-switch
              :value="formParams.is_open_play"
              :checked-value="1"
              :unchecked-value="2"
              @update:value="confirmForm('switch', 'is_open_play')"
            >
              <template #checked> 开 </template>
              <template #unchecked> 关 </template>
            </n-switch>
          </td>
          <td> 默认开启，是否开启发现页-吃喝玩乐</td>
        </tr>
        <tr>
          <td>是否开启发现页-运营商</td>
          <td>
            <n-switch
              :value="formParams.is_open_operator"
              :checked-value="1"
              :unchecked-value="2"
              @update:value="confirmForm('switch', 'is_open_operator')"
            >
              <template #checked> 开 </template>
              <template #unchecked> 关 </template>
            </n-switch>
          </td>
          <td> 默认开启，是否开启发现页-运营商</td>
        </tr>
        <tr>
          <td>是否开启发现页-加盟商</td>
          <td>
            <n-switch
              :value="formParams.is_open_shop"
              :checked-value="1"
              :unchecked-value="2"
              @update:value="confirmForm('switch', 'is_open_shop')"
            >
              <template #checked> 开 </template>
              <template #unchecked> 关 </template>
            </n-switch>
          </td>
          <td> 默认开启，是否开启发现页-加盟商</td>
        </tr>
        <tr>
          <td>是否开启发现页-看一看</td>
          <td>
            <n-switch
              :value="formParams.is_open_top_stories"
              :checked-value="1"
              :unchecked-value="2"
              @update:value="confirmForm('switch', 'is_open_top_stories')"
            >
              <template #checked> 开 </template>
              <template #unchecked> 关 </template>
            </n-switch>
          </td>
          <td> 默认开启，是否开启发现页-看一看</td>
        </tr>
        <tr>
          <td>是否开启钱包</td>
          <td>
            <n-switch
              :value="formParams.is_open_wallet"
              :checked-value="1"
              :unchecked-value="2"
              @update:value="confirmForm('switch', 'is_open_wallet')"
            >
              <template #checked> 开 </template>
              <template #unchecked> 关 </template>
            </n-switch>
          </td>
          <td> 默认开启，是否开启钱包</td>
        </tr>
        <tr>
          <td>是否开启收款码</td>
          <td>
            <n-switch
              :value="formParams.is_open_payment_code"
              :checked-value="1"
              :unchecked-value="2"
              @update:value="confirmForm('switch', 'is_open_payment_code')"
            >
              <template #checked> 开 </template>
              <template #unchecked> 关 </template>
            </n-switch>
          </td>
          <td> 默认开启，是否开启收款码</td>
        </tr>
      </tbody>
    </n-table>
  </n-card>
</template>
<script lang="ts" setup>
  import { ref, reactive, unref, onMounted } from 'vue';
  import { getParameter, upParameter } from '@/api/system';
  import { useMessage } from 'naive-ui';
  const message = useMessage();
  const index = ref();
  const formParams = reactive({
    ip_reg_limit_count: undefined,
    ip_reg_limit_time: undefined,
    sign_award: undefined,
    device_reg_limit: undefined,
    group_limit: undefined,
    group_msg_limit: undefined,
    contacts_friend_limit: undefined,
    show_group_history_chat_num: undefined,
    create_group_limit: undefined,
    group_send_limit: undefined,
    user_id_prefix: undefined,
    file_size_limit: undefined,
    history_time: undefined,
    revoke_time: undefined,
    is_member_add_friend: 2,
    is_member_add_group: 2,
    is_open_register: 1,
    is_show_member_status: 2,
    is_msg_read_status: 2,
    is_open_redpack: 1,
    is_open_redpack_single: 1,
    is_normal_see_address: 2,
    is_member_del_friend: 2,
    is_open_voice_call: 1,
    is_open_camera_call: 1,
    is_normal_see_id: 2,
    is_normal_add_privilege: 2,
    is_add_normal_verify: 1,
    is_add_privilege_verify: 1,
    is_privilege_add_verify: 2,
    is_normal_join_group: 1,
    is_normal_mul_send: 2,
    is_show_revoke: 1,
    is_oss_open: 1,
    is_open_news: 1,
    is_open_sign: 1,
    is_open_play: 1,
    is_open_operator:1,
    is_open_shop:1,
    is_open_top_stories:1,
    is_open_wallet:1,
    is_open_payment_code:1,
  });
  function status(parmas, val) {
    for (let i in parmas) {
      if (i == val) parmas[i] = parmas[i] == 1 ? 2 : 1;
    }
  }
  async function confirmForm(name, val) {
    let parmas = JSON.parse(JSON.stringify(formParams));
    if (name == 'button') {
      index.value = val;
    } else {
      status(parmas, val);
    }
    try {
      parmas.sign_award = parmas.sign_award * 100;
      await upParameter({ config: parmas });
      message.success('保存成功');
      if (name == 'button') {
        index.value = null;
      } else {
        status(formParams, val);
      }
    } catch (error: any) {
      message.error(error.message);
      if (name == 'button') {
        index.value = null;
      }
    }
  }
  onMounted(async () => {
    try {
      const data = await getParameter();
      Object.assign(unref(formParams), {
        ...data,
        sign_award: data.sign_award / 100,
      });
    } catch (error: any) {
      message.error(error.message);
    }
  });
</script>
