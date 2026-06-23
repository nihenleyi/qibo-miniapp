<template>
  <view class="page-my">
    <view class="user-card">
      <image class="avatar" src="@/static/avatar-default.png" mode="aspectFill"></image>
      <view class="user-info"><text class="name">{{ userInfo.name || '岐伯用户' }}</text><text class="bio">中医养生爱好者</text></view>
      <text class="edit" @click="editProfile">个人信息 ▸</text>
    </view>
    <view class="stats">
      <view class="stat-item"><text class="num">3</text><text class="label">问诊记录</text></view>
      <view class="stat-item"><text class="num">5</text><text class="label">处方记录</text></view>
      <view class="stat-item"><text class="num">2</text><text class="label">收藏</text></view>
    </view>
    <view class="menu-list">
      <view class="menu-item" v-for="item in menus" :key="item.key" @click="goTo(item.key)">
        <text class="menu-icon">{{ item.icon }}</text>
        <text class="menu-label">{{ item.label }}</text>
        <text class="menu-arrow">▸</text>
      </view>
    </view>
    <button class="btn-logout" @click="handleLogout">退出登录</button>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getUser, removeToken, removeUser } from '@/utils/auth.js'

const userInfo = ref({ name: '' })
const menus = [
  { key: 'records', icon: '📋', label: '问诊记录' },
  { key: 'prescriptions', icon: '📄', label: '我的处方' },
  { key: 'family', icon: '👨‍👩‍👦', label: '家庭成员管理' },
  { key: 'health', icon: '📊', label: '健康档案' },
  { key: 'settings', icon: '⚙️', label: '设置' }
]

onMounted(() => { const user = getUser(); if (user) userInfo.value = user })

const goTo = (key) => {
  const map = { records: '/pages/my/records', prescriptions: '/pages/my/prescriptions', family: '/pages/my/family', health: '/pages/my/health', settings: '/pages/my/settings' }
  if (map[key]) uni.navigateTo({ url: map[key] })
}
const editProfile = () => uni.showToast({ title: '个人信息编辑', icon: 'none' })
const handleLogout = () => {
  uni.showModal({
    title: '确认退出', content: '确定要退出登录吗？',
    success: (res) => { if (res.confirm) { removeToken(); removeUser(); uni.reLaunch({ url: '/pages/login/login' }) } }
  })
}
</script>

<style lang="scss" scoped>
.page-my { min-height: 100vh; background: #FDF8F0; padding: 0 20pt 20pt; }
.user-card { display: flex; align-items: center; background: #FFFFFF; border-radius: 16pt; padding: 20pt; margin: 12pt 0 16pt; box-shadow: 0 2pt 8pt rgba(43,127,255,0.06); }
.user-card .avatar { width: 56pt; height: 56pt; border-radius: 50%; border: 2pt solid #D4B896; }
.user-card .user-info { flex: 1; margin-left: 14pt; }
.user-card .user-info .name { font-size: 18pt; font-weight: 600; color: #3D3D3D; display: block; }
.user-card .user-info .bio { font-size: 12pt; color: #8C8C8C; }
.user-card .edit { font-size: 12pt; color: #2B7FFF; }
.stats { display: flex; background: #FFFFFF; border-radius: 16pt; padding: 16pt 0; margin-bottom: 16pt; box-shadow: 0 2pt 8pt rgba(43,127,255,0.06); }
.stats .stat-item { flex: 1; text-align: center; border-right: 1pt solid rgba(212,184,150,0.10); }
.stats .stat-item:last-child { border-right: none; }
.stats .stat-item .num { font-size: 20pt; font-weight: 700; color: #2B7FFF; display: block; }
.stats .stat-item .label { font-size: 11pt; color: #8C8C8C; }
.menu-list { background: #FFFFFF; border-radius: 16pt; overflow: hidden; box-shadow: 0 2pt 8pt rgba(43,127,255,0.06); }
.menu-list .menu-item { display: flex; align-items: center; padding: 14pt 16pt; border-bottom: 1pt solid rgba(212,184,150,0.06); }
.menu-list .menu-item:last-child { border-bottom: none; }
.menu-list .menu-item .menu-icon { font-size: 18pt; margin-right: 14pt; }
.menu-list .menu-item .menu-label { flex: 1; font-size: 14pt; color: #3D3D3D; }
.menu-list .menu-item .menu-arrow { color: #D4B896; }
.btn-logout { width: 100%; background: rgba(255,77,79,0.08); color: #FF4D4F; border-radius: 25pt; padding: 12pt; font-size: 15pt; border: 1pt solid rgba(255,77,79,0.15); margin-top: 20pt; }
</style>