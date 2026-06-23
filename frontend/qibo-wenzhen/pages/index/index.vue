<template>
  <view class="page-home">
    <view class="header">
      <view class="brand">
        <text class="icon">☯️</text>
        <view class="brand-text">
          <text class="name">岐伯中医</text>
          <text class="sub">传承 · 智慧 · 健康</text>
        </view>
      </view>
      <view class="user-avatar" @click="goToMy">
        <image src="/static/avatar-default.png" mode="aspectFill"></image>
      </view>
    </view>
    <view class="grid-4">
      <view class="grid-item" @click="goToInquiry">
        <view class="icon-wrap" style="background:#E8F0FE"><text class="icon">🩺</text></view>
        <text class="label">去问诊</text>
      </view>
      <view class="grid-item" @click="goToScan">
        <view class="icon-wrap" style="background:#F0F7E8"><text class="icon">📷</text></view>
        <text class="label">扫一扫</text>
      </view>
      <view class="grid-item" @click="goToQA">
        <view class="icon-wrap" style="background:#FDF0E8"><text class="icon">💬</text></view>
        <text class="label">健康问答</text>
      </view>
      <view class="grid-item" @click="goToMy">
        <view class="icon-wrap" style="background:#F5EDE4"><text class="icon">👤</text></view>
        <text class="label">我的</text>
      </view>
    </view>
    <view class="card card-test" @click="goToTest">
      <text class="card-icon">📋</text>
      <view class="card-body">
        <text class="card-title">中医体质自测</text>
        <text class="card-desc">5分钟了解你的体质类型</text>
      </view>
      <text class="card-arrow">→</text>
    </view>
    <view class="card card-records">
      <view class="card-header">
        <text class="card-title">📝 近期问诊记录</text>
        <text class="card-more" @click="goToRecords">查看全部 →</text>
      </view>
      <view class="record-item" v-for="item in records" :key="item.id">
        <text class="record-date">{{ item.date }}</text>
        <text class="record-name">{{ item.name }}</text>
        <text class="record-arrow">▸</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import request from '@/utils/request.js'

const records = ref([])

const loadRecords = async () => {
  try {
    const res = await request.get('/api/inquiry/list')
    if (res.code === 200) {
      records.value = res.data.map(item => ({ id: item.id, date: item.createTime?.slice(0,10) || '2026-06-15', name: item.symptoms || '问诊记录' }))
    }
  } catch {
    records.value = [{ id: 1, date: '2026-06-15', name: '头痛、发热' }, { id: 2, date: '2026-06-14', name: '乏力、怕冷' }]
  }
}

const goToInquiry = () => uni.switchTab({ url: '/pages/inquiry/index' })
const goToScan = () => uni.navigateTo({ url: '/pages/scan/index' })
const goToQA = () => uni.switchTab({ url: '/pages/qa/index' })
const goToMy = () => uni.switchTab({ url: '/pages/my/index' })
const goToTest = () => uni.showToast({ title: '体质自测开发中', icon: 'none' })
const goToRecords = () => uni.navigateTo({ url: '/pages/my/records' })

onMounted(() => loadRecords())
</script>

<style lang="scss" scoped>
.page-home { min-height: 100vh; background: #FDF8F0; padding: 0 20pt 20pt; }
.header { display: flex; justify-content: space-between; align-items: center; padding: 16pt 0 20pt; }
.brand { display: flex; align-items: center; gap: 12pt; }
.brand .icon { font-size: 36pt; }
.brand-text .name { font-size: 20pt; font-weight: 700; color: #3D3D3D; }
.brand-text .sub { font-size: 11pt; color: #2B7FFF; display: block; margin-top: 2pt; }
.user-avatar image { width: 40pt; height: 40pt; border-radius: 50%; border: 2pt solid #D4B896; }
.grid-4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 12pt; margin-bottom: 16pt; }
.grid-item { display: flex; flex-direction: column; align-items: center; background: #FFFFFF; border-radius: 16pt; padding: 16pt 0 12pt; box-shadow: 0 2pt 8pt rgba(43,127,255,0.06); }
.icon-wrap { width: 48pt; height: 48pt; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24pt; }
.grid-item .label { margin-top: 8pt; font-size: 12pt; color: #3D3D3D; font-weight: 500; }
.card { background: #FFFFFF; border-radius: 16pt; padding: 16pt; margin-bottom: 12pt; box-shadow: 0 2pt 8pt rgba(43,127,255,0.06); border: 1pt solid rgba(212,184,150,0.10); }
.card-test { display: flex; align-items: center; }
.card-test .card-icon { font-size: 28pt; margin-right: 14pt; }
.card-body { flex: 1; }
.card-title { font-size: 15pt; font-weight: 600; color: #3D3D3D; }
.card-desc { font-size: 12pt; color: #8C8C8C; }
.card-arrow { font-size: 18pt; color: #2B7FFF; }
.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10pt; }
.card-more { font-size: 12pt; color: #2B7FFF; }
.record-item { display: flex; align-items: center; padding: 10pt 0; border-bottom: 1pt solid rgba(212,184,150,0.10); }
.record-item:last-child { border-bottom: none; }
.record-date { font-size: 12pt; color: #8C8C8C; width: 80pt; }
.record-name { flex: 1; font-size: 14pt; color: #3D3D3D; }
.record-arrow { color: #D4B896; }
</style>