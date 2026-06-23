<template>
  <view class="page-settings">
    <view class="nav-bar">
      <text class="back" @click="goBack">← 返回</text>
      <text class="title">设置</text>
    </view>
    <view class="section">
      <text class="section-title">通知设置</text>
      <view class="setting-item" v-for="item in notificationSettings" :key="item.key">
        <text class="setting-label">{{ item.icon }} {{ item.label }}</text>
        <switch :checked="item.value" @change="toggleSetting(item)" color="#2B7FFF" />
      </view>
    </view>
    <view class="section">
      <text class="section-title">其他</text>
      <view class="setting-item" @click="clearCache">
        <text class="setting-label">🗑️ 清除缓存</text>
        <text class="setting-arrow">▸</text>
      </view>
      <view class="setting-item" @click="showAbout">
        <text class="setting-label">ℹ️ 关于我们</text>
        <text class="setting-value">v1.0.0</text>
      </view>
      <view class="setting-item" @click="showAgreement">
        <text class="setting-label">📋 用户协议</text>
        <text class="setting-arrow">▸</text>
      </view>
      <view class="setting-item" @click="showPrivacy">
        <text class="setting-label">🔒 隐私政策</text>
        <text class="setting-arrow">▸</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const notificationSettings = ref([
  { key: 'notification', label: '消息通知', icon: '🔔', value: true },
  { key: 'sound', label: '声音提醒', icon: '🔊', value: true },
  { key: 'vibration', label: '震动提醒', icon: '📳', value: false }
])

const toggleSetting = (item) => {
  item.value = !item.value
  uni.showToast({ title: item.value ? '已开启' : '已关闭', icon: 'none' })
}

const clearCache = () => {
  uni.showModal({
    title: '清除缓存',
    content: '确定要清除本地缓存吗？',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({ title: '缓存已清除', icon: 'success' })
      }
    }
  })
}

const showAbout = () => {
  uni.showModal({
    title: '岐伯中医',
    content: '岐伯中医传承机器人\n版本：1.0.0\n传承 · 智慧 · 健康\n\n基于中医经典理论，为您提供在线问诊、健康咨询、药品验证等服务。',
    showCancel: false,
    confirmText: '知道了'
  })
}

const showAgreement = () => uni.showToast({ title: '《用户协议》', icon: 'none' })
const showPrivacy = () => uni.showToast({ title: '《隐私政策》', icon: 'none' })
const goBack = () => uni.navigateBack()
</script>

<style lang="scss" scoped>
.page-settings { min-height: 100vh; background: #FDF8F0; padding: 0 20pt 20pt; }
.nav-bar { display: flex; justify-content: space-between; align-items: center; padding: 16pt 0 8pt; }
.nav-bar .back { font-size: 14pt; color: #8C8C8C; }
.nav-bar .title { font-size: 18pt; font-weight: 600; color: #3D3D3D; }
.section { background: #FFFFFF; border-radius: 16pt; padding: 16pt; margin-bottom: 12pt; box-shadow: 0 2pt 8pt rgba(43,127,255,0.06); border: 1pt solid rgba(212,184,150,0.10); }
.section-title { font-size: 14pt; font-weight: 600; color: #3D3D3D; display: block; margin-bottom: 10pt; padding-bottom: 8pt; border-bottom: 1pt solid rgba(212,184,150,0.10); }
.setting-item { display: flex; align-items: center; justify-content: space-between; padding: 10pt 0; border-bottom: 1pt solid rgba(212,184,150,0.06); }
.setting-item:last-child { border-bottom: none; }
.setting-label { font-size: 14pt; color: #3D3D3D; }
.setting-value { font-size: 13pt; color: #8C8C8C; }
.setting-arrow { font-size: 13pt; color: #D4B896; }
</style>
